import { createHmac } from 'node:crypto';

type VercelRequest = { method?: string; body?: unknown };
type VercelResponse = { status(code: number): VercelResponse; setHeader(name: string, value: string): void; json(body: unknown): void };

function signature(value: string): string {
  return createHmac('sha256', process.env.AUTH_SECRET ?? '').update(value).digest('base64url');
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });
  const body = req.body && typeof req.body === 'object' ? req.body as Record<string, unknown> : {};
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const allowed = process.env.PAID_TEST_EMAIL?.trim().toLowerCase();
  if (!allowed || !process.env.AUTH_SECRET) return res.status(503).json({ error: 'test access is not configured' });
  if (!email || email !== allowed) return res.status(403).json({ error: 'paid promoter access not found' });

  const payload = `${email}.${Date.now() + 8 * 60 * 60 * 1000}`;
  res.setHeader('Set-Cookie', `vw_paid_access=${payload}.${signature(payload)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=28800`);
  return res.status(200).json({ ok: true });
}
