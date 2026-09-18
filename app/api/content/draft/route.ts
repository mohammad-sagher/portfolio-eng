import { requireOwner } from '@/lib/auth';
import { ContentSchema } from '@/lib/schema';
import { sanitizeContent } from '@/lib/sanitize';
import { saveDraft, discardDraft } from '@/lib/db';

export async function PUT(req: Request) {
  const denied = requireOwner(); if (denied) return denied;
  const body = await req.json().catch(() => null);
  const parsed = ContentSchema.safeParse(body?.content);
  if (!parsed.success) return Response.json({ error: 'validation', issues: parsed.error.issues.slice(0, 10) }, { status: 400 });
  const savedAt = await saveDraft(sanitizeContent(parsed.data));
  return Response.json({ ok: true, savedAt });
}

export async function DELETE() {
  const denied = requireOwner(); if (denied) return denied;
  await discardDraft();
  return Response.json({ ok: true });
}
