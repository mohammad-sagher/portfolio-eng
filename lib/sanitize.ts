import type { Content } from './schema';

/** Strip anything HTML-like from every string, recursively. Content is plain text by design; we render as text, never innerHTML. */
function clean(s: string) {
  return s.replace(/<[^>]*>/g, '').replace(/javascript:/gi, '').slice(0, 5000);
}
export function sanitizeDeep<T>(v: T): T {
  if (typeof v === 'string') return clean(v) as T;
  if (Array.isArray(v)) return v.map(sanitizeDeep) as T;
  if (v && typeof v === 'object') {
    const o: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) o[k] = sanitizeDeep(val);
    return o as T;
  }
  return v;
}
export function sanitizeContent(c: Content): Content {
  // Blur placeholders are data URIs we generated server-side; allow them through untouched.
  return sanitizeDeep(c);
}
