/**
 * Limiteur à fenêtre fixe, en mémoire (process unique).
 *
 * Suffisant pour un déploiement mono-instance (Hostinger Node.js). Pour du
 * multi-instances, remplacer le `Map` par un store partagé (Redis / Upstash).
 */

interface Bucket {
  count: number;
  resetAt: number;
}

export type LimitResult = { ok: true; remaining: number } | { ok: false; retryAfterMs: number };

export interface RateLimiter {
  /** Consomme un crédit pour `key` s'il en reste. */
  hit(key: string): LimitResult;
  /** Rend un crédit (ex. échec non imputable au visiteur). */
  refund(key: string): void;
}

export function createRateLimiter({
  windowMs,
  max,
}: {
  windowMs: number;
  max: number;
}): RateLimiter {
  const buckets = new Map<string, Bucket>();

  return {
    hit(key) {
      const now = Date.now();

      // Purge paresseuse : évite qu'une rafale d'IP distinctes fasse grossir la Map.
      if (buckets.size > 5_000) {
        for (const [k, b] of buckets) if (now > b.resetAt) buckets.delete(k);
      }

      let bucket = buckets.get(key);
      if (!bucket || now > bucket.resetAt) {
        bucket = { count: 0, resetAt: now + windowMs };
        buckets.set(key, bucket);
      }
      if (bucket.count >= max) return { ok: false, retryAfterMs: bucket.resetAt - now };
      bucket.count += 1;
      return { ok: true, remaining: max - bucket.count };
    },

    refund(key) {
      const bucket = buckets.get(key);
      if (bucket && bucket.count > 0) bucket.count -= 1;
    },
  };
}
