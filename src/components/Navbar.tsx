import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Sliders,
  BarChart3,
  Flame,
  Globe,
  Wifi,
  WifiOff,
  Smartphone
} from 'lucide-react';
import { Campaign } from '../types';
import { PwaThemeMode, PwaThemeEngine } from './PWA/PwaThemeEngine';
import { triggerHapticFeedback } from '../utils/haptics';

export type ActiveTab = 'participant_hub' | 'agency_customizer' | 'operations_analytics';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  campaign: Campaign;
  campaigns: Campaign[];
  onSelectCampaign: (campaign: Campaign) => void;
  isAuthenticatedParticipant: boolean;
  onToggleParticipantAuth: () => void;
  onOpenDrawModal: () => void;
  onOpenPwaModal: () => void;
  currentPwaTheme: PwaThemeMode;
  onSelectPwaTheme: (theme: PwaThemeMode) => void;
  isStandalone: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  campaign,
  campaigns,
  onSelectCampaign,
  isAuthenticatedParticipant,
  onToggleParticipantAuth,
  onOpenDrawModal,
  onOpenPwaModal,
  currentPwaTheme,
  onSelectPwaTheme,
  isStandalone
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/90 backdrop-blur-2xl transition-all shadow-xs">
      
      {/* PWA Native Micro Status Strip */}
      <div className="bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 border-b border-slate-200/70 px-4 py-1 flex items-center justify-between text-[11px] text-slate-700">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-indigo-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span className="font-bold tracking-wider">VIRAL PWA ENGINE</span>
          </span>

          <span className="hidden sm:inline text-slate-300">|</span>

          {/* Online/Offline Status */}
          <span className={`inline-flex items-center gap-1 font-semibold text-[10px] px-2 py-0.5 rounded-md ${
            isOnline ? 'text-emerald-700 bg-emerald-100 border border-emerald-200' : 'text-rose-700 bg-rose-100 border border-rose-200'
          }`}>
            {isOnline ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
            {isOnline ? 'Live Cloud Sync' : 'Offline Cache Ready'}
          </span>
        </div>

        {/* PWA Aesthetic Switcher & App Trigger */}
        <div className="flex items-center gap-2">
          <PwaThemeEngine
            currentTheme={currentPwaTheme}
            onSelectTheme={onSelectPwaTheme}
          />

          <button
            onClick={() => {
              triggerHapticFeedback('medium');
              onOpenPwaModal();
            }}
            className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition active:scale-95 shadow-2xs"
            title="Inspect PWA Manifest & Install"
          >
            <Smartphone className="w-3 h-3 text-indigo-600" />
            <span>{isStandalone ? 'PWA Installed' : 'Install PWA'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Campaign Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md font-black text-white p-0.5 ring-2 ring-indigo-100"
              style={{ background: `linear-gradient(135deg, ${campaign.theme.primaryColor}, #8B5CF6)` }}
            >
              <div className="w-full h-full bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-xs">
                <Flame className="w-5 h-5 text-white drop-shadow-xs" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                  VIRAL ENGINE
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 uppercase font-mono">
                  PWA Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-semibold truncate max-w-[180px] sm:max-w-xs">
                {campaign.title}
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200/80 shadow-xs">
            <button
              onClick={() => {
                triggerHapticFeedback('light');
                setActiveTab('participant_hub');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'participant_hub'
                  ? 'bg-white text-indigo-600 shadow-xs ring-1 ring-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Public Hub
            </button>

            <button
              onClick={() => {
                triggerHapticFeedback('light');
                setActiveTab('agency_customizer');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'agency_customizer'
                  ? 'bg-white text-indigo-600 shadow-xs ring-1 ring-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Visual Customizer
            </button>

            <button
              onClick={() => {
                triggerHapticFeedback('light');
                setActiveTab('operations_analytics');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'operations_analytics'
                  ? 'bg-white text-indigo-600 shadow-xs ring-1 ring-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analytics & Draw
            </button>
          </nav>

          {/* Quick Actions & Campaign Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Campaign Dropdown */}
            <select
              value={campaign.id}
              onChange={(e) => {
                const found = campaigns.find(c => c.id === e.target.value);
                if (found) onSelectCampaign(found);
              }}
              className="bg-white border border-slate-300 text-slate-800 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 max-w-[140px] sm:max-w-none cursor-pointer shadow-2xs"
            >
              {campaigns.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title.length > 25 ? c.title.substring(0, 25) + '...' : c.title}
                </option>
              ))}
            </select>

            {/* Fair Draw Trigger Button */}
            <button
              onClick={() => {
                triggerHapticFeedback('medium');
                onOpenDrawModal();
              }}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-extrabold px-3.5 py-1.5 rounded-xl shadow-md shadow-amber-500/25 transition active:scale-95 shrink-0"
              title="Launch Live Fair Prize Draw"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-100" />
              <span className="hidden sm:inline">Fair Draw</span>
            </button>

            {/* Toggle Participant Auth State (Demo convenience) */}
            {activeTab === 'participant_hub' && (
              <button
                onClick={() => {
                  triggerHapticFeedback('light');
                  onToggleParticipantAuth();
                }}
                className="text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition shrink-0 shadow-2xs"
                title="Simulate signing up or logging out as a participant"
              >
                {isAuthenticatedParticipant ? 'Sign Out (Demo)' : 'Quick Login'}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Row */}
        <div className="lg:hidden flex items-center overflow-x-auto py-2 gap-2 border-t border-slate-200 no-scrollbar">
          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('participant_hub');
            }}
            className={`whitespace-nowrap px-3 py-1 rounded-xl text-xs font-bold ${
              activeTab === 'participant_hub' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 bg-white border border-slate-200'
            }`}
          >
            Public Hub
          </button>
          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('agency_customizer');
            }}
            className={`whitespace-nowrap px-3 py-1 rounded-xl text-xs font-bold ${
              activeTab === 'agency_customizer' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 bg-white border border-slate-200'
            }`}
          >
            Customizer
          </button>
          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('operations_analytics');
            }}
            className={`whitespace-nowrap px-3 py-1 rounded-xl text-xs font-bold ${
              activeTab === 'operations_analytics' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 bg-white border border-slate-200'
            }`}
          >
            Analytics & Draw
          </button>
        </div>

      </div>
    </header>
  );
};
