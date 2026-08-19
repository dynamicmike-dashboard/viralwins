import { createHmac, timingSafeEqual } from 'node:crypto';

type Headers = Record<string, string | string[] | undefined>;

export function signatureFor(value: string): string {
  return createHmac('sha256', process.env.AUTH_SECRET ?? '').update(value).digest('base64url');
}

function getCookie(headers: Headers, name: string): string | null {
  const cookieHeader = headers.cookie;
  const cookieString = Array.isArray(cookieHeader) ? cookieHeader.join('; ') : (typeof cookieHeader === 'string' ? cookieHeader : '');
  const item = cookieString.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return item ? item.slice(name.length + 1) : null;
}

export function isValidSigned(raw: string): string | null {
  if (!raw || !process.env.AUTH_SECRET) return null;
  const [email, expiry, provided] = raw.split('.');
  if (!email || !expiry || !provided) return null;
  const payload = `${email}.${expiry}`;
  const expected = signatureFor(payload);
  const valid = Number(expiry) > Date.now() && provided.length === expected.length && timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  return valid ? email : null;
}

export function paidPromoterEmail(headers: Headers): string | null {
  return isValidSigned(getCookie(headers, 'vw_paid_access') ?? '');
}

export function promoterSessionEmail(headers: Headers): string | null {
  return isValidSigned(getCookie(headers, 'vw_promoter_session') ?? '');
}

export const PROMOTER_SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;

export function promoterSessionCookie(email: string): string {
  const payload = `${email}.${Date.now() + PROMOTER_SESSION_MAX_AGE_MS}`;
  return `vw_promoter_session=${payload}.${signatureFor(payload)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.floor(PROMOTER_SESSION_MAX_AGE_MS / 1000)}`;
}

export function clearPromoterSessionCookie(): string {
  return 'vw_promoter_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0';
}

/** Defensively read a JSON request body (handles parsed object, string, Buffer, or stream). */
export async function readJsonBody(body: unknown): Promise<Record<string, unknown>> {
  if (body === undefined || body === null) return {};
  try {
    // Stream (Readable / ReadableStream) — consume as text then parse.
    if (typeof (body as { pipe?: unknown }).pipe === 'function' || typeof (body as { getReader?: unknown }).getReader === 'function') {
      const stream = body as NodeJS.ReadableStream;
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
      }
      const text = Buffer.concat(chunks).toString('utf8');
      return text ? JSON.parse(text) as Record<string, unknown> : {};
    }
    // Buffer / Uint8Array — decode then parse.
    if (Buffer.isBuffer(body) || body instanceof Uint8Array) {
      const text = Buffer.from(body as Uint8Array).toString('utf8');
      return text ? JSON.parse(text) as Record<string, unknown> : {};
    }
    // Plain object (Vercel parses application/json) — use directly.
    if (typeof body === 'object') return body as Record<string, unknown>;
    // String — parse.
    if (typeof body === 'string') {
      const text = body.trim();
      return text ? JSON.parse(text) as Record<string, unknown> : {};
    }
    return {};
  } catch (error) {
    console.error('[readJsonBody] body read failed:', error instanceof Error ? error.message : error);
    return {};
  }
}

/** Detect a secure (HTTPS) upstream request for cookie flags. */
export function isSecureUpstream(headers: Record<string, string | string[] | undefined> | undefined): boolean {
  try {
    return Boolean(headers && (headers['x-forwarded-proto'] === 'https' || headers['x-forwarded-protocol'] === 'https'));
  } catch {
    return false;
  }
}