'use client';

import { useEffect, useRef, useState } from 'react';
import type { MotionValue } from 'framer-motion';

/**
 * Trou noir rendu en WebGL (shader GLSL maison, aucune dépendance 3D).
 * - lancer de rayons courbés par la gravité (Schwarzschild simplifié) :
 *   l'arrière du disque d'accrétion apparaît au-dessus et au-dessous de
 *   l'ombre, et les étoiles du fond sont déformées autour.
 * - disque aux couleurs de la charte : cœur blanc-bleu, bleu, violet brand ;
 *   effet Doppler : le côté qui vient vers nous est plus lumineux et plus bleu.
 * - `pull` (0 → 1, piloté par le scroll) rapproche la caméra et accélère
 *   la rotation : le trou noir « aspire » la page.
 *
 * Performance : résolution réduite et adaptative (baisse si les images
 * dépassent ~22 ms), rendu suspendu hors écran, onglet masqué et pendant
 * l'intro. Animations réduites : une seule image fixe.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uPull;

#define STEPS 110
const float RIN = 2.6;
const float ROUT = 10.0;

// Charte : navy #050B2B, brand #5B3DF6, accent #22D3EE
const vec3 C_HOT = vec3(0.86, 0.93, 1.0);
const vec3 C_BLUE = vec3(0.16, 0.56, 0.97);
const vec3 C_VIOLET = vec3(0.357, 0.239, 0.965);
const vec3 C_DEEP = vec3(0.09, 0.08, 0.42);

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + 17.1;
    a *= 0.5;
  }
  return v;
}

// Texture du disque à rotation différentielle (képlérienne). Deux phases
// décalées se relaient pour que le motif ne s'enroule pas à l'infini.
float diskPattern(float r, float ang, float t) {
  float omega = 2.4 / pow(r, 1.5);
  float T = t * 0.05;
  float ph1 = fract(T);
  float ph2 = fract(T + 0.5);
  float w1 = 1.0 - abs(2.0 * ph1 - 1.0);
  float a1 = ang - omega * ph1 * 20.0;
  float a2 = ang - omega * ph2 * 20.0;
  float n1 = fbm(vec2(cos(a1), sin(a1)) * r * 1.1 + vec2(r * 1.7, 3.0));
  float n2 = fbm(vec2(cos(a2), sin(a2)) * r * 1.1 + vec2(r * 1.7, 41.0));
  return mix(n2, n1, w1);
}

vec3 stars(vec3 d) {
  vec3 c = vec3(0.0);
  float n = fbm(d.xy * 2.2 + d.z * 1.3);
  c += mix(C_DEEP, C_VIOLET, n) * 0.05 * n * n;
  vec3 g = d * 90.0;
  vec3 id = floor(g);
  vec3 f = fract(g) - 0.5;
  float h = fract(sin(dot(id, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  if (h > 0.93) {
    vec3 off = vec3(fract(h * 13.0), fract(h * 71.0), fract(h * 37.0)) - 0.5;
    float s = length(f - off * 0.5);
    vec3 tint = mix(vec3(0.75, 0.85, 1.0), C_VIOLET + 0.35, fract(h * 7.0));
    c += tint * smoothstep(0.25, 0.0, s) * (h - 0.93) * 16.0;
  }
  return c;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;

  // Fondu circulaire : pas de bord de canvas visible
  float mask = 1.0 - smoothstep(0.3, 0.5, length(uv));
  if (mask <= 0.0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  float roll = -0.22;
  uv = mat2(cos(roll), -sin(roll), sin(roll), cos(roll)) * uv;

  float dist = mix(17.0, 8.0, uPull);
  float elev = 0.17;
  vec3 ro = vec3(0.0, sin(elev), -cos(elev)) * dist;
  vec3 fw = normalize(-ro);
  vec3 rt = normalize(cross(vec3(0.0, 1.0, 0.0), fw));
  vec3 up = cross(fw, rt);
  vec3 v = normalize(fw + (uv.x * rt + uv.y * up) * 1.25);
  vec3 p = ro;

  vec3 hv = cross(p, v);
  float h2 = dot(hv, hv);
  float t = uTime * (1.0 + 1.6 * uPull);

  vec3 col = vec3(0.0);
  float alpha = 0.0;
  float glow = 0.0;
  bool captured = false;

  for (int i = 0; i < STEPS; i++) {
    float r2 = dot(p, p);
    float r = sqrt(r2);
    if (r < 1.0) { captured = true; break; }
    if (r > 32.0 && dot(p, v) > 0.0) break;
    if (alpha > 0.99) break;

    float dt = clamp(0.1 * r, 0.03, 1.5);
    v += -1.5 * h2 * p / (r2 * r2 * r) * dt;
    vec3 np = p + v * dt;

    // Traversée du plan du disque (y = 0)
    if (p.y * np.y < 0.0) {
      vec3 ip = mix(p, np, p.y / (p.y - np.y));
      float dr = length(ip.xz);
      if (dr > RIN && dr < ROUT) {
        float ang = atan(ip.z, ip.x);
        float n = diskPattern(dr, ang, t);
        float k = (dr - RIN) / (ROUT - RIN);
        float dens = smoothstep(RIN, RIN + 0.5, dr) * (1.0 - smoothstep(ROUT - 4.0, ROUT, dr));
        float inten = dens * (0.25 + 1.1 * n * n) * pow(RIN / dr, 1.3);

        vec3 c = mix(C_HOT, C_BLUE, smoothstep(0.0, 0.22, k));
        c = mix(c, C_VIOLET, smoothstep(0.18, 0.55, k));
        c = mix(c, C_DEEP, smoothstep(0.55, 1.0, k));

        // Doppler : côté approchant plus lumineux et plus bleu
        vec3 vel = normalize(vec3(-ip.z, 0.0, ip.x));
        float dop = dot(vel, -normalize(v)) * sqrt(RIN / dr);
        c = mix(c, C_BLUE + 0.25, clamp(dop, 0.0, 1.0) * 0.35);
        c = mix(c, C_VIOLET, clamp(-dop, 0.0, 1.0) * 0.45);
        inten *= pow(1.0 + 0.55 * dop, 3.0);

        float a = clamp(inten * 0.9, 0.0, 1.0);
        col += (1.0 - alpha) * c * inten * 1.6;
        alpha += (1.0 - alpha) * a;
      }
    }

    // Halo de la sphère de photons
    glow += dt * exp(-pow((r - 1.6) * 2.4, 2.0));
    p = np;
  }

  vec3 halo = mix(C_BLUE, C_VIOLET, 0.55) * glow * 0.09;
  col += (1.0 - alpha) * halo;

  if (captured) {
    alpha = 1.0;
  } else {
    vec3 bg = stars(normalize(v));
    col += (1.0 - alpha) * bg;
    alpha += (1.0 - alpha) * clamp(max(bg.r, max(bg.g, bg.b)), 0.0, 1.0);
  }
  alpha = max(alpha, clamp(max(halo.r, max(halo.g, halo.b)), 0.0, 1.0));

  col = 1.0 - exp(-col * 1.5);
  gl_FragColor = vec4(col * mask, alpha * mask);
}
`;

const DPR_CAP = 1.5;
const Q_START = 0.8;
const Q_MIN = 0.4;
const SLOW_FRAME_MS = 22;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error('[BlackHole]', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

interface BlackHoleProps {
  /** Progression d'aspiration 0 → 1 (scroll). */
  pull?: MotionValue<number>;
  className?: string;
}

export default function BlackHole({ pull, className = '' }: BlackHoleProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    if (!gl) {
      setFailed(true);
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) {
      setFailed(true);
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('[BlackHole]', gl.getProgramInfoLog(prog));
      setFailed(true);
      return;
    }
    gl.useProgram(prog);

    // Triangle plein écran
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uPull = gl.getUniformLocation(prog, 'uPull');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(DPR_CAP, window.devicePixelRatio || 1);
    let quality = Q_START;
    let raf = 0;
    let visible = true;

    const resize = () => {
      const s = dpr * quality;
      const w = Math.max(1, Math.round(canvas.clientWidth * s));
      const h = Math.max(1, Math.round(canvas.clientHeight * s));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };

    const draw = (time: number, pullValue: number) => {
      gl.uniform1f(uTime, time);
      gl.uniform1f(uPull, pullValue);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    resize();

    if (reduce) {
      // Une seule image fixe, redessinée seulement au redimensionnement
      draw(12, 0);
      const ro = new ResizeObserver(() => {
        resize();
        draw(12, 0);
      });
      ro.observe(canvas);
      return () => ro.disconnect();
    }

    // Qualité adaptative
    let frames = 0;
    let acc = 0;
    let last = 0;
    let time = 0;
    let running = false;

    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      if (dt < 100) time += dt / 1000; // pas de saut après une pause

      draw(time, pull ? pull.get() : 0);

      if (dt < 100) {
        acc += dt;
        frames++;
        if (frames === 40) {
          if (acc / frames > SLOW_FRAME_MS && quality > Q_MIN) {
            quality = Math.max(Q_MIN, quality - 0.15);
            resize();
          }
          frames = 0;
          acc = 0;
        }
      }
      raf = requestAnimationFrame(loop);
    };

    // La boucle ne tourne que si le canvas est visible, l'onglet actif
    // et l'intro terminée (attribut data-intro sur <html>).
    const root = document.documentElement;
    const sync = () => {
      const run = visible && !document.hidden && !root.hasAttribute('data-intro');
      if (run && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else if (!run && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(canvas);
    const mo = new MutationObserver(sync);
    mo.observe(root, { attributes: true, attributeFilter: ['data-intro'] });
    document.addEventListener('visibilitychange', sync);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onLost = (e: Event) => {
      e.preventDefault();
      running = false;
      cancelAnimationFrame(raf);
      setFailed(true);
    };
    canvas.addEventListener('webglcontextlost', onLost);

    sync();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', sync);
      canvas.removeEventListener('webglcontextlost', onLost);
    };
  }, [pull]);

  if (failed) {
    // Repli sans WebGL : anneau lumineux statique en CSS
    return (
      <div aria-hidden="true" className={`pointer-events-none h-full w-full ${className}`}>
        <div className="blackhole-fallback" />
      </div>
    );
  }

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none block h-full w-full ${className}`}
    />
  );
}
