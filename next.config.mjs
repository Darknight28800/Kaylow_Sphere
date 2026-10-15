const isDev = process.env.NODE_ENV !== 'production';

/**
 * Content-Security-Policy.
 * - 'unsafe-inline' sur script-src : requis par les pages statiques de Next
 *   (scripts d'hydratation inline) et par le script anti-flash de l'intro ;
 *   un nonce imposerait le rendu dynamique de toutes les pages.
 * - L'aperçu de la démo IA (iframe srcdoc sandboxée) hérite de cette politique :
 *   il n'utilise que du CSS/JS inline et des images data:.
 * - Aucune ressource tierce : polices auto-hébergées par next/font.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Build autonome : .next/standalone/server.js contient tout le nécessaire
  // pour lancer le site sur l'hébergement Node.js Hostinger (Passenger).
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
