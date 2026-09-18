'use client';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLang } from '@/lib/store';

/** Branded, elegant destructive-action confirmation (§1, §7). Never window.confirm. */
type Req = { title: { en: string; ar: string }; resolve: (ok: boolean) => void };
const Ctx = createContext<(title: Req['title']) => Promise<boolean>>(null!);
export const useConfirm = () => useContext(Ctx);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [req, setReq] = useState<Req | null>(null);
  const { t, lang } = useLang();
  const ask = useCallback((title: Req['title']) => new Promise<boolean>((resolve) => setReq({ title, resolve })), []);
  const done = (ok: boolean) => { req?.resolve(ok); setReq(null); };
  return (
    <Ctx.Provider value={ask}>
      {children}
      <AnimatePresence>
        {req && (
          <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-plum/20 backdrop-blur-[2px] p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => done(false)}>
            <motion.div onClick={(e) => e.stopPropagation()} role="alertdialog"
              className="w-full max-w-sm rounded-2xl bg-ivory p-6 shadow-soft border border-lavender-200"
              initial={{ y: 12, scale: 0.98, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 8, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>
              <p className="font-display text-xl text-plum">{t(req.title)}</p>
              <p className="mt-1 text-sm text-plum-mute">{lang === 'ar' ? 'لا يمكن التراجع عن هذا الإجراء بعد النشر.' : 'This cannot be undone once published.'}</p>
              <div className="mt-5 flex justify-end gap-2">
                <button className="btn-ghost" onClick={() => done(false)}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                <button className="btn-danger" onClick={() => done(true)}>{lang === 'ar' ? 'حذف' : 'Delete'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
