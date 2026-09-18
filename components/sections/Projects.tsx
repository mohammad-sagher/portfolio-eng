'use client';
import React from 'react';
import { Section, Meta } from '@/components/ui';
import { EditableText } from '@/components/editable/EditableText';
import { EditableCollection } from '@/components/editable/EditableCollection';
import { EditableImage } from '@/components/editable/EditableImage';
import { EditableHref } from '@/components/editable/EditableLink';
import { F } from './factories';
import { sceneBus } from '@/lib/sceneBus';
import { useStore } from '@/lib/store';

/** Editorial horizontal scroller with hover-reveal detail (§5.7) — not plain rectangular cards. */
export function Projects() {
  const { editMode } = useStore();
  return (
    <Section id="projects" base={['projects']}>
      <EditableCollection path={['projects', 'items']} factory={F.project} className="scroller -mx-6 px-6" emptyLabelPath={['labels', 'emptySection']}
        addLabel={{ en: 'Add project', ar: 'إضافة مشروع' }} itemName={{ en: 'project', ar: 'المشروع' }}
        render={({ item, path, index }) => (
          <article className={`group card overflow-hidden h-full flex flex-col ${index % 2 ? 'md:mt-10' : ''}`} onMouseEnter={() => sceneBus.emit('pulse', { strength: 0.6 })}>
            <div className="relative">
              <EditableImage path={[...path, 'image']} slot="project" />
              <span className="absolute top-3 rounded-full bg-ivory/90 px-3 py-1 text-[.68rem] uppercase tracking-[.14em] text-plum-soft" style={{ insetInlineStart: '.75rem' }}><EditableText path={[...path, 'category']} /></span>
            </div>
            <div className="p-7 flex-1 flex flex-col">
              <EditableText path={[...path, 'name']} as="h3" className="font-display text-3xl" />
              <EditableText path={[...path, 'short']} as="p" multiline className="mt-2 text-plum-soft leading-relaxed" />
              {/* Hover-reveal detail panel: purpose — keep the scroller scannable while offering depth on intent */}
              <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${editMode ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]'}`}>
                <div className="overflow-hidden">
                  <EditableText path={[...path, 'detailed']} as="p" multiline className="mt-4 text-sm text-plum-soft leading-relaxed" />
                  <div className="mt-4"><Meta labelKey="features">
                    <EditableCollection path={[...path, 'features']} factory={F.bullet} className="mt-1 flex flex-col gap-1.5" emptyLabelPath={['labels', 'emptyList']}
                      addLabel={{ en: 'Add feature', ar: 'إضافة ميزة' }} itemName={{ en: 'feature', ar: 'الميزة' }}
                      render={({ path: p }) => <div className="flex gap-2 text-sm"><span className="text-champagne-deep">—</span><EditableText path={[...p, 'text']} multiline /></div>} />
                  </Meta></div>
                  <div className="mt-4"><Meta labelKey="role"><EditableText path={[...path, 'role']} /></Meta></div>
                </div>
              </div>
              <div className="mt-5"><Meta labelKey="techStack">
                <EditableCollection path={[...path, 'technologies']} factory={F.tag} inline className="mt-1 flex flex-wrap gap-2" emptyLabelPath={['labels', 'emptyList']}
                  addLabel={{ en: 'Add', ar: 'إضافة' }} itemName={{ en: 'technology', ar: 'التقنية' }}
                  render={({ path: p }) => <span className="chip !text-xs"><EditableText path={[...p, 'label']} /></span>} />
              </Meta></div>
              <div className="mt-auto pt-6 flex flex-col gap-1">
                <div className="flex flex-wrap gap-5">
                  {(item.github || editMode) && <a href={item.github || undefined} target="_blank" rel="noreferrer" className="link-tech"><EditableText path={['labels', 'viewCode']} /></a>}
                  {(item.demo || editMode) && <a href={item.demo || undefined} target="_blank" rel="noreferrer" className="link-tech"><EditableText path={['labels', 'liveDemo']} /></a>}
                </div>
                <EditableHref path={[...path, 'github']} /><EditableHref path={[...path, 'demo']} />
              </div>
            </div>
          </article>
        )} />
    </Section>
  );
}
