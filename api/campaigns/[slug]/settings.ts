import { saveCampaignLegalSettings } from '../../_lib/teable.js';
import { paidPromoterEmail, readJsonBody } from '../../_lib/access.js';

type VercelRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
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

const ALLOWED_KEYS = new Set([
  'useCustomPrivacyPolicy', 'customPrivacyPolicyText',
  'useCustomTermsConditions', 'customTermsConditionsText',
  'useCustomOfficialRules', 'customOfficialRulesText',
  'useCustomComplaintsPolicy', 'customComplaintsEmail', 'customComplaintsInstructions',
  'promoterLegalDisclaimer', 'promoterJurisdiction', 'platformNonLiabilityNotice',
]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'PATCH' && req.method !== 'PUT') return res.status(405).json({ error: 'method not allowed' });

    const promoter = paidPromoterEmail(req.headers);
    if (!promoter) return res.status(401).json({ error: 'promoter access required' });

    const body = readJsonBody(req.body);
    const legalInput = typeof body.legalSettings === 'object' && body.legalSettings !== null
      ? body.legalSettings as Record<string, unknown>
      : {};
    const legalSettings: Record<string, unknown> = {};
    for (const key of ALLOWED_KEYS) {
      if (key in legalInput && legalInput[key] !== undefined) legalSettings[key] = legalInput[key];
    }

    const slug = queryValue(req.query.slug);
    const saved = await saveCampaignLegalSettings(slug, legalSettings);
    if (!saved) return res.status(404).json({ error: 'campaign not found' });
    return res.status(200).json({ ok: true, legalSettings });
  } catch (error) {
    console.error('Campaign legal settings save failed:', error);
    return res.status(500).json({ error: 'legal settings could not be saved' });
  }
}
