import { z } from 'zod';

/** Every human-readable string is language-keyed at the data layer (§9). */
export const L = z.object({ en: z.string().max(5000), ar: z.string().max(5000) });
export type Localized = z.infer<typeof L>;

const id = z.string().min(1).max(64);
const url = z.string().max(500).refine(
  (v) => v === '' || /^https:\/\/[^\s]+$/i.test(v),
  { message: 'must be an https:// URL' },
);

export const ImageSchema = z.object({
  src: z.string().max(500),
  alt: L,
  blur: z.string().max(4000).optional(), // data-URI blur placeholder (auto-generated on upload)
});

export const LinkSchema = z.object({ id, label: L, href: z.string().max(500) });
export const TagSchema = z.object({ id, label: L });
export const BulletSchema = z.object({ id, text: L });

export const ExperienceSchema = z.object({
  id, title: L, company: L, dates: L, summary: L,
  responsibilities: z.array(BulletSchema),
  technologies: z.array(TagSchema),
});

export const QaProjectSchema = z.object({
  id, name: L, role: L, dates: L, description: L,
  image: ImageSchema,
  tools: z.array(TagSchema),
  achievements: z.array(BulletSchema),
});

export const SkillCategorySchema = z.object({ id, name: L, skills: z.array(TagSchema) });

export const ProjectSchema = z.object({
  id, name: L, category: L, role: L, short: L, detailed: L,
  image: ImageSchema,
  technologies: z.array(TagSchema),
  features: z.array(BulletSchema),
  github: url, demo: url,
});

export const EducationSchema = z.object({
  id, institution: L, degree: L, field: L, dates: L, description: L,
  achievements: z.array(BulletSchema),
});

export const CertificationSchema = z.object({
  id, title: L, issuer: L, date: L, kind: L, description: L, image: ImageSchema, link: url,
});

export const ContactItemSchema = z.object({ id, label: L, value: L, href: z.string().max(500) });

export const ContentSchema = z.object({
  meta: z.object({ siteTitle: L, nav: z.array(LinkSchema) }),
  labels: z.record(z.string(), L), // every micro-label ("Role", "Tech Stack", "+ Add", empty states…) — all editable
  hero: z.object({ name: L, title: L, statement: L, ctas: z.array(LinkSchema), eyebrow: L }),
  about: z.object({ heading: L, eyebrow: L, paragraphs: z.array(BulletSchema), facts: z.array(z.object({ id, label: L, value: L })) }),
  specializations: z.object({ heading: L, eyebrow: L, items: z.array(TagSchema) }),
  experience: z.object({ heading: L, eyebrow: L, items: z.array(ExperienceSchema) }),
  qa: z.object({ heading: L, eyebrow: L, intro: L, organization: L, items: z.array(QaProjectSchema) }),
  skills: z.object({ heading: L, eyebrow: L, categories: z.array(SkillCategorySchema) }),
  projects: z.object({ heading: L, eyebrow: L, items: z.array(ProjectSchema) }),
  education: z.object({ heading: L, eyebrow: L, items: z.array(EducationSchema) }),
  certifications: z.object({ heading: L, eyebrow: L, items: z.array(CertificationSchema) }),
  contact: z.object({ heading: L, eyebrow: L, intro: L, items: z.array(ContactItemSchema) }),
  footer: z.object({ text: L, links: z.array(LinkSchema) }),
});
export type Content = z.infer<typeof ContentSchema>;
export type Lang = 'en' | 'ar';

/** Auto slug/id generation (§3.2): no manual keys ever. */
export function newId(prefix = 'n') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
