'use client';
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLang } from '@/lib/store';
import { EditableText } from './editable/EditableText';
import type { Path } from '@/lib/paths';

/** Section shell: consistent rhythm + editable eyebrow/heading. */
export function Section({ id, base, children, className = '' }: { id: string; base: Path; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative z-10 mx-auto w-full max-w-6xl px-6 py-24 md:py-32 ${className}`}>
      <Reveal>
        <EditableText path={[...base, 'eyebrow']} as="p" className="eyebrow" />
        <EditableText path={[...base, 'heading']} as="h2" className="h-display mt-3 text-4xl md:text-5xl max-w-3xl" />
        <div className="rule mt-8 max-w-xs" />
      </Reveal>
      <div className="mt-12">{children}</div>
    </section>
  );
}

/**
 * AnimatedReveal: entrance on scroll-into-view. Purpose: guides reading order and signals section change.
 * Re-keyed on language so the *visible* section replays its entrance on switch (§3.3). Disabled for reduced motion.
 */
export function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const rm = useReducedMotion();
  const { lang } = useLang();
  return (
    <motion.div key={lang} className={className}
      initial={rm ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1], delay }}>
      {children}
    </motion.div>
  );
}

export function Meta({ labelKey, children }: { labelKey: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <EditableText path={['labels', labelKey]} as="span" className="text-[.68rem] uppercase tracking-[.16em] text-plum-mute" />
      <div className="text-sm text-plum-soft">{children}</div>
    </div>
  );
}
