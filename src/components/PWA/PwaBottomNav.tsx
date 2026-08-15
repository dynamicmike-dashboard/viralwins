import React from 'react';
import { 
  Globe, 
  Sliders, 
  BarChart3, 
  Sparkles, 
  Download
} from 'lucide-react';
import { ActiveTab } from '../Navbar';
import { triggerHapticFeedback } from '../../utils/haptics';

interface PwaBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenPwaModal: () => void;
  isInstallable: boolean;
}

export const PwaBottomNav: React.FC<PwaBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenPwaModal,
  isInstallable
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'participant_hub',
      label: 'Hub',
      icon: <Globe className="w-5 h-5" />,
      badge: 'Live'
    },
    {
      id: 'agency_customizer',
      label: 'Studio',
      icon: <Sliders className="w-5 h-5" />
    },
    {
      id: 'operations_analytics',
      label: 'Draw & KPI',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: 'design_benchmark',
      label: 'Benchmark',
      icon: <Sparkles className="w-5 h-5" />
    }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-safe pt-1 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-md bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-1.5 shadow-xl shadow-slate-900/10 flex items-center justify-around">
        
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                triggerHapticFeedback('light');
                setActiveTab(item.id);
              }}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30 scale-105'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && !isActive && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </div>
              <span className="text-[10px] font-bold mt-0.5 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Quick PWA Install / Status Dock Button */}
        <button
          onClick={() => {
            triggerHapticFeedback('medium');
            onOpenPwaModal();
          }}
          className="relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl text-amber-600 hover:text-amber-700 transition active:scale-95"
          title="PWA Status & App Install"
        >
          <div className="relative p-1 rounded-xl bg-amber-50 border border-amber-200">
            <Download className="w-4 h-4 text-amber-600" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <span className="text-[9px] font-extrabold uppercase mt-0.5 tracking-wider">
            PWA
          </span>
        </button>

      </div>
    </div>
  );
};
