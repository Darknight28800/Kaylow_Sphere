'use client';

import { useEffect } from 'react';

/**
 * Halo lumineux qui suit le curseur à l'intérieur des panneaux `.glass-panel`
 * (rendu CSS : `.glass-panel::before` dans globals.css).
 *
 * Un seul écouteur délégué pour toute la page, actif uniquement avec une
 * souris (pas sur tactile) : on écrit --mx / --my sur le panneau survolé,
 * sans aucune lecture de layout hors du survol ni boucle d'animation.
 */
export default function Spotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let raf = 0;
    let last: PointerEvent | null = null;

    const apply = () => {
      raf = 0;
      const e = last;
      if (!e) return;
      const panel = (e.target as Element | null)?.closest?.<HTMLElement>('.glass-panel');
      if (!panel) return;
      const r = panel.getBoundingClientRect();
      panel.style.setProperty('--mx', `${e.clientX - r.left}px`);
      panel.style.setProperty('--my', `${e.clientY - r.top}px`);
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
