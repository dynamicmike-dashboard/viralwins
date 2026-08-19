import { createHmac } from 'node:crypto';
import { readJsonBody, isSecureUpstream } from '../_lib/access.js';

type VercelRequest = { method?: string; body?: unknown; headers?: Record<string, string | string[] | undefined> };
type VercelResponse = { status(code: number): VercelResponse; setHeader(name: string, value: string): void; json(body: unknown): void };

function signature(value: string): string {
  return createHmac('sha256', process.env.AUTH_SECRET ?? '').update(value).digest('base64url');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

    const body = await readJsonBody(req.body);
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const allowed = (process.env.PAID_TEST_EMAIL ?? 'test@dynamicmike.com').trim().toLowerCase();
    if (!process.env.AUTH_SECRET) return res.status(503).json({ error: 'test access is not configured' });
    if (!email || email !== allowed) return res.status(403).json({ error: 'paid promoter access not found' });

    const payload = `${email}.${Date.now() + 8 * 60 * 60 * 1000}`;
    const secure = isSecureUpstream(req.headers) ? 'Secure; ' : '';
    const cookie = `vw_paid_access=${payload}.${signature(payload)}; Path=/; HttpOnly; ${secure}SameSite=Lax; Max-Age=28800`;
    res.setHeader('Set-Cookie', cookie);
    const testToken = `${payload}.${signature(payload)}`;
    return res.status(200).json({ ok: true, testToken });
  } catch (error) {
    console.error('Test access failed:', error);
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: 'test access unavailable', message });
  }
}
