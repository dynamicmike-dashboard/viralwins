import { createHmac, timingSafeEqual } from 'node:crypto';

type VercelRequest = { headers: Record<string, string | string[] | undefined> };
type VercelResponse = { status(code: number): VercelResponse; json(body: unknown): void };

function signature(value: string): string {
  return createHmac('sha256', process.env.AUTH_SECRET ?? '').update(value).digest('base64url');
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const cookieHeader = typeof req.headers.cookie === 'string' ? req.headers.cookie : '';
  const raw = cookieHeader.split(';').map((item) => item.trim()).find((item) => item.startsWith('vw_paid_access='))?.slice('vw_paid_access='.length);
  if (!raw || !process.env.AUTH_SECRET) return res.status(200).json({ authorized: false });
  const [email, expiry, provided] = raw.split('.');
  const payload = `${email}.${expiry}`;
  const expected = signature(payload);
  const valid = Boolean(email && expiry && provided && Number(expiry) > Date.now() && provided.length === expected.length && timingSafeEqual(Buffer.from(provided), Buffer.from(expected)));
  return res.status(200).json({ authorized: valid, email: valid ? email : undefined });
}
