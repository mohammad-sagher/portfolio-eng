'use client';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLang, useStore } from '@/lib/store';

/** Discreet owner login: footer glyph or ⌘/Ctrl+K (§2.2). Bilingual errors, no information leakage (§8). */
export function LoginDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang } = useLang();
  const { setAuthenticated, reload, toast } = useStore();
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const ar = lang === 'ar';
  useEffect(() => { if (!open) { setErr(''); setPw(''); } }, [open]);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr('');
    const r = await fetch('/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password: pw }) });
    setBusy(false);
    if (r.ok) { setAuthenticated(true); await reload('draft'); toast({ en: 'Edit Mode on — double-click any text to edit', ar: 'وضع التحرير مفعّل — انقري مرتين على أي نص لتحريره' }); onClose(); }
    else if (r.status === 429) setErr(ar ? 'محاولات كثيرة. حاولي بعد 15 دقيقة.' : 'Too many attempts. Try again in 15 minutes.');
    else setErr(ar ? 'بيانات الدخول غير صحيحة.' : 'Those details didn\u2019t match.');
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-plum/20 backdrop-blur-[2px] p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-ivory p-7 shadow-soft border border-lavender-200" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }}>
            <p className="eyebrow">{ar ? 'المالكة' : 'Owner'}</p>
            <p className="font-display text-2xl mt-1">{ar ? 'تسجيل الدخول' : 'Sign in'}</p>
            <label className="block mt-5 text-xs text-plum-mute">{ar ? 'البريد الإلكتروني' : 'Email'}
              <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-lavender-200 bg-white/70 px-3 py-2 text-sm text-plum focus:outline-none focus:border-lilac" dir="ltr" /></label>
            <label className="block mt-3 text-xs text-plum-mute">{ar ? 'كلمة المرور' : 'Password'}
              <input type="password" required autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} className="mt-1 w-full rounded-xl border border-lavender-200 bg-white/70 px-3 py-2 text-sm text-plum focus:outline-none focus:border-lilac" dir="ltr" /></label>
            {err && <p className="mt-3 text-xs text-[#8C2B45]">{err}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="btn-ghost" onClick={onClose}>{ar ? 'إلغاء' : 'Cancel'}</button>
              <button type="submit" disabled={busy} className="btn btn-primary !py-2 !px-4 text-sm">{busy ? '…' : (ar ? 'دخول' : 'Sign in')}</button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
