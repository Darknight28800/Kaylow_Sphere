import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IntroLoader from '@/components/IntroLoader';
import BackToTop from '@/components/BackToTop';
import ScrollProgress from '@/components/ScrollProgress';
import SiteGalaxy from '@/components/SiteGalaxy';
import Spotlight from '@/components/Spotlight';
import SmoothScroll from '@/components/animations/SmoothScroll';
import { structuredData } from '@/lib/seo';
import { site } from '@/lib/site';

/**
 * Peint un cache noir instantané (avant hydratation) si l'intro n'a pas
 * encore été jouée dans la session. Retiré par IntroLoader à la fin,
 * ou par sécurité après 12 s (durée de la séquence + marge).
 */
const introGuard = `try{if(sessionStorage.getItem('sw-intro-played')!=='1'){document.documentElement.setAttribute('data-intro','1');setTimeout(function(){document.documentElement.removeAttribute('data-intro');document.documentElement.removeAttribute('data-intro-reveal')},12000);}}catch(e){}`;

/* Polices auto-hébergées (app/fonts, licence OFL) : aucun téléchargement
   Google au build — un échec réseau faisait échouer le déploiement. */
const inter = localFont({
  src: [
    { path: './fonts/inter-latin-400-normal.woff2', weight: '400' },
    { path: './fonts/inter-latin-500-normal.woff2', weight: '500' },
    { path: './fonts/inter-latin-600-normal.woff2', weight: '600' },
  ],
  variable: '--font-inter',
  display: 'swap',
});
const poppins = localFont({
  src: [
    { path: './fonts/poppins-latin-500-normal.woff2', weight: '500' },
    { path: './fonts/poppins-latin-600-normal.woff2', weight: '600' },
    { path: './fonts/poppins-latin-700-normal.woff2', weight: '700' },
  ],
  variable: '--font-poppins',
  display: 'swap',
});
const jetbrainsMono = localFont({
  src: [
    { path: './fonts/jetbrains-mono-latin-400-normal.woff2', weight: '400' },
    { path: './fonts/jetbrains-mono-latin-500-normal.woff2', weight: '500' },
  ],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Création de site internet à Chartres et en Eure-et-Loir`,
    template: `%s — ${site.name}`,
  },
  description: `${site.baseline} Sites vitrines, applications web sur mesure et maintenance par ${site.legalName}, développeur web fullstack en ${site.location}.`,
  applicationName: site.name,
  authors: [{ name: site.legalName }],
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#050B2B',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: introGuard }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
        />
        <IntroLoader />
        <ScrollProgress />
        <SiteGalaxy />
        <Spotlight />
        <SmoothScroll>
          <div id="app-shell" className="flex min-h-screen flex-col">
            <Header />
            <main id="contenu" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
            <Footer />
          </div>
          <BackToTop />
        </SmoothScroll>
      </body>
    </html>
  );
}
