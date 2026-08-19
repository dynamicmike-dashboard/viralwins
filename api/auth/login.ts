import { verifyPassword } from '../_lib/password.js';
import { findPromoterByEmail } from '../_lib/teable.js';
import { promoterSessionCookie, readJsonBody } from '../_lib/access.js';

type VercelRequest = { method?: string; body?: unknown; headers?: Record<string, string | string[] | undefined> };
type VercelResponse = { status(code: number): VercelResponse; json(body: unknown): void; setHeader(name: string, value: string): void };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });
    const body = await readJsonBody(req.body);
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email.includes('@') || !password) return res.status(400).json({ error: 'email and password are required' });

    const promoter = await findPromoterByEmail(email);
    if (!promoter || !verifyPassword(password, promoter.passwordHash)) {
      return res.status(401).json({ error: 'invalid email or password' });
    }

    res.setHeader('Set-Cookie', promoterSessionCookie(email));
    return res.status(200).json({
      ok: true,
      email,
      paid: promoter.accessStatus.toLowerCase() === 'paid',
      planTier: promoter.planTier || null,
      accessStatus: promoter.accessStatus,
    });
  } catch (error) {
    console.error('Login failed:', error);
    return res.status(500).json({ error: 'login unavailable' });
  }
}
