import { createHmac, timingSafeEqual } from 'node:crypto';

type Headers = Record<string, string | string[] | undefined>;

export function signatureFor(value: string): string {
  return createHmac('sha256', process.env.AUTH_SECRET ?? '').update(value).digest('base64url');
}

export function paidPromoterEmail(headers: Headers): string | null {
  const cookieHeader = typeof headers.cookie === 'string' ? headers.cookie : '';
  const raw = cookieHeader.split(';').map((item) => item.trim()).find((item) => item.startsWith('vw_paid_access='))?.slice('vw_paid_access='.length);
  if (!raw || !process.env.AUTH_SECRET) return null;
  const [email, expiry, provided] = raw.split('.');
  const payload = `${email}.${expiry}`;
  const expected = signatureFor(payload);
  const valid = Boolean(email && expiry && provided && Number(expiry) > Date.now() && provided.length === expected.length && timingSafeEqual(Buffer.from(provided), Buffer.from(expected)));
  return valid ? email : null;
}