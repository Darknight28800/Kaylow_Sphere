import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import {
  GENERATION_MAX_TOKENS,
  GENERATION_MODEL,
  getAnthropicClient,
  isGeneratorConfigured,
} from '@/lib/anthropic';
import {
  buildSystemPrompt,
  buildUserPrompt,
  extractHtmlDocument,
  MalformedGenerationError,
} from '@/lib/generator/prompt';
import { generateSchema } from '@/lib/generator/schema';
import { consumeQuota, logGeneration, refundQuota } from '@/lib/generator/quota';
import { clientIp, isAllowedOrigin } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function minutes(ms: number): number {
  return Math.max(1, Math.ceil(ms / 60_000));
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Origine non autorisée.' }, { status: 403 });
  }
  const ip = clientIp(request);

  if (!isGeneratorConfigured()) {
    return NextResponse.json(
      { error: 'La démo est momentanément indisponible. Réessayez plus tard.' },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const parsed = generateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Données invalides.' },
      { status: 400 },
    );
  }

  // Honeypot rempli → on répond OK sans rien générer.
  if (parsed.data.website) {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const quota = consumeQuota(ip);
  if (!quota.ok) {
    const msg =
      quota.reason === 'ip'
        ? `Vous avez utilisé vos essais gratuits. Réessayez dans ${minutes(quota.retryAfterMs)} min, ou contactez-moi pour aller plus loin.`
        : 'La démo a atteint sa limite de la journée. Revenez demain ou écrivez-moi directement.';
    return NextResponse.json({ error: msg }, { status: 429 });
  }

  const startedAt = Date.now();
  const prompt = parsed.data.prompt;

  try {
    const client = getAnthropicClient();
    // Streaming : évite les timeouts HTTP sur une sortie longue (le document
    // peut faire plusieurs milliers de tokens).
    // Effort bas (tâche fortement cadrée par le prompt système) + raisonnement
    // adaptatif léger : robustesse sur les briefs inhabituels sans coût notable.
    // Le désactiver n'accélère pas (le goulot = la génération du HTML).
    const stream = client.messages.stream({
      model: GENERATION_MODEL,
      max_tokens: GENERATION_MAX_TOKENS,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'low' },
      system: [
        { type: 'text', text: buildSystemPrompt(), cache_control: { type: 'ephemeral' } },
      ],
      messages: [
        { role: 'user', content: buildUserPrompt({ prompt, colors: parsed.data.colors }) },
      ],
    });

    const message = await stream.finalMessage();

    if (message.stop_reason === 'refusal') {
      refundQuota(ip);
      logGeneration({
        ip, prompt, promptLength: prompt.length, status: 'error',
        durationMs: Date.now() - startedAt, model: GENERATION_MODEL, error: 'refusal',
      });
      return NextResponse.json(
        { error: 'Je ne peux pas générer d’aperçu pour cette demande. Reformulez votre projet.' },
        { status: 422 },
      );
    }

    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('');

    const html = extractHtmlDocument(text);

    logGeneration({
      ip, prompt, promptLength: prompt.length, status: 'ok',
      durationMs: Date.now() - startedAt, model: GENERATION_MODEL,
      inputTokens: message.usage.input_tokens,
      outputTokens: message.usage.output_tokens,
    });

    return NextResponse.json({ html, remaining: quota.remaining });
  } catch (err) {
    refundQuota(ip);
    logGeneration({
      ip, prompt, promptLength: prompt.length, status: 'error',
      durationMs: Date.now() - startedAt, model: GENERATION_MODEL,
      error: err instanceof Error ? err.message : String(err),
    });

    if (err instanceof MalformedGenerationError) {
      return NextResponse.json(
        { error: 'L’aperçu n’a pas pu être finalisé. Relancez la génération.' },
        { status: 502 },
      );
    }
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: 'Le service est très sollicité en ce moment. Réessayez dans une minute.' },
        { status: 503 },
      );
    }
    if (err instanceof Anthropic.AuthenticationError) {
      console.error('[api/generate] Clé API Anthropic invalide ou expirée.');
      return NextResponse.json(
        { error: 'La démo est momentanément indisponible. Réessayez plus tard.' },
        { status: 503 },
      );
    }
    if (err instanceof Anthropic.APIError) {
      console.error('[api/generate] Erreur API Anthropic :', err.status, err.message);
      return NextResponse.json(
        { error: 'L’aperçu n’a pas pu être généré. Réessayez dans un instant.' },
        { status: 502 },
      );
    }

    console.error('[api/generate] Erreur inattendue :', err);
    return NextResponse.json(
      { error: 'Une erreur est survenue. Réessayez dans un instant.' },
      { status: 500 },
    );
  }
}
