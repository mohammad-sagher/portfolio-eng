'use client';
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EditableText } from '@/components/editable/EditableText';
import { EditableCollection } from '@/components/editable/EditableCollection';
import { EditableHref } from '@/components/editable/EditableLink';
import { F } from './factories';
import { useLang } from '@/lib/store';

export function Hero() {
  const rm = useReducedMotion();
  const { lang } = useLang();
  return (
    <section id="hero" className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center px-6 pt-28 pb-16">
      <motion.div key={lang} initial={rm ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }} className="max-w-2xl">
        <EditableText path={['hero', 'eyebrow']} as="p" className="eyebrow" />
        <EditableText path={['hero', 'name']} as="h1" className="h-display mt-5 text-6xl md:text-8xl" />
        <EditableText path={['hero', 'title']} as="p" className="mt-4 font-display text-2xl md:text-3xl text-plum-soft italic" />
        <EditableText path={['hero', 'statement']} as="p" multiline className="mt-8 max-w-xl text-base md:text-lg leading-relaxed text-plum-soft" />
        <EditableCollection path={['hero', 'ctas']} factory={F.link} inline className="mt-10 flex flex-wrap items-center gap-3"
          addLabel={{ en: 'Add button', ar: 'إضافة زر' }} itemName={{ en: 'button', ar: 'الزر' }}
          render={({ item, path, index }) => (
            <div>
              <a href={item.href} className={`btn ${index === 0 ? 'btn-primary' : 'btn-outline'}`}><EditableText path={[...path, 'label']} /></a>
              <EditableHref path={[...path, 'href']} allowAnchors />
            </div>
          )} />
      </motion.div>
      <div className="absolute bottom-8 inline-start-6 flex items-center gap-3 text-xs text-plum-mute" style={{ insetInlineStart: '1.5rem' }}>
        <span className="block h-10 w-px bg-gradient-to-b from-lilac to-transparent" />
        <EditableText path={['labels', 'scroll']} />
      </div>
    </section>
  );
}
