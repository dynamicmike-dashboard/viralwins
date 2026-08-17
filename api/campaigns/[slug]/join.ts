import { joinPublicCampaign } from '../../_lib/teable';

type VercelRequest = {
  method?: string;
  query: Record<string, string | string[] | undefined>;
  body?: unknown;
};
type VercelResponse = {
  status(code: number): VercelResponse;
  json(body: unknown): void;
};

function queryValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  try {
    const body = req.body && typeof req.body === 'object' ? req.body as Record<string, unknown> : {};
    const name = typeof body.name === 'string' ? body.name : '';
    const email = typeof body.email === 'string' ? body.email : '';
    if (!name.trim() || !email.includes('@')) {
      return res.status(400).json({ error: 'name and a valid email are required' });
    }

    const result = await joinPublicCampaign({
      slug: queryValue(req.query.slug),
      name,
      email,
      referrerCode: typeof body.referrerCode === 'string' ? body.referrerCode : undefined,
    });
    if (result.kind === 'not_found') return res.status(404).json({ error: 'campaign not found' });
    if (result.kind === 'inactive') return res.status(409).json({ error: 'campaign is not active' });
    if (result.kind === 'duplicate') return res.status(409).json({ error: 'email already entered this campaign' });
    return res.status(201).json(result);
  } catch (error) {
    console.error('Campaign join failed:', error);
    return res.status(500).json({ error: 'campaign join unavailable' });
  }
}
