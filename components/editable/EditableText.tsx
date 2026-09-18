'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useLang, useStore, useValue } from '@/lib/store';
import type { Localized } from '@/lib/schema';
import type { Path } from '@/lib/paths';

type Props = {
  path: Path;                       // path to a { en, ar } object in content
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
};

/**
 * THE text primitive (§1). Public mode: renders plain text in the active language.
 * Edit mode: hover → soft branded outline; double-click → contentEditable in place, preserving font/size/color exactly.
 * A missing translation in the other language is flagged (bilingual propagation helper, §3.2).
 */
export function EditableText({ path, as = 'span', className = '', multiline = false, placeholder }: Props) {
  const value = useValue<Localized>(path) ?? { en: '', ar: '' };
  const { lang, t, missing } = useLang();
  const { editMode, set } = useStore();
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const Tag = as as any;
  const text = t(value);
  const other = lang === 'en' ? 'ar' : 'en';
  const otherMissing = editMode && !!value[lang] && !value[other];

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      const sel = window.getSelection(); const range = document.createRange();
      range.selectNodeContents(ref.current); range.collapse(false); sel?.removeAllRanges(); sel?.addRange(range);
    }
  }, [editing]);

  if (!editMode) {
    return <Tag className={className}>{text || (placeholder ?? '')}</Tag>;
  }

  const commit = () => {
    const next = (ref.current?.innerText ?? '').replace(/\n{3,}/g, '\n\n').trim();
    if (next !== (value[lang] ?? '')) set(path, { ...value, [lang]: next });
    setEditing(false);
  };

  return (
    <Tag
      ref={ref}
      className={`editable ${editing ? 'editable--active' : ''} ${className}`}
      contentEditable={editing}
      suppressContentEditableWarning
      data-empty={!text ? 'true' : undefined}
      data-placeholder={placeholder ?? (lang === 'ar' ? 'انقر مرتين للكتابة' : 'Double-click to write')}
      title={!editing ? (lang === 'ar' ? 'انقر مرتين للتحرير' : 'Double-click to edit') : undefined}
      onDoubleClick={(e: React.MouseEvent) => { e.stopPropagation(); setEditing(true); }}
      onBlur={editing ? commit : undefined}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (!editing) return;
        if (e.key === 'Escape') { if (ref.current) ref.current.innerText = value[lang] ?? ''; setEditing(false); }
        // Enter commits; Shift+Enter inserts a line break in multiline fields.
        if (e.key === 'Enter' && !(multiline && e.shiftKey)) { e.preventDefault(); commit(); }
      }}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {editing ? (value[lang] ?? '') : text}
      {!editing && otherMissing && (
        <i className="editable__flag" contentEditable={false} title={lang === 'en' ? 'Arabic translation missing' : 'الترجمة الإنجليزية ناقصة'}>
          {lang === 'en' ? 'AR?' : 'EN?'}
        </i>
      )}
      {!editing && missing(value) && (
        <i className="editable__flag editable__flag--warn" contentEditable={false} title={lang === 'en' ? 'Showing Arabic — English missing' : 'يُعرض الإنجليزي — العربي ناقص'}>
          {lang === 'en' ? 'EN?' : 'AR?'}
        </i>
      )}
    </Tag>
  );
}
