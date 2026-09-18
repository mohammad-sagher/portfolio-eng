'use client';
import { useEffect, useRef, useState } from 'react';
import { useLang } from './store';

/**
 * Single scroll-orchestration hook (§3.3). Publishes: active section, per-section progress (0–1),
 * global progress, scroll velocity, idle state. Everything (3D, nav, reveals) reads from this — no per-section listeners.
 */
export const SECTION_IDS = ['hero','about','specializations','experience','qa','skills','projects','education','certifications','contact'] as const;
export type SectionId = typeof SECTION_IDS[number];

export type SceneState = {
  index: number;          // active section index (float, e.g. 3.4 = 40% through section 3 → 4)
  active: SectionId;
  sectionProgress: number;
  velocity: number;       // px/ms, signed
  idle: boolean;
  pointer: { x: number; y: number }; // -1..1, already mirrored for RTL
  reducedMotion: boolean;
  touch: boolean;
};

const store: { state: SceneState; subs: Set<(s: SceneState) => void> } = {
  state: { index: 0, active: 'hero', sectionProgress: 0, velocity: 0, idle: false, pointer: { x: 0, y: 0 }, reducedMotion: false, touch: false },
  subs: new Set(),
};
export const readSceneState = () => store.state;
export const subscribeScene = (fn: (s: SceneState) => void) => { store.subs.add(fn); return () => { store.subs.delete(fn); }; };

export function ScrollOrchestrator() {
  const { dir } = useLang();
  const dirRef = useRef(dir); dirRef.current = dir;
  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    let lastY = window.scrollY, lastT = performance.now(), idleTimer: any = null, raf = 0;
    const emit = () => store.subs.forEach((f) => f(store.state));
    const compute = () => {
      const els = SECTION_IDS.map((id) => document.getElementById(id));
      const vh = window.innerHeight; const mid = vh * 0.5;
      let index = 0, prog = 0, active: SectionId = 'hero';
      els.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top <= mid) {
          const p = Math.min(1, Math.max(0, (mid - r.top) / Math.max(1, r.height)));
          prog = p; active = SECTION_IDS[i];
          // Scene index reaches the *pure* state of a section at its centre and starts blending
          // toward the next one only in its lower half — so each section's metaphor has a clear peak.
          index = i + Math.max(0, (p - 0.5) * 2);
        }
      });
      store.state = { ...store.state, index, sectionProgress: prog, active, reducedMotion: rm.matches, touch };
      document.documentElement.dataset.section = active; // lets CSS tint the page per section in step with the 3D state
    };
    const onScroll = () => {
      const now = performance.now(); const y = window.scrollY;
      const v = (y - lastY) / Math.max(1, now - lastT); lastY = y; lastT = now;
      store.state = { ...store.state, velocity: v, idle: false };
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { store.state = { ...store.state, idle: true, velocity: 0 }; emit(); }, 4000); // idle drift after 4s (§3.3)
      cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { compute(); emit(); });
    };
    const onPointer = (e: PointerEvent) => {
      if (touch) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1; const y = (e.clientY / window.innerHeight) * 2 - 1;
      store.state = { ...store.state, pointer: { x: dirRef.current === 'rtl' ? -x : x, y }, idle: false }; // mirrored for RTL (§3.3)
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { store.state = { ...store.state, idle: true }; emit(); }, 4000);
    };
    compute(); emit();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('pointermove', onPointer, { passive: true });
    idleTimer = setTimeout(() => { store.state = { ...store.state, idle: true }; emit(); }, 4000);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); window.removeEventListener('pointermove', onPointer); cancelAnimationFrame(raf); if (idleTimer) clearTimeout(idleTimer); };
  }, []);
  return null;
}

/** React-friendly subscription to the active section only (cheap re-renders for nav). */
export function useActiveSection() {
  const [active, setActive] = useState<SectionId>('hero');
  useEffect(() => subscribeScene((s) => setActive((a) => (a === s.active ? a : s.active))), []);
  return active;
}
