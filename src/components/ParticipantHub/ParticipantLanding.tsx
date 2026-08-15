import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  Users, 
  ShieldCheck, 
  Flame, 
  Lock,
  Calendar
} from 'lucide-react';
import { Campaign } from '../../types';
import { triggerHapticFeedback } from '../../utils/haptics';

interface ParticipantLandingProps {
  campaign: Campaign;
  referrerCode?: string;
  onJoinSuccess: (name: string, email: string, referrerCode?: string) => void;
  onOpenRules: () => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

export const ParticipantLanding: React.FC<ParticipantLandingProps> = ({
  campaign,
  referrerCode = "ALEX77",
  onJoinSuccess,
  onOpenRules,
  onOpenPrivacy,
  onOpenTerms
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [refCodeInput, setRefCodeInput] = useState(referrerCode);
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHapticFeedback('medium');
    if (!name.trim() || !email.trim()) {
      setErrorMessage('Please enter both your name and email address.');
      triggerHapticFeedback('warning');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      triggerHapticFeedback('warning');
      return;
    }
    if (!acceptedTerms) {
      setErrorMessage('Please agree to the official sweepstakes rules.');
      triggerHapticFeedback('warning');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onJoinSuccess(name.trim(), email.trim(), refCodeInput.trim() || undefined);
    }, 600);
  };

  const rewardLabel = campaign.campaignType === 'milestone_points' ? 'Points' : 'Entries';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner & Countdown */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        <div 
          className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: campaign.theme.primaryColor }}
        />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Official Verified Giveaway
            </div>
            
            <h1 
              className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight"
              style={{ fontFamily: campaign.theme.headlineFont }}
            >
              {campaign.headline}
            </h1>
            
            <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed font-medium">
              {campaign.description}
            </p>

            {referrerCode && (
              <div className="inline-flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-semibold">
                <Users className="w-3.5 h-3.5 text-emerald-600" /> Invited by friend code: <strong className="font-mono text-emerald-900">{referrerCode}</strong> (+5 bonus entries applied)
              </div>
            )}
          </div>

          {/* Countdown Clock */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-2.5 shrink-0 shadow-inner">
            <div className="text-center px-2 sm:px-3">
              <span className="block text-2xl sm:text-3xl font-black text-indigo-600 font-mono">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Days</span>
            </div>
            <span className="text-slate-300 font-bold pb-4 text-xl">:</span>
            <div className="text-center px-2 sm:px-3">
              <span className="block text-2xl sm:text-3xl font-black text-indigo-600 font-mono">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Hours</span>
            </div>
            <span className="text-slate-300 font-bold pb-4 text-xl">:</span>
            <div className="text-center px-2 sm:px-3">
              <span className="block text-2xl sm:text-3xl font-black text-indigo-600 font-mono">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Mins</span>
            </div>
            <span className="text-slate-300 font-bold pb-4 text-xl">:</span>
            <div className="text-center px-2 sm:px-3">
              <span className="block text-2xl sm:text-3xl font-black text-amber-500 font-mono">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Secs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Showcase & Registration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Grand Prize Visual */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white group shadow-lg">
            <div className="h-64 sm:h-80 w-full overflow-hidden relative">
              <img
                src={campaign.prizeImageUrl}
                alt={campaign.prizeTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              
              <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <Trophy className="w-4 h-4" /> GRAND PRIZE
              </div>

              <div className="absolute top-4 right-4 bg-white/95 text-slate-900 border border-slate-200 text-xs font-extrabold px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-md">
                ${campaign.prizeValueUsd.toLocaleString()} USD Value
              </div>
            </div>

            <div className="p-6 sm:p-8 -mt-14 relative z-10 space-y-3 bg-white/95 backdrop-blur-md border-t border-slate-100 rounded-b-3xl">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {campaign.prizeTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {campaign.prizeDescription}
              </p>
              
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Live draw: {new Date(campaign.drawDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-600" />
                  {campaign.winnerCount} Guaranteed Winner{campaign.winnerCount > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Viral Mechanics Explanation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm mb-2">
                1
              </div>
              <h4 className="text-xs font-extrabold text-slate-900 mb-1">Enter In 10 Seconds</h4>
              <p className="text-[11px] text-slate-600 font-medium">Enter your name & email to instantly earn your first draw ticket.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm mb-2">
                2
              </div>
              <h4 className="text-xs font-extrabold text-slate-900 mb-1">Share Your Link</h4>
              <p className="text-[11px] text-slate-600 font-medium">Get +{campaign.referralRewardEntries} bonus {rewardLabel.toLowerCase()} every time a friend signs up with your link.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm mb-2">
                3
              </div>
              <h4 className="text-xs font-extrabold text-slate-900 mb-1">Complete Actions</h4>
              <p className="text-[11px] text-slate-600 font-medium">Watch videos, share on WhatsApp/X, and join communities for extra odds.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 relative backdrop-blur-xl">
            <div className="space-y-1 mb-6">
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" /> Join The Giveaway
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                100% Free. Instant participation & verifiable draw ticket.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>Referral Code (Optional)</span>
                  {referrerCode && <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold">Applied</span>}
                </label>
                <input
                  type="text"
                  placeholder="e.g. FRIEND2026"
                  value={refCodeInput}
                  onChange={(e) => setRefCodeInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-4 text-xs font-mono font-bold text-slate-800 uppercase focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 bg-white text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-600 leading-tight font-medium">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={onOpenRules}
                      className="text-indigo-600 hover:underline font-bold"
                    >
                      Official Rules
                    </button>
                    ,{' '}
                    <button
                      type="button"
                      onClick={onOpenTerms || onOpenRules}
                      className="text-indigo-600 hover:underline font-bold"
                    >
                      Terms & Conditions
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      onClick={onOpenPrivacy || onOpenRules}
                      className="text-indigo-600 hover:underline font-bold"
                    >
                      Privacy Policy
                    </button>
                    . No purchase necessary.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 font-extrabold text-sm py-3.5 px-6 rounded-xl text-white transition shadow-lg active:scale-98"
                style={{
                  backgroundColor: campaign.theme.primaryColor,
                  boxShadow: `0 10px 25px -5px ${campaign.theme.primaryColor}55`
                }}
              >
                {isSubmitting ? (
                  <>Securing Your Spot...</>
                ) : (
                  <>
                    Enter Giveaway Now <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Trust Footer */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Anti-fraud protected
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                Zero spam guarantee
              </span>
            </div>
          </div>

          {/* Social Proof Box */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="flex -space-x-2 overflow-hidden">
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                AJ
              </div>
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold">
                MV
              </div>
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-amber-600 flex items-center justify-center text-white text-[10px] font-bold">
                SC
              </div>
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                +1k
              </div>
            </div>
            <div className="text-xs">
              <p className="font-extrabold text-slate-900">
                {campaign.stats.totalSubscribers.toLocaleString()} Active Competitors
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                {campaign.stats.totalReferrals.toLocaleString()} referrals logged so far
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
