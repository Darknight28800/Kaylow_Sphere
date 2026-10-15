import { NextResponse } from 'next/server';
import { z } from 'zod';
import { clientIp, forwardedChain, isAllowedOrigin } from '@/lib/http';
import { sendContactEmail } from '@/lib/mailer';
import { createRateLimiter } from '@/lib/rate-limit';
import { site } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const required = (msg: string) => ({ required_error: msg, invalid_type_error: msg });

const schema = z.object({
  name: z.string(required('Indiquez votre nom')).trim().min(2, 'Nom trop court').max(120),
  email: z
    .string(required('Indiquez votre adresse e-mail'))
    .trim()
    .email('Adresse e-mail invalide')
    .max(180),
  projectType: z.string().trim().max(80).optional(),
  message: z
    .string(required('Écrivez votre message'))
    .trim()
    .min(10, 'Message trop court')
    .max(5000),
  company: z.string().max(0).optional(), // honeypot : doit rester vide
});

// 5 envois / 15 min / visiteur, et un plafond global (toutes IP confondues)
// qui borne le spam même si l'IP est falsifiée (cf. lib/http.ts).
const perIp = createRateLimiter({ windowMs: 15 * 60_000, max: 5 });
const global = createRateLimiter({ windowMs: 60 * 60_000, max: 30 });

const TOO_MANY = 'Trop de demandes envoyées. Merci de réessayer dans quelques minutes.';

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Origine non autorisée.' }, { status: 403 });
  }

  const ip = clientIp(request);
  if (!perIp.hit(ip).ok || !global.hit('all').ok) {
    return NextResponse.json({ error: TOO_MANY }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Données invalides.' },
      { status: 400 },
    );
  }

  // Honeypot rempli → on répond OK sans rien envoyer.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  try {
    await sendContactEmail({ ...parsed.data, meta: { ip, chain: forwardedChain(request) } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/contact] Échec de l’envoi :', err);
    return NextResponse.json(
      {
        error: `Le message n'a pas pu être envoyé pour le moment. Vous pouvez m'écrire directement à ${site.email}.`,
        // Catégorie grossière, sans détail sensible : permet de diagnostiquer
        // la prod sans accès aux journaux de l'hébergeur.
        code: smtpErrorCode(err),
      },
      { status: 502 },
    );
  }
}

/** Classe une erreur nodemailer en grande famille (aucune valeur de config exposée). */
function smtpErrorCode(err: unknown): string {
  const e = err as { code?: string; responseCode?: number; message?: string };
  if (e?.message?.startsWith('Configuration SMTP incomplète')) return 'smtp_config';
  if (e?.code === 'EAUTH' || e?.responseCode === 535) return 'smtp_auth';
  if (['ECONNECTION', 'ETIMEDOUT', 'ECONNREFUSED', 'ESOCKET', 'EDNS'].includes(e?.code ?? ''))
    return 'smtp_connect';
  if (e?.code === 'EENVELOPE' || e?.responseCode === 550 || e?.responseCode === 553)
    return 'smtp_envelope';
  return 'smtp_other';
}
