'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Big Bang au scroll, puis galaxie en fond jusqu'en bas de la page.
 *
 * Le composant rend une bande vide (la « zone d'explosion ») dans le flux ;
 * la traverser fait avancer la séquence :
 *   0 → 0,3  éclair + onde de choc, les étoiles jaillissent du centre ;
 *   0,3 → 1  elles s'enroulent et se posent en galaxie spirale bleu-violet.
 * Remonter rejoue la séquence à l'envers.
 *
 * Rendu : canvas WebGL fixe en `z-index: -1` (porté dans <body>), donc sous
 * tout le contenu ; les sections suivantes doivent avoir un fond transparent.
 * Les positions sont calculées dans le vertex shader à partir de la
 * progression : aucune mise à jour CPU par étoile.
 *
 * Mode `galaxy` (pages internes) : pas de zone ni d'explosion, la galaxie
 * formée est en fond dès l'arrivée sur la page.
 *
 * Performance : boucle arrêtée tant que la zone n'est pas atteinte, onglet
 * masqué ou intro en cours ; moins d'étoiles sur mobile. Animations réduites :
 * galaxie fixe, sans explosion.
 */

const VERT = `
attribute vec3 aGal;  // rayon, angle, hauteur dans le disque
attribute vec3 aDir;  // direction d'éjection (unitaire)
attribute vec4 aRnd;  // vitesse, taille, teinte, phase
uniform float uP;
uniform float uTime;
uniform float uAspect;
uniform float uScale;
uniform float uPx;
varying vec3 vCol;
varying float vA;

const vec3 C_CORE = vec3(1.0, 0.93, 0.98);
const vec3 C_BLUE = vec3(0.16, 0.56, 0.97);
const vec3 C_CYAN = vec3(0.13, 0.83, 0.93);
const vec3 C_VIOLET = vec3(0.357, 0.239, 0.965);
const vec3 C_LILAC = vec3(0.62, 0.48, 1.0);
const float INCL = 0.85;
const float ROLL = -0.35;

void main() {
  float r = aGal.x;
  float a = aGal.y + uTime * 0.035 / (0.25 + r); // rotation différentielle
  vec3 g = vec3(r * cos(a), aGal.z, r * sin(a));

  // Éjection
  float pe = smoothstep(0.0, 0.42, uP);
  float ex = 1.0 - pow(1.0 - pe, 3.0);
  vec3 e = aDir * aRnd.x * ex * 1.1;

  // Formation : la matière s'enroule autour de l'axe puis se pose
  float pf = smoothstep(0.32, 1.0, uP);
  float f = pf * pf * (3.0 - 2.0 * pf);
  float sw = f * 1.8;
  e = vec3(e.x * cos(sw) - e.z * sin(sw), e.y, e.x * sin(sw) + e.z * cos(sw));
  vec3 pos = mix(e, g, f);

  // Inclinaison du disque + rotation dans l'écran
  float ci = cos(INCL);
  float si = sin(INCL);
  vec3 v = vec3(pos.x, pos.y * ci - pos.z * si, pos.y * si + pos.z * ci);
  float cr = cos(ROLL);
  float sr = sin(ROLL);
  v.xy = vec2(v.x * cr - v.y * sr, v.x * sr + v.y * cr);

  float persp = 3.0 / (3.0 + v.z);
  vec2 s = v.xy * persp * uScale;
  gl_Position = vec4(s.x / uAspect, s.y, 0.0, 1.0);

  float hue = aRnd.z;
  vec3 c = mix(C_BLUE, C_VIOLET * 1.35, smoothstep(0.15, 0.6, hue));
  c = mix(c, C_CYAN, step(0.86, hue) * 0.8);
  c = mix(c, C_LILAC, step(hue, 0.1) * 0.7);
  c = mix(C_CORE, c, smoothstep(0.04, 0.32, r));
  c = mix(vec3(1.0, 0.97, 0.92), c, smoothstep(0.05, 0.5, uP)); // blanc chaud au départ
  vCol = c;

  float tw = 0.75 + 0.25 * sin(uTime * 1.7 + aRnd.w * 6.2832);
  vA = tw * mix(0.45, 1.0, smoothstep(0.1, 0.4, r));

  float burst = 1.0 + 1.5 * (1.0 - smoothstep(0.0, 0.2, uP));
  gl_PointSize = aRnd.y * uPx * persp * burst;
}
`;

const FRAG = `
precision mediump float;
varying vec3 vCol;
varying float vA;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float k = max(0.0, 1.0 - dot(d, d) * 4.0);
  k *= k;
  gl_FragColor = vec4(vCol * k * vA, k * vA);
}
`;

// Éclair, onde de choc et halo de la galaxie (passe plein écran)
const GLOW_VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const GLOW_FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uP;
uniform float uAspect;
uniform float uScale;
uniform float uTime;
const vec3 C_CYAN = vec3(0.13, 0.83, 0.93);
const vec3 C_BLUE = vec3(0.16, 0.56, 0.97);
const vec3 C_VIOLET = vec3(0.357, 0.239, 0.965);
const float INCL = 0.85;
const float ROLL = -0.35;

void main() {
  vec2 uv = (gl_FragCoord.xy / uRes) * 2.0 - 1.0;
  uv.x *= uAspect;
  float d = length(uv);

  float fl = smoothstep(0.0, 0.03, uP) * (1.0 - smoothstep(0.03, 0.3, uP));
  vec3 col = vec3(1.0, 0.95, 1.0) * fl * (exp(-d * d * 6.0) * 1.4 + 0.25 * exp(-d * 1.5));

  float ringR = smoothstep(0.0, 0.35, uP) * 2.6;
  float ring = exp(-pow((d - ringR) * 9.0, 2.0)) * (1.0 - smoothstep(0.1, 0.4, uP));
  col += mix(C_CYAN, C_VIOLET, 0.5) * ring * 0.6;

  // Halo de la galaxie formée : ellipse dans le plan incliné
  float f = smoothstep(0.55, 1.0, uP);
  float cr = cos(-ROLL);
  float sr = sin(-ROLL);
  vec2 q = vec2(uv.x * cr - uv.y * sr, uv.x * sr + uv.y * cr) / uScale;
  q.y /= sin(INCL);
  float gd = length(q);
  col += f * (vec3(0.85, 0.8, 1.0) * exp(-gd * gd * 40.0) * 0.3
            + mix(C_BLUE, C_VIOLET, smoothstep(0.1, 0.8, gd)) * exp(-gd * 2.8) * 0.05);

  // Nébuleuse le long des bras (même rotation différentielle que les étoiles)
  float ga = atan(-q.y, q.x) - uTime * 0.035 / (0.25 + gd);
  float phase = ga - log(max(gd, 0.08) / 0.08) * 2.0;
  float arms = pow(0.5 + 0.5 * cos(2.0 * phase), 3.0);
  float neb = arms * exp(-gd * 1.6) * smoothstep(0.06, 0.25, gd);
  col += f * mix(C_BLUE, C_VIOLET * 1.3, smoothstep(0.1, 0.6, gd)) * neb * 0.22;

  gl_FragColor = vec4(col, clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0));
}
`;

const COUNT_DESKTOP = 14000;
const COUNT_MOBILE = 6000;
const DPR_CAP = 1.5;
/** Position de déclenchement : la séquence démarre quand le haut de la zone
 *  atteint ce point de l'écran (0 = haut, 1 = bas). */
const TRIGGER = 0.5;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error('[BigBang]', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function program(gl: WebGLRenderingContext, vert: string, frag: string) {
  const vs = compile(gl, gl.VERTEX_SHADER, vert);
  const fs = compile(gl, gl.FRAGMENT_SHADER, frag);
  const prog = gl.createProgram();
  if (!vs || !fs || !prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('[BigBang]', gl.getProgramInfoLog(prog));
    return null;
  }
  return prog;
}

/** Étoiles : bulbe central, deux bras spiraux logarithmiques, disque diffus. */
function buildStars(count: number) {
  const gal = new Float32Array(count * 3);
  const dir = new Float32Array(count * 3);
  const rnd = new Float32Array(count * 4);
  const gauss = () => {
    let u = 0;
    while (u === 0) u = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random());
  };

  for (let i = 0; i < count; i++) {
    const kind = Math.random();
    let r: number;
    let theta: number;
    let h: number;
    if (kind < 0.1) {
      r = Math.abs(gauss()) * 0.13;
      theta = Math.random() * Math.PI * 2;
      h = gauss() * 0.05;
    } else if (kind < 0.82) {
      const arm = i % 2;
      r = 0.08 + Math.pow(Math.random(), 0.85) * 1.05;
      theta = arm * Math.PI + Math.log(r / 0.08) * 2.0 + gauss() * 0.16 * (0.5 + r);
      h = gauss() * 0.02;
    } else {
      r = 0.1 + Math.pow(Math.random(), 0.7) * 1.1;
      theta = Math.random() * Math.PI * 2;
      h = gauss() * 0.025;
    }
    gal.set([r, theta, h], i * 3);

    // Direction uniforme sur la sphère
    const z = Math.random() * 2 - 1;
    const t = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - z * z);
    dir.set([s * Math.cos(t), z, s * Math.sin(t)], i * 3);

    const bright = Math.random() < 0.05;
    rnd.set(
      [
        0.3 + Math.sqrt(Math.random()) * 1.2,
        bright ? 3 + Math.random() * 1.5 : 0.8 + Math.random() * 1.8,
        Math.random(),
        Math.random(),
      ],
      i * 4,
    );
  }
  return { gal, dir, rnd };
}

interface BigBangProps {
  className?: string;
  /**
   * `bigbang` (accueil) : séquence pilotée par la traversée de la zone.
   * `galaxy` (autres pages) : galaxie déjà formée, en fond dès l'arrivée.
   */
  mode?: 'bigbang' | 'galaxy';
}

export default function BigBang({ className = '', mode = 'bigbang' }: BigBangProps) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const zone = zoneRef.current;
    const canvas = canvasRef.current;
    const galaxyOnly = mode === 'galaxy';
    if (!mounted || !canvas || (!galaxyOnly && !zone)) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
    });
    if (!gl) return;

    const stars = program(gl, VERT, FRAG);
    const glow = program(gl, GLOW_VERT, GLOW_FRAG);
    if (!stars || !glow) return;

    const count = window.innerWidth < 768 ? COUNT_MOBILE : COUNT_DESKTOP;
    const data = buildStars(count);
    const attr = (prog: WebGLProgram, name: string, arr: Float32Array, size: number) => {
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);
      return { buf, loc: gl.getAttribLocation(prog, name), size };
    };
    const starAttrs = [
      attr(stars, 'aGal', data.gal, 3),
      attr(stars, 'aDir', data.dir, 3),
      attr(stars, 'aRnd', data.rnd, 4),
    ];
    const quad = attr(glow, 'aPos', new Float32Array([-1, -1, 3, -1, -1, 3]), 2);

    const bind = (list: { buf: WebGLBuffer | null; loc: number; size: number }[]) => {
      for (const a of list) {
        gl.bindBuffer(gl.ARRAY_BUFFER, a.buf);
        gl.enableVertexAttribArray(a.loc);
        gl.vertexAttribPointer(a.loc, a.size, gl.FLOAT, false, 0, 0);
      }
    };
    const unbind = (list: { loc: number }[]) => {
      for (const a of list) gl.disableVertexAttribArray(a.loc);
    };

    const u = (prog: WebGLProgram, name: string) => gl.getUniformLocation(prog, name);
    const su = {
      p: u(stars, 'uP'),
      time: u(stars, 'uTime'),
      aspect: u(stars, 'uAspect'),
      scale: u(stars, 'uScale'),
      px: u(stars, 'uPx'),
    };
    const gu = {
      res: u(glow, 'uRes'),
      p: u(glow, 'uP'),
      aspect: u(glow, 'uAspect'),
      scale: u(glow, 'uScale'),
      time: u(glow, 'uTime'),
    };

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE); // lumière additive

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(DPR_CAP, window.devicePixelRatio || 1);
    let aspect = 1;
    let scale = 1;
    let px = dpr;
    let zoneTop = 0;
    let zoneH = 1;

    const measure = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      aspect = w / h;
      scale = Math.max(aspect * 0.75, 0.75);
      // Taille des étoiles proportionnelle à la hauteur d'écran
      px = dpr * Math.min(1.8, Math.max(0.9, h / 800));
      if (zone) {
        const rect = zone.getBoundingClientRect();
        zoneTop = rect.top + window.scrollY;
        zoneH = Math.max(1, rect.height);
      }
    };

    // Lecture de layout uniquement au redimensionnement ; ici, de l'arithmétique
    const progress = () =>
      galaxyOnly
        ? 1
        : Math.min(
            1,
            Math.max(0, (window.scrollY + window.innerHeight * TRIGGER - zoneTop) / zoneH),
          );

    const draw = (p: number, time: number) => {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(glow);
      bind([quad]);
      gl.uniform2f(gu.res, canvas.width, canvas.height);
      gl.uniform1f(gu.p, p);
      gl.uniform1f(gu.aspect, aspect);
      gl.uniform1f(gu.scale, scale);
      gl.uniform1f(gu.time, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      unbind([quad]);

      gl.useProgram(stars);
      bind(starAttrs);
      gl.uniform1f(su.p, p);
      gl.uniform1f(su.time, time);
      gl.uniform1f(su.aspect, aspect);
      gl.uniform1f(su.scale, scale);
      gl.uniform1f(su.px, px);
      gl.drawArrays(gl.POINTS, 0, count);
      unbind(starAttrs);
    };

    let raf = 0;
    let running = false;
    let last = 0;
    let time = 0;
    let shownStatic = false;
    const root = document.documentElement;

    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      if (dt < 100) time += dt / 1000;
      const p = progress();
      canvas.style.opacity = String(Math.min(1, p * 40));
      draw(p, time);
      raf = requestAnimationFrame(loop);
    };

    const sync = () => {
      const p = progress();
      const active = p > 0 && !document.hidden && !root.hasAttribute('data-intro');

      if (reduce) {
        // Galaxie fixe, sans explosion, dessinée une fois à l'arrivée
        canvas.style.opacity = active ? '1' : '0';
        if (active && !shownStatic) {
          draw(1, 0);
          shownStatic = true;
        }
        return;
      }

      if (active && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else if (!active && running) {
        running = false;
        cancelAnimationFrame(raf);
        canvas.style.opacity = '0';
      }
    };

    const onResize = () => {
      measure();
      shownStatic = false;
      sync();
    };

    measure();
    sync();
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', sync);
    const mo = new MutationObserver(sync);
    mo.observe(root, { attributes: true, attributeFilter: ['data-intro'] });
    // La hauteur de la page change (polices, images) : la zone se déplace
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', sync);
      mo.disconnect();
      ro.disconnect();
    };
  }, [mounted, mode]);

  return (
    <>
      {mode === 'bigbang' && <div ref={zoneRef} aria-hidden="true" className={className} />}
      {mounted &&
        createPortal(
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10 block h-full w-full opacity-0"
          />,
          document.body,
        )}
    </>
  );
}
