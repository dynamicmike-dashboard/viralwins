import { createHmac } from 'node:crypto';
import { hashPassword } from '../_lib/password.js';
import { findPromoterByEmail, setPromoterPassword } from '../_lib/teable.js';
import { clearPromoterSessionCookie, readJsonBody } from '../_lib/access.js';

type VercelRequest = { method?: string; body?: unknown };
type VercelResponse = { status(code: number): VercelResponse; json(body: unknown): void; setHeader(name: string, value: string): void };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });
    const body = await readJsonBody(req.body);
    const token = typeof body.token === 'string' ? body.token : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!token || password.length < 8) return res.status(400).json({ error: 'a reset token and a password of at least 8 characters are required' });

    const [email, expiry, signature] = token.split('.');
    if (!email || !expiry || !signature || !process.env.AUTH_SECRET) return res.status(400).json({ error: 'invalid reset token' });
    const expected = createHmac('sha256', process.env.AUTH_SECRET).update(`${email}.${expiry}`).digest('base64url');
    if (signature !== expected || Number(expiry) < Date.now()) return res.status(400).json({ error: 'invalid or expired reset token' });

    const promoter = await findPromoterByEmail(email);
    if (!promoter) return res.status(404).json({ error: 'account not found' });

    await setPromoterPassword(promoter.id, hashPassword(password));
    res.setHeader('Set-Cookie', clearPromoterSessionCookie());
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Reset failed:', error);
    return res.status(500).json({ error: 'password reset unavailable' });
  }
}
