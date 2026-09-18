'use client';
import React from 'react';
import { Section, Reveal } from '@/components/ui';
import { EditableText } from '@/components/editable/EditableText';
import { EditableCollection } from '@/components/editable/EditableCollection';
import { F } from './factories';
import { sceneBus } from '@/lib/sceneBus';

export function Skills() {
  return (
    <Section id="skills" base={['skills']}>
      <EditableCollection path={['skills', 'categories']} factory={F.skillCategory} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" emptyLabelPath={['labels', 'emptySection']}
        addLabel={{ en: 'Add category', ar: 'إضافة فئة' }} itemName={{ en: 'category', ar: 'الفئة' }}
        render={({ path }) => (
          <Reveal className="card p-6 h-full">
            <EditableText path={[...path, 'name']} as="h3" className="font-display text-2xl" />
            <EditableCollection path={[...path, 'skills']} factory={F.tag} inline className="mt-4 flex flex-wrap gap-2" emptyLabelPath={['labels', 'emptyList']}
              addLabel={{ en: 'Add skill', ar: 'إضافة مهارة' }} itemName={{ en: 'skill', ar: 'المهارة' }}
              render={({ path: p }) => <span className="chip" onMouseEnter={() => sceneBus.emit('pulse', { strength: 0.5 })}><EditableText path={[...p, 'label']} /></span>} />
          </Reveal>
        )} />
    </Section>
  );
}
