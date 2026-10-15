'use client';

/**
 * HeroScene — sphère géodésique filaire qui tourne lentement, en fond du hero.
 * Maillage en dégradé bleu → violet (couleurs du logo), nœuds lumineux aux
 * sommets, cœur diffus, glow via bloom. Pas de halo/coquille autour de la
 * sphère (volontaire, cf. retour utilisateur) et pas de cyan (idem).
 *
 * Jamais dans le bundle initial : importé par HeroBackground3D via
 * next/dynamic (ssr: false). Ne pas l'importer directement.
 */

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useLayoutEffect, useMemo, useRef } from 'react';
import {
  BufferAttribute,
  Color,
  IcosahedronGeometry,
  InstancedMesh,
  Object3D,
  type Group,
} from 'three';

const BLUE = '#3457ff';
const VIOLET = '#7b62f8';

/** Géométrie du maillage avec une couleur par sommet, dégradé bleu → violet. */
function useGradientWireGeometry() {
  return useMemo(() => {
    const geo = new IcosahedronGeometry(1, 2);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const from = new Color(BLUE);
    const to = new Color(VIOLET);
    const c = new Color();
    for (let i = 0; i < pos.count; i++) {
      const t = (pos.getY(i) + 1) / 2;
      c.copy(from).lerp(to, t);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute('color', new BufferAttribute(colors, 3));
    return geo;
  }, []);
}

/** Sommets uniques du maillage, pour poser un petit nœud lumineux sur chacun. */
function useUniqueVertices(geometry: IcosahedronGeometry) {
  return useMemo(() => {
    const pos = geometry.attributes.position;
    const seen = new Map<string, [number, number, number]>();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const key = `${x.toFixed(3)}|${y.toFixed(3)}|${z.toFixed(3)}`;
      if (!seen.has(key)) seen.set(key, [x, y, z]);
    }
    return Array.from(seen.values());
  }, [geometry]);
}

function VertexNodes({ geometry }: { geometry: IcosahedronGeometry }) {
  const vertices = useUniqueVertices(geometry);
  const ref = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const dummy = new Object3D();
    const from = new Color(BLUE);
    const to = new Color(VIOLET);
    const c = new Color();
    vertices.forEach(([x, y, z], i) => {
      dummy.position.set(x, y, z);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
      c.copy(from).lerp(to, (y + 1) / 2);
      ref.current!.setColorAt(i, c);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [vertices]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, vertices.length]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial transparent opacity={0.9} />
    </instancedMesh>
  );
}

function GeoSphere() {
  const group = useRef<Group>(null);
  const wireGeometry = useGradientWireGeometry();

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.07;
    group.current.rotation.x += delta * 0.015;
  });

  return (
    <Float speed={0.9} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={group} scale={1.7}>
        {/* Maillage filaire, dégradé bleu → violet */}
        <mesh geometry={wireGeometry}>
          <meshBasicMaterial vertexColors wireframe transparent opacity={0.55} />
        </mesh>
        {/* Nœuds lumineux aux sommets */}
        <VertexNodes geometry={wireGeometry} />
        {/* Cœur diffus */}
        <mesh scale={0.99}>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial color={VIOLET} transparent opacity={0.08} />
        </mesh>
      </group>
    </Float>
  );
}

export default function HeroScene({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas
      frameloop={paused ? 'never' : 'always'}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 8.5], fov: 40 }}
      style={{ pointerEvents: 'none' }}
    >
      <GeoSphere />
      <Sparkles count={40} scale={[10, 9, 5]} size={2.3} speed={0.22} color={BLUE} opacity={0.5} />
      <EffectComposer>
        <Bloom
          mipmapBlur
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          intensity={0.65}
          radius={0.6}
        />
      </EffectComposer>
    </Canvas>
  );
}
