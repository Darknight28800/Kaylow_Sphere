'use client';

import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

/**
 * Fine barre de progression de lecture, en haut de l'écran.
 * Animée uniquement via `transform: scaleX` (composité, aucun reflow).
 */
export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-accent via-brand-400 to-brand"
      style={{ scaleX: reduce ? scrollYProgress : smooth }}
    />
  );
}
