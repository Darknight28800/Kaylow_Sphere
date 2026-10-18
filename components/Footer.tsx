import Link from 'next/link';
import Image from 'next/image';
import Logo from './Logo';
import Icon from './Icon';
import { cities } from '@/lib/local';
import { trades } from '@/lib/trades';
import { nav, partner, site } from '@/lib/site';

const colLabel = 'font-mono text-xs uppercase tracking-[0.2em] text-white/60';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10">
      <div className="container-page py-14">
        <div className="grid gap-10 text-center md:grid-cols-[1.5fr_1fr_1fr] md:text-left">
          <div>
            <Logo />
            <p className="mx-auto mt-5 max-w-sm text-sm text-white/60 md:mx-0">{site.baseline}</p>
            <p className="mt-5 font-mono text-xs leading-relaxed text-white/60">
              {site.legalName} — {site.role}
              <br />
              {site.status} · {site.location}
            </p>
          </div>

          <nav aria-label="Pied de page — navigation">
            <h2 className={colLabel}>Navigation</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {nav.map((item) => (
                <li key={item.to}>
                  <Link
                    href={item.to}
                    className="text-white/60 transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={colLabel}>Contact</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 text-white/60 transition-colors hover:text-accent"
                >
                  <Icon name="mail" className="h-4 w-4" />
                  {site.email}
                </a>
              </li>
              {site.phone && (
                <li>
                  <a
                    href={`tel:${site.phoneHref}`}
                    className="inline-flex items-center gap-2 text-white/60 transition-colors hover:text-accent"
                  >
                    <Icon name="phone" className="h-4 w-4" />
                    {site.phone}
                  </a>
                </li>
              )}
              <li className="inline-flex items-center gap-2 text-white/60">
                <Icon name="map-pin" className="h-4 w-4" />
                {site.location}
              </li>
              <li className="text-xs leading-relaxed text-white/50">
                Création de site internet à{' '}
                {cities.map((c, i) => (
                  <span key={c.slug}>
                    <Link
                      href={`/creation-site-internet/${c.slug}`}
                      className="transition-colors hover:text-accent"
                    >
                      {c.name}
                    </Link>
                    {i < cities.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </li>
              <li className="text-xs leading-relaxed text-white/50">
                Site internet pour{' '}
                {trades.map((t, i) => (
                  <span key={t.slug}>
                    <Link
                      href={`/site-internet/${t.slug}`}
                      className="transition-colors hover:text-accent"
                    >
                      {t.name.toLowerCase()}
                    </Link>
                    {i < trades.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </li>
            </ul>
          </div>
        </div>

        {/* Partenariat — centré, ligne de séparation au-dessus */}
        <div className="mt-12 border-t border-white/10 pt-10">
          <div className="mx-auto flex w-fit flex-wrap items-center justify-center gap-x-6 gap-y-4 px-4 text-center">
            <span className="text-lg text-white/60">En partenariat avec</span>
            <a
              href={partner.url}
              target="_blank"
              rel="noreferrer"
              className="transition-opacity hover:opacity-80"
              aria-label={`${partner.name} — site web`}
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={306}
                height={160}
                unoptimized
                className="h-16 w-auto sm:h-[4.5rem]"
              />
            </a>
          </div>
        </div>

        <div className="mt-10 space-y-3 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/60">
          <p className="text-center">
            © {year} {site.name} — {site.legalName}. Tous droits réservés. Toute reproduction ou
            copie, même partielle, de ce site (contenus, code, design) est interdite sans
            autorisation écrite.
          </p>
          <div className="flex flex-col items-center gap-3 pt-1 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="uppercase tracking-[0.15em] text-white/60">
              Création - Développement - Innovation
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link href="/avis" className="transition-colors hover:text-white/70">
                Laisser un avis
              </Link>
              <Link href="/mentions-legales" className="transition-colors hover:text-white/70">
                Mentions légales
              </Link>
              <Link href="/confidentialite" className="transition-colors hover:text-white/70">
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
