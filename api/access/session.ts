import { promoterSessionEmail, paidPromoterEmail, isValidSigned } from '../_lib/access.js';
import { findPromoterByEmail } from '../_lib/teable.js';

type VercelRequest = { headers: Record<string, string | string[] | undefined> };
type VercelResponse = { status(code: number): VercelResponse; json(body: unknown): void };

function getHeader(headers: VercelRequest['headers'], name: string): string | null {
  const val = headers[name.toLowerCase()];
  return Array.isArray(val) ? val[0] : (val ?? null);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const email = promoterSessionEmail(req.headers);

  if (!email) {
    const legacy = paidPromoterEmail(req.headers);
    if (legacy) return res.status(200).json({ loggedIn: false, authorized: true, email: legacy, planTier: null });
    
    // Fallback: test token from header (for Vercel dev/preview where cookies may not persist)
    const testToken = getHeader(req.headers, 'x-vw-test-token');
    if (testToken) {
      const verified = isValidSigned(testToken);
      if (verified) return res.status(200).json({ loggedIn: false, authorized: true, email: verified, planTier: null });
    }
    return res.status(200).json({ loggedIn: false, authorized: false });
  }

  const promoter = await findPromoterByEmail(email).catch(() => null);
  if (!promoter) return res.status(200).json({ loggedIn: true, authorized: false, email });

  const paid = promoter.accessStatus.toLowerCase() === 'paid';
  return res.status(200).json({
    loggedIn: true,
    authorized: paid,
    email,
    name: promoter.name,
    planTier: promoter.planTier || null,
    accessStatus: promoter.accessStatus,
  });
}