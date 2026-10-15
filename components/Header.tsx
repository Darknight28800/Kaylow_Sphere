'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { nav, site } from '@/lib/site';

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  /* Fond flouté dès qu'on quitte le haut de page ; la barre se retire quand on
     descend et revient dès qu'on remonte (plus de place pour le contenu). */
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 160);
        lastY = y;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (to: string) => (to === '/' ? pathname === '/' : pathname.startsWith(to));

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[transform,background-color,border-color] duration-300 ease-out ${
        scrolled
          ? 'border-white/10 bg-navy/65 backdrop-blur-xl backdrop-saturate-150'
          : 'border-transparent bg-transparent'
      } ${hidden && !open ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-brand focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Aller au contenu
      </a>
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" aria-label={`${site.name} — accueil`}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Navigation principale">
          {nav.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              aria-current={isActive(item.to) ? 'page' : undefined}
              className={`relative text-sm font-medium tracking-wide transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-gradient-to-r after:from-accent after:to-brand after:transition-transform after:duration-300 ${
                isActive(item.to)
                  ? 'text-white after:scale-x-100'
                  : 'text-white/65 after:scale-x-0 hover:text-white hover:after:scale-x-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="btn-primary px-4 py-2.5">
            Demander un devis
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-[3px] border border-white/15 text-white md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 block h-0.5 w-5 bg-current transition-transform ${
                open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 bg-current transition-opacity ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-5 bg-current transition-transform ${
                open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'
              }`}
            />
          </span>
        </button>
      </div>

      {open && (
        <div id="menu-mobile" className="border-t border-white/10 bg-navy md:hidden">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="Navigation mobile">
            {nav.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                aria-current={isActive(item.to) ? 'page' : undefined}
                className={`rounded-lg px-3 py-3 text-base font-medium tracking-wide ${
                  isActive(item.to) ? 'bg-navy-800 text-accent' : 'text-white/80 hover:bg-navy-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/contact" className="btn-primary mt-2 w-full">
              Demander un devis
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
