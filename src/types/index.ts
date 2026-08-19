export type CampaignType = 'sweepstakes' | 'milestone_points' | 'hybrid';

export type ActionPlatform = 
  | 'whatsapp'
  | 'twitter'
  | 'linkedin'
  | 'youtube'
  | 'telegram'
  | 'discord'
  | 'instagram'
  | 'tiktok'
  | 'newsletter'
  | 'custom_link'
  | 'api_webhook';

export interface CampaignAction {
  id: string;
  title: string;
  platform: ActionPlatform;
  reward: number; // Entries or Points
  description: string;
  url?: string;
  verificationType: 'instant_click' | 'timed_watch' | 'manual_review' | 'webhook';
  timedSeconds?: number;
  iconColor?: string;
  category?: 'social' | 'content' | 'community' | 'referral';
}

export interface CampaignMilestone {
  id: string;
  title: string;
  requiredPoints: number;
  rewardType: 'badge' | 'discount_code' | 'digital_download' | 'bonus_tickets' | 'physical_merch';
  rewardValue: string; // e.g. "PROMO50", "Exclusive Creator Guide PDF", "+25 Draw Tickets"
  icon: string;
  unlockedCount?: number;
}

export interface CampaignTheme {
  primaryColor: string; // Hex e.g. "#6366F1"
  accentColor: string;  // Hex e.g. "#F59E0B"
  bgColor: string;      // "slate-950" | "zinc-950" | "neutral-950" | "indigo-950" | "white"
  headlineFont: string; // "Plus Jakarta Sans" | "Outfit" | "Syne" | "Inter" | "JetBrains Mono" | "Playfair Display"
  cardStyle: 'glass' | 'solid' | 'bordered' | 'neo-brutal';
  borderRadius: 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl' | 'rounded-none';
  bannerLayout: 'hero_spotlight' | 'split_card' | 'minimal_header' | 'video_first';
}

export interface CampaignLegalSettings {
  useCustomPrivacyPolicy: boolean;
  customPrivacyPolicyText?: string;
  useCustomTermsConditions: boolean;
  customTermsConditionsText?: string;
  useCustomOfficialRules: boolean;
  customOfficialRulesText?: string;
  useCustomComplaintsPolicy: boolean;
  customComplaintsEmail?: string;
  customComplaintsInstructions?: string;
  promoterLegalDisclaimer?: string;
  promoterJurisdiction?: string;
  platformNonLiabilityNotice?: string;
}

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  headline: string;
  description: string;
  clientName: string;
  agencyName: string;
  campaignType: CampaignType;
  prizeTitle: string;
  prizeDescription: string;
  prizeValueUsd: number;
  prizeImageUrl: string;
  drawDate: string; // ISO format
  claimDeadlineDays: number;
  winnerCount: number;
  referralRewardEntries: number;
  showLeaderboard: boolean;
  leaderboardCount: number;
  anonymizeLeaderboard: boolean;
  theme: CampaignTheme;
  actions: CampaignAction[];
  milestones: CampaignMilestone[];
  officialRules: string;
  legalSettings?: CampaignLegalSettings;
  status: 'active' | 'draft' | 'ended' | 'drawing';
  stats: {
    totalSubscribers: number;
    totalReferrals: number;
    totalActionsCompleted: number;
    viralKFactor: number; // e.g. 1.84
    conversionRate: number; // e.g. 34.2%
  };
}

export interface Subscriber {
  id: string;
  campaignId: string;
  name: string;
  email: string;
  referralCode: string;
  referredByCode?: string;
  totalEntries: number;
  referralCount: number;
  completedActionIds: string[];
  unlockedMilestoneIds: string[];
  createdAt: string;
  ipAddress?: string;
  fraudRiskScore: number; // 0 to 100 (0 = Clean, >70 = Flagged)
  fraudReasons: string[];
  status: 'active' | 'flagged' | 'disqualified';
}

export interface ActionLog {
  id: string;
  subscriberId: string;
  subscriberName: string;
  campaignId: string;
  actionId: string;
  actionTitle: string;
  rewardAwarded: number;
  timestamp: string;
  verified: boolean;
}

export interface DrawWinner {
  subscriberId: string;
  subscriberName: string;
  subscriberEmail: string;
  referralCode: string;
  totalEntriesAtDraw: number;
  winningTicketNumber: number;
  totalTicketsInPool: number;
  drawTimestamp: string;
  auditHash: string;
  prizeTitle: string;
}

export interface DrawAuditRecord {
  campaignId: string;
  campaignTitle: string;
  drawnAt: string;
  seed: string;
  totalEligibleSubscribers: number;
  totalTickets: number;
  winners: DrawWinner[];
  sha256VerificationProof: string;
}
