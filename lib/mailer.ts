import nodemailer from 'nodemailer';
import { site } from './site';

const HOST = new URL(site.url).host;

export interface ContactPayload {
  name: string;
  email: string;
  projectType?: string;
  message: string;
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
  const { name, email, projectType = 'Non précisé', message, meta = {} } = data;
  const receivedAt = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });

  const from = process.env.MAIL_FROM || process.env.SMTP_USER || '';
  const to = process.env.MAIL_TO || process.env.SMTP_USER || '';

  const text = [
    `Nouveau message depuis ${HOST}`,
    '',
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
    subject: `[Contact] ${projectType} — ${name}`,
    text,
    html,
  });
}
