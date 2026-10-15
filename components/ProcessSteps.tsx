'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export interface ProcessStep {
  num: string;
  title: string;
  desc: string;
}

/**
 * Récit au défilement (« scroll storytelling ») de la méthode de travail.
 *
 * Desktop : colonne gauche collante (sticky) qui affiche l'étape en cours en
 * grand ; colonne droite qui fait défiler les étapes, l'étape au centre de
 * l'écran devient active. Mobile : simple liste, toutes les étapes visibles.
 */
export default function ProcessSteps({ steps }: { steps: ProcessStep[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const current = steps[active];

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
      {/* Colonne collante — desktop uniquement */}
      <div className="hidden lg:block">
        <div className="sticky top-32">
          <div className="relative h-[clamp(9rem,14vw,13rem)] overflow-hidden" aria-hidden="true">
            <motion.span
              key={current.num}
              initial={reduce ? false : { opacity: 0, y: 40, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="block bg-gradient-to-b from-white to-white/20 bg-clip-text font-heading text-[clamp(8rem,13vw,12rem)] font-bold leading-none tracking-[-0.06em] text-transparent"
            >
              {current.num}
            </motion.span>
          </div>
          {/* Progression */}
          <div className="mt-8 flex gap-2">
            {steps.map((s, i) => (
              <span
                key={s.num}
                className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                  i <= active ? 'bg-gradient-to-r from-accent to-brand' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-white/55">
            Étape {active + 1} sur {steps.length}
          </p>
        </div>
      </div>

      <ol className="space-y-6 lg:space-y-[28vh] lg:py-[12vh]">
        {steps.map((step, i) => (
          <Step key={step.num} step={step} isActive={i === active} onActive={() => setActive(i)} />
        ))}
      </ol>
    </div>
  );
}

function Step({
  step,
  isActive,
  onActive,
}: {
  step: ProcessStep;
  isActive: boolean;
  onActive: () => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // Active quand l'étape traverse la bande centrale de l'écran
  const inCenter = useInView(ref, { margin: '-45% 0px -45% 0px' });

  useEffect(() => {
    if (inCenter) onActive();
  }, [inCenter, onActive]);

  return (
    <li
      ref={ref}
      className={`glass-panel p-7 transition-[opacity,border-color] duration-500 sm:p-9 lg:opacity-40 ${
        isActive ? 'lg:!opacity-100 lg:border-accent/30' : ''
      }`}
    >
      <span className="font-mono text-xs tracking-widest text-accent lg:hidden">{step.num}</span>
      <h3 className="mt-2 text-2xl lg:mt-0">{step.title}</h3>
      <p className="mt-3 max-w-md text-base leading-relaxed text-white/70">{step.desc}</p>
    </li>
  );
}
