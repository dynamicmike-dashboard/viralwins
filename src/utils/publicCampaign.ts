import type { Campaign, CampaignAction, CampaignLegalSettings } from '../types';

type PublicCampaign = {
  id: string;
  slug: string;
  title: string;
  headline: string;
  description: string;
  status: string;
  rewardMode: string;
  referralPoints: number;
  referralEntries: number;
  prize: { title: string; description: string; value: string; drawsAt: string; winnerCount: number };
  actions: Array<Record<string, unknown>>;
  legalSettings?: Record<string, unknown> | null;
};

const DEFAULT_NON_LIABILITY_NOTICE =
  "ViralWins is strictly a software technology provider for this campaign. This promotion is organized and sponsored independently by the campaign promoter, who is solely responsible for prizes, eligibility, and legal compliance. ViralWins is not liable for any losses, claims, or prize fulfillment. Entrants must review the promoter's own terms and privacy policy.";

function legalBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function legalString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function toLegalSettings(raw: Record<string, unknown> | null | undefined): CampaignLegalSettings | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  return {
    useCustomPrivacyPolicy: legalBoolean(raw.useCustomPrivacyPolicy, false),
    customPrivacyPolicyText: legalString(raw.customPrivacyPolicyText),
    useCustomTermsConditions: legalBoolean(raw.useCustomTermsConditions, false),
    customTermsConditionsText: legalString(raw.customTermsConditionsText),
    useCustomOfficialRules: legalBoolean(raw.useCustomOfficialRules, false),
    customOfficialRulesText: legalString(raw.customOfficialRulesText),
    useCustomComplaintsPolicy: legalBoolean(raw.useCustomComplaintsPolicy, false),
    customComplaintsEmail: legalString(raw.customComplaintsEmail),
    customComplaintsInstructions: legalString(raw.customComplaintsInstructions),
    promoterLegalDisclaimer: legalString(raw.promoterLegalDisclaimer),
    promoterJurisdiction: legalString(raw.promoterJurisdiction),
    platformNonLiabilityNotice: legalString(raw.platformNonLiabilityNotice, DEFAULT_NON_LIABILITY_NOTICE),
  };
}

const emptyTheme: Campaign['theme'] = {
  primaryColor: '#0f766e',
  accentColor: '#f59e0b',
  bgColor: 'white',
  headlineFont: 'Plus Jakarta Sans',
  cardStyle: 'solid',
  borderRadius: 'rounded-3xl',
  bannerLayout: 'hero_spotlight',
};

function actionPlatform(value: unknown): CampaignAction['platform'] {
  const allowed: CampaignAction['platform'][] = ['whatsapp', 'twitter', 'linkedin', 'youtube', 'telegram', 'discord', 'instagram', 'tiktok', 'newsletter', 'custom_link', 'api_webhook'];
  return typeof value === 'string' && allowed.includes(value as CampaignAction['platform'])
    ? value as CampaignAction['platform']
    : 'custom_link';
}

export function toPrototypeCampaign(data: PublicCampaign): Campaign {
  const entriesMode = data.rewardMode.toLowerCase() === 'entries';
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    headline: data.headline,
    description: data.description,
    clientName: '',
    agencyName: '',
    campaignType: entriesMode ? 'sweepstakes' : 'milestone_points',
    prizeTitle: data.prize.title,
    prizeDescription: data.prize.description,
    prizeValueUsd: Number.parseFloat(data.prize.value.replace(/[^0-9.]/g, '')) || 0,
    prizeImageUrl: '/icon-512.svg',
    drawDate: data.prize.drawsAt || new Date(Date.now() + 30 * 86400000).toISOString(),
    claimDeadlineDays: 7,
    winnerCount: data.prize.winnerCount || 1,
    referralRewardEntries: entriesMode ? data.referralEntries : data.referralPoints,
    showLeaderboard: false,
    leaderboardCount: 10,
    anonymizeLeaderboard: true,
    theme: emptyTheme,
    actions: data.actions.map((action, index) => ({
      id: String(action.id ?? `action-${index}`),
      title: String(action.title ?? action.label ?? 'Complete action'),
      platform: actionPlatform(action.platform),
      reward: Number(action.entries ?? action.points ?? 0),
      description: String(action.description ?? ''),
      url: typeof action.destinationUrl === 'string' ? action.destinationUrl : undefined,
      verificationType: action.verificationMethod === 'webhook' ? 'webhook' : 'instant_click',
      category: 'social',
    })),
    milestones: [],
    officialRules: '',
    legalSettings: toLegalSettings(data.legalSettings),
    status: data.status.toLowerCase() === 'active' ? 'active' : 'draft',
    stats: { totalSubscribers: 0, totalReferrals: 0, totalActionsCompleted: 0, viralKFactor: 0, conversionRate: 0 },
  };
}
