'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Titre du hero, révélé ligne par ligne (montée depuis un masque + flou qui
 * se dissipe). S'intègre dans un <Stagger> parent : hérite de ses états
 * « hidden » / « show ».
 */
export default function HeroTitle() {
  const reduce = useReducedMotion();

  const line: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: '70%', filter: 'blur(10px)' },
    show: { opacity: 1, y: '0%', filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE } },
  };

  return (
    <motion.h1
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
      className="font-heading text-[clamp(2.3rem,4.6vw,4.25rem)] font-bold leading-[1.02] tracking-[-0.04em]"
    >
      <span className="block overflow-hidden pb-[0.06em]">
        <motion.span variants={line} className="block">
          Le centre de gravité
        </motion.span>
      </span>
      <span className="block overflow-hidden pb-[0.06em]">
        <motion.span variants={line} className="block">
          de votre{' '}
          <span className="bg-gradient-to-r from-accent via-brand-400 to-brand bg-clip-text text-transparent">
            projet web
          </span>
          .
        </motion.span>
      </span>
    </motion.h1>
  );
}
