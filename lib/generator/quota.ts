/**
 * Quotas et journalisation de la démo IA — en mémoire (process unique).
 *
 * Suffisant pour un déploiement mono-instance (Hostinger Node.js).
 * Pour du multi-instances, remplacer par un store partagé (Redis / Upstash)
 * — même remarque que pour `app/api/contact/route.ts`.
 */

import { createRateLimiter } from '../rate-limit';

// 3 générations gratuites / IP / jour, et un plafond dur toutes IP confondues
// (borne les coûts API même si l'IP est falsifiée).
const PER_IP_MAX = 3;
const DAY_MS = 24 * 60 * 60 * 1000;
const perIp = createRateLimiter({ windowMs: DAY_MS, max: PER_IP_MAX });
const global = createRateLimiter({ windowMs: DAY_MS, max: 150 });

export type QuotaResult =
  { ok: true; remaining: number } | { ok: false; reason: 'ip' | 'global'; retryAfterMs: number };

/** Vérifie ET consomme un crédit si disponible. */
export function consumeQuota(ip: string): QuotaResult {
  const g = global.hit('all');
  if (!g.ok) return { ok: false, reason: 'global', retryAfterMs: g.retryAfterMs };

  const r = perIp.hit(ip);
  if (!r.ok) {
    global.refund('all');
    return { ok: false, reason: 'ip', retryAfterMs: r.retryAfterMs };
  }
  return { ok: true, remaining: r.remaining };
}

/** Rend un crédit (appel après un échec côté modèle : on ne facture pas l'erreur). */
export function refundQuota(ip: string): void {
  perIp.refund(ip);
  global.refund('all');
}

export const QUOTA_PER_IP = PER_IP_MAX;

// --- Journalisation -----------------------------------------------------
export interface GenerationLog {
  ip: string;
  promptLength: number;
  prompt: string;
  status: 'ok' | 'error';
  durationMs: number;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  error?: string;
}

/**
 * Trace une génération (analyse d'usage + anti-abus).
 * Sortie sur stdout au format JSON — récupérable via les journaux d'exécution
 * Hostinger. À brancher sur une table MySQL/Sequelize si un historique
 * persistant devient nécessaire.
 */
export function logGeneration(entry: GenerationLog): void {
  console.info(
    '[api/generate]',
    JSON.stringify({ at: new Date().toISOString(), ...entry, prompt: entry.prompt.slice(0, 500) }),
  );
}
