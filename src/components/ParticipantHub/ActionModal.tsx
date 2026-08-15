import React, { useState, useEffect } from 'react';
import { 
  X, 
  Youtube, 
  ExternalLink, 
  CheckCircle2, 
  Play, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  Send,
  Share2
} from 'lucide-react';
import { CampaignAction, Campaign } from '../../types';
import { triggerActionReward } from '../../utils/confetti';
import { triggerHapticFeedback } from '../../utils/haptics';

interface ActionModalProps {
  action: CampaignAction;
  campaign: Campaign;
  referralLink: string;
  onClose: () => void;
  onComplete: (actionId: string, reward: number) => void;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  action,
  campaign,
  referralLink,
  onClose,
  onComplete
}) => {
  const isVideo = action.verificationType === 'timed_watch' || action.platform === 'youtube';
  const duration = action.timedSeconds || 10;
  
  const [secondsRemaining, setSecondsRemaining] = useState(duration);
  const [isPlaying, setIsPlaying] = useState(isVideo);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVideo && isPlaying && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoVerify();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isVideo, isPlaying, secondsRemaining]);

  const handleAutoVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsCompleted(true);
      triggerHapticFeedback('success');
      triggerActionReward();
      setTimeout(() => {
        onComplete(action.id, action.reward);
        onClose();
      }, 1200);
    }, 1000);
  };

  const handleManualAction = () => {
    triggerHapticFeedback('medium');
    let targetUrl = action.url || '';
    const shareMessage = encodeURIComponent(
      `Join the ${campaign.prizeTitle} giveaway with me! Free entry here: `
    );

    if (action.platform === 'whatsapp') {
      targetUrl = `https://api.whatsapp.com/send?text=${shareMessage}${encodeURIComponent(referralLink)}`;
    } else if (action.platform === 'twitter') {
      targetUrl = `https://twitter.com/intent/tweet?text=${shareMessage}&url=${encodeURIComponent(referralLink)}`;
    } else if (action.platform === 'linkedin') {
      targetUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`;
    }

    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }

    handleAutoVerify();
  };

  const rewardLabel = campaign.campaignType === 'milestone_points' ? 'Points' : 'Entries';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={() => {
            triggerHapticFeedback('light');
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className={`p-3 rounded-2xl ${
            action.platform === 'youtube' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
            action.platform === 'whatsapp' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
            action.platform === 'twitter' ? 'bg-sky-50 text-sky-600 border border-sky-200' :
            action.platform === 'telegram' ? 'bg-cyan-50 text-cyan-600 border border-cyan-200' :
            'bg-indigo-50 text-indigo-600 border border-indigo-200'
          }`}>
            {action.platform === 'youtube' && <Youtube className="w-6 h-6" />}
            {action.platform === 'whatsapp' && <Send className="w-6 h-6" />}
            {action.platform === 'twitter' && <Share2 className="w-6 h-6" />}
            {action.platform === 'telegram' && <Send className="w-6 h-6" />}
            {action.platform === 'linkedin' && <Share2 className="w-6 h-6" />}
            {action.platform === 'newsletter' && <Sparkles className="w-6 h-6" />}
            {action.platform === 'custom_link' && <ExternalLink className="w-6 h-6" />}
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              Bonus Action • +{action.reward} {rewardLabel}
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
              {action.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 font-medium mb-6">
          {action.description}
        </p>

        {/* Video Player Simulator */}
        {isVideo ? (
          <div className="space-y-4 mb-6">
            <div className="relative aspect-video rounded-2xl bg-slate-900 border border-slate-200 overflow-hidden flex flex-col items-center justify-center group shadow-md">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/60 via-slate-900/60 to-slate-950 opacity-90" />
              
              <div className="relative z-10 text-center px-4">
                <div className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-rose-600/30 animate-pulse">
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                </div>
                <p className="text-xs font-bold text-white">
                  {campaign.prizeTitle}
                </p>
                <p className="text-[11px] text-slate-300">
                  Official Teaser & Product Overview
                </p>
              </div>

              {/* Progress Bar Overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-800">
                <div 
                  className="h-full bg-rose-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${((duration - secondsRemaining) / duration) * 100}%` }}
                />
              </div>
            </div>

            {/* Verification Status */}
            <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl font-semibold">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                {secondsRemaining > 0 ? (
                  <>Watch verification: <strong className="text-amber-600 font-mono">{secondsRemaining}s</strong> remaining</>
                ) : (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verification complete!
                  </span>
                )}
              </span>
              <span className="text-[11px] text-slate-400">Auto-validating</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 text-xs text-slate-700 space-y-2 font-medium">
              <div className="flex items-center gap-2 font-bold text-indigo-900">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                Instant Anti-Fraud Verification
              </div>
              <p className="text-slate-600">
                Clicking the button below will open the target destination in a new tab and credit your campaign entries upon verification.
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              triggerHapticFeedback('light');
              onClose();
            }}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition"
          >
            Cancel
          </button>

          {!isVideo ? (
            <button
              onClick={handleManualAction}
              disabled={isVerifying || isCompleted}
              className="flex-2 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-md shadow-indigo-600/25"
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" /> Done!
                </>
              ) : isVerifying ? (
                <>Verifying action...</>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4" /> Open & Claim +{action.reward} {rewardLabel}
                </>
              )}
            </button>
          ) : (
            <button
              disabled={secondsRemaining > 0 || isVerifying || isCompleted}
              onClick={handleAutoVerify}
              className={`flex-2 inline-flex items-center justify-center gap-2 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-md ${
                secondsRemaining > 0 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Reward Claimed!
                </>
              ) : secondsRemaining > 0 ? (
                <>Watching video ({secondsRemaining}s)...</>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Claim +{action.reward} {rewardLabel}
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
