import { destroySession, isAuthenticated } from '@/lib/auth';
export async function POST() { if (isAuthenticated()) destroySession(); return Response.json({ ok: true }); }
