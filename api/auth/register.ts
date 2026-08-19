import { hashPassword } from '../_lib/password.js';
import { createPromoter, findPromoterByEmail } from '../_lib/teable.js';
import { promoterSessionCookie, readJsonBody } from '../_lib/access.js';

type VercelRequest = { method?: string; body?: unknown; headers?: Record<string, string | string[] | undefined> };
type VercelResponse = { status(code: number): VercelResponse; json(body: unknown): void; setHeader(name: string, value: string): void };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });
    const body = readJsonBody(req.body);
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email.includes('@')) return res.status(400).json({ error: 'a valid email is required' });
    if (name.length < 2) return res.status(400).json({ error: 'your name is required' });
    if (password.length < 8) return res.status(400).json({ error: 'password must be at least 8 characters' });

    const exists = await findPromoterByEmail(email);
    if (exists) return res.status(409).json({ error: 'an account with that email already exists' });

    const paid = email === (process.env.PAID_TEST_EMAIL ?? 'test@dynamicmike.com').trim().toLowerCase();
    const promoter = await createPromoter({
      email,
      name,
      passwordHash: hashPassword(password),
      accessStatus: paid ? 'paid' : 'unpaid',
      planTier: paid ? 'Growth' : undefined,
    });
    if (!promoter) return res.status(503).json({ error: 'account could not be created' });

    res.setHeader('Set-Cookie', promoterSessionCookie(email));
    return res.status(201).json({ ok: true, email, paid, planTier: promoter.planTier || null, accessStatus: promoter.accessStatus });
  } catch (error) {
    console.error('Register failed:', error);
    return res.status(500).json({ error: 'registration unavailable' });
  }
}
