import { neon } from '@neondatabase/serverless';
import { ContentSchema, type Content } from './schema';
import { seed } from './seed';

/**
 * Production persistence layer.
 *
 * Vercel Functions do not have a persistent writable filesystem, so the old
 * SQLite implementation has been replaced with Neon Postgres. The data model
 * stays intentionally identical: one live document, one draft document,
 * revision history, and login throttling.
 */
const MAX_REVISIONS = 20;
let initialized: Promise<void> | null = null;

function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is missing');
  return neon(url);
}

async function ensureSchema() {
  if (initialized) return initialized;
  initialized = (async () => {
    const db = sql();
    await db`CREATE TABLE IF NOT EXISTS documents (kind TEXT PRIMARY KEY, json TEXT NOT NULL, updated_at BIGINT NOT NULL)`;
    await db`CREATE TABLE IF NOT EXISTS revisions (id BIGSERIAL PRIMARY KEY, json TEXT NOT NULL, created_at BIGINT NOT NULL)`;
    await db`CREATE TABLE IF NOT EXISTS login_attempts (ip TEXT PRIMARY KEY, count INTEGER NOT NULL, first_at BIGINT NOT NULL)`;

    const rows = await db`SELECT 1 FROM documents WHERE kind = 'live' LIMIT 1`;
    if (rows.length === 0) {
      const json = JSON.stringify(seed);
      const now = Date.now();
      await db`INSERT INTO documents (kind, json, updated_at) VALUES ('live', ${json}, ${now}), ('draft', ${json}, ${now})`;
    } else {
      const draft = await db`SELECT 1 FROM documents WHERE kind = 'draft' LIMIT 1`;
      if (draft.length === 0) {
        const live = await db`SELECT json, updated_at FROM documents WHERE kind = 'live' LIMIT 1`;
        await db`INSERT INTO documents (kind, json, updated_at) VALUES ('draft', ${live[0].json}, ${live[0].updated_at})`;
      }
    }
  })();
  return initialized;
}

export async function getDocument(kind: 'live' | 'draft'): Promise<{ content: Content; updatedAt: number }> {
  await ensureSchema();
  const rows = await sql()`SELECT json, updated_at FROM documents WHERE kind = ${kind} LIMIT 1`;
  if (!rows.length) return { content: seed, updatedAt: 0 };
  try {
    const parsed = ContentSchema.safeParse(JSON.parse(rows[0].json as string));
    return { content: parsed.success ? parsed.data : seed, updatedAt: Number(rows[0].updated_at) };
  } catch {
    return { content: seed, updatedAt: Number(rows[0].updated_at) };
  }
}

export async function saveDraft(content: Content) {
  await ensureSchema();
  const now = Date.now();
  const json = JSON.stringify(content);
  await sql()`INSERT INTO documents (kind, json, updated_at) VALUES ('draft', ${json}, ${now}) ON CONFLICT (kind) DO UPDATE SET json = EXCLUDED.json, updated_at = EXCLUDED.updated_at`;
  return now;
}

export async function publish() {
  await ensureSchema();
  const db = sql();
  const rows = await db`SELECT kind, json FROM documents WHERE kind IN ('live','draft')`;
  const live = rows.find((r: any) => r.kind === 'live')?.json;
  const draft = rows.find((r: any) => r.kind === 'draft')?.json;
  if (!live || !draft) throw new Error('documents are not initialized');
  const now = Date.now();
  await db`INSERT INTO revisions (json, created_at) VALUES (${live}, ${now})`;
  await db`DELETE FROM revisions WHERE id NOT IN (SELECT id FROM revisions ORDER BY id DESC LIMIT ${MAX_REVISIONS})`;
  await db`UPDATE documents SET json = ${draft}, updated_at = ${now} WHERE kind = 'live'`;
  return now;
}

export async function discardDraft() {
  await ensureSchema();
  const db = sql();
  const live = await db`SELECT json FROM documents WHERE kind = 'live' LIMIT 1`;
  if (!live.length) return;
  await db`UPDATE documents SET json = ${live[0].json}, updated_at = ${Date.now()} WHERE kind = 'draft'`;
}

export async function listRevisions() {
  await ensureSchema();
  return await sql()`SELECT id::text AS id, created_at::bigint AS created_at FROM revisions ORDER BY id DESC` as { id: string; created_at: number }[];
}

export async function restoreRevision(id: number) {
  await ensureSchema();
  const db = sql();
  const row = await db`SELECT json FROM revisions WHERE id = ${id} LIMIT 1`;
  if (!row.length) return false;
  await db`UPDATE documents SET json = ${row[0].json}, updated_at = ${Date.now()} WHERE kind = 'draft'`;
  return true;
}

/** Login throttling: 5 attempts per 15 minutes per IP. */
export async function checkAndCountLogin(ip: string, success: boolean) {
  await ensureSchema();
  const db = sql();
  const now = Date.now();
  const WINDOW = 15 * 60 * 1000;
  const row = await db`SELECT count, first_at FROM login_attempts WHERE ip = ${ip} LIMIT 1`;
  if (success) {
    await db`DELETE FROM login_attempts WHERE ip = ${ip}`;
    return { allowed: true };
  }
  if (!row.length || now - Number(row[0].first_at) > WINDOW) {
    await db`INSERT INTO login_attempts (ip, count, first_at) VALUES (${ip}, 1, ${now}) ON CONFLICT (ip) DO UPDATE SET count = 1, first_at = EXCLUDED.first_at`;
    return { allowed: true };
  }
  const count = Number(row[0].count) + 1;
  await db`UPDATE login_attempts SET count = ${count} WHERE ip = ${ip}`;
  return { allowed: count <= 5 };
}

export async function isThrottled(ip: string) {
  await ensureSchema();
  const row = await sql()`SELECT count, first_at FROM login_attempts WHERE ip = ${ip} LIMIT 1`;
  return !!row.length && Number(row[0].count) >= 5 && Date.now() - Number(row[0].first_at) < 15 * 60 * 1000;
}
