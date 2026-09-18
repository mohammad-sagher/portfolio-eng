'use client';
import React, { useRef, useState } from 'react';
import { useLang, useStore, useValue, csrfHeader } from '@/lib/store';
import type { Path } from '@/lib/paths';
import { EditableText } from './EditableText';

type Img = { src: string; alt: { en: string; ar: string }; blur?: string };

/**
 * THE image primitive (§1). Public: progressive image with blur placeholder. Edit: click/drag-drop to replace
 * (uploaded via server pipeline: re-encode, ratio guard per slot, blur generation). Alt text itself is editable.
 */
export function EditableImage({ path, slot = 'generic', className = '', aspect = 'aspect-[16/10]' }: { path: Path; slot?: 'project' | 'qa' | 'certificate' | 'generic'; className?: string; aspect?: string }) {
  const img = useValue<Img>(path) ?? { src: '', alt: { en: '', ar: '' } };
  const { editMode, set, toast } = useStore();
  const { t, lang } = useLang();
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setBusy(true);
    const fd = new FormData(); fd.append('file', file); fd.append('slot', slot);
    try {
      const r = await fetch('/api/upload', { method: 'POST', headers: csrfHeader(), body: fd });
      if (!r.ok) throw new Error();
      const j = await r.json();
      set(path, { ...img, src: j.src, blur: j.blur });
      toast({ en: 'Image replaced', ar: 'تم استبدال الصورة' });
    } catch { toast({ en: 'Upload failed — use JPG/PNG/WebP under 8 MB', ar: 'فشل الرفع — استخدم JPG/PNG/WebP أقل من 8 ميغابايت' }); }
    finally { setBusy(false); }
  };

  const picture = img.src ? (
    <img src={img.src} alt={t(img.alt)} loading="lazy" decoding="async" className="h-full w-full object-cover"
      style={img.blur ? { backgroundImage: `url(${img.blur})`, backgroundSize: 'cover' } : undefined} />
  ) : (
    <div className="h-full w-full grid place-items-center bg-gradient-to-br from-lavender-100 via-ivory-warm to-champagne/40">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden><circle cx="24" cy="24" r="18" stroke="#B99CD6" strokeWidth="1.2" /><path d="M14 30l7-8 5 6 4-4 6 6" stroke="#9A78C2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="30" cy="18" r="2" fill="#E3C9A3" /></svg>
    </div>
  );

  if (!editMode) return <div className={`overflow-hidden ${aspect} ${className}`}>{picture}</div>;

  return (
    <div className={`relative overflow-hidden ${aspect} ${className} editable-image ${drag ? 'editable-image--drag' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) upload(f); }}>
      {picture}
      <button type="button" onClick={() => input.current?.click()} className="absolute inset-0 grid place-items-center bg-plum/0 hover:bg-plum/25 transition-colors group" aria-label="Replace image">
        <span className="rounded-full bg-ivory/95 px-4 py-2 text-xs font-medium text-plum shadow-soft opacity-0 group-hover:opacity-100 transition-opacity">
          {busy ? (lang === 'ar' ? 'جارٍ الرفع…' : 'Uploading…') : (lang === 'ar' ? 'استبدال الصورة' : 'Replace image')}
        </span>
      </button>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/avif" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.currentTarget.value = ''; }} />
      <div className="absolute bottom-2 inline-start-2 max-w-[80%] rounded-md bg-ivory/90 px-2 py-0.5 text-[10px] text-plum-mute" style={{ insetInlineStart: '0.5rem' }}>
        alt: <EditableText path={[...path, 'alt']} />
      </div>
    </div>
  );
}
