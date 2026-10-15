'use client';

import { useEffect, useRef } from 'react';

const COUNT = 64;
const REPEL_RADIUS = 100; // px — rayon autour du curseur qui repousse les particules
const REPEL_FORCE = 0.85;

/**
 * Champ d'étoiles/particules qui dérivent lentement sur toute la page et
 * fuient le curseur quand il s'en approche. Décoratif, non interactif
 * (pointer-events: none). Coupé pendant l'intro et si prefers-reduced-motion.
 */
export default function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const tints = ['rgba(255,255,255,', 'rgba(120,200,255,', 'rgba(123,98,248,'];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const parts = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: rand(-0.12, 0.12),
      vy: rand(-0.12, 0.12),
      r: rand(0.7, 2),
      base: rand(0.22, 0.55),
      tw: rand(0, Math.PI * 2),
      c: tints[Math.floor(Math.random() * tints.length)],
    }));

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onMove, { passive: true });
    window.addEventListener('blur', onLeave);
    document.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', resize);

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(2.5, (now - last) / 16.67);
      last = now;
      /* Masqué par CSS pendant l'intro : inutile de dessiner */
      if (document.documentElement.hasAttribute('data-intro')) {
        raf = requestAnimationFrame(loop);
        return;
      }
      ctx.clearRect(0, 0, w, h);

      for (const p of parts) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < REPEL_RADIUS * REPEL_RADIUS) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / REPEL_RADIUS) * REPEL_FORCE;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }

        p.vx += rand(-0.012, 0.012);
        p.vy += rand(-0.012, 0.012);
        p.vx *= 0.955;
        p.vy *= 0.955;

        if (Math.hypot(p.vx, p.vy) < 0.04) {
          p.vx += rand(-0.05, 0.05);
          p.vy += rand(-0.05, 0.05);
        }

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (p.x < -12) p.x = w + 12;
        else if (p.x > w + 12) p.x = -12;
        if (p.y < -12) p.y = h + 12;
        else if (p.y > h + 12) p.y = -12;

        p.tw += 0.018 * dt;
        const a = p.base * (0.55 + 0.45 * Math.sin(p.tw));

        ctx.beginPath();
        ctx.fillStyle = `${p.c}${(a * 0.14).toFixed(3)})`;
        ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `${p.c}${a.toFixed(3)})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
      window.removeEventListener('blur', onLeave);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="particle-field" aria-hidden="true" />;
}
