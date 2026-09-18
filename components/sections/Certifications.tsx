'use client';
import React from 'react';
import { Section, Reveal } from '@/components/ui';
import { EditableText } from '@/components/editable/EditableText';
import { EditableCollection } from '@/components/editable/EditableCollection';
import { EditableImage } from '@/components/editable/EditableImage';
import { EditableHref } from '@/components/editable/EditableLink';
import { F } from './factories';
import { useStore } from '@/lib/store';

export function Certifications() {
  const { editMode } = useStore();
  return (
    <Section id="certifications" base={['certifications']}>
      <EditableCollection path={['certifications', 'items']} factory={F.certification} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" emptyLabelPath={['labels', 'emptySection']}
        addLabel={{ en: 'Add certification or achievement', ar: 'إضافة شهادة أو إنجاز' }} itemName={{ en: 'certification', ar: 'الشهادة' }}
        render={({ item, path }) => (
          <Reveal className="card overflow-hidden h-full flex flex-col">
            <EditableImage path={[...path, 'image']} slot="certificate" aspect="aspect-[1.4/1]" />
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-lavender-200 px-2.5 py-0.5 text-[.65rem] uppercase tracking-[.14em] text-plum-mute"><EditableText path={[...path, 'kind']} /></span>
                <EditableText path={[...path, 'date']} className="text-xs text-plum-mute" />
              </div>
              <EditableText path={[...path, 'title']} as="h3" className="font-display text-2xl mt-3" />
              <EditableText path={[...path, 'issuer']} as="p" className="text-sm text-lilac-deep" />
              <EditableText path={[...path, 'description']} as="p" multiline className="mt-3 text-sm text-plum-soft leading-relaxed" />
              <div className="mt-auto pt-4">
                {(item.link || editMode) && <a href={item.link || undefined} target="_blank" rel="noreferrer" className="link-tech"><EditableText path={['labels', 'viewCertificate']} /></a>}
                <EditableHref path={[...path, 'link']} />
              </div>
            </div>
          </Reveal>
        )} />
    </Section>
  );
}
