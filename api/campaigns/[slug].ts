import { getPublicCampaign } from '../_lib/teable';

type VercelRequest = { query: Record<string, string | string[] | undefined> };
type VercelResponse = {
  status(code: number): VercelResponse;
  json(body: unknown): void;
};

function queryValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const slug = queryValue(req.query.slug);
    const campaign = await getPublicCampaign(slug);
    if (!campaign) return res.status(404).json({ error: 'campaign not found' });
    return res.status(200).json({ campaign });
  } catch (error) {
    console.error('Campaign read failed:', error);
    return res.status(500).json({ error: 'campaign data unavailable' });
  }
}
