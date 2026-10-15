'use client';

import { useEffect } from 'react';

const SWEEP = 10_000; // ms — durée d'un balayage de bout en bout
const GAP = 6_000; // ms — pause entre deux balayages
const CYCLE = SWEEP + GAP;
const BEAM_W = 190; // px — doit correspondre à la largeur du ::before (globals.css)
const SELECTOR = '.glass-panel, .beam-target';

/**
 * Un unique « jet de lumière » traverse tout l'écran de gauche à droite en
 * ~10 s, puis marque une pause de 6 s avant de recommencer. Il n'est rendu
 * visible que sur les panneaux (via --beam-x / --beam-o). Si le curseur
 * survole un panneau, le faisceau s'y estompe (règle CSS :hover, globals.css).
 *
 * Perf : les positions des panneaux sont mises en cache (re-mesurées au plus
 * toutes les MEASURE_EVERY ms, au resize et quand le DOM change) au lieu d'un
 * getBoundingClientRect par panneau et par image, et la boucle dort pendant
 * la pause entre deux balayages.
 */
const MEASURE_EVERY = 400; // ms

type Item = { el: HTMLElement; top: number; left: number; width: number; height: number; o: string };

export default function CardBeam() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let timer = 0;
    let items: Item[] = [];
    let measuredAt = -Infinity;
    let dirty = true;

    /* Lecture groupée de toutes les positions (aucune écriture intercalée) */
    const measure = (now: number) => {
      const sx = window.scrollX;
      const sy = window.scrollY;
      const prev = new Map(items.map((it) => [it.el, it.o]));
      items = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR), (el) => {
        const r = el.getBoundingClientRect();
        return { el, top: r.top + sy, left: r.left + sx, width: r.width, height: r.height, o: prev.get(el) ?? '' };
      });
      measuredAt = now;
      dirty = false;
    };

    const setO = (it: Item, o: string) => {
      if (it.o !== o) {
        it.o = o;
        it.el.style.setProperty('--beam-o', o);
      }
    };

    const loop = (now: number) => {
      /* Rien à éclairer tant que l'intro masque la page */
      if (document.documentElement.hasAttribute('data-intro')) {
        raf = requestAnimationFrame(loop);
        return;
      }
      const phase = now % CYCLE;

      /* Pause entre deux balayages : on éteint tout et on dort jusqu'au suivant */
      if (phase >= SWEEP) {
        for (const it of items) setO(it, '0');
        timer = window.setTimeout(() => {
          dirty = true;
          raf = requestAnimationFrame(loop);
        }, CYCLE - phase);
        return;
      }

      if (dirty || now - measuredAt > MEASURE_EVERY) measure(now);

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const sx = window.scrollX;
      const sy = window.scrollY;
      const beamX = -BEAM_W + (phase / SWEEP) * (vw + BEAM_W * 2);

      for (const it of items) {
        const top = it.top - sy;
        const onScreen = top + it.height > 0 && top < vh && it.width > 0;
        const localX = beamX - (it.left - sx);
        const across = localX > -BEAM_W && localX < it.width;
        if (onScreen && across) {
          it.el.style.setProperty('--beam-x', `${localX}px`);
          setO(it, '1');
        } else {
          setO(it, '0');
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const markDirty = () => {
      dirty = true;
    };
    window.addEventListener('resize', markDirty);
    const mo = new MutationObserver(markDirty);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener('resize', markDirty);
      mo.disconnect();
    };
  }, []);

  return null;
}
