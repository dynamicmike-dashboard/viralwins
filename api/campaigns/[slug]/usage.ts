import { getCampaignUsage } from '../../_lib/teable.js';
import { paidPromoterEmail } from '../../_lib/access.js';

type VercelRequest = {
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[] | undefined>;
};
type VercelResponse = {
  status(code: number): VercelResponse;
  json(body: unknown): void;
};

function queryValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const promoter = paidPromoterEmail(req.headers);
  if (!promoter) return res.status(401).json({ error: 'promoter access required' });

  try {
    const usage = await getCampaignUsage(queryValue(req.query.slug));
    if (!usage) return res.status(404).json({ error: 'campaign not found' });
    return res.status(200).json({ usage });
  } catch (error) {
    console.error('Campaign usage failed:', error);
    return res.status(500).json({ error: 'campaign usage unavailable' });
  }
}