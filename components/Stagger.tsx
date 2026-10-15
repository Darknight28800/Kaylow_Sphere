'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

const CONTAINER_TAGS = { div: motion.div, ol: motion.ol, ul: motion.ul } as const;
const ITEM_TAGS = { div: motion.div, li: motion.li, article: motion.article } as const;

interface StaggerProps {
  children: ReactNode;
  className?: string;
  /** Intervalle entre chaque enfant, en secondes. */
  gap?: number;
  as?: keyof typeof CONTAINER_TAGS;
}

/**
 * Conteneur qui fait apparaître ses <StaggerItem> en cascade à sa première
 * entrée dans le viewport.
 */
export function Stagger({ children, className, gap = 0.09, as = 'div' }: StaggerProps) {
  const MotionTag = CONTAINER_TAGS[as];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -6% 0px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap } },
      }}
    >
      {children}
    </MotionTag>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  as?: keyof typeof ITEM_TAGS;
  id?: string;
  /** Léger soulèvement au survol (cartes). */
  hover?: boolean;
}

export function StaggerItem({ children, className, as = 'div', id, hover = false }: StaggerItemProps) {
  const reduce = useReducedMotion();
  const MotionTag = ITEM_TAGS[as];

  const variants: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 18, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.65, ease: EASE } },
  };

  return (
    <MotionTag
      id={id}
      className={className}
      variants={variants}
      whileHover={
        hover && !reduce ? { y: -4, transition: { duration: 0.2, ease: 'easeOut' } } : undefined
      }
    >
      {children}
    </MotionTag>
  );
}
