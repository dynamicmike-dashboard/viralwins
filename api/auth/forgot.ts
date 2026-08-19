import { createHmac } from 'node:crypto';
import { readJsonBody } from '../_lib/access.js';

type VercelRequest = { method?: string; body?: unknown };
type VercelResponse = { status(code: number): VercelResponse; json(body: unknown): void };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

    // Short-lived signed token="email.expiry.sig" returned to the caller instead of emailed.
    const body = readJsonBody(req.body);
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!email.includes('@') || !process.env.AUTH_SECRET) return res.status(400).json({ error: 'invalid email' });

    const payload = `${email}.${Date.now() + 60 * 60 * 1000}`;
    const token = `${payload}.${createHmac('sha256', process.env.AUTH_SECRET).update(payload).digest('base64url')}`;
    const resetUrl = `/reset-password?token=${encodeURIComponent(token)}`;

    return res.status(200).json({ ok: true, resetUrl });
  } catch (error) {
    console.error('Forgot failed:', error);
    return res.status(500).json({ error: 'could not generate reset link' });
  }
}
