import { requireOwner } from '@/lib/auth';
import { publish } from '@/lib/db';

export async function POST() {
  const denied = requireOwner(); if (denied) return denied;
  return Response.json({ ok: true, publishedAt: await publish() });
}
