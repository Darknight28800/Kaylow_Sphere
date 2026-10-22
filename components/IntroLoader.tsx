'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';

const KEY = 'sw-intro-played';

/* Durées des phases en millisecondes — ajustables librement (total 6 s).
   La page est révélée dès que la sphère a disparu (fin de l'accélération). */
const PHASE = {
  cruise: 1_100, // 1. en hyper-espace
  decelerate: 1_200, // 2. décélération — la sphère se rapproche
  hold: 2_500, // 3. sphère au centre : l'anneau se dessine, le nom s'écrit
  accelerate: 1_200, // 4. ré-accélération — la sphère zoome et s'efface
} as const;

type Phase = 'cruise' | 'decelerate' | 'hold' | 'accelerate' | 'reveal';
const SEQ = ['cruise', 'decelerate', 'hold', 'accelerate'] as const;

/* Bornes cumulées [début, fin] de chaque phase */
const BOUND: Record<string, [number, number]> = (() => {
  let acc = 0;
  const b: Record<string, [number, number]> = {};
  for (const p of SEQ) {
    b[p] = [acc, acc + PHASE[p]];
    acc += PHASE[p];
  }
  return b;
})();
const SPEED = 0.7; // vitesse de croisière (unités de profondeur / s)
const REVEAL_MS = 600; // durée d'apparition de la page
const SPHERE_ZOOM = 55; // facteur d'agrandissement de la sphère pendant l'accélération

const RING_R = 47; // rayon de l'anneau (viewBox 100 × 100)
const RING_LEN = 2 * Math.PI * RING_R;
const RING_CLOSE = 0.8; // part de la phase « hold » au bout de laquelle l'anneau est fermé

/* Nom écrit sous la sphère : une couleur par lettre, du bleu électrique au violet du logo */
const NAME = 'KAYLOW SPHERE';
const GRADIENT: [number, number, number][] = [
  [91, 140, 255], // #5B8CFF
  [123, 98, 248], // #7B62F8
  [91, 61, 246], // #5B3DF6
];
const letterColor = (t: number) => {
  const seg = Math.min(GRADIENT.length - 2, Math.floor(t * (GRADIENT.length - 1)));
  const k = t * (GRADIENT.length - 1) - seg;
  const a = GRADIENT[seg];
  const b = GRADIENT[seg + 1];
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(', ')})`;
};
const LETTERS = Array.from(NAME).map((ch, i) => ({
  ch,
  color: letterColor(i / (NAME.length - 1)),
  delay: i * 85,
}));

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => t * t * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

export default function IntroLoader() {
  const [active, setActive] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [hudOn, setHudOn] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const cometRef = useRef<SVGCircleElement>(null);
  const [ringClosed, setRingClosed] = useState(false);
  const doneRef = useRef(false);
  const hudOnRef = useRef(false);
  const revealFnRef = useRef<() => void>(() => {});
  hudOnRef.current = hudOn;

  /* Décide si l'intro doit jouer (une fois par session) */
  useEffect(() => {
    let played = true;
    try {
      played = sessionStorage.getItem(KEY) === '1';
    } catch {
      played = false;
    }
    if (played) {
      document.documentElement.removeAttribute('data-intro');
      return;
    }
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* ignore */
    }
    setActive(true);
  }, []);

  /* Déroule la séquence une fois le canvas monté */
  useEffect(() => {
    if (!active) return;

    /* --- Fin de l'intro : révèle la page --- */
    const reveal = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      document.documentElement.setAttribute('data-intro-reveal', '1');
      document.documentElement.removeAttribute('data-intro');
      setRevealing(true);
      window.setTimeout(() => {
        setActive(false);
        document.documentElement.removeAttribute('data-intro-reveal');
      }, REVEAL_MS + 200);
    };
    revealFnRef.current = reveal;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      const id = window.setTimeout(reveal, 500);
      return () => clearTimeout(id);
    }

    /* --- Canvas hyper-espace --- */
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      const id = window.setTimeout(reveal, 500);
      return () => clearTimeout(id);
    }
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let fov = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2;
      cy = h / 2;
      fov = Math.max(w, h) * 0.9;
    };
    resize();
    window.addEventListener('resize', resize);

    const N = 300;
    const stars = Array.from({ length: N }, () => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random() * 0.9 + 0.1,
    }));

    const start = performance.now();
    let last = start;
    let raf = 0;
    let hudShown = false;
    let closed = false;

    const currentPhase = (t: number): Phase | 'reveal' => {
      for (const p of SEQ) if (t < BOUND[p][1]) return p;
      return 'reveal';
    };

    const setSphere = (scale: number, opacity: number) => {
      const el = sphereRef.current;
      if (el) {
        el.style.transform = `translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = String(opacity);
      }
    };

    const loop = (now: number) => {
      if (doneRef.current) return;
      const t = now - start;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const phase = currentPhase(t);

      let speed = SPEED;
      let alpha = 1;

      if (phase === 'cruise') {
        speed = SPEED;
        setSphere(0, 0);
      } else if (phase === 'decelerate') {
        const p = (t - BOUND.decelerate[0]) / PHASE.decelerate;
        speed = SPEED * (1 - easeOut(p));
        setSphere(0.04 + easeOut(p) * 0.96, clamp01(p * 2));
      } else if (phase === 'hold') {
        const p = (t - BOUND.hold[0]) / PHASE.hold;
        speed = 0.015;
        setSphere(1, 1);
        if (!hudShown) {
          hudShown = true;
          setHudOn(true);
        }
        /* L'anneau se dessine autour de la sphère, une comète en tête */
        const r = easeInOut(clamp01(p / RING_CLOSE));
        if (ringRef.current) ringRef.current.style.strokeDashoffset = String(RING_LEN * (1 - r));
        if (cometRef.current) {
          const a = -Math.PI / 2 + r * 2 * Math.PI;
          cometRef.current.setAttribute('cx', (50 + RING_R * Math.cos(a)).toFixed(2));
          cometRef.current.setAttribute('cy', (50 + RING_R * Math.sin(a)).toFixed(2));
          cometRef.current.style.opacity = r >= 0.999 ? '0' : '1';
        }
        if (!closed && r >= 0.999) {
          closed = true;
          setRingClosed(true);
        }
      } else if (phase === 'accelerate') {
        const p = (t - BOUND.accelerate[0]) / PHASE.accelerate;
        speed = SPEED * 1.2 * easeIn(p);
        /* Zoom jusqu'à couvrir toute la page ; fondu progressif sur toute la phase */
        const k = easeIn(p);
        setSphere(1 + k * SPHERE_ZOOM, 1 - k);
        if (hudShown && hudOnRef.current) {
          setHudOn(false);
        }
      } else {
        // reveal
        alpha = 0;
      }

      /* Traînée : on éclaircit à peine le noir pour l'effet de filé */
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(3, 4, 12, 0.28)';
      ctx.fillRect(0, 0, w, h);

      if (alpha > 0) {
        ctx.globalAlpha = alpha;
        for (const s of stars) {
          const pz = s.z;
          s.z -= speed * dt;
          if (s.z <= 0.02) {
            s.z = 1;
            s.x = Math.random() * 2 - 1;
            s.y = Math.random() * 2 - 1;
            continue;
          }
          const sx = cx + (s.x / s.z) * fov;
          const sy = cy + (s.y / s.z) * fov;
          const px = cx + (s.x / pz) * fov;
          const py = cy + (s.y / pz) * fov;
          const d = 1 - s.z;
          ctx.strokeStyle = `rgba(200, 224, 255, ${clamp01(d * 1.1)})`;
          ctx.lineWidth = Math.max(0.5, d * 2.6);
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        }
      }

      if (phase === 'reveal') {
        reveal();
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      className={`intro ${revealing ? 'intro--reveal' : ''}`}
      role="presentation"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="intro__canvas" />

      <div ref={sphereRef} className="intro__sphere-wrap">
        {/* Anneau d'orbite : se dessine pendant la pause, éclat à la fermeture */}
        <svg
          className={`intro__ring ${ringClosed ? 'intro__ring--closed' : ''}`}
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id="intro-ring-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5B8CFF" />
              <stop offset="50%" stopColor="#7B62F8" />
              <stop offset="100%" stopColor="#5B3DF6" />
            </linearGradient>
          </defs>
          <circle className="intro__ring-track" cx="50" cy="50" r={RING_R} />
          <circle
            ref={ringRef}
            className="intro__ring-line"
            cx="50"
            cy="50"
            r={RING_R}
            stroke="url(#intro-ring-grad)"
            strokeDasharray={RING_LEN}
            strokeDashoffset={RING_LEN}
            transform="rotate(-90 50 50)"
          />
          <circle ref={cometRef} className="intro__ring-comet" cx="50" cy={50 - RING_R} r="1.4" />
        </svg>
        <div className="intro__sphere-spin">
          <Image
            src="/logo-sphere.png"
            alt=""
            fill
            sizes="280px"
            priority
            className="intro__sphere-img"
          />
        </div>
      </div>

      <div className={`intro__hud ${hudOn ? 'intro__hud--on' : ''}`}>
        {/* Nom de marque : chaque lettre s'allume l'une après l'autre */}
        <p className="intro__name">
          {LETTERS.map(({ ch, color, delay }, i) =>
            ch === ' ' ? (
              <span key={i} className="intro__name-space" />
            ) : (
              <span
                key={i}
                className="intro__letter"
                style={{ color, '--glow': color, animationDelay: `${delay}ms` } as CSSProperties}
              >
                {ch}
              </span>
            ),
          )}
        </p>
        <p className="intro__tagline">Création · Développement · Innovation</p>
      </div>

      <button type="button" className="intro__skip" onClick={() => revealFnRef.current()}>
        Passer l&apos;intro →
      </button>
    </div>
  );
}
