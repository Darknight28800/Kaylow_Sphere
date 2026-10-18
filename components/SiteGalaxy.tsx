'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import BigBang from '@/components/BigBang';

/**
 * Galaxie en fond de toutes les pages sauf l'accueil, qui garde sa propre
 * séquence Big Bang (voir app/page.tsx). Pose `data-galaxy` sur <html> :
 * les fonds navy des sections deviennent alors transparents (globals.css).
 *
 * Pages de lecture (légal, articles de blog) : un voile bleu nuit atténue la
 * galaxie pour que le texte reste confortable à lire.
 */
const READING = /^\/(mentions-legales|confidentialite|blog\/[^/]+)\/?$/;
export default function SiteGalaxy() {
  const pathname = usePathname();
  const show = pathname !== '/';

  useEffect(() => {
    const root = document.documentElement;
    if (show) root.setAttribute('data-galaxy', '1');
    else root.removeAttribute('data-galaxy');
    return () => root.removeAttribute('data-galaxy');
  }, [show]);

  if (!show) return null;
  return (
    <>
      <BigBang mode="galaxy" />
      {READING.test(pathname) && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-[5] bg-navy/75" />
      )}
    </>
  );
}
