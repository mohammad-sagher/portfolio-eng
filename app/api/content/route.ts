import { getDocument } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const wantDraft = url.searchParams.get('draft') === '1' && isAuthenticated();
  const doc = await getDocument(wantDraft ? 'draft' : 'live');
  return Response.json({ content: doc.content, updatedAt: doc.updatedAt, kind: wantDraft ? 'draft' : 'live' });
}
