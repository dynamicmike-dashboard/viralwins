import React, { useState } from 'react';
import { 
  Mail, 
  Bell, 
  Send, 
  Sparkles, 
  Check, 
  Flame, 
  Trophy, 
  Gift, 
  ExternalLink,
  ChevronRight,
  Smartphone
} from 'lucide-react';
import { Campaign, Subscriber } from '../../types';
import { triggerHapticFeedback } from '../../utils/haptics';

interface NotificationPreviewDrawerProps {
  campaign: Campaign;
  subscriber: Subscriber;
  onClose: () => void;
}

export const NotificationPreviewDrawer: React.FC<NotificationPreviewDrawerProps> = ({
  campaign,
  subscriber,
  onClose
}) => {
  const [activeChannel, setActiveChannel] = useState<'email' | 'push' | 'sms'>('email');
  const [templateType, setTemplateType] = useState<'welcome' | 'referral_success' | 'milestone_unlocked' | 'draw_winner'>('referral_success');

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://launch.app';
  const referralLink = `${origin}/c/${campaign.slug}?ref=${subscriber.referralCode}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                Automated Entrant Notifications
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Live preview of transactional email, SMS receipts, and PWA push notifications
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Channel & Template Switchers */}
        <div className="pt-4 space-y-3">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => {
                triggerHapticFeedback('light');
                setActiveChannel('email');
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${
                activeChannel === 'email' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" /> Email Dispatch
            </button>

            <button
              onClick={() => {
                triggerHapticFeedback('light');
                setActiveChannel('push');
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${
                activeChannel === 'push' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bell className="w-3.5 h-3.5" /> PWA Push Alert
            </button>

            <button
              onClick={() => {
                triggerHapticFeedback('light');
                setActiveChannel('sms');
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${
                activeChannel === 'sms' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> SMS Blast
            </button>
          </div>

          {/* Trigger Event Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setTemplateType('welcome')}
              className={`px-3 py-1 rounded-lg font-bold border transition shrink-0 ${
                templateType === 'welcome' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              🎉 Welcome Entry
            </button>

            <button
              onClick={() => setTemplateType('referral_success')}
              className={`px-3 py-1 rounded-lg font-bold border transition shrink-0 ${
                templateType === 'referral_success' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              🔥 Friend Joined (+{campaign.referralRewardEntries} Tickets)
            </button>

            <button
              onClick={() => setTemplateType('milestone_unlocked')}
              className={`px-3 py-1 rounded-lg font-bold border transition shrink-0 ${
                templateType === 'milestone_unlocked' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              🏆 Milestone Unlocked
            </button>

            <button
              onClick={() => setTemplateType('draw_winner')}
              className={`px-3 py-1 rounded-lg font-bold border transition shrink-0 ${
                templateType === 'draw_winner' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              👑 Winner Claim Claim
            </button>
          </div>
        </div>

        {/* Live Rendering Preview Container */}
        <div className="flex-1 overflow-y-auto py-4">
          
          {activeChannel === 'email' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="bg-slate-100 p-3 border-b border-slate-200 text-xs space-y-1">
                <div><span className="font-bold text-slate-500">From:</span> {campaign.clientName} &lt;notifications@viralengine.io&gt;</div>
                <div><span className="font-bold text-slate-500">To:</span> {subscriber.name} &lt;{subscriber.email}&gt;</div>
                <div>
                  <span className="font-bold text-slate-500">Subject: </span> 
                  <strong className="text-slate-900">
                    {templateType === 'welcome' && `You're in! Here is your official pass for ${campaign.title}`}
                    {templateType === 'referral_success' && `🔥 Boom! A friend just joined with your link (+${campaign.referralRewardEntries} Tickets)`}
                    {templateType === 'milestone_unlocked' && `🎉 Congratulations! You unlocked the VIP Milestone Reward`}
                    {templateType === 'draw_winner' && `👑 URGENT: You won the ${campaign.prizeTitle}!`}
                  </strong>
                </div>
              </div>

              <div className="p-6 bg-white space-y-4 text-xs text-slate-700 leading-relaxed">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-black text-sm text-slate-900">{campaign.clientName}</span>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">Official Notification</span>
                </div>

                <p>Hey <strong>{subscriber.name}</strong>,</p>

                {templateType === 'referral_success' && (
                  <>
                    <p>
                      Great news! One of your friends just joined the <strong>{campaign.title}</strong> using your personal invite link.
                    </p>
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-emerald-900">Reward Added:</span>
                        <span className="font-mono font-black text-emerald-700">+{campaign.referralRewardEntries} Extra Draw Tickets</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-emerald-800">
                        <span>Your New Ticket Total:</span>
                        <span className="font-mono font-bold">{subscriber.totalEntries + campaign.referralRewardEntries} Tickets</span>
                      </div>
                    </div>
                  </>
                )}

                {templateType === 'welcome' && (
                  <>
                    <p>
                      Welcome to the <strong>{campaign.title}</strong>! You have officially secured your first entry into the grand prize draw.
                    </p>
                    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1">
                      <span className="font-bold text-indigo-900 block">Your Exclusive Referral Link:</span>
                      <code className="text-[11px] text-indigo-700 font-mono break-all">{referralLink}</code>
                    </div>
                  </>
                )}

                {templateType === 'milestone_unlocked' && (
                  <>
                    <p>
                      You crushed another milestone! Your reward is unlocked and ready to claim:
                    </p>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-center">
                      <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Unlocked Perk</span>
                      <div className="text-sm font-black text-amber-900 font-mono">PROMO-VIP-25-OFF</div>
                    </div>
                  </>
                )}

                {templateType === 'draw_winner' && (
                  <>
                    <p className="font-bold text-rose-600">
                      Congratulations! Your ticket was selected in our provably fair SHA-256 draw!
                    </p>
                    <p>
                      Please reply to this email or visit your portal within {campaign.claimDeadlineDays} days to claim the prize delivery.
                    </p>
                  </>
                )}

                <div className="pt-2 text-center">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs shadow-md"
                  >
                    View Your Campaign Hub
                  </a>
                </div>

                <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center">
                  {campaign.agencyName} • Automated Campaign Infrastructure Provider • No Purchase Necessary
                </div>
              </div>
            </div>
          )}

          {activeChannel === 'push' && (
            <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-3 shadow-md max-w-md mx-auto">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 font-bold">
                  <Bell className="w-3.5 h-3.5 text-indigo-400" /> {campaign.clientName}
                </span>
                <span>Just now</span>
              </div>
              <p className="text-xs font-bold text-slate-100">
                {templateType === 'referral_success' && `🔥 +${campaign.referralRewardEntries} Tickets Added! A friend just entered with your referral code.`}
                {templateType === 'welcome' && `🎉 You're entered! Complete 3 quick tasks to boost your odds 5x.`}
                {templateType === 'milestone_unlocked' && `🏆 Milestone unlocked! Tap to reveal your reward code.`}
                {templateType === 'draw_winner' && `👑 WINNER ALERT: You won the ${campaign.prizeTitle}!`}
              </p>
            </div>
          )}

          {activeChannel === 'sms' && (
            <div className="bg-slate-100 p-4 rounded-2xl max-w-sm mx-auto space-y-2 border border-slate-200 text-xs text-slate-800 font-sans">
              <div className="bg-emerald-600 text-white p-3 rounded-2xl rounded-bl-xs leading-relaxed space-y-1 shadow-2xs">
                <p>
                  {campaign.clientName}: +{campaign.referralRewardEntries} tickets added to your account! You now have {subscriber.totalEntries + campaign.referralRewardEntries} entries for the {campaign.prizeTitle}. Track live: {referralLink}
                </p>
                <span className="text-[9px] opacity-75 block text-right">Delivered</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
          >
            Close Preview
          </button>
        </div>

      </div>
    </div>
  );
};
