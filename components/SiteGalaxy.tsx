'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import BigBang from '@/components/BigBang';

/**
 * Galaxie en fond de toutes les pages sauf l'accueil, qui garde sa propre
 * séquence Big Bang (voir app/page.tsx). Pose `data-galaxy` sur <html> :
 * les fonds navy des sections deviennent alors transparents (globals.css).
 */
export default function SiteGalaxy() {
  const pathname = usePathname();
  const show = pathname !== '/';

  useEffect(() => {
    const root = document.documentElement;
    if (show) root.setAttribute('data-galaxy', '1');
    else root.removeAttribute('data-galaxy');
    return () => root.removeAttribute('data-galaxy');
  }, [show]);

  return show ? <BigBang mode="galaxy" /> : null;
}
