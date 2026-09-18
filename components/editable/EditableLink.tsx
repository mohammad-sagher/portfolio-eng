'use client';
import React, { useState } from 'react';
import { useLang, useStore, useValue } from '@/lib/store';
import type { Path } from '@/lib/paths';

/**
 * Inline href editor with automatic URL validation + correction hint (§3.2). Renders as a tiny field under the element in Edit Mode.
 */
export function EditableHref({ path, allowAnchors = false }: { path: Path; allowAnchors?: boolean }) {
  const value = useValue<string>(path) ?? '';
  const { editMode, set } = useStore();
  const { lang } = useLang();
  const [v, setV] = useState<string | null>(null);
  if (!editMode) return null;
  const cur = v ?? value;
  const ok = cur === '' || /^https:\/\/\S+$/i.test(cur) || (allowAnchors && /^(#\S*|mailto:\S+|tel:\S+)$/.test(cur));
  const hint = !ok ? (/^http:\/\//i.test(cur) ? (lang === 'ar' ? 'استخدمي https://' : 'Use https://') : (lang === 'ar' ? 'رابط غير صالح' : 'Invalid URL')) : '';
  return (
    <label className="href-field" onDoubleClick={(e) => e.stopPropagation()}>
      <span>↗</span>
      <input value={cur} placeholder="https://" dir="ltr" onChange={(e) => setV(e.target.value)}
        onBlur={() => { if (v !== null) { let n = v.trim(); if (/^http:\/\//i.test(n)) n = n.replace(/^http:/i, 'https:'); set(path, n); setV(null); } }}
        className={ok ? '' : 'href-field--bad'} />
      {hint && <em>{hint}</em>}
    </label>
  );
}
