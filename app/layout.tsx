import type { Metadata, Viewport } from 'next';
import { Inter, Poppins, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IntroLoader from '@/components/IntroLoader';
import ScrollProgress from '@/components/ScrollProgress';
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

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-inter' });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-poppins',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Développeur web fullstack`,
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
        <Spotlight />
        <SmoothScroll>
          <div id="app-shell" className="flex min-h-screen flex-col">
            <Header />
            <main id="contenu" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
