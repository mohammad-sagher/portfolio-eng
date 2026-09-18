'use client';
import React from 'react';
import { Section, Reveal, Meta } from '@/components/ui';
import { EditableText } from '@/components/editable/EditableText';
import { EditableCollection } from '@/components/editable/EditableCollection';
import { F } from './factories';

/** Nested editability demo: entry → responsibilities bullet list → each bullet (§1). */
export function Experience() {
  return (
    <Section id="experience" base={['experience']}>
      <EditableCollection path={['experience', 'items']} factory={F.experience} className="flex flex-col gap-10 border-s border-lavender-200 ps-8 ms-1" emptyLabelPath={['labels', 'emptySection']}
        addLabel={{ en: 'Add position', ar: 'إضافة منصب' }} itemName={{ en: 'position', ar: 'المنصب' }}
        render={({ path }) => (
          <Reveal className="relative">
            <span className="timeline-dot" style={{ insetInlineStart: '-2.35rem' }} />
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <EditableText path={[...path, 'title']} as="h3" className="font-display text-3xl" />
              <EditableText path={[...path, 'dates']} className="text-sm text-plum-mute" />
            </div>
            <EditableText path={[...path, 'company']} as="p" className="mt-1 text-lilac-deep" />
            <EditableText path={[...path, 'summary']} as="p" multiline className="mt-4 max-w-2xl text-plum-soft leading-relaxed" />
            <div className="mt-6 grid gap-8 md:grid-cols-[1.4fr_1fr]">
              <Meta labelKey="responsibilities">
                <EditableCollection path={[...path, 'responsibilities']} factory={F.bullet} className="mt-2 flex flex-col gap-2" emptyLabelPath={['labels', 'emptyList']}
                  addLabel={{ en: 'Add responsibility', ar: 'إضافة مسؤولية' }} itemName={{ en: 'responsibility', ar: 'المسؤولية' }}
                  render={({ path: p }) => <div className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-champagne-deep" /><EditableText path={[...p, 'text']} as="p" multiline className="leading-relaxed" /></div>} />
              </Meta>
              <Meta labelKey="techStack">
                <EditableCollection path={[...path, 'technologies']} factory={F.tag} inline className="mt-2 flex flex-wrap gap-2" emptyLabelPath={['labels', 'emptyList']}
                  addLabel={{ en: 'Add', ar: 'إضافة' }} itemName={{ en: 'technology', ar: 'التقنية' }}
                  render={({ path: p }) => <span className="chip !text-xs"><EditableText path={[...p, 'label']} /></span>} />
              </Meta>
            </div>
          </Reveal>
        )} />
    </Section>
  );
}
