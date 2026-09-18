'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useLang, useStore } from '@/lib/store';
import { ScrollOrchestrator, useActiveSection } from '@/lib/useScroll';
import { EditableText } from './editable/EditableText';
import { EditableCollection } from './editable/EditableCollection';
import { EditableHref } from './editable/EditableLink';
import { EditBar } from './edit/EditBar';
import { LoginDialog } from './edit/Login';
import { F } from './sections/factories';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Specializations } from './sections/Specializations';
import { Experience } from './sections/Experience';
import { QA } from './sections/QA';
import { Skills } from './sections/Skills';
import { Projects } from './sections/Projects';
import { Education } from './sections/Education';
import { Certifications } from './sections/Certifications';
import { Contact } from './sections/Contact';

const Scene = dynamic(() => import('./three/Scene').then((m) => m.Scene), { ssr: false });

export function Portfolio() {
  const { lang, setLang, t } = useLang();
  const { authenticated, content } = useStore();
  const active = useActiveSection();
  const [login, setLogin] = useState(false);

  // Keyboard-triggered owner entry: ⌘/Ctrl + K (§2.2)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && !authenticated) { e.preventDefault(); setLogin(true); } };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [authenticated]);

  return (
    <div id="top" className="relative">
      <ScrollOrchestrator />
      <div className="scene-fixed" aria-hidden><Scene /></div>

      {/* Ambient backdrop glow — purpose: separates the identity object from the page without heavy glass */}
      <div className="ambient pointer-events-none fixed inset-0 z-0" />
      {/* Owner-only: shows which 3D state is active — useful when tuning content vs. visual metaphor */}
      {authenticated && <div className="state-badge">{lang === 'ar' ? 'حالة المجسّم' : '3D state'} · {active}</div>}

      <header className="fixed top-0 inset-x-0 z-50">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="#top" className="font-display text-xl tracking-tight"><EditableText path={['hero', 'name']} /></a>
          <div className="hidden md:flex items-center gap-1 rounded-full border border-lavender-200 bg-ivory/80 px-2 py-1 backdrop-blur">
            <EditableCollection path={['meta', 'nav']} factory={F.link} inline className="flex items-center gap-1"
              addLabel={{ en: 'Add', ar: 'إضافة' }} itemName={{ en: 'nav link', ar: 'رابط التنقل' }}
              render={({ item, path }) => (
                <span className="group/nav relative">
                  <a href={item.href} className={`rounded-full px-3 py-1.5 text-sm transition-colors ${item.href === `#${active}` ? 'bg-lavender-100 text-plum' : 'text-plum-soft hover:text-plum'}`}><EditableText path={[...path, 'label']} /></a>
                  {/* href editor appears only on hover so the nav keeps its exact public layout in Edit Mode */}
                  <span className="absolute top-full mt-1 hidden w-40 rounded-xl bg-ivory p-2 shadow-soft border border-lavender-200 group-hover/nav:block" style={{ insetInlineStart: 0 }}><EditableHref path={[...path, 'href']} allowAnchors /></span>
                </span>
              )} />
          </div>
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="rounded-full border border-lavender-200 bg-ivory/80 px-3 py-1.5 text-sm backdrop-blur hover:border-lilac transition-colors" aria-label="Switch language">
            <EditableText path={['labels', 'langSwitch']} />
          </button>
        </nav>
      </header>

      <main>
        <Hero /><About /><Specializations /><Experience /><QA /><Skills /><Projects /><Education /><Certifications /><Contact />
      </main>

      <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-28 pt-10">
        <div className="rule" />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-plum-mute">
          <EditableText path={['footer', 'text']} />
          <div className="flex items-center gap-5">
            <EditableCollection path={['footer', 'links']} factory={F.link} inline className="flex items-center gap-4"
              addLabel={{ en: 'Add', ar: 'إضافة' }} itemName={{ en: 'footer link', ar: 'رابط التذييل' }}
              render={({ item, path }) => <span><a href={item.href} className="hover:text-plum"><EditableText path={[...path, 'label']} /></a><EditableHref path={[...path, 'href']} allowAnchors /></span>} />
            {/* Discreet owner glyph (§2.2) */}
            {!authenticated && <button onClick={() => setLogin(true)} className="opacity-40 hover:opacity-100 transition-opacity" aria-label={t(content.labels.ownerLogin)} title="⌘K">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden><circle cx="7" cy="7" r="5.5" stroke="currentColor" /><circle cx="7" cy="7" r="1.6" fill="currentColor" /></svg>
            </button>}
          </div>
        </div>
      </footer>

      <EditBar />
      <LoginDialog open={login} onClose={() => setLogin(false)} />
    </div>
  );
}
