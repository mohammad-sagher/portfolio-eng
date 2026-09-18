import { z } from 'zod';
import { verifyCredentials, createSession, clientIp } from '@/lib/auth';
import { checkAndCountLogin, isThrottled } from '@/lib/db';

const Body = z.object({ email: z.string().email().max(200), password: z.string().min(1).max(200) });

export async function POST(req: Request) {
  const ip = clientIp();
  if (await isThrottled(ip)) return Response.json({ error: 'throttled' }, { status: 429 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: 'invalid' }, { status: 401 });
  const ok = await verifyCredentials(parsed.data.email, parsed.data.password);
  const gate = await checkAndCountLogin(ip, ok);
  if (!ok) return Response.json({ error: gate.allowed ? 'invalid' : 'throttled' }, { status: gate.allowed ? 401 : 429 });
  createSession();
  return Response.json({ ok: true });
}
