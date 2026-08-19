import { createHmac } from 'node:crypto';

type VercelRequest = { method?: string; body?: unknown; headers: Record<string, string | string[] | undefined> };
type VercelResponse = { status(code: number): VercelResponse; setHeader(name: string, value: string): void; json(body: unknown): void };

function signature(value: string): string {
  return createHmac('sha256', process.env.AUTH_SECRET ?? '').update(value).digest('base64url');
}

function isSecureContext(req: VercelRequest): boolean {
  const proto = req.headers['x-forwarded-proto'] || req.headers['x-forwarded-protocol'] || '';
  return proto === 'https';
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });
  const body = req.body && typeof req.body === 'object' ? req.body as Record<string, unknown> : {};
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const allowed = (process.env.PAID_TEST_EMAIL ?? 'test@dynamicmike.com').trim().toLowerCase();
  if (!process.env.AUTH_SECRET) return res.status(503).json({ error: 'test access is not configured' });
  if (!email || email !== allowed) return res.status(403).json({ error: 'paid promoter access not found' });

  const payload = `${email}.${Date.now() + 8 * 60 * 60 * 1000}`;
  const secureFlag = isSecureContext(req) ? 'Secure; ' : '';
  const cookie = `vw_paid_access=${payload}.${signature(payload)}; Path=/; HttpOnly; ${secureFlag}SameSite=Lax; Max-Age=28800`;
  res.setHeader('Set-Cookie', cookie);
  // Also return a test token for environments where cookies are unreliable (Vercel dev/preview)
  const testToken = `${payload}.${signature(payload)}`;
  return res.status(200).json({ ok: true, testToken });
}
