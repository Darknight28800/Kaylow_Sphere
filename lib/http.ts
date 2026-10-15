import { site } from './site';

/**
 * Utilitaires HTTP partagés par les Route Handlers (`app/api/*`).
 */

/**
 * Nombre de proxys de confiance devant l'application (CDN Hostinger, Passenger…).
 * Chacun AJOUTE l'adresse qu'il voit à la fin de `X-Forwarded-For` : l'adresse
 * réelle du visiteur est donc la N-ième en partant de la droite. Tout ce qui est
 * plus à gauche a pu être forgé par le client.
 *
 * Non défini → repli sur la première adresse (comportement historique, falsifiable) :
 * les plafonds globaux de chaque route restent alors le vrai garde-fou.
 * Pour trouver la bonne valeur : regarder la ligne « Chaîne XFF » d'un e-mail
 * reçu via le formulaire de contact.
 */
const TRUSTED_PROXY_COUNT = Number(process.env.TRUSTED_PROXY_COUNT) || 0;

/** Chaîne `X-Forwarded-For` brute (diagnostic). */
export function forwardedChain(request: Request): string {
  return request.headers.get('x-forwarded-for') ?? '';
}

/** Adresse IP du visiteur, la moins falsifiable possible selon la configuration. */
export function clientIp(request: Request): string {
  const chain = forwardedChain(request)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (chain.length > 0) {
    if (TRUSTED_PROXY_COUNT > 0) {
      return chain[Math.max(0, chain.length - TRUSTED_PROXY_COUNT)];
    }
    return chain[0];
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

const ALLOWED_HOSTS = new Set([new URL(site.url).host, `www.${new URL(site.url).host}`]);

/**
 * Refuse les requêtes envoyées depuis un autre site (formulaire piégé, script
 * tiers qui consommerait la démo IA…). Les navigateurs envoient toujours
 * l'en-tête `Origin` sur un POST ; son absence = client non navigateur, accepté
 * (les quotas s'appliquent quand même). En dev, localhost est autorisé.
 */
export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    const { host, hostname } = new URL(origin);
    if (ALLOWED_HOSTS.has(host)) return true;
    return process.env.NODE_ENV !== 'production' && (hostname === 'localhost' || hostname === '127.0.0.1');
  } catch {
    return false;
  }
}
