import { paidPromoterEmail } from '../_lib/access.js';

type VercelRequest = { headers: Record<string, string | string[] | undefined> };
type VercelResponse = { status(code: number): VercelResponse; json(body: unknown): void };

export default function handler(req: VercelRequest, res: VercelResponse) {
  const email = paidPromoterEmail(req.headers);
  return res.status(200).json({ authorized: email !== null, email });
}