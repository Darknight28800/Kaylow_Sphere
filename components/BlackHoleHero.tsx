'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import BlackHole from '@/components/BlackHole';

/**
 * Hero « trou noir » de l'accueil, en trois pièces qui gardent la structure
 * de app/page.tsx :
 *
 *   <BlackHoleHero className="…section…">
 *     <BlackHoleLayer className="…position du trou noir…" />
 *     …
 *     <GravityPull>…contenu du hero…</GravityPull>
 *   </BlackHoleHero>
 *
 * En scrollant, le contenu est attiré vers le centre du trou noir
 * (translation, rétrécissement, torsion, fondu) pendant que la caméra du
 * shader s'en approche. Inerte si `prefers-reduced-motion`.
 */

interface HeroCtx {
  pull: MotionValue<number>;
  holeRef: RefObject<HTMLDivElement | null>;
  reduce: boolean;
}

const Ctx = createContext<HeroCtx | null>(null);

function useHero() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('BlackHoleLayer / GravityPull doivent être dans <BlackHoleHero>');
  return ctx;
}

export function BlackHoleHero({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const holeRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const pull = useTransform(scrollYProgress, [0, 0.9], [0, 1], { clamp: true });

  return (
    <section ref={sectionRef} className={className}>
      <Ctx.Provider value={{ pull, holeRef, reduce }}>{children}</Ctx.Provider>
    </section>
  );
}

/** Couche du trou noir ; son centre est la cible de l'aspiration. */
export function BlackHoleLayer({ className }: { className?: string }) {
  const { pull, holeRef, reduce } = useHero();
  return (
    <div ref={holeRef} aria-hidden="true" className={className}>
      <BlackHole pull={reduce ? undefined : pull} />
    </div>
  );
}

/** Contenu attiré vers le trou noir au fil du scroll. */
export function GravityPull({ children }: { children: ReactNode }) {
  const { pull, holeRef, reduce } = useHero();
  const outerRef = useRef<HTMLDivElement>(null);

  // Accélère à l'approche de l'horizon (ease-in)
  const k = useTransform(pull, (v) => v * v);

  // Vecteur contenu → centre du trou noir, mesuré au redimensionnement
  const vx = useMotionValue(0);
  const vy = useMotionValue(0);
  const x = useTransform([k, vx], ([kv, d]: number[]) => kv * d * 0.85);
  const y = useTransform([k, vy], ([kv, d]: number[]) => kv * d * 0.85);
  const scale = useTransform(k, [0, 1], [1, 0.35]);
  const rotate = useTransform(k, [0, 1], [0, -12]);
  const opacity = useTransform(k, [0, 0.75, 1], [1, 0.45, 0]);

  useEffect(() => {
    const outer = outerRef.current;
    const hole = holeRef.current;
    if (!outer || !hole) return;
    const measure = () => {
      const t = outer.getBoundingClientRect();
      const h = hole.getBoundingClientRect();
      vx.set(h.left + h.width / 2 - (t.left + t.width / 2));
      vy.set(h.top + h.height / 2 - (t.top + t.height / 2));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(outer);
    ro.observe(hole);
    return () => ro.disconnect();
  }, [holeRef, vx, vy]);

  // Le conteneur externe reste fixe (mesure), l'interne est aspiré
  return (
    <div ref={outerRef}>
      <motion.div
        style={reduce ? undefined : { x, y, scale, rotate, opacity }}
        className="origin-center will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
