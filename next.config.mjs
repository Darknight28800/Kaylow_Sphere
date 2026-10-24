const isDev = process.env.NODE_ENV !== 'production';

/**
 * Content-Security-Policy.
 * - 'unsafe-inline' sur script-src : requis par les pages statiques de Next
 *   (scripts d'hydratation inline) et par le script anti-flash de l'intro ;
 *   un nonce imposerait le rendu dynamique de toutes les pages.
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
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join('; ');

/**
 * Variables serveur figées au moment du build.
 * Hostinger charge les variables de hPanel (fichier .env) pendant `next build`,
 * mais le serveur standalone ne les voit plus à l'exécution → le formulaire
 * de contact échouait en « Configuration SMTP incomplète ». On les inline donc
 * au build. Elles ne sont lues que dans app/api et lib (code serveur) : elles
 * n'apparaissent jamais dans le JavaScript envoyé au navigateur.
 * Conséquence : après un changement de variable dans hPanel, il faut REDÉPLOYER.
 */
const SERVER_ENV_KEYS = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_SECURE',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_TLS_INSECURE',
  'MAIL_FROM',
  'MAIL_TO',
  'TRUSTED_PROXY_COUNT',
];
const serverEnv = Object.fromEntries(
  SERVER_ENV_KEYS.filter((k) => process.env[k] !== undefined && process.env[k] !== '').map((k) => [
    k,
    process.env[k],
  ]),
);

// Diagnostic dans le journal de build Hostinger : présence des variables
// (noms seulement, jamais les valeurs).
console.log(
  '[env] ' + SERVER_ENV_KEYS.map((k) => `${k}=${k in serverEnv ? 'OK' : 'ABSENT'}`).join(' '),
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Build autonome : .next/standalone/server.js contient tout le nécessaire
  // pour lancer le site sur l'hébergement Node.js Hostinger (Passenger).
  output: 'standalone',
  env: serverEnv,
  // La démo IA a été retirée : les anciens liens renvoient vers l'accueil.
  async redirects() {
    return [
      { source: '/demo', destination: '/', permanent: true },
      // Une seule adresse pour Google : www.kaylowsphere.com renvoie vers kaylowsphere.com (page en double sinon).
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.kaylowsphere.com' }],
        destination: 'https://kaylowsphere.com/:path*',
        permanent: true,
      },
    ];
  },
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
