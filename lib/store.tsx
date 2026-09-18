'use client';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Content, Lang, Localized } from './schema';
import { newId } from './schema';
import { getAt, setAt, updateAt, type Path } from './paths';

/* ───────────── Language / direction (§9) ───────────── */
type LangCtx = { lang: Lang; dir: 'ltr' | 'rtl'; setLang: (l: Lang) => void; t: (v: Localized) => string; missing: (v: Localized) => boolean };
const LangContext = createContext<LangCtx>(null!);
export const useLang = () => useContext(LangContext);

/* ───────────── Edit mode + content store (§2.2, §3.1) ───────────── */
type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';
type Ctx = {
  content: Content;
  editMode: boolean;           // authenticated AND not previewing as visitor
  authenticated: boolean;
  previewing: boolean;
  saveState: SaveState;
  savedAt: number | null;
  setPreviewing: (v: boolean) => void;
  setAuthenticated: (v: boolean) => void;
  set: (path: Path, value: unknown) => void;
  update: (path: Path, fn: (prev: any) => any) => void;
  addItem: (path: Path, factory: () => unknown, index?: number) => void;
  removeItem: (path: Path, index: number) => void;
  moveItem: (path: Path, from: number, to: number) => void;
  duplicateItem: (path: Path, index: number) => void;
  publish: () => Promise<void>;
  discard: () => Promise<void>;
  logout: () => Promise<void>;
  reload: (kind: 'live' | 'draft') => Promise<void>;
  toast: (msg: Localized) => void;
  toasts: { id: number; msg: Localized }[];
};
const StoreContext = createContext<Ctx>(null!);
export const useStore = () => useContext(StoreContext);

export function csrfHeader(): Record<string, string> {
  const m = document.cookie.match(/(?:^|; )bs_csrf=([^;]+)/);
  return m ? { 'x-csrf-token': decodeURIComponent(m[1]) } : {};
}

/** Deep-clone with fresh ids (used by Duplicate). */
function reId(v: any): any {
  if (Array.isArray(v)) return v.map(reId);
  if (v && typeof v === 'object') {
    const o: any = {};
    for (const [k, val] of Object.entries(v)) o[k] = k === 'id' ? newId('d') : reId(val);
    return o;
  }
  return v;
}

export function Providers({ initialContent, initialAuth, children }: { initialContent: Content; initialAuth: boolean; children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  const [content, setContent] = useState<Content>(initialContent);
  const [authenticated, setAuthenticated] = useState(initialAuth);
  const [previewing, setPreviewing] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [toasts, setToasts] = useState<{ id: number; msg: Localized }[]>([]);
  const dirtyRef = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(content);
  latest.current = content;

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? (localStorage.getItem('bs_lang') as Lang | null) : null;
    if (saved === 'ar' || saved === 'en') setLangState(saved);
  }, []);
  const setLang = useCallback((l: Lang) => { setLangState(l); localStorage.setItem('bs_lang', l); }, []);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  useEffect(() => { document.documentElement.lang = lang; document.documentElement.dir = dir; }, [lang, dir]);

  const toast = useCallback((msg: Localized) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  /* Debounced autosave pipeline: any mutation marks dirty → 1.5s idle → PUT draft (§3.1). */
  const scheduleSave = useCallback(() => {
    dirtyRef.current = true;
    setSaveState('dirty');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setSaveState('saving');
      try {
        const res = await fetch('/api/content/draft', { method: 'PUT', headers: { 'content-type': 'application/json', ...csrfHeader() }, body: JSON.stringify({ content: latest.current }) });
        if (!res.ok) throw new Error(String(res.status));
        const j = await res.json();
        dirtyRef.current = false; setSavedAt(j.savedAt); setSaveState('saved');
      } catch { setSaveState('error'); }
    }, 1500);
  }, []);

  const mutate = useCallback((fn: (c: Content) => Content) => { setContent((c) => fn(c)); scheduleSave(); }, [scheduleSave]);

  const api = useMemo<Ctx>(() => ({
    content, authenticated, previewing, saveState, savedAt, toasts, toast,
    editMode: authenticated && !previewing,
    setPreviewing, setAuthenticated,
    set: (path, value) => mutate((c) => setAt(c, path, value)),
    update: (path, fn) => mutate((c) => updateAt(c, path, fn)),
    addItem: (path, factory, index) => mutate((c) => updateAt(c, path, (arr: unknown[] = []) => {
      const next = [...arr]; next.splice(index ?? next.length, 0, factory()); return next;
    })),
    removeItem: (path, index) => mutate((c) => updateAt(c, path, (arr: unknown[]) => arr.filter((_, i) => i !== index))),
    moveItem: (path, from, to) => mutate((c) => updateAt(c, path, (arr: unknown[]) => {
      const next = [...arr]; const [m] = next.splice(from, 1); next.splice(to, 0, m); return next; // atomic batch reorder (§3.2)
    })),
    duplicateItem: (path, index) => mutate((c) => updateAt(c, path, (arr: unknown[]) => {
      const next = [...arr]; next.splice(index + 1, 0, reId(arr[index])); return next;
    })),
    publish: async () => {
      if (timer.current) clearTimeout(timer.current);
      await fetch('/api/content/draft', { method: 'PUT', headers: { 'content-type': 'application/json', ...csrfHeader() }, body: JSON.stringify({ content: latest.current }) });
      const r = await fetch('/api/content/publish', { method: 'POST', headers: csrfHeader() });
      if (r.ok) { setSaveState('saved'); toast({ en: 'Published — visitors now see this version', ar: 'تم النشر — يرى الزوار هذه النسخة الآن' }); }
      else toast({ en: 'Publish failed', ar: 'فشل النشر' });
    },
    discard: async () => {
      if (timer.current) clearTimeout(timer.current);
      await fetch('/api/content/draft', { method: 'DELETE', headers: csrfHeader() });
      const r = await fetch('/api/content?draft=1'); const j = await r.json(); setContent(j.content); setSaveState('idle');
      toast({ en: 'Draft discarded', ar: 'تم تجاهل المسودة' });
    },
    logout: async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      setAuthenticated(false); setPreviewing(false);
      const r = await fetch('/api/content'); const j = await r.json(); setContent(j.content);
    },
    reload: async (kind) => {
      const r = await fetch(kind === 'draft' ? '/api/content?draft=1' : '/api/content'); const j = await r.json(); setContent(j.content);
    },
  }), [content, authenticated, previewing, saveState, savedAt, toasts, toast, mutate]);

  const langApi = useMemo<LangCtx>(() => ({
    lang, dir, setLang,
    t: (v) => (v?.[lang] ?? '') || (v?.[lang === 'en' ? 'ar' : 'en'] ?? ''),
    missing: (v) => !!v && !v[lang] && !!v[lang === 'en' ? 'ar' : 'en'],
  }), [lang, dir, setLang]);

  return (
    <LangContext.Provider value={langApi}>
      <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
    </LangContext.Provider>
  );
}

/** Convenience: read a value at a path from the store. */
export function useValue<T = unknown>(path: Path): T { return getAt(useStore().content, path) as T; }
