import { NextResponse } from 'next/server';
import { z } from 'zod';
import { clientIp, isAllowedOrigin } from '@/lib/http';
import { sendReviewEmail } from '@/lib/mailer';
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
  role: z.string().trim().max(120).optional(),
  rating: z.coerce
    .number(required('Choisissez une note'))
    .int()
    .min(1, 'Choisissez une note')
    .max(5),
  text: z
    .string(required('Écrivez votre avis'))
    .trim()
    .min(20, 'Avis trop court (20 caractères minimum)')
    .max(1500, 'Avis trop long (1 500 caractères maximum)'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Merci d’accepter la publication de votre avis.' }),
  }),
  company: z.string().max(0).optional(), // honeypot : doit rester vide
});

// Un avis se dépose rarement : quotas plus serrés que le formulaire de contact.
const perIp = createRateLimiter({ windowMs: 60 * 60_000, max: 3 });
const global = createRateLimiter({ windowMs: 60 * 60_000, max: 20 });

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Origine non autorisée.' }, { status: 403 });
  }

  const ip = clientIp(request);
  if (!perIp.hit(ip).ok || !global.hit('all').ok) {
    return NextResponse.json(
      { error: 'Trop d’envois. Merci de réessayer un peu plus tard.' },
      { status: 429 },
    );
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
    const { name, email, role, rating, text } = parsed.data;
    await sendReviewEmail({ name, email, role: role || undefined, rating, text, meta: { ip } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/avis] Échec de l’envoi :', err);
    return NextResponse.json(
      {
        error: `Votre avis n'a pas pu être envoyé pour le moment. Vous pouvez me l'écrire à ${site.email}.`,
      },
      { status: 502 },
    );
  }
}
