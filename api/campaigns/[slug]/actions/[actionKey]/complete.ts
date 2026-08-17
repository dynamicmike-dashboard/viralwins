import { completePublicAction } from '../../../../_lib/teable';

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
    const subscriberId = typeof body.subscriberId === 'string' ? body.subscriberId : '';
    if (!subscriberId) return res.status(400).json({ error: 'subscriberId is required' });

    const result = await completePublicAction({
      slug: queryValue(req.query.slug),
      actionKey: queryValue(req.query.actionKey),
      subscriberId,
    });
    if (result.kind === 'not_found') return res.status(404).json({ error: 'campaign not found' });
    if (result.kind === 'subscriber_not_found') return res.status(404).json({ error: 'subscriber not found' });
    if (result.kind === 'action_not_found') return res.status(404).json({ error: 'action not found' });
    return res.status(201).json({ ok: true, awarded: result.awarded, status: result.status });
  } catch (error) {
    console.error('Campaign action failed:', error);
    return res.status(500).json({ error: 'action completion unavailable' });
  }
}
