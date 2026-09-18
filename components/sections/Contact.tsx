'use client';
import React from 'react';
import { Section, Reveal } from '@/components/ui';
import { EditableText } from '@/components/editable/EditableText';
import { EditableCollection } from '@/components/editable/EditableCollection';
import { EditableHref } from '@/components/editable/EditableLink';
import { F } from './factories';

export function Contact() {
  return (
    <Section id="contact" base={['contact']}>
      <Reveal><EditableText path={['contact', 'intro']} as="p" multiline className="max-w-xl text-lg text-plum-soft leading-relaxed" /></Reveal>
      <EditableCollection path={['contact', 'items']} factory={F.contact} className="mt-10 grid gap-4 sm:grid-cols-2" emptyLabelPath={['labels', 'emptySection']}
        addLabel={{ en: 'Add contact link', ar: 'إضافة وسيلة تواصل' }} itemName={{ en: 'contact link', ar: 'وسيلة التواصل' }}
        render={({ item, path }) => (
          <Reveal className="card p-5">
            <a href={item.href || undefined} target={item.href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="block group">
              <EditableText path={[...path, 'label']} as="p" className="text-[.68rem] uppercase tracking-[.16em] text-plum-mute" />
              <EditableText path={[...path, 'value']} as="p" className="mt-1 font-display text-xl group-hover:text-lilac-deep transition-colors" />
            </a>
            <EditableHref path={[...path, 'href']} allowAnchors />
          </Reveal>
        )} />
    </Section>
  );
}
