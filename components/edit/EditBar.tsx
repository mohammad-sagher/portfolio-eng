'use client';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLang, useStore, csrfHeader } from '@/lib/store';

/** Floating owner control bar (§2.2): Publish · Discard · Preview · History · Language · Logout, + autosave status. */
export function EditBar() {
  const { authenticated, previewing, setPreviewing, saveState, savedAt, publish, discard, logout, toasts, reload } = useStore();
  const { lang, setLang, t } = useLang();
  const [hist, setHist] = useState<{ id: number; created_at: number }[] | null>(null);
  useEffect(() => { if (!authenticated) setHist(null); }, [authenticated]);
  if (!authenticated) return <Toasts toasts={toasts} />;
  const ar = lang === 'ar';
  const status = { idle: ar ? 'جاهز' : 'Ready', dirty: ar ? 'تعديلات غير محفوظة' : 'Unsaved changes', saving: ar ? 'جارٍ الحفظ…' : 'Saving…', saved: `${ar ? 'تم الحفظ' : 'Saved'}${savedAt ? ' · ' + new Date(savedAt).toLocaleTimeString(ar ? 'ar' : 'en', { hour: '2-digit', minute: '2-digit' }) : ''}`, error: ar ? 'فشل الحفظ' : 'Save failed' }[saveState];
  const openHistory = async () => { const r = await fetch('/api/content/revisions'); const j = await r.json(); setHist(j.revisions); };
  const restore = async (id: number) => { await fetch('/api/content/revisions', { method: 'POST', headers: { 'content-type': 'application/json', ...csrfHeader() }, body: JSON.stringify({ id }) }); await reload('draft'); setHist(null); };
  return (
    <>
      <Toasts toasts={toasts} />
      <div className="edit-bar" role="toolbar" dir={ar ? 'rtl' : 'ltr'}>
        <span className="status">{previewing ? (ar ? 'معاينة كزائر' : 'Previewing as visitor') : status}</span>
        {!previewing && <button className="primary" onClick={publish}>{ar ? 'نشر' : 'Publish'}</button>}
        {!previewing && <button onClick={discard}>{ar ? 'تجاهل' : 'Discard'}</button>}
        <button onClick={() => setPreviewing(!previewing)}>{previewing ? (ar ? 'العودة للتحرير' : 'Back to editing') : (ar ? 'معاينة' : 'Preview')}</button>
        <button onClick={openHistory}>{ar ? 'السجل' : 'History'}</button>
        <button onClick={() => setLang(ar ? 'en' : 'ar')}>{ar ? 'EN' : 'ع'}</button>
        <button onClick={logout}>{ar ? 'خروج' : 'Log out'}</button>
      </div>
      <AnimatePresence>
        {hist && (
          <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-plum/20 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setHist(null)}>
            <motion.div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-ivory p-6 shadow-soft border border-lavender-200" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }}>
              <p className="font-display text-xl">{ar ? 'الإصدارات المنشورة السابقة' : 'Previously published versions'}</p>
              <p className="text-sm text-plum-mute mt-1">{ar ? 'الاستعادة تحمّل الإصدار إلى المسودة؛ انشري لاعتماده.' : 'Restoring loads the version into your draft; publish to make it live.'}</p>
              <ul className="mt-4 divide-y divide-lavender-200 max-h-72 overflow-auto">
                {hist.length === 0 && <li className="py-3 text-sm text-plum-mute">{ar ? 'لا يوجد إصدارات بعد' : 'No revisions yet'}</li>}
                {hist.map((h) => <li key={h.id} className="flex items-center justify-between py-2 text-sm"><span>{new Date(h.created_at).toLocaleString(ar ? 'ar' : 'en')}</span><button className="btn-ghost" onClick={() => restore(h.id)}>{ar ? 'استعادة' : 'Restore'}</button></li>)}
              </ul>
              <div className="mt-4 text-end"><button className="btn-ghost" onClick={() => setHist(null)}>{ar ? 'إغلاق' : 'Close'}</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Toasts({ toasts }: { toasts: { id: number; msg: { en: string; ar: string } }[] }) {
  const { t } = useLang();
  return <AnimatePresence>{toasts.slice(-1).map((x) => <motion.div key={x.id} className="toast" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{t(x.msg)}</motion.div>)}</AnimatePresence>;
}
