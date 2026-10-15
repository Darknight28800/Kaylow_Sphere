'use client';

/**
 * HeroBackground3D — enveloppe le rendu 3D du hero.
 * - Chargé en lazy (next/dynamic, ssr: false) : three.js/r3f/drei restent
 *   hors du bundle initial et ne s'exécutent jamais côté serveur.
 * - Ne se monte pas sur mobile ni si `prefers-reduced-motion` : dans ces cas
 *   c'est un simple bloc absent, aucune ressource chargée.
 * - Rendu en pause (frameloop « never ») pendant l'intro et quand le hero
 *   est hors écran.
 *
 * Exemple (dans le hero, en couche de fond) :
 *
 *   <section className="relative overflow-hidden">
 *     <HeroBackground3D className="absolute inset-0 -z-0 opacity-70" />
 *     <div className="relative z-10">…contenu du hero…</div>
 *   </section>
 */

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => null,
});

export default function HeroBackground3D({ className }: { className?: string }) {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [intro, setIntro] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(mq.matches && !reduce);

    const onChange = () => setEnabled(mq.matches && !reduce);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* Pause pendant l'intro (attribut data-intro sur <html>) */
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setIntro(root.hasAttribute('data-intro'));
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(root, { attributes: true, attributeFilter: ['data-intro'] });
    return () => mo.disconnect();
  }, []);

  /* Pause quand le hero sort de l'écran */
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      <HeroScene paused={intro || !visible} />
    </div>
  );
}
