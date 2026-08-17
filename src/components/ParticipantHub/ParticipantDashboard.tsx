import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Clock,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Youtube,
  Send,
  Sparkles,
  Users,
  Award,
  Flame,
  CheckCircle2,
  QrCode,
  Scale,
  Gift,
  Percent,
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
  Hash,
  Mail
} from 'lucide-react';
import { Campaign, Subscriber, CampaignAction } from '../../types';
import { ActionModal } from './ActionModal';
import { QRCodeModal } from './QRCodeModal';
import { CryptographicVerifierModal } from '../AnalyticsAndDraw/CryptographicVerifierModal';
import { NotificationPreviewDrawer } from '../NotificationPreview/NotificationPreviewDrawer';
import { triggerFireworks, triggerActionReward } from '../../utils/confetti';
import { triggerHapticFeedback } from '../../utils/haptics';

interface ParticipantDashboardProps {
  campaign: Campaign;
  subscriber: Subscriber;
  allSubscribers: Subscriber[];
  pendingActionIds?: string[];
  onActionCompleted: (actionId: string, reward: number) => void;
  onOpenRules: () => void;
}

export const ParticipantDashboard: React.FC<ParticipantDashboardProps> = ({
  campaign,
  subscriber,
  allSubscribers,
  pendingActionIds = [],
  onActionCompleted,
  onOpenRules
}) => {
  const [copied, setCopied] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [activeActionModal, setActiveActionModal] = useState<CampaignAction | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showVerifierModal, setShowVerifierModal] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  // Dynamic participant referral link
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://launch.app';
  const referralLink = `${origin}/c/${campaign.slug}?ref=${subscriber.referralCode}`;

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(campaign.drawDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };
    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [campaign.drawDate]);

  const copyToClipboard = () => {
    triggerHapticFeedback('success');
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleNativeShare = async () => {
    triggerHapticFeedback('medium');
    if (navigator.share) {
      try {
        await navigator.share({
          title: campaign.title,
          text: `Enter the ${campaign.prizeTitle} giveaway with me! Free entry here:`,
          url: referralLink
        });
      } catch {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const handleDirectShare = (platform: 'whatsapp' | 'twitter' | 'linkedin') => {
    triggerHapticFeedback('light');
    const shareMessage = encodeURIComponent(
      `Check out this giveaway for a chance to win ${campaign.prizeTitle}! Use my link to join: `
    );
    let targetUrl = '';
    if (platform === 'whatsapp') {
      targetUrl = `https://api.whatsapp.com/send?text=${shareMessage}${encodeURIComponent(referralLink)}`;
    } else if (platform === 'twitter') {
      targetUrl = `https://twitter.com/intent/tweet?text=${shareMessage}&url=${encodeURIComponent(referralLink)}`;
    } else if (platform === 'linkedin') {
      targetUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`;
    }
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Calculate user leaderboard ranking & winning probability
  const totalPoolEntries = allSubscribers.reduce((sum, s) => sum + (s.status === 'active' ? s.totalEntries : 0), 0) || 1;
  const userWinningOdds = ((subscriber.totalEntries / totalPoolEntries) * 100 * campaign.winnerCount).toFixed(1);

  const sortedSubscribers = [...allSubscribers].sort((a, b) => b.totalEntries - a.totalEntries);
  const userRankIndex = sortedSubscribers.findIndex(s => s.id === subscriber.id);
  const userRank = userRankIndex >= 0 ? userRankIndex + 1 : '-';

  const rewardLabel = campaign.campaignType === 'milestone_points' ? 'Points' : 'Entries';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header & Countdown */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        <div 
          className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: campaign.theme.primaryColor }}
        />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Participant Command Center
            </div>
            <h1 
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900"
              style={{ fontFamily: campaign.theme.headlineFont }}
            >
              Welcome, {subscriber.name.split(' ')[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-medium">
              Complete actions below and share your link to maximize your chances before the live draw.
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-2.5 sm:gap-3 shrink-0 shadow-inner">
            <div className="text-center px-2">
              <span className="block text-xl sm:text-2xl font-black text-indigo-600 font-mono">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Days</span>
            </div>
            <span className="text-slate-300 font-bold pb-3">:</span>
            <div className="text-center px-2">
              <span className="block text-xl sm:text-2xl font-black text-indigo-600 font-mono">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Hours</span>
            </div>
            <span className="text-slate-300 font-bold pb-3">:</span>
            <div className="text-center px-2">
              <span className="block text-xl sm:text-2xl font-black text-indigo-600 font-mono">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Mins</span>
            </div>
            <span className="text-slate-300 font-bold pb-3">:</span>
            <div className="text-center px-2">
              <span className="block text-xl sm:text-2xl font-black text-amber-500 font-mono">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Secs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prize Showcase Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white group shadow-lg">
        <div className="h-44 sm:h-60 w-full overflow-hidden relative">
          <img
            src={campaign.prizeImageUrl}
            alt={campaign.prizeTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
            <Trophy className="w-4 h-4" /> GRAND PRIZE
          </div>
          <div className="absolute top-4 right-4 bg-white/95 text-slate-900 border border-slate-200 text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-md">
            ${campaign.prizeValueUsd.toLocaleString()} Value
          </div>
        </div>
        <div className="p-6 sm:p-8 -mt-12 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-md border-t border-slate-100 rounded-b-3xl">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">
              {campaign.prizeTitle}
            </h2>
            <p className="text-xs text-slate-600 font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Live random draw on {new Date(campaign.drawDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                triggerHapticFeedback('light');
                setShowVerifierModal(true);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-bold transition shrink-0"
              title="Verify cryptographic SHA-256 fairness proof"
            >
              <Hash className="w-3.5 h-3.5" /> Provably Fair
            </button>

            <button
              onClick={() => {
                triggerHapticFeedback('light');
                onOpenRules();
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600 font-semibold transition shrink-0"
            >
              <Scale className="w-4 h-4" /> Official Rules
            </button>
          </div>
        </div>
      </div>

      {/* 4-Stat Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Entries */}
        <div className="bg-white border border-indigo-100 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs ring-1 ring-indigo-50">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">Your {rewardLabel}</span>
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono mt-2">{subscriber.totalEntries}</p>
        </div>

        {/* Referrals */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Invited</span>
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono mt-2">{subscriber.referralCount}</p>
        </div>

        {/* Rank */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Current Rank</span>
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono mt-2">#{userRank}</p>
        </div>

        {/* Estimated Winning Probability */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Winning Odds</span>
            <div className="p-2 bg-sky-50 rounded-xl text-sky-600 border border-sky-100">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono mt-2">~{userWinningOdds}%</p>
        </div>

      </div>

      {/* Unique Referral Link Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl shadow-slate-900/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-indigo-600" /> Your Personal Viral Referral Link
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Each friend who signs up with your link awards you <strong className="text-indigo-700">+{campaign.referralRewardEntries} extra {rewardLabel.toLowerCase()}</strong> instantly.
            </p>
          </div>
          <span className="text-xs text-indigo-800 font-mono bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200 self-start sm:self-auto font-bold">
            Code: {subscriber.referralCode}
          </span>
        </div>

        {/* Link Input & Quick Triggers */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full relative">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 px-4 text-xs sm:text-sm text-slate-800 font-mono select-all focus:outline-none focus:border-indigo-600 shadow-inner"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={copyToClipboard}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl transition shadow-md shadow-indigo-600/25 active:scale-95"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={() => setShowQRModal(true)}
              className="inline-flex items-center justify-center p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-300 transition"
              title="Show QR Code for print & flyers"
            >
              <QrCode className="w-4 h-4" />
            </button>
            <button
              onClick={handleNativeShare}
              className="inline-flex items-center justify-center p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-300 transition"
              title="Share via device"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1-Tap Quick Social Share Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-600 font-bold mr-1">Quick Share:</span>
          
          <button
            onClick={() => handleDirectShare('whatsapp')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold border border-emerald-200 transition"
          >
            <Send className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp
          </button>

          <button
            onClick={() => handleDirectShare('twitter')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 hover:bg-sky-100 text-xs font-bold border border-sky-200 transition"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-600" /> Post on X
          </button>

          <button
            onClick={() => handleDirectShare('linkedin')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 text-xs font-bold border border-blue-200 transition"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-600" /> LinkedIn
          </button>
        </div>
      </div>

      {/* Bonus Action Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" /> Complete Bonus Actions
          </h3>
          <span className="text-xs text-slate-500 font-semibold">Instant Verification & Credit</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaign.actions.map((action) => {
            const isCompleted = subscriber.completedActionIds.includes(action.id);
            const isPending = pendingActionIds.includes(action.id);
            return (
              <div
                key={action.id}
                className={`rounded-2xl border p-4 sm:p-5 flex items-center justify-between gap-4 transition duration-200 ${
                  isCompleted || isPending
                    ? "bg-slate-50/80 border-slate-200 opacity-70"
                    : "bg-white border-slate-200/90 hover:border-indigo-300 hover:shadow-lg shadow-xs"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`p-3 rounded-xl shrink-0 ${
                    action.platform === 'whatsapp' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    action.platform === 'twitter' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                    action.platform === 'youtube' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    action.platform === 'linkedin' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    action.platform === 'telegram' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' :
                    'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {action.platform === 'whatsapp' && <Send className="w-5 h-5" />}
                    {action.platform === 'twitter' && <Share2 className="w-5 h-5" />}
                    {action.platform === 'youtube' && <Youtube className="w-5 h-5" />}
                    {action.platform === 'linkedin' && <Share2 className="w-5 h-5" />}
                    {action.platform === 'telegram' && <Send className="w-5 h-5" />}
                    {action.platform === 'newsletter' && <Sparkles className="w-5 h-5" />}
                    {action.platform === 'custom_link' && <ExternalLink className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-extrabold text-slate-900 truncate">{action.title}</h4>
                    <p className="text-xs text-slate-500 font-medium truncate">{action.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!isCompleted && !isPending) {
                      setActiveActionModal(action);
                    }
                  }}
                  disabled={isCompleted || isPending}
                  className={`shrink-0 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition ${
                    isCompleted || isPending
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default"
                      : "bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 active:scale-95 shadow-2xs"
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </>
                  ) : isPending ? (
                    <>
                      <Clock className="w-3.5 h-3.5" /> Pending review
                    </>
                  ) : (
                    <>+{action.reward} {rewardLabel}</>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestone Rewards Ladder (If milestones configured) */}
      {campaign.milestones && campaign.milestones.length > 0 && (
        <div className="border border-slate-200/90 bg-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl shadow-slate-900/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Gift className="w-5 h-5 text-indigo-600" /> Milestone Rewards & Unlocks
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Earn guaranteed perks and bonus entries as your score rises
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-800 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200">
              {subscriber.totalEntries} {rewardLabel}
            </span>
          </div>

          {/* Milestone Track Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {campaign.milestones.map((ms) => {
              const isUnlocked = subscriber.totalEntries >= ms.requiredPoints;
              return (
                <div
                  key={ms.id}
                  className={`rounded-2xl border p-4 flex flex-col justify-between space-y-3 transition ${
                    isUnlocked
                      ? "bg-gradient-to-b from-indigo-50/60 to-white border-indigo-200 text-slate-900 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-500 opacity-80"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`p-2.5 rounded-xl ${
                      isUnlocked ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {isUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {ms.requiredPoints} {rewardLabel}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 leading-snug">{ms.title}</h4>
                    <p className="text-[11px] text-slate-600 mt-1 font-mono break-all font-semibold">{ms.rewardValue}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className={isUnlocked ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                      {isUnlocked ? '✓ Unlocked' : 'Locked'}
                    </span>
                    {isUnlocked && ms.rewardType === 'discount_code' && (
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(ms.rewardValue);
                          alert(`Copied discount code: ${ms.rewardValue}`);
                        }}
                        className="text-indigo-600 hover:underline text-[10px] font-bold"
                      >
                        Copy Code
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dynamic Leaderboard Drawer */}
      {campaign.showLeaderboard && (
        <div className="border border-slate-200/90 bg-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl shadow-slate-900/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Live Campaign Leaderboard</h3>
                <p className="text-xs text-slate-600 font-medium">Top participants ranked by total entries</p>
              </div>
            </div>
            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="inline-flex items-center gap-1 text-xs text-indigo-700 hover:text-indigo-800 font-bold bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200"
            >
              {showLeaderboard ? (
                <>Hide <ChevronUp className="w-3.5 h-3.5" /></>
              ) : (
                <>Show Top 10 <ChevronDown className="w-3.5 h-3.5" /></>
              )}
            </button>
          </div>

          {showLeaderboard && (
            <div className="mt-4 divide-y divide-slate-100 border-t border-slate-100 pt-2">
              {sortedSubscribers.slice(0, campaign.leaderboardCount || 10).map((item, idx) => {
                const isUser = item.id === subscriber.id;
                const displayName = campaign.anonymizeLeaderboard 
                  ? (isUser ? `${item.name} (You)` : `${item.name.split(' ')[0]} ${item.name.split(' ')[1] ? item.name.split(' ')[1][0] + '.' : ''}`)
                  : item.name;

                return (
                  <div
                    key={item.id}
                    className={`py-3 px-3 rounded-xl flex items-center justify-between text-xs transition ${
                      isUser 
                        ? "bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold" 
                        : "text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-black ${
                        idx === 0 ? "bg-amber-400 text-amber-950" :
                        idx === 1 ? "bg-slate-200 text-slate-900" :
                        idx === 2 ? "bg-amber-600 text-white" :
                        "text-slate-600 bg-slate-100"
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{displayName}</span>
                        {isUser && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-200 text-indigo-900 uppercase font-black">
                            You
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-slate-500 text-[11px] hidden sm:inline">
                        {item.referralCount} referrals
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        {item.totalEntries} {rewardLabel.toLowerCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {activeActionModal && (
        <ActionModal
          action={activeActionModal}
          campaign={campaign}
          referralLink={referralLink}
          onClose={() => setActiveActionModal(null)}
          onComplete={(actionId, reward) => {
            onActionCompleted(actionId, reward);
            setActiveActionModal(null);
          }}
        />
      )}

      {showQRModal && (
        <QRCodeModal
          referralLink={referralLink}
          campaignTitle={campaign.title}
          onClose={() => setShowQRModal(false)}
        />
      )}

      {showVerifierModal && (
        <CryptographicVerifierModal
          onClose={() => setShowVerifierModal(false)}
        />
      )}

      {showNotificationDrawer && (
        <NotificationPreviewDrawer
          campaign={campaign}
          subscriber={subscriber}
          onClose={() => setShowNotificationDrawer(false)}
        />
      )}

    </div>
  );
};
