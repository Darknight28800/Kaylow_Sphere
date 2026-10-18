'use client';

import { useEffect, useState } from 'react';
import { useLenis } from '@/components/animations/SmoothScroll';
import Icon from './Icon';

/**
 * Bouton « retour en haut », en bas à droite. Apparaît après un écran et demi
 * de défilement ; remonte en douceur via Lenis (ou instantanément si le
 * visiteur a demandé des animations réduites).
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 1.5);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (lenis && !reduce) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    // Le focus revient en haut de page pour les utilisateurs au clavier
    document.getElementById('contenu')?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Retour en haut de la page"
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-5 right-5 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-navy/80 text-white/80 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-300 hover:border-accent/60 hover:text-accent sm:bottom-8 sm:right-8 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <Icon name="arrow-right" className="h-4 w-4 -rotate-90" />
    </button>
  );
}
