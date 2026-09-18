'use client';
import React from 'react';
import { Section, Reveal, Meta } from '@/components/ui';
import { EditableText } from '@/components/editable/EditableText';
import { EditableCollection } from '@/components/editable/EditableCollection';
import { F } from './factories';

export function Education() {
  return (
    <Section id="education" base={['education']}>
      <EditableCollection path={['education', 'items']} factory={F.education} className="grid gap-6 md:grid-cols-2" emptyLabelPath={['labels', 'emptySection']}
        addLabel={{ en: 'Add education', ar: 'إضافة مؤهل' }} itemName={{ en: 'education entry', ar: 'المؤهل' }}
        render={({ path }) => (
          <Reveal className="card p-7 h-full">
            <EditableText path={[...path, 'dates']} className="text-sm text-plum-mute" />
            <EditableText path={[...path, 'degree']} as="h3" className="font-display text-3xl mt-2" />
            <EditableText path={[...path, 'field']} as="p" className="text-lilac-deep" />
            <EditableText path={[...path, 'institution']} as="p" className="mt-1 text-plum-soft" />
            <EditableText path={[...path, 'description']} as="p" multiline className="mt-4 text-plum-soft leading-relaxed" />
            <div className="mt-5"><Meta labelKey="achievements">
              <EditableCollection path={[...path, 'achievements']} factory={F.bullet} className="mt-1 flex flex-col gap-1.5" emptyLabelPath={['labels', 'emptyList']}
                addLabel={{ en: 'Add achievement', ar: 'إضافة إنجاز' }} itemName={{ en: 'achievement', ar: 'الإنجاز' }}
                render={({ path: p }) => <div className="flex gap-2"><span className="text-champagne-deep">—</span><EditableText path={[...p, 'text']} multiline /></div>} />
            </Meta></div>
          </Reveal>
        )} />
    </Section>
  );
}
