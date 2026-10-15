'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const KEY = 'sw-intro-played';

/* Durées des phases en millisecondes — ajustables librement (total ≈ 5 s).
   La page est révélée dès que la sphère a disparu (fin de l'accélération). */
const PHASE = {
  cruise: 1_100, // 1. en hyper-espace
  decelerate: 1_200, // 2. décélération — la sphère se rapproche
  hold: 1_600, // 3. sphère au centre + barre
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

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => t * t * t;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

export default function IntroLoader() {
  const [active, setActive] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [hudOn, setHudOn] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLParagraphElement>(null);
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
        if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(3)})`;
        if (countRef.current) countRef.current.textContent = `${Math.round(clamp01(p) * 100)} %`;
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
        <p className="intro__hud-label">Bienvenue au cœur du web</p>
        <div className="intro__bar">
          <div ref={barRef} className="intro__bar-fill" />
        </div>
        <p ref={countRef} className="intro__count">
          0&nbsp;%
        </p>
      </div>

      <button type="button" className="intro__skip" onClick={() => revealFnRef.current()}>
        Passer l&apos;intro →
      </button>
    </div>
  );
}
