import { cookies, headers } from 'next/headers';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

/**
 * Auth layer (§8): credentials only from env, bcrypt-hashed password, HMAC-signed httpOnly session cookie.
 * No secrets ever reach the client bundle — this module is server-only.
 */
const COOKIE = 'bs_session';
const CSRF_COOKIE = 'bs_csrf';
const TTL = 60 * 60 * 12; // 12h

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error('SESSION_SECRET missing or too short');
  return s;
}
function sign(payload: string) {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
}

/**
 * bcrypt hashes contain "$" which dotenv-style loaders expand as variables. To be robust on every host,
 * the env value may be the raw hash OR its base64 encoding (prefixed with "b64:"). `npm run hash-password` emits the b64 form.
 */
function readHash() {
  const raw = process.env.ADMIN_PASSWORD_HASH || '';
  if (raw.startsWith('b64:')) return Buffer.from(raw.slice(4), 'base64').toString('utf8');
  return raw;
}

export async function verifyCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL || '';
  const hash = readHash();
  // Constant-time-ish: always run bcrypt even if email mismatches (no info leakage on failure).
  const emailOk = adminEmail.length > 0 && crypto.timingSafeEqual(
    Buffer.from(email.toLowerCase().padEnd(256).slice(0, 256)),
    Buffer.from(adminEmail.toLowerCase().padEnd(256).slice(0, 256)),
  );
  const pwOk = hash ? await bcrypt.compare(password, hash) : false;
  return emailOk && pwOk;
}

export function createSession() {
  const exp = Math.floor(Date.now() / 1000) + TTL;
  const payload = `${exp}.${crypto.randomBytes(16).toString('hex')}`;
  const token = `${payload}.${sign(payload)}`;
  const csrf = crypto.randomBytes(24).toString('base64url');
  const secure = process.env.NODE_ENV === 'production';
  cookies().set(COOKIE, token, { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: TTL });
  cookies().set(CSRF_COOKIE, csrf, { httpOnly: false, secure, sameSite: 'lax', path: '/', maxAge: TTL });
}

export function destroySession() {
  cookies().delete(COOKIE);
  cookies().delete(CSRF_COOKIE);
}

export function isAuthenticated(): boolean {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return false;
  const [exp, nonce, sig] = token.split('.');
  if (!exp || !nonce || !sig) return false;
  const expected = sign(`${exp}.${nonce}`);
  if (expected.length !== sig.length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return false;
  return Number(exp) > Math.floor(Date.now() / 1000);
}

/** Double-submit CSRF: header must match the non-httpOnly cookie (§8). */
export function csrfOk(): boolean {
  const c = cookies().get(CSRF_COOKIE)?.value;
  const h = headers().get('x-csrf-token');
  return !!c && !!h && c === h;
}

export function requireOwner(): Response | null {
  if (!isAuthenticated()) return Response.json({ error: 'unauthorized' }, { status: 401 });
  if (!csrfOk()) return Response.json({ error: 'csrf' }, { status: 403 });
  return null;
}

export function clientIp() {
  const h = headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'local';
}
