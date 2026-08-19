import { clearPromoterSessionCookie } from '../_lib/access.js';

type VercelRequest = { method?: string };
type VercelResponse = { status(code: number): VercelResponse; json(body: unknown): void; setHeader(name: string, value: string): void };

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });
  res.setHeader('Set-Cookie', clearPromoterSessionCookie());
  return res.status(200).json({ ok: true });
}