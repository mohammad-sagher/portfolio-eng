import { put } from '@vercel/blob';
import { requireOwner } from '@/lib/auth';
import sharp from 'sharp';
import crypto from 'node:crypto';

/**
 * Persistent image pipeline for Vercel.
 * Images are re-encoded server-side and stored in Vercel Blob rather than the
 * read-only/ephemeral function filesystem.
 */
const MAX_BYTES = 8 * 1024 * 1024;
const SLOTS: Record<string, { w: number; h: number }> = {
  project: { w: 1600, h: 1000 },
  qa: { w: 1600, h: 1000 },
  certificate: { w: 1200, h: 850 },
  generic: { w: 1600, h: 1600 },
};

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const denied = requireOwner(); if (denied) return denied;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return Response.json({ error: 'blob_not_configured' }, { status: 503 });

  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  const slot = String(form?.get('slot') || 'generic');
  if (!(file instanceof File)) return Response.json({ error: 'no_file' }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: 'too_large' }, { status: 413 });

  const buf = Buffer.from(await file.arrayBuffer());
  let meta;
  try { meta = await sharp(buf).metadata(); } catch { return Response.json({ error: 'bad_image' }, { status: 400 }); }
  if (!meta.format || !['jpeg', 'png', 'webp', 'gif', 'avif'].includes(meta.format)) {
    return Response.json({ error: 'bad_type' }, { status: 415 });
  }

  const target = SLOTS[slot] || SLOTS.generic;
  const srcW = meta.width ?? target.w;
  const srcH = meta.height ?? target.h;
  let w = Math.min(target.w, srcW);
  let h = Math.round(w * target.h / target.w);
  if (h > srcH) {
    h = Math.min(target.h, srcH);
    w = Math.round(h * target.w / target.h);
  }

  const pipeline = sharp(buf).rotate();
  const out = await (slot === 'generic'
    ? pipeline.resize(target.w, target.h, { fit: 'inside', withoutEnlargement: true })
    : pipeline.resize(w, h, { fit: 'cover', position: 'attention' })
  ).webp({ quality: 82 }).toBuffer();

  const blur = await sharp(out).resize(16).blur().webp({ quality: 40 }).toBuffer();
  const name = `portfolio/${crypto.randomBytes(8).toString('hex')}.webp`;
  const blob = await put(name, out, { access: 'public', contentType: 'image/webp', addRandomSuffix: false });

  return Response.json({
    src: blob.url,
    blur: `data:image/webp;base64,${blur.toString('base64')}`,
  });
}
