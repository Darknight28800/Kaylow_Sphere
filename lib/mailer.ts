import nodemailer from 'nodemailer';
import { site } from './site';

const HOST = new URL(site.url).host;

export interface ContactPayload {
  name: string;
  email: string;
  projectType?: string;
  message: string;
  /** Référence du ticket montré au visiteur (ex. KS-7F3K). */
  ref?: string;
  meta?: { ip?: string | null; chain?: string };
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('Configuration SMTP incomplète (SMTP_HOST / SMTP_USER / SMTP_PASS).');
  }

  transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
    // Échappatoire DEV UNIQUEMENT : certains antivirus (Norton, ESET…) inspectent
    // le trafic SMTP et présentent un certificat re-signé non vérifiable. Ne
    // JAMAIS activer en production (le serveur Hostinger n'a pas ce problème).
    ...(process.env.SMTP_TLS_INSECURE === 'true' ? { tls: { rejectUnauthorized: false } } : {}),
  });

  return transporter;
}

function escapeHtml(str: string): string {
  return str.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
  );
}

/** Envoie le message du formulaire de contact vers la boîte Kaylow Sphere. */
export async function sendContactEmail(data: ContactPayload) {
  const { name, email, projectType = 'Non précisé', message, ref, meta = {} } = data;
  const receivedAt = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });

  const from = process.env.MAIL_FROM || process.env.SMTP_USER || '';
  const to = process.env.MAIL_TO || process.env.SMTP_USER || '';

  const text = [
    `Nouveau message depuis ${HOST}`,
    '',
    ref ? `Référence    : ${ref}` : null,
    `Nom          : ${name}`,
    `E-mail       : ${email}`,
    `Type projet  : ${projectType}`,
    `Reçu le      : ${receivedAt}`,
    meta.ip ? `IP           : ${meta.ip}` : null,
    // Diagnostic de TRUSTED_PROXY_COUNT (cf. lib/http.ts)
    meta.chain ? `Chaîne XFF   : ${meta.chain}` : null,
    '',
    'Message :',
    message,
  ]
    .filter(Boolean)
    .join('\n');

  const html = `
    <h2 style="font-family:Arial,sans-serif;color:#050B2B">Nouveau message — ${HOST}</h2>
    <table style="font-family:Arial,sans-serif;font-size:14px;color:#1F2937;border-collapse:collapse">
      ${ref ? `<tr><td style="padding:4px 12px 4px 0"><strong>Référence</strong></td><td>${escapeHtml(ref)}</td></tr>` : ''}
      <tr><td style="padding:4px 12px 4px 0"><strong>Nom</strong></td><td>${escapeHtml(name)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0"><strong>E-mail</strong></td><td>${escapeHtml(email)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0"><strong>Type de projet</strong></td><td>${escapeHtml(projectType)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0"><strong>Reçu le</strong></td><td>${escapeHtml(receivedAt)}</td></tr>
      ${meta.ip ? `<tr><td style="padding:4px 12px 4px 0;color:#6B7280">IP</td><td style="color:#6B7280">${escapeHtml(meta.ip)}</td></tr>` : ''}
      ${meta.chain ? `<tr><td style="padding:4px 12px 4px 0;color:#6B7280">Chaîne XFF</td><td style="color:#6B7280">${escapeHtml(meta.chain)}</td></tr>` : ''}
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#1F2937;white-space:pre-wrap;margin-top:16px">${escapeHtml(
      message,
    )}</p>`;

  return getTransporter().sendMail({
    from,
    to,
    replyTo: `${name} <${email}>`,
    subject: `[${ref ?? 'Contact'}] ${projectType} — ${name}`,
    text,
    html,
  });
}

export interface ReviewPayload {
  name: string;
  email: string;
  role?: string;
  rating: number;
  text: string;
  meta?: { ip?: string | null };
}

/** Initiale du nom de famille : « Camille Durand » → « Camille D. » */
function displayName(full: string): string {
  const parts = full.trim().split(/\s+/);
  if (parts.length < 2) return parts[0] ?? full;
  return `${parts[0]} ${parts[parts.length - 1].charAt(0).toUpperCase()}.`;
}

/**
 * Envoie un avis client pour modération. L'e-mail contient un bloc prêt à
 * coller dans `testimonials` (lib/site.ts) si vous décidez de le publier.
 */
export async function sendReviewEmail(data: ReviewPayload) {
  const { name, email, role, rating, text, meta = {} } = data;
  const receivedAt = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
  const month = new Date().toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Paris',
  });
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

  const snippet = [
    '  {',
    `    name: ${JSON.stringify(displayName(name))},`,
    role ? `    role: ${JSON.stringify(role)},` : null,
    `    rating: ${rating},`,
    `    text: ${JSON.stringify(text)},`,
    `    date: ${JSON.stringify(month)},`,
    '  },',
  ]
    .filter(Boolean)
    .join('\n');

  const from = process.env.MAIL_FROM || process.env.SMTP_USER || '';
  const to = process.env.MAIL_TO || process.env.SMTP_USER || '';

  const textBody = [
    `Nouvel avis déposé sur ${HOST} — À MODÉRER`,
    '',
    `Note         : ${stars} (${rating}/5)`,
    `Nom          : ${name}`,
    `E-mail       : ${email}`,
    `Structure    : ${role || '—'}`,
    `Reçu le      : ${receivedAt}`,
    meta.ip ? `IP           : ${meta.ip}` : null,
    '',
    'Avis :',
    text,
    '',
    "L'auteur a accepté la publication de son avis (prénom + initiale du nom).",
    'Pour le publier, coller ce bloc dans `testimonials` (lib/site.ts) :',
    '',
    snippet,
  ]
    .filter((l) => l !== null)
    .join('\n');

  const html = `
    <h2 style="font-family:Arial,sans-serif;color:#050B2B">Nouvel avis à modérer — ${HOST}</h2>
    <p style="font-family:Arial,sans-serif;font-size:22px;color:#5B3DF6;margin:0 0 12px">${stars}</p>
    <table style="font-family:Arial,sans-serif;font-size:14px;color:#1F2937;border-collapse:collapse">
      <tr><td style="padding:4px 12px 4px 0"><strong>Nom</strong></td><td>${escapeHtml(name)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0"><strong>E-mail</strong></td><td>${escapeHtml(email)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0"><strong>Structure</strong></td><td>${escapeHtml(role || '—')}</td></tr>
      <tr><td style="padding:4px 12px 4px 0"><strong>Reçu le</strong></td><td>${escapeHtml(receivedAt)}</td></tr>
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#1F2937;white-space:pre-wrap;margin-top:16px">${escapeHtml(text)}</p>
    <p style="font-family:Arial,sans-serif;font-size:13px;color:#6B7280;margin-top:20px">
      L'auteur a accepté la publication (prénom + initiale du nom). Pour le publier, coller ce bloc
      dans <code>testimonials</code> (lib/site.ts) :
    </p>
    <pre style="background:#F4F5F7;padding:12px;border-radius:6px;font-size:12px;white-space:pre-wrap">${escapeHtml(snippet)}</pre>`;

  return getTransporter().sendMail({
    from,
    to,
    replyTo: `${name} <${email}>`,
    subject: `[Avis ${rating}/5] ${name}${role ? ` — ${role}` : ''}`,
    text: textBody,
    html,
  });
}
