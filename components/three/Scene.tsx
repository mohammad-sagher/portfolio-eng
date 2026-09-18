'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { SCENE_TARGETS, lerp, type SceneTarget } from './sceneStates';
import { readSceneState } from '@/lib/useScroll';
import { sceneBus } from '@/lib/sceneBus';
import { useLang } from '@/lib/store';

/* ───────── Device tier detection (§4.4) ───────── */
type Tier = 'high' | 'balanced' | 'lite';
function detectTier(): Tier {
  if (typeof window === 'undefined') return 'balanced';
  if (new URLSearchParams(window.location.search).get('tier') === 'lite') return 'lite';
  const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mem = (navigator as any).deviceMemory ?? 4; const cores = navigator.hardwareConcurrency ?? 4;
  const small = window.innerWidth < 640;
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) return 'lite';
  if (small && (mem <= 2 || cores <= 4)) return 'lite';
  if (rm || small || mem <= 4) return 'balanced';
  return 'high';
}

/* ───────── Simplex-ish noise in vertex shader for organic morph ───────── */
const vert = /* glsl */`
uniform float uTime; uniform float uNoise; uniform float uFacet; uniform float uPulse;
varying vec3 vN; varying vec3 vP; varying float vD;
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;} vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);} vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);
vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}
void main(){
  vec3 p = position;
  float n = snoise(p*1.6 + uTime*0.25);
  float d = n * uNoise + uPulse * 0.08 * sin(uTime*8.0 + p.y*6.0);
  p += normal * d;
  vD = d;
  vec4 mv = modelViewMatrix * vec4(p,1.0);
  vN = normalize(normalMatrix * normal); vP = mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;
const frag = /* glsl */`
uniform vec3 uColor; uniform vec3 uAccent; uniform float uFacet; uniform float uMetal;
varying vec3 vN; varying vec3 vP; varying float vD;
void main(){
  vec3 n = normalize(vN);
  vec3 fn = normalize(cross(dFdx(vP), dFdy(vP)));  // flat normal for faceted look
  n = normalize(mix(n, fn, uFacet));
  vec3 V = normalize(-vP);
  vec3 L1 = normalize(vec3(0.6, 0.8, 0.9)); vec3 L2 = normalize(vec3(-0.7, -0.2, 0.5));
  float diff = max(dot(n,L1),0.0)*0.75 + max(dot(n,L2),0.0)*0.35;
  float fres = pow(1.0 - max(dot(n,V),0.0), 2.4);
  vec3 H = normalize(L1+V); float spec = pow(max(dot(n,H),0.0), mix(24.0, 90.0, uMetal)) * mix(0.25, 0.9, uMetal);
  vec3 base = mix(uColor, vec3(1.0), 0.15);
  vec3 col = base * (0.55 + 0.45*diff) + uAccent * fres * 0.9 + spec * mix(vec3(1.0), uAccent, 0.4);
  col += vD * 0.35 * uAccent;
  gl_FragColor = vec4(col, 1.0);
}`;

function Identity({ tier }: { tier: Tier }) {
  const { dir } = useLang();
  const dirSign = dir === 'rtl' ? -1 : 1; // mirrored motion for RTL (§3.3/§9)
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const layers = useRef<THREE.Group>(null);
  const lattice = useRef<THREE.Group>(null);
  const latticeMat = useRef<THREE.MeshBasicMaterial>(null);
  const tick = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);
  const nodes = useRef<THREE.InstancedMesh>(null);
  const edges = useRef<THREE.LineSegments>(null);
  const blocks = useRef<THREE.InstancedMesh>(null);
  const sats = useRef<THREE.InstancedMesh>(null);
  const frags = useRef<THREE.InstancedMesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const pulse = useRef(0);
  const cur = useRef<SceneTarget>({ ...SCENE_TARGETS[0] });
  const colA = useMemo(() => new THREE.Color(), []); const colB = useMemo(() => new THREE.Color(), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const detail = tier === 'high' ? 48 : 24;

  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uNoise: { value: 0.15 }, uFacet: { value: 0 }, uPulse: { value: 0 }, uMetal: { value: 0.25 },
    uColor: { value: new THREE.Color(SCENE_TARGETS[0].color) }, uAccent: { value: new THREE.Color(SCENE_TARGETS[0].accent) },
  }), []);
  useEffect(() => sceneBus.on('pulse', (e) => { pulse.current = Math.min(1, pulse.current + (e.strength ?? 0.6)); }), []);

  /* Precomputed layouts (instancing for repeated geometry, §4.4) */
  const nodePos = useMemo(() => Array.from({ length: 16 }, (_, i) => { const phi = Math.acos(1 - 2 * (i + 0.5) / 16); const th = Math.PI * (1 + Math.sqrt(5)) * i; return new THREE.Vector3(Math.cos(th) * Math.sin(phi), Math.cos(phi), Math.sin(th) * Math.sin(phi)).multiplyScalar(1.35); }), []);
  const edgePairs = useMemo(() => { const pairs: [number, number][] = []; nodePos.forEach((a, i) => nodePos.forEach((b, j) => { if (j > i && a.distanceTo(b) < 1.25) pairs.push([i, j]); })); return pairs; }, [nodePos]);
  const edgeGeo = useMemo(() => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(edgePairs.length * 6), 3)); return g; }, [edgePairs]);
  // Blocks: assembled 3×3×2 grid vs. scattered start positions — assembly driven by section progress
  const blockHome = useMemo(() => Array.from({ length: 18 }, (_, i) => new THREE.Vector3(((i % 3) - 1) * 0.62, ((Math.floor(i / 3) % 3) - 1) * 0.62, (Math.floor(i / 9) - 0.5) * 0.62)), []);
  const blockAway = useMemo(() => blockHome.map((p, i) => p.clone().normalize().multiplyScalar(2.2 + (i % 4) * 0.3).add(new THREE.Vector3(0, ((i % 5) - 2) * 0.3, 0))), [blockHome]);
  const fragDir = useMemo(() => Array.from({ length: 12 }, (_, i) => { const phi = Math.acos(1 - 2 * (i + 0.5) / 12); const th = Math.PI * (1 + Math.sqrt(5)) * i; return new THREE.Vector3(Math.cos(th) * Math.sin(phi), Math.cos(phi), Math.sin(th) * Math.sin(phi)); }), []);
  const satOrbit = useMemo(() => Array.from({ length: 9 }, (_, i) => ({ r: 1.5 + (i % 3) * 0.25, tilt: (i % 3) * 0.6, phase: i * 0.7 })), []);
  const vA = useMemo(() => new THREE.Vector3(), []); const vB = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    const s = readSceneState();
    const i = Math.min(SCENE_TARGETS.length - 1, Math.max(0, s.index));
    const a = SCENE_TARGETS[Math.floor(i)], b = SCENE_TARGETS[Math.min(SCENE_TARGETS.length - 1, Math.floor(i) + 1)];
    const f = i - Math.floor(i);
    const speed = Math.min(1, Math.abs(s.velocity) * 0.6);
    const k = 1 - Math.exp(-dt * (3.2 + speed * 6)); // faster scroll → quicker settle (§4.3)
    const c = cur.current;
    (Object.keys(c) as (keyof SceneTarget)[]).forEach((key) => {
      if (typeof c[key] !== 'number') return;
      (c as any)[key] = lerp(c[key] as number, lerp(a[key] as number, b[key] as number, f), k);
    });
    colA.set(a.color).lerp(colB.set(b.color), f); uniforms.uColor.value.lerp(colA, k);
    colA.set(a.accent).lerp(colB.set(b.accent), f); uniforms.uAccent.value.lerp(colA, k);
    if (light.current) { colA.set(a.lightColor).lerp(colB.set(b.lightColor), f); light.current.color.lerp(colA, k); light.current.intensity = lerp(light.current.intensity, lerp(a.lightIntensity, b.lightIntensity, f) * 6, k); }

    const t = state.clock.elapsedTime;
    const motion = s.reducedMotion ? 0 : 1;
    uniforms.uTime.value = t * motion;
    uniforms.uNoise.value = c.noise * (s.reducedMotion ? 0.5 : 1);
    uniforms.uFacet.value = c.facet; uniforms.uMetal.value = c.metal;
    pulse.current = Math.max(0, pulse.current - dt * 1.6); uniforms.uPulse.value = pulse.current;
    const wide = state.size.width > 900;

    // Light position + camera distance per section (lighting/framing are part of the metaphor, not decoration)
    if (light.current) { const lp = a.lightPos.map((v, n) => lerp(v, b.lightPos[n], f)) as [number, number, number]; light.current.position.x = THREE.MathUtils.damp(light.current.position.x, lp[0] * dirSign, 3, dt); light.current.position.y = THREE.MathUtils.damp(light.current.position.y, lp[1], 3, dt); light.current.position.z = THREE.MathUtils.damp(light.current.position.z, lp[2], 3, dt); }
    const zoomT = lerp(a.zoom, b.zoom, f); state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, 4.6 * zoomT, 2.5, dt);
    // Motion signature: the section closest to the current index decides *how* the identity moves
    const mode = (f < 0.5 ? a : b).rotMode;
    if (group.current) {
      const idleDrift = s.idle && motion ? 1.6 : 1;
      if (mode === 'spin') group.current.rotation.y += dt * c.rotSpeed * dirSign * idleDrift * motion;
      else if (mode === 'sway') group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, Math.sin(t * 0.5) * 0.35 * dirSign * motion, 2, dt);
      else if (mode === 'step') { const target = Math.round(t / 2.2) * (Math.PI / 2) * dirSign; group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, target * motion, 6, dt); } // QA: deliberate 90° snaps
      else group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, 0.35 * dirSign, 2, dt); // still: Experience presents its stack face-on
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, c.tilt + s.pointer.y * 0.18 * motion + Math.sin(t * 0.3) * 0.05 * c.wobble * motion, 3, dt);
      group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, -s.pointer.x * 0.12 * motion, 3, dt);
      group.current.scale.setScalar(wide ? 0.9 : 0.75);
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, c.y, 2, dt);
      const anchor = wide ? 1.35 * dirSign : 0;
      group.current.position.x = THREE.MathUtils.damp(group.current.position.x, anchor + s.pointer.x * 0.15 * motion, 3, dt);
    }
    // Core: breathing in About, flattening into a disc in Experience
    if (core.current) {
      const breathe = 1 + Math.sin(t * 1.1) * 0.035 * c.wobble * motion;
      core.current.scale.set(c.coreScale * breathe, c.coreScale * c.squash * breathe, c.coreScale * breathe);
    }
    // Experience: layers settle from spread → stacked as the section is entered
    if (layers.current) {
      layers.current.visible = c.layers > 0.02;
      layers.current.children.forEach((m, j) => {
        const off = j - 1.5;
        m.position.y = off * 0.42 * c.layers;
        m.scale.setScalar((1.45 - Math.abs(off) * 0.15) * c.layers);
        m.rotation.y = off * 0.25 * (1 - c.layers) * 3; // un-twist as they settle
      });
    }
    // QA: lattice scales in with deliberate, snapped feel; tick draws in
    if (lattice.current) { lattice.current.visible = c.lattice > 0.02; const q = Math.round(c.lattice * 6) / 6; lattice.current.scale.setScalar(0.3 + q * 0.7); if (latticeMat.current) latticeMat.current.opacity = c.lattice * 0.35; }
    if (tick.current) { tick.current.visible = c.lattice > 0.3; tick.current.scale.setScalar(Math.max(0.001, (c.lattice - 0.3) / 0.7)); }
    // Education: rings rise and widen
    if (rings.current) { rings.current.visible = c.rings > 0.02; rings.current.children.forEach((m, j) => { m.position.y = (j - 1) * 0.5 * c.rings + Math.sin(t * 0.8 + j) * 0.04 * motion; m.scale.setScalar((1.1 + j * 0.3) * c.rings); }); }

    const place = (m: THREE.InstancedMesh | null, j: number, p: THREE.Vector3, size: number, rot = 0) => {
      if (!m) return; dummy.position.copy(p); dummy.rotation.set(rot, rot * 0.7, 0); dummy.scale.setScalar(Math.max(0.0001, size)); dummy.updateMatrix(); m.setMatrixAt(j, dummy.matrix);
    };
    // Skills: network nodes pulse on chip hover; edges follow nodes
    if (nodes.current) {
      nodes.current.visible = c.nodes > 0.02;
      const pos = edgeGeo.attributes.position as THREE.BufferAttribute;
      nodePos.forEach((p, j) => { const wob = 1 + Math.sin(t * 1.5 + j) * 0.04 * motion; vA.copy(p).multiplyScalar(c.nodes * wob); place(nodes.current, j, vA, 0.075 * c.nodes + pulse.current * 0.04); });
      edgePairs.forEach(([x, y], e) => { vA.copy(nodePos[x]).multiplyScalar(c.nodes); vB.copy(nodePos[y]).multiplyScalar(c.nodes); pos.setXYZ(e * 2, vA.x, vA.y, vA.z); pos.setXYZ(e * 2 + 1, vB.x, vB.y, vB.z); });
      pos.needsUpdate = true; nodes.current.instanceMatrix.needsUpdate = true;
      if (edges.current) { edges.current.visible = c.nodes > 0.02; (edges.current.material as THREE.LineBasicMaterial).opacity = c.nodes * 0.8; }
    }
    // Projects: blocks fly in from scattered → assembled as you scroll through the section
    if (blocks.current) {
      blocks.current.visible = c.blocks > 0.02;
      const inProjects = s.active === 'projects' ? s.sectionProgress : (i > 6 ? 1 : 0);
      const assembly = THREE.MathUtils.smoothstep(inProjects, 0.05, 0.6);
      blockHome.forEach((h, j) => { vA.copy(blockAway[j]).lerp(h, assembly); place(blocks.current, j, vA, 0.5 * c.blocks, (1 - assembly) * 1.2 + j * 0.05); });
      blocks.current.instanceMatrix.needsUpdate = true;
    }
    // Specializations: fragments burst outward from the core and slowly orbit
    if (frags.current) {
      frags.current.visible = c.fragments > 0.02;
      fragDir.forEach((d, j) => { const ang = t * 0.25 * dirSign * motion; vA.set(d.x * Math.cos(ang) - d.z * Math.sin(ang), d.y, d.x * Math.sin(ang) + d.z * Math.cos(ang)).multiplyScalar(0.55 + c.fragments * (0.75 + (j % 3) * 0.18)); place(frags.current, j, vA, 0.2 * c.fragments, t * 0.4 + j); });
      frags.current.instanceMatrix.needsUpdate = true;
    }
    // Certifications: satellites on tilted orbits; orbit speed follows scroll velocity
    if (sats.current) {
      sats.current.visible = c.satellites > 0.02;
      const w = (0.4 + Math.abs(s.velocity) * 1.2) * dirSign * motion;
      satOrbit.forEach((o, j) => { const ang = t * w + o.phase; vA.set(Math.cos(ang) * o.r, Math.sin(ang) * o.r * Math.sin(o.tilt), Math.sin(ang) * o.r * Math.cos(o.tilt)).multiplyScalar(c.satellites); place(sats.current, j, vA, 0.06 * c.satellites); });
      sats.current.instanceMatrix.needsUpdate = true;
    }
  });

  const gold = <meshStandardMaterial color="#E9D4B4" metalness={0.7} roughness={0.3} emissive="#CDAA74" emissiveIntensity={0.25} />;
  return (
    <group ref={group}>
      <pointLight ref={light} position={[2, 2.5, 2.5]} intensity={6} distance={12} decay={2} />
      <mesh ref={core}>
        <icosahedronGeometry args={[1, detail]} />
        <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniforms} />
      </mesh>
      {/* Experience: stacked layers */}
      <group ref={layers}>{[0, 1, 2, 3].map((j) => <mesh key={j}><cylinderGeometry args={[1, 1, 0.07, 64]} /><meshStandardMaterial color={j % 2 ? '#9A78C2' : '#DCD1EA'} metalness={0.35} roughness={0.4} emissive="#3B2547" emissiveIntensity={0.15} /></mesh>)}</group>
      {/* QA: lattice + verification tick */}
      <group ref={lattice}><mesh><boxGeometry args={[2.2, 2.2, 2.2, 4, 4, 4]} /><meshBasicMaterial ref={latticeMat} color="#8FB8D8" wireframe transparent opacity={0.5} /></mesh></group>
      <group ref={tick} position={[0, 0, 1.12]}>
        <mesh position={[-0.28, -0.12, 0]} rotation={[0, 0, -0.8]}><boxGeometry args={[0.55, 0.12, 0.12]} />{gold}</mesh>
        <mesh position={[0.22, 0.05, 0]} rotation={[0, 0, 0.8]}><boxGeometry args={[0.95, 0.12, 0.12]} />{gold}</mesh>
      </group>
      {/* Education: ascending rings */}
      <group ref={rings}>{[0, 1, 2].map((j) => <mesh key={j} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1, 0.03, 8, 96]} /><meshStandardMaterial color="#9A78C2" metalness={0.5} roughness={0.35} emissive="#9A78C2" emissiveIntensity={0.2} /></mesh>)}</group>
      {/* Skills: node network */}
      <instancedMesh ref={nodes} args={[undefined, undefined, 16]}><sphereGeometry args={[1, 14, 14]} /><meshStandardMaterial color="#F6F0FF" metalness={0.6} roughness={0.25} emissive="#B99CD6" emissiveIntensity={0.35} /></instancedMesh>
      <lineSegments ref={edges} geometry={edgeGeo}><lineBasicMaterial color="#9A78C2" transparent opacity={0.8} /></lineSegments>
      {/* Projects: modular blocks */}
      <instancedMesh ref={blocks} args={[undefined, undefined, 18]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#C9B3E3" metalness={0.3} roughness={0.5} emissive="#B99CD6" emissiveIntensity={0.15} /></instancedMesh>
      {/* Certifications: satellites · Specializations: fragments */}
      <instancedMesh ref={sats} args={[undefined, undefined, 9]}><sphereGeometry args={[1, 10, 10]} />{gold}</instancedMesh>
      <instancedMesh ref={frags} args={[undefined, undefined, 12]}><octahedronGeometry args={[1, 0]} />{gold}</instancedMesh>
    </group>
  );
}

/** Pause the RAF loop when tab hidden / canvas off-screen (§4.4). */
function FrameGovernor() {
  const { invalidate, setFrameloop } = useThree() as any;
  useEffect(() => {
    const onVis = () => setFrameloop(document.hidden ? 'never' : 'always');
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [setFrameloop, invalidate]);
  return null;
}

/** Lite tier / WebGL-loss fallback: CSS/SVG echo of the same state machine (§4.4). */
export function LiteIdentity() {
  const [i, setI] = useState(0);
  const { dir } = useLang();
  useEffect(() => { const id = setInterval(() => setI(Math.round(readSceneState().index)), 300); return () => clearInterval(id); }, []);
  const t = SCENE_TARGETS[Math.min(SCENE_TARGETS.length - 1, i)];
  const mirror = dir === 'rtl' ? -1 : 1;
  const coreStyle: React.CSSProperties = {
    background: `radial-gradient(circle at 35% 30%, #fff 0%, ${t.color} 45%, ${t.accent} 100%)`,
    borderRadius: t.facet > 0.5 ? '22%' : '50% 45% 55% 50% / 55% 50% 50% 45%',
    transform: `scale(${t.coreScale}) scaleY(${t.squash})`, opacity: t.coreScale < 0.5 ? 0.55 : 1,
    boxShadow: `inset -20px -30px 60px rgba(59,37,71,.08), 0 30px 80px -40px ${t.accent}`,
  };
  return (
    <div className="lite-identity" data-state={i} aria-hidden>
      <div className="lite-stage" style={{ transform: `rotateX(${t.tilt * 40}deg)` }}>
        <div className="lite-blob" style={coreStyle} />
        {/* Experience: stacked layers */}
        {t.layers > 0.5 && [0, 1, 2, 3].map((j) => <div key={j} className="lite-layer" style={{ transform: `translateY(${(j - 1.5) * 34}px) rotateX(70deg)`, background: j % 2 ? '#9A78C2' : '#DCD1EA' }} />)}
        {/* QA: lattice + tick */}
        {t.lattice > 0.5 && <><div className="lite-grid" /><div className="lite-tick">✓</div></>}
        {/* Skills: network */}
        {t.nodes > 0.5 && <svg className="lite-svg" viewBox="-100 -100 200 200">{Array.from({ length: 10 }, (_, j) => { const a = j * 0.628; const r = 78; return <g key={j}><line x1={Math.cos(a) * r} y1={Math.sin(a) * r} x2={Math.cos(a + 1.26) * r} y2={Math.sin(a + 1.26) * r} stroke="#9A78C2" strokeWidth="1.5" opacity=".85" /><line x1={Math.cos(a) * r} y1={Math.sin(a) * r} x2="0" y2="0" stroke="#B99CD6" strokeWidth="1" opacity=".5" /><circle cx={Math.cos(a) * r} cy={Math.sin(a) * r} r="7" fill="#F6F0FF" stroke="#9A78C2" strokeWidth="1.5" /></g>; })}</svg>}
        {/* Projects: modular blocks */}
        {t.blocks > 0.5 && <div className="lite-blocks">{Array.from({ length: 9 }, (_, j) => <span key={j} style={{ animationDelay: `${j * 0.08}s` }} />)}</div>}
        {/* Specializations: fragments */}
        {t.fragments > 0.5 && Array.from({ length: 8 }, (_, j) => <span key={j} className="lite-frag" style={{ transform: `rotate(${j * 45 * mirror}deg) translateX(120px) rotate(45deg)` }} />)}
        {/* Education: rings */}
        {t.rings > 0.5 && [0, 1, 2].map((j) => <div key={j} className="lite-ring" style={{ transform: `translateY(${(1 - j) * 44}px) rotateX(72deg) scale(${1 + j * 0.25})` }} />)}
        {/* Certifications: satellites */}
        {t.satellites > 0.5 && <div className="lite-orbit" style={{ animationDirection: dir === 'rtl' ? 'reverse' : 'normal' }}>{[0, 1, 2, 3].map((j) => <span key={j} style={{ transform: `rotate(${j * 90}deg) translateX(130px)` }} />)}</div>}
      </div>
    </div>
  );
}

export function Scene() {
  const [tier, setTier] = useState<Tier | null>(null);
  const [lost, setLost] = useState(false);
  useEffect(() => { setTier(detectTier()); }, []);
  if (!tier) return null;
  if (tier === 'lite' || lost) return <LiteIdentity />;
  return (
    <Canvas
      dpr={tier === 'high' ? [1, 2] : [1, 1.25]}
      camera={{ position: [0, 0, 4.6], fov: 38 }}
      gl={{ antialias: tier === 'high', alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => { gl.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); setLost(true); }); }}
      style={{ pointerEvents: 'none' }}
    >
      <FrameGovernor />
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#FFF8EE" />
      <directionalLight position={[-4, -2, 2]} intensity={1.2} color="#DCD1EA" />
      <Float speed={1} rotationIntensity={0} floatIntensity={0.4}>
        <Identity tier={tier} />
      </Float>
      {tier === 'high' && <Environment preset="apartment" background={false} />}
    </Canvas>
  );
}
