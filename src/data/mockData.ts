import { Campaign, Subscriber, ActionLog, DrawAuditRecord } from '../types';

export const mockCampaigns: Campaign[] = [
  {
    id: "camp-creator-tech",
    slug: "tech-giveaway",
    title: "Ultimate Creator Tech Bundle Giveaway",
    headline: "Win a $3,500 Ultimate Creator Studio Setup",
    description: "Complete quick actions and invite fellow creators to increase your winning odds before the live draw. 100% free to enter!",
    clientName: "Apex Gear Labs",
    agencyName: "ViralScale Agency",
    campaignType: "sweepstakes",
    prizeTitle: "Apple MacBook Pro M3 Max + Shure SM7B + 4K Sony Studio Camera",
    prizeDescription: "Everything you need to launch a top-tier podcast, YouTube channel, or design studio. Delivered anywhere worldwide with 1-year AppleCare+ included.",
    prizeValueUsd: 3500,
    prizeImageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80",
    drawDate: "2026-09-30T23:59:59Z",
    claimDeadlineDays: 7,
    winnerCount: 1,
    referralRewardEntries: 5,
    showLeaderboard: true,
    leaderboardCount: 10,
    anonymizeLeaderboard: true,
    theme: {
      primaryColor: "#6366F1", // Indigo
      accentColor: "#F59E0B",  // Amber
      bgColor: "slate-950",
      headlineFont: "Plus Jakarta Sans",
      cardStyle: "glass",
      borderRadius: "rounded-3xl",
      bannerLayout: "hero_spotlight"
    },
    actions: [
      {
        id: "act-wa",
        title: "Share on WhatsApp",
        platform: "whatsapp",
        reward: 3,
        description: "Send direct invite message to your group chats or contacts",
        verificationType: "instant_click",
        category: "social"
      },
      {
        id: "act-tw",
        title: "Broadcast on X / Twitter",
        platform: "twitter",
        reward: 3,
        description: "Post personal referral link to your timeline with official hashtags",
        verificationType: "instant_click",
        category: "social"
      },
      {
        id: "act-yt",
        title: "Watch 30-Sec Gear Walkthrough",
        platform: "youtube",
        reward: 4,
        description: "Watch our unboxing teaser (10s verification)",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        verificationType: "timed_watch",
        timedSeconds: 10,
        category: "content"
      },
      {
        id: "act-li",
        title: "Share on LinkedIn",
        platform: "linkedin",
        reward: 3,
        description: "Share with your professional creative network",
        verificationType: "instant_click",
        category: "social"
      },
      {
        id: "act-tg",
        title: "Join VIP Telegram Channel",
        platform: "telegram",
        reward: 5,
        description: "Get insider drops, gear reviews, and bonus draw codes",
        url: "https://t.me/telegram",
        verificationType: "instant_click",
        category: "community"
      },
      {
        id: "act-news",
        title: "Subscribe to Creator Weekly",
        platform: "newsletter",
        reward: 4,
        description: "Get curated filmmaking and audio production tips every Friday",
        url: "https://creatorweekly.substack.com",
        verificationType: "instant_click",
        category: "content"
      }
    ],
    milestones: [
      {
        id: "ms-1",
        title: "Starter Creator Badge",
        requiredPoints: 5,
        rewardType: "badge",
        rewardValue: "Verified Competitor Badge",
        icon: "ShieldCheck"
      },
      {
        id: "ms-2",
        title: "Creator Playbook PDF",
        requiredPoints: 15,
        rewardType: "digital_download",
        rewardValue: "https://download.apexgearlabs.com/playbook-2026.pdf",
        icon: "BookOpen"
      },
      {
        id: "ms-3",
        title: "20 Bonus Draw Tickets",
        requiredPoints: 30,
        rewardType: "bonus_tickets",
        rewardValue: "+20 Weighted Draw Entries",
        icon: "Ticket"
      },
      {
        id: "ms-4",
        title: "Apex Gear $50 Store Voucher",
        requiredPoints: 50,
        rewardType: "discount_code",
        rewardValue: "APEX50-GIVEAWAY",
        icon: "Gift"
      }
    ],
    officialRules: "NO PURCHASE NECESSARY. Open to legal residents worldwide, 18+. Void where prohibited. The promotion runs until the stated draw date. Winner(s) selected at random via verifiable cryptographic algorithm. Winner has 7 days to claim prize before alternate is selected.",
    legalSettings: {
      useCustomPrivacyPolicy: false,
      customPrivacyPolicyText: "",
      useCustomTermsConditions: false,
      customTermsConditionsText: "",
      useCustomOfficialRules: false,
      customOfficialRulesText: "",
      useCustomComplaintsPolicy: false,
      customComplaintsEmail: "support@apexgearlabs.com",
      customComplaintsInstructions: "Please provide your registered entry email address and full name for swift verification.",
      promoterLegalDisclaimer: "Apex Gear Labs is solely responsible for prize procurement, fulfillment, and sweepstakes administration.",
      promoterJurisdiction: "Delaware, United States"
    },
    status: "active",
    stats: {
      totalSubscribers: 1420,
      totalReferrals: 3890,
      totalActionsCompleted: 7850,
      viralKFactor: 2.74,
      conversionRate: 41.8
    }
  },
  {
    id: "camp-saas-launch",
    slug: "nexus-ai-beta",
    title: "Nexus AI Agent Platform - Early VIP Access",
    headline: "Skip 15,000+ On The Waitlist & Win Free Lifetime Access",
    description: "Refer teammates and engineering friends to move up the queue and unlock guaranteed developer perks.",
    clientName: "Nexus Autonomous Systems",
    agencyName: "ViralScale Agency",
    campaignType: "hybrid",
    prizeTitle: "Lifetime Founder Tier License + 1,000,000 Gemini API Credits",
    prizeDescription: "Permanent team account for up to 10 engineers with dedicated GPU priority pipelines.",
    prizeValueUsd: 6000,
    prizeImageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    drawDate: "2026-10-15T18:00:00Z",
    claimDeadlineDays: 5,
    winnerCount: 3,
    referralRewardEntries: 10,
    showLeaderboard: true,
    leaderboardCount: 10,
    anonymizeLeaderboard: true,
    theme: {
      primaryColor: "#10B981", // Emerald
      accentColor: "#06B6D4",  // Cyan
      bgColor: "zinc-950",
      headlineFont: "Syne",
      cardStyle: "glass",
      borderRadius: "rounded-2xl",
      bannerLayout: "hero_spotlight"
    },
    actions: [
      {
        id: "act-nx-x",
        title: "Post on X / Twitter",
        platform: "twitter",
        reward: 5,
        description: "Share your early access link with fellow devs",
        verificationType: "instant_click",
        category: "social"
      },
      {
        id: "act-nx-dc",
        title: "Join Discord Developer Guild",
        platform: "discord",
        reward: 8,
        description: "Connect directly with our core AI engineering team",
        url: "https://discord.gg/nexus",
        verificationType: "instant_click",
        category: "community"
      },
      {
        id: "act-nx-yt",
        title: "Watch 1-Min Live Architecture Demo",
        platform: "youtube",
        reward: 6,
        description: "See Nexus AI agents code and deploy apps autonomously",
        url: "https://youtube.com",
        verificationType: "timed_watch",
        timedSeconds: 10,
        category: "content"
      }
    ],
    milestones: [
      {
        id: "nx-m1",
        title: "Priority Beta Tier 1",
        requiredPoints: 10,
        rewardType: "badge",
        rewardValue: "Early Developer Access (Week 1)",
        icon: "Zap"
      },
      {
        id: "nx-m2",
        title: "Free 100k API Tokens",
        requiredPoints: 30,
        rewardType: "discount_code",
        rewardValue: "NEXUS-FREE-100K-KEY",
        icon: "Key"
      },
      {
        id: "nx-m3",
        title: "Exclusive Swag Kit (Hoodie & Stickers)",
        requiredPoints: 60,
        rewardType: "physical_merch",
        rewardValue: "Free Worldwide Swag Shipment",
        icon: "Package"
      }
    ],
    officialRules: "Official beta rollout rules. Waitlist positions and raffle entries are weighted according to verified actions.",
    legalSettings: {
      useCustomPrivacyPolicy: false,
      customPrivacyPolicyText: "",
      useCustomTermsConditions: false,
      customTermsConditionsText: "",
      useCustomOfficialRules: false,
      customOfficialRulesText: "",
      useCustomComplaintsPolicy: false,
      customComplaintsEmail: "help@nexusautonomous.io",
      customComplaintsInstructions: "Include your GitHub username and API referral handle in your ticket.",
      promoterLegalDisclaimer: "Nexus Autonomous Systems is solely responsible for beta quota allocation and digital token distribution.",
      promoterJurisdiction: "California, United States"
    },
    status: "active",
    stats: {
      totalSubscribers: 4980,
      totalReferrals: 11200,
      totalActionsCompleted: 19800,
      viralKFactor: 2.25,
      conversionRate: 48.6
    }
  }
];

export const mockSubscribers: Subscriber[] = [
  {
    id: "sub-user-demo",
    campaignId: "camp-creator-tech",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    referralCode: "ALEX77",
    totalEntries: 24,
    referralCount: 4,
    completedActionIds: ["act-wa", "act-yt"],
    unlockedMilestoneIds: ["ms-1", "ms-2"],
    createdAt: "2026-08-10T14:20:00Z",
    ipAddress: "192.168.1.10",
    fraudRiskScore: 4,
    fraudReasons: [],
    status: "active"
  },
  {
    id: "sub-marcus",
    campaignId: "camp-creator-tech",
    name: "Marcus Vance",
    email: "marcus.v@creativestudio.io",
    referralCode: "MARCUS99",
    totalEntries: 72,
    referralCount: 12,
    completedActionIds: ["act-wa", "act-tw", "act-yt", "act-li", "act-tg", "act-news"],
    unlockedMilestoneIds: ["ms-1", "ms-2", "ms-3", "ms-4"],
    createdAt: "2026-08-08T09:12:00Z",
    ipAddress: "74.125.19.44",
    fraudRiskScore: 0,
    fraudReasons: [],
    status: "active"
  },
  {
    id: "sub-sarah",
    campaignId: "camp-creator-tech",
    name: "Sarah Chen",
    email: "sarah.chen@techvibe.co",
    referralCode: "SARAH_C",
    totalEntries: 58,
    referralCount: 9,
    completedActionIds: ["act-tw", "act-yt", "act-li", "act-tg"],
    unlockedMilestoneIds: ["ms-1", "ms-2", "ms-3"],
    createdAt: "2026-08-09T11:45:00Z",
    ipAddress: "142.250.180.14",
    fraudRiskScore: 5,
    fraudReasons: [],
    status: "active"
  },
  {
    id: "sub-elena",
    campaignId: "camp-creator-tech",
    name: "Elena Rostova",
    email: "elena.r@visuals.art",
    referralCode: "ELENA_R",
    totalEntries: 43,
    referralCount: 7,
    completedActionIds: ["act-wa", "act-tw", "act-news"],
    unlockedMilestoneIds: ["ms-1", "ms-2", "ms-3"],
    createdAt: "2026-08-11T16:30:00Z",
    ipAddress: "172.56.21.90",
    fraudRiskScore: 2,
    fraudReasons: [],
    status: "active"
  },
  {
    id: "sub-david",
    campaignId: "camp-creator-tech",
    name: "David Lindqvist",
    email: "david.l@nordicfilm.se",
    referralCode: "DAVID_L",
    totalEntries: 39,
    referralCount: 6,
    completedActionIds: ["act-yt", "act-tg", "act-news"],
    unlockedMilestoneIds: ["ms-1", "ms-2", "ms-3"],
    createdAt: "2026-08-12T08:05:00Z",
    ipAddress: "194.14.82.11",
    fraudRiskScore: 8,
    fraudReasons: [],
    status: "active"
  },
  {
    id: "sub-tariq",
    campaignId: "camp-creator-tech",
    name: "Tariq Mansour",
    email: "tariq@dubaimedia.ae",
    referralCode: "TARIQ_M",
    totalEntries: 31,
    referralCount: 5,
    completedActionIds: ["act-wa", "act-li"],
    unlockedMilestoneIds: ["ms-1", "ms-2", "ms-3"],
    createdAt: "2026-08-12T19:22:00Z",
    ipAddress: "94.200.32.18",
    fraudRiskScore: 0,
    fraudReasons: [],
    status: "active"
  },
  {
    id: "sub-maya",
    campaignId: "camp-creator-tech",
    name: "Maya Patel",
    email: "maya.designs@gmail.com",
    referralCode: "MAYA_P",
    totalEntries: 28,
    referralCount: 4,
    completedActionIds: ["act-tw", "act-tg"],
    unlockedMilestoneIds: ["ms-1", "ms-2"],
    createdAt: "2026-08-13T10:14:00Z",
    ipAddress: "103.21.124.5",
    fraudRiskScore: 12,
    fraudReasons: [],
    status: "active"
  },
  {
    id: "sub-bot1",
    campaignId: "camp-creator-tech",
    name: "Bot Spammy 99",
    email: "temp19283@trashmail.com",
    referralCode: "SPAM99",
    totalEntries: 35,
    referralCount: 7,
    completedActionIds: [],
    unlockedMilestoneIds: [],
    createdAt: "2026-08-14T03:00:00Z",
    ipAddress: "185.220.101.5",
    fraudRiskScore: 88,
    fraudReasons: ["Disposable email domain (trashmail.com)", "Rapid automated referrals within 60 seconds", "Known datacenter Tor/VPN exit IP"],
    status: "flagged"
  }
];

export const mockActionLogs: ActionLog[] = [
  {
    id: "log-1",
    subscriberId: "sub-user-demo",
    subscriberName: "Alex Johnson",
    campaignId: "camp-creator-tech",
    actionId: "act-wa",
    actionTitle: "Share on WhatsApp",
    rewardAwarded: 3,
    timestamp: "2026-08-15T14:10:00Z",
    verified: true
  },
  {
    id: "log-2",
    subscriberId: "sub-user-demo",
    subscriberName: "Alex Johnson",
    campaignId: "camp-creator-tech",
    actionId: "act-yt",
    actionTitle: "Watch 30-Sec Gear Walkthrough",
    rewardAwarded: 4,
    timestamp: "2026-08-15T14:15:00Z",
    verified: true
  },
  {
    id: "log-3",
    subscriberId: "sub-marcus",
    subscriberName: "Marcus Vance",
    campaignId: "camp-creator-tech",
    actionId: "act-tw",
    actionTitle: "Broadcast on X / Twitter",
    rewardAwarded: 3,
    timestamp: "2026-08-15T13:40:00Z",
    verified: true
  },
  {
    id: "log-4",
    subscriberId: "sub-sarah",
    subscriberName: "Sarah Chen",
    campaignId: "camp-creator-tech",
    actionId: "act-li",
    actionTitle: "Share on LinkedIn",
    rewardAwarded: 3,
    timestamp: "2026-08-15T12:05:00Z",
    verified: true
  }
];

export const mockPreviousDraws: DrawAuditRecord[] = [
  {
    campaignId: "camp-creator-tech-prev",
    campaignTitle: "Summer Audio Pro Giveaway (Previous Season)",
    drawnAt: "2026-06-30T23:59:59Z",
    seed: "0x89f41b2c44917a02c892e620d2bbfe7819ab921c5f",
    totalEligibleSubscribers: 890,
    totalTickets: 3410,
    winners: [
      {
        subscriberId: "sub-prev-win",
        subscriberName: "Julian K.",
        subscriberEmail: "julian.k***@gmail.com",
        referralCode: "JULIAN_AUDIO",
        totalEntriesAtDraw: 48,
        winningTicketNumber: 1842,
        totalTicketsInPool: 3410,
        drawTimestamp: "2026-06-30T23:59:59Z",
        auditHash: "sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        prizeTitle: "Universal Audio Apollo Twin X Duo"
      }
    ],
    sha256VerificationProof: "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35"
  }
];
