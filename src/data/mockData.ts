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
  },

  // ============ CAMPAIGN TEMPLATES ============

  // 1. LOCAL GYM / FITNESS STUDIO
  {
    id: "tmpl-gym-fitness",
    slug: "gym-grand-opening",
    title: "Grand Opening: Free Year of Fitness + PT Sessions",
    headline: "Win 12 Months Free Membership + 12 Personal Training Sessions",
    description: "Join our founding member giveaway! Share with workout buddies to boost your odds. New studio, top-tier equipment, zero commitment.",
    clientName: "Iron Forge Fitness",
    agencyName: "ViralScale Agency",
    campaignType: "sweepstakes",
    prizeTitle: "12-Month Unlimited Membership + 12 PT Sessions (worth $2,400)",
    prizeDescription: "Full access to all classes, open gym, and 12 one-on-one sessions with a certified trainer. Transferable to a friend.",
    prizeValueUsd: 2400,
    prizeImageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    drawDate: "2026-10-15T23:59:59Z",
    claimDeadlineDays: 7,
    winnerCount: 1,
    referralRewardEntries: 5,
    showLeaderboard: true,
    leaderboardCount: 10,
    anonymizeLeaderboard: true,
    theme: {
      primaryColor: "#DC2626", // Red-600
      accentColor: "#F59E0B",  // Amber
      bgColor: "slate-950",
      headlineFont: "Plus Jakarta Sans",
      cardStyle: "glass",
      borderRadius: "rounded-2xl",
      bannerLayout: "hero_spotlight"
    },
    actions: [
      { id: "act-wa", title: "Share on WhatsApp", platform: "whatsapp", reward: 3, description: "Invite gym buddies to join the founding member waitlist", verificationType: "instant_click", category: "social" },
      { id: "act-tw", title: "Post on X / Twitter", platform: "twitter", reward: 3, description: "Share your founding member link with #IronForgeFitness", verificationType: "instant_click", category: "social" },
      { id: "act-ig", title: "Share on Instagram Story", platform: "instagram", reward: 4, description: "Tag @ironforgefittness in your story", verificationType: "instant_click", category: "social" },
      { id: "act-yt", title: "Watch 30-Sec Studio Tour", platform: "youtube", reward: 5, description: "Watch our virtual walkthrough (15s verification)", url: "https://youtube.com", verificationType: "timed_watch", timedSeconds: 15, category: "content" },
      { id: "act-tg", title: "Join Member Telegram", platform: "telegram", reward: 4, description: "Get class schedules, nutrition tips, and bonus codes", url: "https://t.me/telegram", verificationType: "instant_click", category: "community" },
      { id: "act-news", title: "Subscribe to Fit Weekly", platform: "newsletter", reward: 3, description: "Weekly workout plans and nutrition guides", url: "https://example.com/subscribe", verificationType: "instant_click", category: "content" }
    ],
    milestones: [
      { id: "ms-1", title: "Founding Member Badge", requiredPoints: 5, rewardType: "badge", rewardValue: "Iron Forge Founder Badge", icon: "Award" },
      { id: "ms-2", title: "Free Protein Shake", requiredPoints: 15, rewardType: "discount_code", rewardValue: "SHAKE-FREE-1", icon: "Coffee" },
      { id: "ms-3", title: "Guest Pass for a Friend", requiredPoints: 30, rewardType: "physical_merch", rewardValue: "1-Week Guest Pass Card", icon: "UserPlus" },
      { id: "ms-4", title: "PT Session Voucher", requiredPoints: 50, rewardType: "discount_code", rewardValue: "PT-SESSION-1HR", icon: "Dumbbell" }
    ],
    officialRules: "NO PURCHASE NECESSARY. Open to local residents 18+. Winner must redeem within 30 days. PT sessions schedule subject to trainer availability.",
    legalSettings: {
      useCustomPrivacyPolicy: false, customPrivacyPolicyText: "",
      useCustomTermsConditions: false, customTermsConditionsText: "",
      useCustomOfficialRules: false, customOfficialRulesText: "",
      useCustomComplaintsPolicy: false, customComplaintsEmail: "hello@ironforgefittness.com",
      customComplaintsInstructions: "Include your full name and registered email.",
      promoterLegalDisclaimer: "Iron Forge Fitness is solely responsible for prize fulfillment and membership terms.",
      promoterJurisdiction: "California, United States",
      platformNonLiabilityNotice: "Iron Forge Fitness operates this promotion independently. ViralWins is strictly a software technology provider and is not liable for any losses, unfulfilled prizes, or dispute outcomes."
    },
    status: "active",
    stats: { totalSubscribers: 0, totalReferrals: 0, totalActionsCompleted: 0, viralKFactor: 0, conversionRate: 0 }
  },

  // 2. SAAS WAITLIST / BETA LAUNCH
  {
    id: "tmpl-saas-beta",
    slug: "saas-beta-waitlist",
    title: "Skip the Queue: Lifetime Pro Access to FlowState",
    headline: "Win Lifetime Pro Access to FlowState — AI Project Manager",
    description: "FlowState auto-organizes your projects, writes status updates, and predicts bottlenecks. Join the beta waitlist, refer teammates, jump the queue.",
    clientName: "FlowState Labs",
    agencyName: "ViralScale Agency",
    campaignType: "hybrid",
    prizeTitle: "Lifetime Pro Plan (unlimited projects, team seats, AI credits)",
    prizeDescription: "Permanent Pro tier for you + 5 team members. Includes 1M AI tokens/month, priority support, and early feature access.",
    prizeValueUsd: 4800,
    prizeImageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    drawDate: "2026-11-01T23:59:59Z",
    claimDeadlineDays: 5,
    winnerCount: 3,
    referralRewardEntries: 10,
    showLeaderboard: true,
    leaderboardCount: 20,
    anonymizeLeaderboard: true,
    theme: {
      primaryColor: "#0891B2", // Cyan-600
      accentColor: "#10B981",  // Emerald
      bgColor: "zinc-950",
      headlineFont: "Syne",
      cardStyle: "bordered",
      borderRadius: "rounded-xl",
      bannerLayout: "split_card"
    },
    actions: [
      { id: "act-tw", title: "Tweet about FlowState", platform: "twitter", reward: 5, description: "Share your waitlist position with #FlowStateBeta", verificationType: "instant_click", category: "social" },
      { id: "act-li", title: "Post on LinkedIn", platform: "linkedin", reward: 8, description: "Announce your early access to your professional network", verificationType: "instant_click", category: "social" },
      { id: "act-dc", title: "Join Discord Community", platform: "discord", reward: 10, description: "Chat with founders, get beta invites, shape the roadmap", url: "https://discord.gg/flowstate", verificationType: "instant_click", category: "community" },
      { id: "act-yt", title: "Watch 2-Min Demo", platform: "youtube", reward: 6, description: "See FlowState AI plan a sprint in real time", url: "https://youtube.com", verificationType: "timed_watch", timedSeconds: 20, category: "content" },
      { id: "act-gh", title: "Star GitHub Repo", platform: "custom_link", reward: 4, description: "Star our public SDK repo", url: "https://github.com/flowstate", verificationType: "instant_click", category: "community" },
      { id: "act-ref", title: "Refer a Dev Teammate", platform: "custom_link", reward: 15, description: "Each dev who joins adds 15 entries", verificationType: "instant_click", category: "referral" }
    ],
    milestones: [
      { id: "ms-1", title: "Early Access Tier 1", requiredPoints: 10, rewardType: "badge", rewardValue: "Beta Pioneer Badge", icon: "Zap" },
      { id: "ms-2", title: "100k AI Tokens Free", requiredPoints: 30, rewardType: "discount_code", rewardValue: "FLOWSTATE-100K", icon: "Cpu" },
      { id: "ms-3", title: "Exclusive Swag Pack", requiredPoints: 60, rewardType: "physical_merch", rewardValue: "Hoodie + Stickers + Notebook", icon: "Package" },
      { id: "ms-4", title: "Founder 1-on-1 Call", requiredPoints: 100, rewardType: "discount_code", rewardValue: "FOUNDER-CALL-30MIN", icon: "MessageSquare" }
    ],
    officialRules: "Open to developers, product managers, and founders 18+. Beta access subject to NDA. Lifetime plan non-transferable outside winning team.",
    legalSettings: {
      useCustomPrivacyPolicy: false, customPrivacyPolicyText: "",
      useCustomTermsConditions: false, customTermsConditionsText: "",
      useCustomOfficialRules: false, customOfficialRulesText: "",
      useCustomComplaintsPolicy: false, customComplaintsEmail: "beta@flowstate.io",
      customComplaintsInstructions: "Include your GitHub handle and registered email.",
      promoterLegalDisclaimer: "FlowState Labs is solely responsible for beta access grants and AI token allocation.",
      promoterJurisdiction: "Delaware, United States",
      platformNonLiabilityNotice: "FlowState Labs operates this promotion independently. ViralWins is strictly a software technology provider and is not liable for any losses, unfulfilled prizes, or dispute outcomes."
    },
    status: "active",
    stats: { totalSubscribers: 0, totalReferrals: 0, totalActionsCompleted: 0, viralKFactor: 0, conversionRate: 0 }
  },

  // 3. CONSUMER PRODUCT LAUNCH
  {
    id: "tmpl-product-launch",
    slug: "product-launch-headphones",
    title: "Be First: Win the Aurora Pro Wireless Headphones",
    headline: "Win Aurora Pro — Audiophile Wireless Before Anyone Else",
    description: "Our flagship headphones: planar magnetic drivers, 60hr battery, lossless codec. Join the launch list, share with audiophiles, win a pair free.",
    clientName: "Aurora Audio",
    agencyName: "ViralScale Agency",
    campaignType: "sweepstakes",
    prizeTitle: "Aurora Pro Wireless Headphones (MSRP $599)",
    prizeDescription: "Planar magnetic drivers, aptX Adaptive / LDAC, 60-hour ANC on, custom EQ app. Ships worldwide free.",
    prizeValueUsd: 599,
    prizeImageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    drawDate: "2026-10-31T23:59:59Z",
    claimDeadlineDays: 7,
    winnerCount: 2,
    referralRewardEntries: 5,
    showLeaderboard: false,
    leaderboardCount: 10,
    anonymizeLeaderboard: true,
    theme: {
      primaryColor: "#7C3AED", // Violet-600
      accentColor: "#F59E0B",  // Amber
      bgColor: "neutral-950",
      headlineFont: "Playfair Display",
      cardStyle: "solid",
      borderRadius: "rounded-3xl",
      bannerLayout: "video_first"
    },
    actions: [
      { id: "act-ig", title: "Instagram Reel/Story", platform: "instagram", reward: 5, description: "Show your current setup, tag @auroraaudio", verificationType: "instant_click", category: "social" },
      { id: "act-yt", title: "Watch 60-Sec Sound Demo", platform: "youtube", reward: 8, description: "Hear the planar magnetic difference (20s)", url: "https://youtube.com", verificationType: "timed_watch", timedSeconds: 20, category: "content" },
      { id: "act-tw", title: "Tweet Your Dream Setup", platform: "twitter", reward: 4, description: "Describe your ideal listening space with #AuroraPro", verificationType: "instant_click", category: "social" },
      { id: "act-dc", title: "Join Audiophile Discord", platform: "discord", reward: 6, description: "Discuss specs, get early firmware access", url: "https://discord.gg/aurora", verificationType: "instant_click", category: "community" },
      { id: "act-news", title: "Subscribe to Sound Journal", platform: "newsletter", reward: 5, description: "Monthly deep-dives on audio tech", url: "https://auroraaudio.substack.com", verificationType: "instant_click", category: "content" },
      { id: "act-ref", title: "Refer a Fellow Audiophile", platform: "custom_link", reward: 10, description: "Each audiophile friend = 10 bonus entries", verificationType: "instant_click", category: "referral" }
    ],
    milestones: [
      { id: "ms-1", title: "Early Bird Badge", requiredPoints: 8, rewardType: "badge", rewardValue: "Aurora Early Adopter", icon: "Headphones" },
      { id: "ms-2", title: "15% Launch Discount", requiredPoints: 25, rewardType: "discount_code", rewardValue: "AURORA-LAUNCH-15", icon: "Tag" },
      { id: "ms-3", title: "Premium Carrying Case", requiredPoints: 50, rewardType: "physical_merch", rewardValue: "Aurora Hard Case (worth $79)", icon: "Briefcase" },
      { id: "ms-4", title: "Custom EQ Profile", requiredPoints: 80, rewardType: "digital_download", rewardValue: "Personalized EQ by Lead Engineer", icon: "Sliders" }
    ],
    officialRules: "NO PURCHASE NECESSARY. Open globally 18+. Winner receives headphones in retail packaging. Shipping included. Colors subject to availability.",
    legalSettings: {
      useCustomPrivacyPolicy: false, customPrivacyPolicyText: "",
      useCustomTermsConditions: false, customTermsConditionsText: "",
      useCustomOfficialRules: false, customOfficialRulesText: "",
      useCustomComplaintsPolicy: false, customComplaintsEmail: "support@auroraaudio.com",
      customComplaintsInstructions: "Include order reference or registered email.",
      promoterLegalDisclaimer: "Aurora Audio is solely responsible for product shipping, warranty, and fulfillment.",
      promoterJurisdiction: "New York, United States",
      platformNonLiabilityNotice: "Aurora Audio operates this promotion independently. ViralWins is strictly a software technology provider and is not liable for any losses, unfulfilled prizes, or dispute outcomes."
    },
    status: "active",
    stats: { totalSubscribers: 0, totalReferrals: 0, totalActionsCompleted: 0, viralKFactor: 0, conversionRate: 0 }
  },

  // 4. LOCAL CAFE / RESTAURANT
  {
    id: "tmpl-cafe-local",
    slug: "cafe-grand-opening",
    title: "Free Coffee for a Year + Private Tasting Dinner",
    headline: "Win Free Coffee for a Year + Chef's Table for 6",
    description: "New specialty café opening downtown. Join the founding circle, invite friends, win unlimited coffee + private dinner experience.",
    clientName: "Bean & Beam Café",
    agencyName: "ViralScale Agency",
    campaignType: "sweepstakes",
    prizeTitle: "365 Daily Drinks + Private Chef's Tasting Dinner for 6 (worth $1,800)",
    prizeDescription: "One handcrafted drink per day for 12 months + exclusive after-hours tasting menu with head roaster and chef.",
    prizeValueUsd: 1800,
    prizeImageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80",
    drawDate: "2026-10-20T23:59:59Z",
    claimDeadlineDays: 7,
    winnerCount: 1,
    referralRewardEntries: 4,
    showLeaderboard: true,
    leaderboardCount: 10,
    anonymizeLeaderboard: false,
    theme: {
      primaryColor: "#92400E", // Amber-800
      accentColor: "#F59E0B",  // Amber
      bgColor: "amber-50",
      headlineFont: "Outfit",
      cardStyle: "solid",
      borderRadius: "rounded-2xl",
      bannerLayout: "hero_spotlight"
    },
    actions: [
      { id: "act-wa", title: "WhatsApp Group Invite", platform: "whatsapp", reward: 3, description: "Share with your coffee crew", verificationType: "instant_click", category: "social" },
      { id: "act-ig", title: "Instagram Story Tag", platform: "instagram", reward: 4, description: "Tag @beanandbeamcafe showing your morning brew", verificationType: "instant_click", category: "social" },
      { id: "act-tw", title: "Tweet Your Order", platform: "twitter", reward: 2, description: "What's your go-to drink? Tweet with #BeanAndBeam", verificationType: "instant_click", category: "social" },
      { id: "act-maps", title: "Save on Google Maps", platform: "custom_link", reward: 5, description: "Save our location for opening week", url: "https://maps.google.com", verificationType: "instant_click", category: "community" },
      { id: "act-news", title: "Join Bean Club Newsletter", platform: "newsletter", reward: 3, description: "Weekly roast notes, brew guides, secret menu", url: "https://beanandbeam.substack.com", verificationType: "instant_click", category: "content" },
      { id: "act-ref", title: "Bring a Coffee Friend", platform: "custom_link", reward: 6, description: "Each friend who joins = 6 entries", verificationType: "instant_click", category: "referral" }
    ],
    milestones: [
      { id: "ms-1", title: "Founding Bean Club", requiredPoints: 5, rewardType: "badge", rewardValue: "Founding Member Badge", icon: "Crown" },
      { id: "ms-2", title: "Free Pastry with Drink", requiredPoints: 15, rewardType: "discount_code", rewardValue: "PASTRY-FREE-1", icon: "Cookie" },
      { id: "ms-3", title: "Private Cupping Session", requiredPoints: 35, rewardType: "physical_merch", rewardValue: "Cupping for 2 with Head Roaster", icon: "Coffee" },
      { id: "ms-4", title: "Chef's Table Deposit", requiredPoints: 60, rewardType: "discount_code", rewardValue: "CHEFS-TABLE-50OFF", icon: "UtensilsCrossed" }
    ],
    officialRules: "NO PURCHASE NECESSARY. Local residents 18+. Coffee redemption: 1 drink/day, non-transferable. Dinner date subject to availability.",
    legalSettings: {
      useCustomPrivacyPolicy: false, customPrivacyPolicyText: "",
      useCustomTermsConditions: false, customTermsConditionsText: "",
      useCustomOfficialRules: false, customOfficialRulesText: "",
      useCustomComplaintsPolicy: false, customComplaintsEmail: "hello@beanandbeam.com",
      customComplaintsInstructions: "Include your registered email and visit date if applicable.",
      promoterLegalDisclaimer: "Bean & Beam Café is solely responsible for prize fulfillment, food safety, and dietary accommodations.",
      promoterJurisdiction: "Texas, United States",
      platformNonLiabilityNotice: "Bean & Beam Café operates this promotion independently. ViralWins is strictly a software technology provider and is not liable for any losses, unfulfilled prizes, or dispute outcomes."
    },
    status: "active",
    stats: { totalSubscribers: 0, totalReferrals: 0, totalActionsCompleted: 0, viralKFactor: 0, conversionRate: 0 }
  },

  // 5. SPIN THE WHEEL INSTANT WIN
  {
    id: "tmpl-spin-wheel",
    slug: "spin-win-instant",
    title: "Spin & Win Instant Prizes",
    headline: "Spin the Wheel — Instant Discounts & Freebies",
    description: "One free spin for every entrant. Land on discounts, freebies, or the grand prize. No purchase necessary!",
    clientName: "Main Street Boutique",
    agencyName: "ViralScale Agency",
    campaignType: "spin_wheel",
    prizeTitle: "Grand Prize: $250 Shopping Spree",
    prizeDescription: "Land on the GRAND PRIZE slot to win a $250 in-store shopping spree. Everyone else wins a discount or freebie.",
    prizeValueUsd: 250,
    prizeImageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    drawDate: "2026-12-31T23:59:59Z",
    claimDeadlineDays: 14,
    winnerCount: 1,
    referralRewardEntries: 3,
    showLeaderboard: false,
    leaderboardCount: 10,
    anonymizeLeaderboard: true,
    theme: {
      primaryColor: "#EC4899", // Pink
      accentColor: "#F59E0B",  // Amber
      bgColor: "white",
      headlineFont: "Outfit",
      cardStyle: "solid",
      borderRadius: "rounded-3xl",
      bannerLayout: "hero_spotlight"
    },
    spinWheel: {
      title: "Spin & Win Big!",
      description: "One free spin for every entrant. Prizes change weekly — try your luck!",
      backgroundImageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
      buttonLabel: "SPIN TO WIN",
      resultMessage: "You landed on",
      segments: [
        { id: "s1", label: "10% OFF" },
        { id: "s2", label: "Free Shipping" },
        { id: "s3", label: "Try Again" },
        { id: "s4", label: "$5 Gift Card" },
        { id: "s5", label: "20% OFF" },
        { id: "s6", label: "Almost!" },
        { id: "s7", label: "Free Tote Bag" },
        { id: "s8", label: "GRAND PRIZE" }
      ]
    },
    actions: [
      { id: "act-wa", title: "Share on WhatsApp", platform: "whatsapp", reward: 3, description: "Send your spin link to friends for extra spins", verificationType: "instant_click", category: "social" },
      { id: "act-ig", title: "Follow on Instagram", platform: "instagram", reward: 3, description: "Follow @mainstreetboutique for new prize drops", verificationType: "instant_click", category: "social" },
      { id: "act-news", title: "Join VIP List", platform: "newsletter", reward: 4, description: "Weekly prize announcements + secret sales", url: "https://mainstreet.substack.com", verificationType: "instant_click", category: "content" }
    ],
    milestones: [
      { id: "ms-1", title: "Extra Spin Token", requiredPoints: 5, rewardType: "bonus_tickets", rewardValue: "+1 Extra Spin", icon: "RotateCcw" },
      { id: "ms-2", title: "VIP Early Access", requiredPoints: 15, rewardType: "badge", rewardValue: "Wheel VIP — early prize drops", icon: "Crown" }
    ],
    officialRules: "NO PURCHASE NECESSARY. Open 18+. One spin per entrant per day; referral bonus spins unlimited. Grand prize winner drawn from all entrants at campaign close.",
    legalSettings: {
      useCustomPrivacyPolicy: false, customPrivacyPolicyText: "",
      useCustomTermsConditions: false, customTermsConditionsText: "",
      useCustomOfficialRules: false, customOfficialRulesText: "",
      useCustomComplaintsPolicy: false, customComplaintsEmail: "hello@mainstreetboutique.com",
      customComplaintsInstructions: "Include your spin result and registered email.",
      promoterLegalDisclaimer: "Main Street Boutique is solely responsible for all prize fulfillment and discount redemption.",
      promoterJurisdiction: "Nevada, United States",
      platformNonLiabilityNotice: "Main Street Boutique operates this promotion independently. ViralWins is strictly a software technology provider and is not liable for any losses, unfulfilled prizes, or dispute outcomes."
    },
    status: "active",
    stats: { totalSubscribers: 0, totalReferrals: 0, totalActionsCompleted: 0, viralKFactor: 0, conversionRate: 0 }
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
