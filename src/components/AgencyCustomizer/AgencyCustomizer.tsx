import React, { useState } from 'react';
import {
  Sliders,
  Palette,
  Type,
  Trophy,
  Gift,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Layers,
  Settings,
  Eye,
  Check,
  RotateCcw,
  Scale,
  ShieldCheck,
  LifeBuoy,
  FileText,
  Building2,
  AlertTriangle,
  Mail,
  FileCode,
  ExternalLink,
  Wand2,
  Copy,
  Disc3
} from 'lucide-react';
import { Campaign, CampaignAction, CampaignMilestone, CampaignType, CampaignLegalSettings, SpinWheelConfig } from '../../types';
import { DevicePreviewFrame, DeviceMode } from './DevicePreviewFrame';
import { ParticipantDashboard } from '../ParticipantHub/ParticipantDashboard';
import { ParticipantLanding } from '../ParticipantHub/ParticipantLanding';
import { PrivacyPolicyModal } from '../Legal/PrivacyPolicyModal';
import { TermsConditionsModal } from '../Legal/TermsConditionsModal';
import { ComplaintsModal } from '../Legal/ComplaintsModal';
import { OfficialRulesModal } from '../ParticipantHub/OfficialRulesModal';
import { AiCampaignGeneratorModal } from './AiCampaignGeneratorModal';
import { SpinWheelEditor } from '../SpinWheel/SpinWheelEditor';
import { SpinWheelWidget } from '../SpinWheel/SpinWheelWidget';
import { mockSubscribers } from '../../data/mockData';
import { triggerHapticFeedback } from '../../utils/haptics';

interface AgencyCustomizerProps {
  campaign: Campaign;
  onUpdateCampaign: (updated: Campaign) => void;
}

const colorPresets = [
  { name: 'Indigo Aura', hex: '#4F46E5' },
  { name: 'Emerald Mint', hex: '#059669' },
  { name: 'Amber Gold', hex: '#D97706' },
  { name: 'Rose Coral', hex: '#E11D48' },
  { name: 'Violet Luxe', hex: '#7C3AED' },
  { name: 'Cyan Tech', hex: '#0891B2' },
  { name: 'Sky Electric', hex: '#0284C7' }
];

const fontPresets = [
  { name: 'Plus Jakarta Sans (Modern Clean)', value: 'Plus Jakarta Sans' },
  { name: 'Syne (Neo-Brutalist & Bold)', value: 'Syne' },
  { name: 'Outfit (Trendy Tech)', value: 'Outfit' },
  { name: 'Inter (SaaS Standard)', value: 'Inter' },
  { name: 'JetBrains Mono (Developer)', value: 'JetBrains Mono' },
  { name: 'Playfair Display (Luxury & Editorial)', value: 'Playfair Display' }
];

const prizeImagePresets = [
  {
    title: "Creator Tech Studio Bundle",
    url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Cyber AI Hardware & Pro Workstation",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Luxury Travel & Flights Experience",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Cash & Crypto Hardware Wallet Giveaway",
    url: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80"
  }
];

export const AgencyCustomizer: React.FC<AgencyCustomizerProps> = ({
  campaign,
  onUpdateCampaign
}) => {
  const [activeTab, setActiveTab] = useState<'theme' | 'prize' | 'actions' | 'milestones' | 'wheel' | 'legal'>('theme');
  const [previewState, setPreviewState] = useState<'landing' | 'hub'>('hub');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');

  // Interactive Live Preview Modal from Promoter Dashboard
  const [previewModal, setPreviewModal] = useState<'privacy' | 'terms' | 'complaints' | 'rules' | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);

  const handleCampaignFieldChange = <K extends keyof Campaign>(field: K, value: Campaign[K]) => {
    onUpdateCampaign({
      ...campaign,
      [field]: value
    });
  };

  const handleThemeChange = <K extends keyof Campaign['theme']>(field: K, value: Campaign['theme'][K]) => {
    onUpdateCampaign({
      ...campaign,
      theme: {
        ...campaign.theme,
        [field]: value
      }
    });
  };

  const handleCampaignTypeChange = (type: CampaignType) => {
    const patch: Partial<Campaign> = { campaignType: type };
    if (type === 'spin_wheel' && !campaign.spinWheel) {
      patch.spinWheel = {
        title: 'Spin & Win Big!',
        description: 'One free spin for every entrant. Prizes change weekly — try your luck!',
        segments: [
          { id: 's1', label: '10% OFF' },
          { id: 's2', label: 'Free Shipping' },
          { id: 's3', label: 'Try Again' },
          { id: 's4', label: '$5 Gift Card' },
          { id: 's5', label: '20% OFF' },
          { id: 's6', label: 'Almost!' },
        ],
        buttonLabel: 'SPIN TO WIN',
        resultMessage: 'You landed on',
      };
    }
    onUpdateCampaign({ ...campaign, ...patch });
  };

  const handleLegalChange = <K extends keyof CampaignLegalSettings>(field: K, value: CampaignLegalSettings[K]) => {
    const currentLegal: CampaignLegalSettings = campaign.legalSettings || {
      useCustomPrivacyPolicy: false,
      customPrivacyPolicyText: '',
      useCustomTermsConditions: false,
      customTermsConditionsText: '',
      useCustomOfficialRules: false,
      customOfficialRulesText: '',
      useCustomComplaintsPolicy: false,
      customComplaintsEmail: `support@${campaign.slug.replace(/[^a-zA-Z0-9]/g, '') || 'promoter'}.com`,
      customComplaintsInstructions: '',
      promoterLegalDisclaimer: `${campaign.clientName} is solely responsible for prize fulfillment and campaign administration.`,
      promoterJurisdiction: 'Delaware, United States',
      platformNonLiabilityNotice: `${campaign.clientName} operates this promotion independently. ViralWins is strictly a software technology provider and is not liable for any losses, unfulfilled prizes, or dispute outcomes.`
    };

    onUpdateCampaign({
      ...campaign,
      legalSettings: {
        ...currentLegal,
        [field]: value
      }
    });
  };

  // Action Handlers
  const handleAddAction = () => {
    triggerHapticFeedback('light');
    const newAction: CampaignAction = {
      id: `act-${Date.now()}`,
      title: "New Viral Action",
      platform: "twitter",
      reward: 3,
      description: "Perform this bonus action to earn extra entries",
      verificationType: "instant_click",
      category: "social"
    };
    handleCampaignFieldChange('actions', [...campaign.actions, newAction]);
  };

  const handleUpdateAction = (id: string, updated: Partial<CampaignAction>) => {
    const nextActions = campaign.actions.map(a => a.id === id ? { ...a, ...updated } : a);
    handleCampaignFieldChange('actions', nextActions);
  };

  const handleDeleteAction = (id: string) => {
    triggerHapticFeedback('warning');
    handleCampaignFieldChange('actions', campaign.actions.filter(a => a.id !== id));
  };

  // Milestone Handlers
  const handleAddMilestone = () => {
    triggerHapticFeedback('light');
    const newMilestone: CampaignMilestone = {
      id: `ms-${Date.now()}`,
      title: "Tier Unlock",
      requiredPoints: (campaign.milestones.length + 1) * 15,
      rewardType: "discount_code",
      rewardValue: "PROMO-BONUS-2026",
      icon: "Gift"
    };
    handleCampaignFieldChange('milestones', [...campaign.milestones, newMilestone]);
  };

  const handleUpdateMilestone = (id: string, updated: Partial<CampaignMilestone>) => {
    const nextMilestones = campaign.milestones.map(m => m.id === id ? { ...m, ...updated } : m);
    handleCampaignFieldChange('milestones', nextMilestones);
  };

  const handleDeleteMilestone = (id: string) => {
    triggerHapticFeedback('warning');
    handleCampaignFieldChange('milestones', campaign.milestones.filter(m => m.id !== id));
  };

  // Duplicate campaign handler
  const handleDuplicateCampaign = () => {
    triggerHapticFeedback('medium');
    const duplicated: Campaign = {
      ...campaign,
      id: `camp-${Date.now()}`,
      slug: `${campaign.slug}-copy-${Date.now().toString(36)}`,
      title: `${campaign.title} (Copy)`,
      status: 'draft',
      stats: { totalSubscribers: 0, totalReferrals: 0, totalActionsCompleted: 0, viralKFactor: 0, conversionRate: 0 },
    };
    onUpdateCampaign(duplicated);
  };

  // Save & publish the promoter's legal settings to the live campaign record.
  const [legalSaveState, setLegalSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleSaveLegalSettings = async () => {
    setLegalSaveState('saving');
    triggerHapticFeedback('medium');
    try {
      const response = await fetch(`/api/campaigns/${encodeURIComponent(campaign.slug)}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ legalSettings: campaign.legalSettings || {} }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        if (response.status === 401) throw new Error('Promoter sign-in required');
        if (response.status === 404) throw new Error('Saved to this workspace — publish a live campaign to persist remotely');
        throw new Error(result.error || 'Settings could not be saved');
      }
      setLegalSaveState('saved');
      triggerHapticFeedback('success');
      setTimeout(() => setLegalSaveState('idle'), 4000);
    } catch (error) {
      console.error('[customizer] legal save failed', error);
      setLegalSaveState('error');
      setTimeout(() => setLegalSaveState('idle'), 4000);
    }
  };

  const demoSubscriber = mockSubscribers[0];
  const legal = campaign.legalSettings || {
    useCustomPrivacyPolicy: false,
    customPrivacyPolicyText: '',
    useCustomTermsConditions: false,
    customTermsConditionsText: '',
    useCustomOfficialRules: false,
    customOfficialRulesText: '',
    useCustomComplaintsPolicy: false,
    customComplaintsEmail: '',
    customComplaintsInstructions: '',
    promoterLegalDisclaimer: '',
    promoterJurisdiction: '',
    platformNonLiabilityNotice: ''
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
              Promoter & Agency Studio
            </span>
            <span className="text-xs text-slate-500 font-semibold">Client: {campaign.clientName}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Visual Staging, Mechanics & Legal Terms
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          {/* AI Generator Trigger */}
          <button
            onClick={() => {
              triggerHapticFeedback('medium');
              setShowAiModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 hover:from-indigo-700 hover:to-violet-800 transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Campaign Strategist
          </button>

          {/* Duplicate Campaign */}
          <button
            onClick={handleDuplicateCampaign}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 shadow-2xs transition active:scale-98"
            title="Create a copy of this campaign as a new draft"
          >
            <Copy className="w-3.5 h-3.5" /> Duplicate Campaign
          </button>

          <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-2xl">
            <button
              onClick={() => {
                triggerHapticFeedback('light');
                setPreviewState('landing');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                previewState === 'landing' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Public Landing View
            </button>
            <button
              onClick={() => {
                triggerHapticFeedback('light');
                setPreviewState('hub');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                previewState === 'hub' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Participant Hub View
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Configurator Left (5 cols) & Live Frame Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Settings Panel */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xl shadow-slate-900/5">
            
            {/* Customizer Sub-tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50/80 p-1.5 gap-1 overflow-x-auto no-scrollbar">
              <button
                onClick={() => {
                  triggerHapticFeedback('light');
                  setActiveTab('theme');
                }}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition ${
                  activeTab === 'theme' ? 'bg-white text-indigo-600 shadow-xs ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Palette className="w-3.5 h-3.5" /> Theme
              </button>

              <button
                onClick={() => {
                  triggerHapticFeedback('light');
                  setActiveTab('prize');
                }}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition ${
                  activeTab === 'prize' ? 'bg-white text-indigo-600 shadow-xs ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" /> Prize
              </button>

              <button
                onClick={() => {
                  triggerHapticFeedback('light');
                  setActiveTab('actions');
                }}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition ${
                  activeTab === 'actions' ? 'bg-white text-indigo-600 shadow-xs ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Actions
              </button>

              <button
                onClick={() => {
                  triggerHapticFeedback('light');
                  setActiveTab('milestones');
                }}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition ${
                  activeTab === 'milestones' ? 'bg-white text-indigo-600 shadow-xs ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Gift className="w-3.5 h-3.5" /> Tiers
              </button>

              <button
                onClick={() => {
                  triggerHapticFeedback('light');
                  setActiveTab('wheel');
                }}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition ${
                  activeTab === 'wheel' ? 'bg-white text-indigo-600 shadow-xs ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Disc3 className="w-3.5 h-3.5" /> Wheel
              </button>

              <button
                onClick={() => {
                  triggerHapticFeedback('light');
                  setActiveTab('legal');
                }}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition ${
                  activeTab === 'legal' ? 'bg-white text-indigo-600 shadow-xs ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Scale className="w-3.5 h-3.5 text-amber-600" /> Legal & Terms
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[750px] overflow-y-auto">
              
              {/* TAB 1: THEME & FONTS */}
              {activeTab === 'theme' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  
                  {/* Headline Font Chooser */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <Type className="w-4 h-4 text-indigo-600" /> Headline Typography
                    </label>
                    <select
                      value={campaign.theme.headlineFont}
                      onChange={(e) => handleThemeChange('headlineFont', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white"
                    >
                      {fontPresets.map(f => (
                        <option key={f.value} value={f.value}>{f.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Primary Color Palette */}
                  <div className="space-y-3">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-indigo-600" /> Primary Color Scheme
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {colorPresets.map((preset) => {
                        const isSelected = campaign.theme.primaryColor === preset.hex;
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => {
                              triggerHapticFeedback('light');
                              handleThemeChange('primaryColor', preset.hex);
                            }}
                            className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-bold transition text-left ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-2 ring-indigo-500/20'
                                : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                            }`}
                          >
                            <span
                              className="w-4 h-4 rounded-full shrink-0 shadow-xs"
                              style={{ backgroundColor: preset.hex }}
                            />
                            <span className="truncate">{preset.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 ml-auto" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Border Radius */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                      Border Corner Curvature
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {(['rounded-xl', 'rounded-2xl', 'rounded-3xl'] as const).map((rad) => (
                        <button
                          key={rad}
                          type="button"
                          onClick={() => handleThemeChange('borderRadius', rad)}
                          className={`py-2 px-3 border font-bold transition rounded-xl ${
                            campaign.theme.borderRadius === rad
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                          }`}
                        >
                          {rad.replace('rounded-', '')}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: PRIZE & DRAW LOGISTICS */}
              {activeTab === 'prize' && (
                <div className="space-y-4 animate-in fade-in duration-150">

                  {/* Campaign Type Selector */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800">Campaign Style</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {([
                        { value: 'sweepstakes', label: 'Sweepstakes', hint: 'Entries & referral draw' },
                        { value: 'milestone_points', label: 'Points Milestones', hint: 'Earn & unlock tiers' },
                        { value: 'hybrid', label: 'Hybrid', hint: 'Entries + milestones' },
                        { value: 'spin_wheel', label: 'Spin the Wheel', hint: 'Gamified instant win' },
                      ] as { value: CampaignType; label: string; hint: string }[]).map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleCampaignTypeChange(opt.value)}
                          className={`p-2.5 rounded-xl border text-left font-bold transition ${
                            campaign.campaignType === opt.value
                              ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                              : 'border-slate-200 bg-white hover:border-indigo-400 text-slate-700'
                          }`}
                        >
                          <span className="block">{opt.label}</span>
                          <span className={`block text-[10px] font-semibold mt-0.5 ${campaign.campaignType === opt.value ? 'text-white/75' : 'text-slate-400'}`}>{opt.hint}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">Grand Prize Headline Title</label>
                      <input
                        type="text"
                        value={campaign.prizeTitle}
                        onChange={(e) => handleCampaignFieldChange('prizeTitle', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-600 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">Prize ARV Value ($ USD)</label>
                        <input
                          type="number"
                          value={campaign.prizeValueUsd}
                          onChange={(e) => handleCampaignFieldChange('prizeValueUsd', Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">Entries per Referral</label>
                        <input
                          type="number"
                          value={campaign.referralRewardEntries}
                          onChange={(e) => handleCampaignFieldChange('referralRewardEntries', Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs font-mono font-bold text-indigo-700 focus:outline-none focus:border-indigo-600 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">Draw Countdown Date & Time (UTC)</label>
                      <input
                        type="datetime-local"
                        value={campaign.drawDate.substring(0, 16)}
                        onChange={(e) => handleCampaignFieldChange('drawDate', new Date(e.target.value).toISOString())}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-800 font-mono font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">Prize Image URL</label>
                      <input
                        type="text"
                        value={campaign.prizeImageUrl}
                        onChange={(e) => handleCampaignFieldChange('prizeImageUrl', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-700 font-mono focus:outline-none focus:border-indigo-600 focus:bg-white"
                      />
                      
                      {/* Curated Presets */}
                      <div className="mt-2 space-y-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Or choose sample image:</span>
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          {prizeImagePresets.map(preset => (
                            <button
                              key={preset.title}
                              type="button"
                              onClick={() => handleCampaignFieldChange('prizeImageUrl', preset.url)}
                              className="text-left text-[10px] p-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-indigo-500 text-slate-700 truncate font-semibold"
                            >
                              {preset.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: ACTION MATRIX BUILDER */}
              {activeTab === 'actions' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                      Enabled Bonus Actions ({campaign.actions.length})
                    </span>
                    <button
                      onClick={handleAddAction}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Action
                    </button>
                  </div>

                  <div className="space-y-3">
                    {campaign.actions.map((act) => (
                      <div
                        key={act.id}
                        className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={act.title}
                            onChange={(e) => handleUpdateAction(act.id, { title: e.target.value })}
                            className="bg-transparent text-xs font-extrabold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none flex-1 py-1"
                          />
                          <button
                            onClick={() => handleDeleteAction(act.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition"
                            title="Delete Action"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="text-[10px] text-slate-500 font-bold block mb-1">Platform Channel</label>
                            <select
                              value={act.platform}
                              onChange={(e) => handleUpdateAction(act.id, { platform: e.target.value as any })}
                              className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-2 text-slate-800 text-xs font-medium"
                            >
                              <option value="whatsapp">WhatsApp Direct Share</option>
                              <option value="twitter">X / Twitter Intent</option>
                              <option value="linkedin">LinkedIn Share</option>
                              <option value="youtube">YouTube Video Watch</option>
                              <option value="telegram">Telegram Channel Join</option>
                              <option value="discord">Discord Community</option>
                              <option value="newsletter">Newsletter Subscribe</option>
                              <option value="custom_link">Custom URL Visit</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-500 font-bold block mb-1">Reward Weight</label>
                            <input
                              type="number"
                              min={1}
                              max={50}
                              value={act.reward}
                              onChange={(e) => handleUpdateAction(act.id, { reward: Number(e.target.value) })}
                              className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-2 text-slate-900 text-xs font-mono font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 font-bold block mb-1">Target URL (Optional)</label>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={act.url || ''}
                            onChange={(e) => handleUpdateAction(act.id, { url: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg py-1 px-2 text-[11px] font-mono text-slate-700"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: MILESTONE REWARDS */}
              {activeTab === 'milestones' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                      Configured Milestones ({campaign.milestones.length})
                    </span>
                    <button
                      onClick={handleAddMilestone}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Milestone
                    </button>
                  </div>

                  <div className="space-y-3">
                    {campaign.milestones.map((ms) => (
                      <div
                        key={ms.id}
                        className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={ms.title}
                            onChange={(e) => handleUpdateMilestone(ms.id, { title: e.target.value })}
                            className="bg-transparent text-xs font-extrabold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none flex-1 py-1"
                          />
                          <button
                            onClick={() => handleDeleteMilestone(ms.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="text-[10px] text-slate-500 font-bold block mb-1">Required Points/Entries</label>
                            <input
                              type="number"
                              value={ms.requiredPoints}
                              onChange={(e) => handleUpdateMilestone(ms.id, { requiredPoints: Number(e.target.value) })}
                              className="w-full bg-white border border-slate-300 rounded-lg py-1 px-2 text-xs font-mono font-bold text-slate-900"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-500 font-bold block mb-1">Reward Type</label>
                            <select
                              value={ms.rewardType}
                              onChange={(e) => handleUpdateMilestone(ms.id, { rewardType: e.target.value as any })}
                              className="w-full bg-white border border-slate-300 rounded-lg py-1 px-2 text-xs text-slate-800 font-medium"
                            >
                              <option value="discount_code">Discount Promo Code</option>
                              <option value="digital_download">Digital PDF Download</option>
                              <option value="bonus_tickets">Bonus Draw Tickets</option>
                              <option value="badge">Digital Badge</option>
                              <option value="physical_merch">Physical Swag Merch</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 font-bold block mb-1">Unlock Value (Code/URL/Text)</label>
                          <input
                            type="text"
                            value={ms.rewardValue}
                            onChange={(e) => handleUpdateMilestone(ms.id, { rewardValue: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg py-1 px-2 text-[11px] font-mono font-semibold text-slate-800"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: SPIN WHEEL */}
              {activeTab === 'wheel' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {campaign.campaignType !== 'spin_wheel' && (
                    <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold leading-relaxed">
                      The spin wheel works alongside any campaign style. Set the campaign style to <strong>Spin the Wheel</strong> on the Prize tab to make it the primary experience.
                    </div>
                  )}
                  <SpinWheelEditor
                    config={campaign.spinWheel || { title: campaign.title, description: '', segments: [] }}
                    onChange={(spinWheel) => onUpdateCampaign({ ...campaign, spinWheel })}
                  />
                </div>
              )}

              {/* TAB 5: LEGAL, PRIVACY, T&C AND COMPLIANCE */}
              {activeTab === 'legal' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  
                  {/* Platform Non-Liability Notice */}
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                    <div className="flex items-center gap-2 text-amber-950 font-extrabold text-xs">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Platform Non-Liability & Promoter Governance
                    </div>
                    <p className="text-amber-900 text-xs leading-relaxed">
                      As the campaign promoter / sponsor (<strong className="text-amber-950">{campaign.clientName}</strong>), you are solely responsible for prize fulfillment, tax compliance, and legal administration. <strong>ViralWins</strong> provides software infrastructure only and is held harmless from all entrant disputes.
                    </p>
                    <div className="pt-1">
                      <label className="text-[10px] text-slate-500 font-bold block mb-1">
                        End-user footer non-liability notice (shown to entrants)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="ViralWins is strictly a software technology provider..."
                        value={legal.platformNonLiabilityNotice || ''}
                        onChange={(e) => handleLegalChange('platformNonLiabilityNotice', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 leading-relaxed resize-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleLegalChange(
                          'platformNonLiabilityNotice',
                          `${campaign.clientName} operates this promotion independently. ViralWins is strictly a software technology provider and is not liable for any losses, unfulfilled prizes, or dispute outcomes. Entrants must review the promoter's own terms and privacy policy.`
                        )}
                        className="text-[10px] text-slate-600 hover:text-indigo-600 font-bold inline-flex items-center gap-1"
                      >
                        <FileCode className="w-3 h-3" /> Load default non-liability wording
                      </button>
                    </div>
                  </div>

                  {/* Section 1: Terms & Conditions */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <Scale className="w-4 h-4 text-amber-600" /> Terms & Conditions (T&C)
                      </label>
                      <button
                        onClick={() => {
                          triggerHapticFeedback('light');
                          setPreviewModal('terms');
                        }}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview Modal
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tc_mode"
                          checked={!legal.useCustomTermsConditions}
                          onChange={() => handleLegalChange('useCustomTermsConditions', false)}
                          className="text-indigo-600"
                        />
                        <span className="font-bold text-slate-700">Use Platform Generic Default</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tc_mode"
                          checked={legal.useCustomTermsConditions}
                          onChange={() => handleLegalChange('useCustomTermsConditions', true)}
                          className="text-indigo-600"
                        />
                        <span className="font-bold text-slate-700">Provide Custom Promoter Terms</span>
                      </label>
                    </div>

                    {legal.useCustomTermsConditions && (
                      <div className="space-y-2 pt-1 animate-in fade-in">
                        <textarea
                          rows={4}
                          placeholder="Paste or write your specific campaign Terms & Conditions here..."
                          value={legal.customTermsConditionsText || ''}
                          onChange={(e) => handleLegalChange('customTermsConditionsText', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 leading-relaxed font-mono resize-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            triggerHapticFeedback('light');
                            handleLegalChange('customTermsConditionsText', `1. SPONSORSHIP: Operated solely by ${campaign.clientName}.\n2. NO PURCHASE NECESSARY: Void where prohibited.\n3. PRIZE: ${campaign.prizeTitle} (ARV $${campaign.prizeValueUsd}).\n4. DRAW: Conducted on ${campaign.drawDate}.\n5. PLATFORM DISCLAIMER: ViralWins is an independent software provider with no liability.`);
                          }}
                          className="text-[10px] text-slate-600 hover:text-indigo-600 font-bold inline-flex items-center gap-1"
                        >
                          <FileCode className="w-3 h-3" /> Load Sample Custom Template
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Section 2: Privacy Policy */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> Privacy Policy & Data Notice
                      </label>
                      <button
                        onClick={() => {
                          triggerHapticFeedback('light');
                          setPreviewModal('privacy');
                        }}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview Modal
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="privacy_mode"
                          checked={!legal.useCustomPrivacyPolicy}
                          onChange={() => handleLegalChange('useCustomPrivacyPolicy', false)}
                          className="text-indigo-600"
                        />
                        <span className="font-bold text-slate-700">Use Platform GDPR/CCPA Default</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="privacy_mode"
                          checked={legal.useCustomPrivacyPolicy}
                          onChange={() => handleLegalChange('useCustomPrivacyPolicy', true)}
                          className="text-indigo-600"
                        />
                        <span className="font-bold text-slate-700">Provide Custom Promoter Privacy</span>
                      </label>
                    </div>

                    {legal.useCustomPrivacyPolicy && (
                      <div className="space-y-2 pt-1 animate-in fade-in">
                        <textarea
                          rows={4}
                          placeholder="Paste or write your organization's custom privacy charter..."
                          value={legal.customPrivacyPolicyText || ''}
                          onChange={(e) => handleLegalChange('customPrivacyPolicyText', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 leading-relaxed font-mono resize-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            triggerHapticFeedback('light');
                            handleLegalChange('customPrivacyPolicyText', `DATA PRIVACY DISCLOSURE BY ${campaign.clientName.toUpperCase()}\nWe collect entrant emails strictly for prize notification and verified referral credits.\nParticipants may request complete data deletion at any time by contacting our privacy officer.\nPlatform Provider (ViralWins) acts as data processor.`);
                          }}
                          className="text-[10px] text-slate-600 hover:text-indigo-600 font-bold inline-flex items-center gap-1"
                        >
                          <FileCode className="w-3 h-3" /> Load Sample Custom Privacy
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Section 3: Official Sweepstakes Rules */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-600" /> Official Sweepstakes Rules
                      </label>
                      <button
                        onClick={() => {
                          triggerHapticFeedback('light');
                          setPreviewModal('rules');
                        }}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview Modal
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rules_mode"
                          checked={!legal.useCustomOfficialRules}
                          onChange={() => handleLegalChange('useCustomOfficialRules', false)}
                          className="text-indigo-600"
                        />
                        <span className="font-bold text-slate-700">Use Standard Audited Rules</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rules_mode"
                          checked={legal.useCustomOfficialRules}
                          onChange={() => handleLegalChange('useCustomOfficialRules', true)}
                          className="text-indigo-600"
                        />
                        <span className="font-bold text-slate-700">Provide Custom Rules</span>
                      </label>
                    </div>

                    {legal.useCustomOfficialRules && (
                      <div className="space-y-2 pt-1 animate-in fade-in">
                        <textarea
                          rows={4}
                          placeholder="Paste official sweepstakes rules clauses..."
                          value={legal.customOfficialRulesText || ''}
                          onChange={(e) => handleLegalChange('customOfficialRulesText', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 leading-relaxed font-mono resize-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Section 4: Complaints & Dispute Desk Contact */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <LifeBuoy className="w-4 h-4 text-indigo-600" /> Promoter Dispute Desk & Support
                      </label>
                      <button
                        onClick={() => {
                          triggerHapticFeedback('light');
                          setPreviewModal('complaints');
                        }}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview Modal
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">
                          Promoter Support / Dispute Email *
                        </label>
                        <input
                          type="email"
                          placeholder="support@yourbrand.com"
                          value={legal.customComplaintsEmail || ''}
                          onChange={(e) => handleLegalChange('customComplaintsEmail', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">
                          Custom Entrant Dispute Instructions (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Please provide your order ID or registered email address..."
                          value={legal.customComplaintsInstructions || ''}
                          onChange={(e) => handleLegalChange('customComplaintsInstructions', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Governing Jurisdiction & Disclaimers */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-indigo-600" /> Promoter Entity & Governing Region
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">
                          Governing Legal Jurisdiction
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Delaware, United States"
                          value={legal.promoterJurisdiction || ''}
                          onChange={(e) => handleLegalChange('promoterJurisdiction', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-indigo-600"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">
                          Client / Sponsor Organization Name
                        </label>
                        <input
                          type="text"
                          value={campaign.clientName}
                          onChange={(e) => handleCampaignFieldChange('clientName', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-1">
                        Promoter Liability Statement
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Gear Labs is solely responsible for prize procurement..."
                        value={legal.promoterLegalDisclaimer || ''}
                        onChange={(e) => handleLegalChange('promoterLegalDisclaimer', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  {/* Save & publish legal settings */}
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                    <button
                      onClick={handleSaveLegalSettings}
                      disabled={legalSaveState === 'saving'}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-black transition
                        text-white shadow-lg animate-vw-gradient bg-gradient-to-r from-fuchsia-600 to-rose-500
                        disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {legalSaveState === 'saving' ? (
                        <>Saving…</>
                      ) : legalSaveState === 'saved' ? (
                        <>Saved & published</>
                      ) : legalSaveState === 'error' ? (
                        <>Save failed — retry</>
                      ) : (
                        <>Save & publish legal settings</>
                      )}
                    </button>
                    <span className="text-xs font-bold text-slate-500">
                      {legalSaveState === 'saved' && 'Changes pushed to live campaign'}
                      {legalSaveState === 'error' && 'Check console for details'}
                    </span>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Right Column: Live Responsive Frame Preview */}
        <div className="lg:col-span-7 h-[780px]">
          <DevicePreviewFrame deviceMode={deviceMode} setDeviceMode={setDeviceMode}>
            {previewState === 'landing' ? (
              <ParticipantLanding
                campaign={campaign}
                referrerCode="ALEX77"
                onJoinSuccess={() => {
                  setPreviewState('hub');
                }}
                onOpenRules={() => setPreviewModal('rules')}
                onOpenPrivacy={() => setPreviewModal('privacy')}
                onOpenTerms={() => setPreviewModal('terms')}
              />
            ) : (
              <ParticipantDashboard
                campaign={campaign}
                subscriber={demoSubscriber}
                allSubscribers={mockSubscribers}
                onActionCompleted={() => {}}
                onOpenRules={() => setPreviewModal('rules')}
              />
            )}
          </DevicePreviewFrame>
        </div>

      </div>

      {/* Interactive Modal Previews Triggered from Customizer */}
      {previewModal === 'privacy' && (
        <PrivacyPolicyModal
          campaign={campaign}
          onClose={() => setPreviewModal(null)}
        />
      )}

      {previewModal === 'terms' && (
        <TermsConditionsModal
          campaign={campaign}
          onClose={() => setPreviewModal(null)}
        />
      )}

      {previewModal === 'complaints' && (
        <ComplaintsModal
          campaign={campaign}
          subscriber={demoSubscriber}
          onClose={() => setPreviewModal(null)}
        />
      )}

      {previewModal === 'rules' && (
        <OfficialRulesModal
          campaign={campaign}
          onClose={() => setPreviewModal(null)}
        />
      )}

      {/* AI Campaign Generator Modal */}
      {showAiModal && (
        <AiCampaignGeneratorModal
          onApplyCampaign={(generated) => {
            onUpdateCampaign({
              ...campaign,
              ...generated,
              theme: {
                ...campaign.theme,
                ...(generated.theme || {})
              }
            });
          }}
          onClose={() => setShowAiModal(false)}
        />
      )}

    </div>
  );
};
