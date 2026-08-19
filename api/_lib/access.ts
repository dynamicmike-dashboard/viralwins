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

/** Defensively read a JSON request body (handles object, string, or undefined). */
export function readJsonBody(body: unknown): Record<string, unknown> {
  if (!body) return {};
  if (typeof body !== 'object') {
    if (typeof body === 'string') {
      try {
        return JSON.parse(body) as Record<string, unknown>;
      } catch (error) {
        console.error('[readJsonBody] invalid JSON string:', JSON.stringify(body.slice(0, 200)), error instanceof Error ? error.message : error);
        return {};
      }
    }
    console.error('[readJsonBody] non-object, non-string body type:', typeof body);
    return {};
  }
  return body as Record<string, unknown>;
}

/** Detect a secure (HTTPS) upstream request for cookie flags. */
export function isSecureUpstream(headers: Record<string, string | string[] | undefined> | undefined): boolean {
  try {
    return Boolean(headers && (headers['x-forwarded-proto'] === 'https' || headers['x-forwarded-protocol'] === 'https'));
  } catch {
    return false;
  }
}