import { createHmac } from 'node:crypto';

type VercelRequest = { method?: string; body?: unknown };
type VercelResponse = { status(code: number): VercelResponse; json(body: unknown): void };

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  // Short-lived signed token="email.expiry.sig" returned to the caller instead of emailed.
  // A real mail provider would carry this link instead.
  const email = req.body && typeof req.body === 'object' && typeof (req.body as Record<string, unknown>).email === 'string'
    ? ((req.body as Record<string, unknown>).email as string).trim().toLowerCase()
    : '';
  if (!email.includes('@') || !process.env.AUTH_SECRET) return res.status(400).json({ error: 'invalid email' });

  const payload = `${email}.${Date.now() + 60 * 60 * 1000}`;
  const token = `${payload}.${createHmac('sha256', process.env.AUTH_SECRET).update(payload).digest('base64url')}`;
  const resetUrl = `/reset-password?token=${encodeURIComponent(token)}`;

  return res.status(200).json({ ok: true, resetUrl });
}