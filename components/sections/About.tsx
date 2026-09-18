'use client';
import React from 'react';
import { Section, Reveal } from '@/components/ui';
import { EditableText } from '@/components/editable/EditableText';
import { EditableCollection } from '@/components/editable/EditableCollection';
import { F } from './factories';

export function About() {
  return (
    <Section id="about" base={['about']}>
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <EditableCollection path={['about', 'paragraphs']} factory={F.bullet} className="flex flex-col gap-5"
            addLabel={{ en: 'Add paragraph', ar: 'إضافة فقرة' }} itemName={{ en: 'paragraph', ar: 'الفقرة' }}
            render={({ path }) => <EditableText path={[...path, 'text']} as="p" multiline className="text-lg leading-relaxed text-plum-soft" />} />
        </Reveal>
        <Reveal delay={0.1}>
          <EditableCollection path={['about', 'facts']} factory={F.fact} className="card p-6 flex flex-col divide-y divide-lavender-200"
            addLabel={{ en: 'Add fact', ar: 'إضافة معلومة' }} itemName={{ en: 'fact', ar: 'المعلومة' }}
            render={({ path }) => (
              <div className="flex items-baseline justify-between gap-4 py-3">
                <EditableText path={[...path, 'label']} className="text-[.7rem] uppercase tracking-[.16em] text-plum-mute" />
                <EditableText path={[...path, 'value']} className="font-display text-lg text-end" />
              </div>
            )} />
        </Reveal>
      </div>
    </Section>
  );
}
