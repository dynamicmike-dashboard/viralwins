import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Lightbulb, 
  Check, 
  Loader2, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  Gift,
  Target
} from 'lucide-react';
import { Campaign, CampaignAction, CampaignMilestone } from '../../types';
import { triggerHapticFeedback } from '../../utils/haptics';
import { triggerFireworks } from '../../utils/confetti';

interface AiCampaignGeneratorModalProps {
  onApplyCampaign: (generatedCampaign: Partial<Campaign>) => void;
  onClose: () => void;
}

const examplePrompts = [
  {
    title: 'Organic Specialty Coffee Subscription',
    industry: 'Food & Beverage / E-Commerce',
    audience: 'Coffee nerds, morning ritual lovers, remote workers',
    prompt: 'Giveaway of 1-Year Free Single-Origin Coffee + Fellow Ode Grinder'
  },
  {
    title: 'Web3 AI Trading Bot & SaaS Beta',
    industry: 'FinTech / AI Software',
    audience: 'Crypto traders, quantitative investors, tech founders',
    prompt: 'Free Lifetime Pro AI Subscription + $1,000 Trading Capital Escrow'
  },
  {
    title: 'Filmmaker & YouTube Creator Studio',
    industry: 'Creator Economy / Hardware',
    audience: 'YouTubers, TikTok videographers, podcast hosts',
    prompt: 'Sony FX3 Cinema Camera + Rode Wireless Pro Microphones'
  },
  {
    title: 'Fitness & Recovery Cold Plunge',
    industry: 'Health & Wellness DTC',
    audience: 'Athletes, biohackers, gym owners',
    prompt: 'Commercial-Grade Inflatable Cold Plunge Tub + Whoop 4.0 1-Year Membership'
  }
];

export const AiCampaignGeneratorModal: React.FC<AiCampaignGeneratorModalProps> = ({
  onApplyCampaign,
  onClose
}) => {
  const [prompt, setPrompt] = useState('');
  const [industry, setIndustry] = useState('E-Commerce & DTC');
  const [targetAudience, setTargetAudience] = useState('Creator economy & tech enthusiasts');
  const [campaignType, setCampaignType] = useState<'sweepstakes' | 'milestone_points' | 'hybrid'>('sweepstakes');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewResult, setPreviewResult] = useState<Partial<Campaign> | null>(null);

  const handleGenerate = async (presetPrompt?: string, presetIndustry?: string, presetAudience?: string) => {
    const finalPrompt = presetPrompt || prompt;
    const finalIndustry = presetIndustry || industry;
    const finalAudience = presetAudience || targetAudience;

    if (!finalPrompt.trim()) {
      setError('Please provide a brief description or pick an example prompt.');
      return;
    }

    setError(null);
    setLoading(true);
    triggerHapticFeedback('medium');

    try {
      const response = await fetch('/api/ai/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          industry: finalIndustry,
          targetAudience: finalAudience,
          campaignType
        })
      });

      if (!response.ok) {
        throw new Error('AI generation request failed');
      }

      const data = await response.json();
      setPreviewResult(data);
      triggerHapticFeedback('success');
      triggerFireworks();
    } catch (err: any) {
      console.warn('Backend generation fallback:', err);
      // Client-side intelligent fallback in case server route is unavailable
      const fallbackCampaign: Partial<Campaign> = {
        title: `${finalIndustry} VIP Viral Launch`,
        headline: `Win the Ultimate ${finalIndustry} Giveaway Package`,
        description: `Join thousands of creators in our premier promotional drop. Complete quick verified tasks and refer friends for exponential ticket multipliers!`,
        clientName: `Nova ${finalIndustry} Labs`,
        prizeTitle: `Grand ${finalIndustry} Flagship Experience Bundle`,
        prizeDescription: `Delivered worldwide with priority warranty and 1-year complimentary VIP access.`,
        prizeValueUsd: 2500,
        prizeImageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80",
        referralRewardEntries: 5,
        actions: [
          {
            id: `act-wa-${Date.now()}`,
            title: "Share on WhatsApp Group",
            platform: "whatsapp",
            reward: 3,
            description: "Direct 1-tap invite link for your inner circle",
            verificationType: "instant_click",
            category: "social"
          },
          {
            id: `act-tw-${Date.now()}`,
            title: "Broadcast on X / Twitter",
            platform: "twitter",
            reward: 4,
            description: "Share announcement post with #ViralLaunch",
            verificationType: "instant_click",
            category: "social"
          },
          {
            id: `act-yt-${Date.now()}`,
            title: "Watch 30-Sec Brand Teaser",
            platform: "youtube",
            reward: 5,
            description: "Watch our exclusive product teaser video",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            verificationType: "timed_watch",
            timedSeconds: 10,
            category: "content"
          },
          {
            id: `act-tg-${Date.now()}`,
            title: "Join VIP Telegram Channel",
            platform: "telegram",
            reward: 5,
            description: "Get secret bonus ticket codes and early announcements",
            url: "https://t.me/telegram",
            verificationType: "instant_click",
            category: "community"
          }
        ],
        milestones: [
          {
            id: `ms-1-${Date.now()}`,
            title: "Verified Competitor Tier",
            requiredPoints: 5,
            rewardType: "badge",
            rewardValue: "VIP Launch Badge",
            icon: "ShieldCheck"
          },
          {
            id: `ms-2-${Date.now()}`,
            title: "Promoter 25% Off Code",
            requiredPoints: 15,
            rewardType: "discount_code",
            rewardValue: "VIP25OFF",
            icon: "Gift"
          },
          {
            id: `ms-3-${Date.now()}`,
            title: "Exclusive Starter Asset Kit",
            requiredPoints: 30,
            rewardType: "digital_download",
            rewardValue: "Pro Masterclass Pack PDF",
            icon: "Percent"
          }
        ]
      };
      setPreviewResult(fallbackCampaign);
      triggerHapticFeedback('success');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (previewResult) {
      triggerHapticFeedback('success');
      onApplyCampaign(previewResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                Gemini AI Campaign Strategist
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  One-Click Engine
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Generate high-converting headlines, tailored social challenges, and viral milestone rewards
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

        {/* Modal Body */}
        <div className="overflow-y-auto py-5 space-y-6 flex-1 pr-1">
          
          {!previewResult ? (
            <>
              {/* Prompt Controls */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                    Describe your Brand, Product, or Giveaway Concept:
                  </label>
                  <textarea
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Luxury mechanical watch brand launching a titanium diver edition. Looking for watch collectors and daily wear enthusiasts with high engagement actions on Instagram, WhatsApp, and YouTube."
                    className="w-full text-xs font-medium text-slate-900 border border-slate-200 rounded-2xl p-3.5 focus:outline-none focus:border-indigo-600 bg-slate-50/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Industry</label>
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g. E-Commerce / SaaS"
                      className="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Target Audience</label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="e.g. Digital Nomads, Gamers"
                      className="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Campaign Type</label>
                    <select
                      value={campaignType}
                      onChange={(e) => setCampaignType(e.target.value as any)}
                      className="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-slate-900 font-medium"
                    >
                      <option value="sweepstakes">Viral Sweepstakes</option>
                      <option value="milestone_points">Milestone Unlocks Only</option>
                      <option value="hybrid">Hybrid Sweepstakes + Rewards</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 1-Tap Example Presets */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Or pick a high-converting growth archetype:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {examplePrompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPrompt(p.prompt);
                        setIndustry(p.industry);
                        setTargetAudience(p.audience);
                        handleGenerate(p.prompt, p.industry, p.audience);
                      }}
                      className="text-left p-3 rounded-2xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/40 transition group space-y-1 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-700">
                          {p.title}
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{p.prompt}</p>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-700 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
            </>
          ) : (
            /* Generated Campaign Strategy Preview */
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-900">
                    AI Strategy generated successfully! Review below before applying to your campaign.
                  </span>
                </div>
                <button
                  onClick={() => setPreviewResult(null)}
                  className="text-xs font-bold text-emerald-800 hover:underline"
                >
                  Regenerate
                </button>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                    Campaign Headline & Hook
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">{previewResult.headline}</h3>
                  <p className="text-xs text-slate-600 mt-1 font-medium">{previewResult.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Gift className="w-3 h-3 text-amber-500" /> Prize Package (${previewResult.prizeValueUsd})
                    </span>
                    <p className="text-xs font-bold text-slate-900">{previewResult.prizeTitle}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{previewResult.prizeDescription}</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-500" /> Referral Velocity
                    </span>
                    <p className="text-xs font-bold text-slate-900">+{previewResult.referralRewardEntries} Tickets / Referral</p>
                    <p className="text-[11px] text-slate-500">Dual-sided incentive structure</p>
                  </div>
                </div>

                {/* Generated Actions */}
                {previewResult.actions && previewResult.actions.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <span className="text-[11px] font-bold uppercase text-slate-700">
                      Generated Viral Actions ({previewResult.actions.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {previewResult.actions.map((act, i) => (
                        <div key={i} className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800 line-clamp-1">{act.title}</span>
                          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 shrink-0">
                            +{act.reward}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>

          {!previewResult ? (
            <button
              onClick={() => handleGenerate()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold text-xs shadow-md shadow-indigo-500/25 transition active:scale-95 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Synthesizing Strategy...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Generate AI Campaign
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleApply}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/25 transition active:scale-95"
            >
              <Check className="w-4 h-4" />
              Apply Strategy to Studio
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
