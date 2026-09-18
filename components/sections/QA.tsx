'use client';
import React from 'react';
import { Section, Reveal, Meta } from '@/components/ui';
import { EditableText } from '@/components/editable/EditableText';
import { EditableCollection } from '@/components/editable/EditableCollection';
import { EditableImage } from '@/components/editable/EditableImage';
import { F } from './factories';

export function QA() {
  return (
    <Section id="qa" base={['qa']}>
      <Reveal className="max-w-2xl">
        <EditableText path={['qa', 'organization']} as="p" className="font-display text-2xl text-lilac-deep" />
        <EditableText path={['qa', 'intro']} as="p" multiline className="mt-3 text-plum-soft leading-relaxed" />
      </Reveal>
      <EditableCollection path={['qa', 'items']} factory={F.qa} className="mt-12 grid gap-8" emptyLabelPath={['labels', 'emptySection']}
        addLabel={{ en: 'Add testing project', ar: 'إضافة مشروع اختبار' }} itemName={{ en: 'testing project', ar: 'مشروع الاختبار' }}
        render={({ path }) => (
          <Reveal className="card overflow-hidden grid md:grid-cols-[1fr_1.3fr]">
            <EditableImage path={[...path, 'image']} slot="qa" aspect="aspect-[16/10] md:aspect-auto md:h-full" />
            <div className="p-7 md:p-9">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <EditableText path={[...path, 'name']} as="h3" className="font-display text-3xl" />
                <EditableText path={[...path, 'dates']} className="text-sm text-plum-mute" />
              </div>
              <EditableText path={[...path, 'description']} as="p" multiline className="mt-4 text-plum-soft leading-relaxed" />
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <Meta labelKey="role"><EditableText path={[...path, 'role']} /></Meta>
                <Meta labelKey="tools">
                  <EditableCollection path={[...path, 'tools']} factory={F.tag} inline className="mt-1 flex flex-wrap gap-2" emptyLabelPath={['labels', 'emptyList']}
                    addLabel={{ en: 'Add', ar: 'إضافة' }} itemName={{ en: 'tool', ar: 'الأداة' }}
                    render={({ path: p }) => <span className="chip !text-xs"><EditableText path={[...p, 'label']} /></span>} />
                </Meta>
              </div>
              <div className="mt-6"><Meta labelKey="achievements">
                <EditableCollection path={[...path, 'achievements']} factory={F.bullet} className="mt-1 flex flex-col gap-2" emptyLabelPath={['labels', 'emptyList']}
                  addLabel={{ en: 'Add achievement', ar: 'إضافة إنجاز' }} itemName={{ en: 'achievement', ar: 'الإنجاز' }}
                  render={({ path: p }) => <div className="flex gap-3"><span className="mt-2 text-champagne-deep text-xs">✓</span><EditableText path={[...p, 'text']} as="p" multiline /></div>} />
              </Meta></div>
            </div>
          </Reveal>
        )} />
    </Section>
  );
}
