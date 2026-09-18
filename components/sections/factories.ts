import { newId } from '@/lib/schema';
/** Blank-item factories: new entries scaffold BOTH languages empty so the "translation missing" flag surfaces immediately (§3.2). */
const e = () => ({ en: '', ar: '' });
const img = () => ({ src: '', alt: e() });
export const F = {
  tag: () => ({ id: newId('t'), label: e() }),
  bullet: () => ({ id: newId('b'), text: e() }),
  link: () => ({ id: newId('l'), label: e(), href: '#' }),
  fact: () => ({ id: newId('f'), label: e(), value: e() }),
  experience: () => ({ id: newId('exp'), title: e(), company: e(), dates: e(), summary: e(), responsibilities: [], technologies: [] }),
  qa: () => ({ id: newId('qa'), name: e(), role: e(), dates: e(), description: e(), image: img(), tools: [], achievements: [] }),
  skillCategory: () => ({ id: newId('sk'), name: e(), skills: [] }),
  project: () => ({ id: newId('p'), name: e(), category: e(), role: e(), short: e(), detailed: e(), image: img(), technologies: [], features: [], github: '', demo: '' }),
  education: () => ({ id: newId('ed'), institution: e(), degree: e(), field: e(), dates: e(), description: e(), achievements: [] }),
  certification: () => ({ id: newId('c'), title: e(), issuer: e(), date: e(), kind: e(), description: e(), image: img(), link: '' }),
  contact: () => ({ id: newId('ct'), label: e(), value: e(), href: '' }),
};
