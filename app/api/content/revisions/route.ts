import { requireOwner, isAuthenticated } from '@/lib/auth';
import { listRevisions, restoreRevision } from '@/lib/db';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isAuthenticated()) return Response.json({ error: 'unauthorized' }, { status: 401 });
  return Response.json({ revisions: await listRevisions() });
}

export async function POST(req: Request) {
  const denied = requireOwner(); if (denied) return denied;
  const { id } = await req.json().catch(() => ({}));
  if (typeof id !== 'number' || !await restoreRevision(id)) return Response.json({ error: 'not_found' }, { status: 404 });
  return Response.json({ ok: true });
}
