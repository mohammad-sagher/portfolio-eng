'use client';
import React from 'react';
import { Section, Reveal } from '@/components/ui';
import { EditableText } from '@/components/editable/EditableText';
import { EditableCollection } from '@/components/editable/EditableCollection';
import { F } from './factories';
import { sceneBus } from '@/lib/sceneBus';

export function Specializations() {
  return (
    <Section id="specializations" base={['specializations']}>
      <Reveal>
        <EditableCollection path={['specializations', 'items']} factory={F.tag} inline className="flex flex-wrap gap-3" emptyLabelPath={['labels', 'emptySection']}
          addLabel={{ en: 'Add specialization', ar: 'إضافة تخصص' }} itemName={{ en: 'specialization', ar: 'التخصص' }}
          render={({ path }) => <span className="chip !text-base !px-5 !py-3 font-display" onMouseEnter={() => sceneBus.emit('pulse', { strength: 0.35 })}><EditableText path={[...path, 'label']} /></span>} />
      </Reveal>
    </Section>
  );
}
