import React from 'react';
import { Sparkles } from 'lucide-react';
import { triggerHapticFeedback } from '../../utils/haptics';

export type PwaThemeMode = 'clean_luxe' | 'emerald_sage' | 'sunset_coral' | 'sky_azure' | 'golden_honey';

interface PwaThemeEngineProps {
  currentTheme: PwaThemeMode;
  onSelectTheme: (theme: PwaThemeMode) => void;
}

export const PwaThemeEngine: React.FC<PwaThemeEngineProps> = ({
  currentTheme,
  onSelectTheme
}) => {
  const themes: { id: PwaThemeMode; label: string; dotClass: string; desc: string }[] = [
    {
      id: 'clean_luxe',
      label: 'Alabaster Luxe',
      dotClass: 'bg-indigo-600 ring-2 ring-indigo-200',
      desc: 'Crisp Porcelain & Royal Indigo'
    },
    {
      id: 'emerald_sage',
      label: 'Emerald Mint',
      dotClass: 'bg-emerald-600 ring-2 ring-emerald-200',
      desc: 'Crisp Mint & Botanical Sage'
    },
    {
      id: 'sunset_coral',
      label: 'Sunset Coral',
      dotClass: 'bg-orange-500 ring-2 ring-orange-200',
      desc: 'Warm Peach & Vibrant Coral'
    },
    {
      id: 'sky_azure',
      label: 'Sky Azure',
      dotClass: 'bg-sky-500 ring-2 ring-sky-200',
      desc: 'Electric Ocean & Cyan Breeze'
    },
    {
      id: 'golden_honey',
      label: 'Golden Honey',
      dotClass: 'bg-amber-500 ring-2 ring-amber-200',
      desc: 'Warm Vanilla & Amber Glow'
    }
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-100/90 border border-slate-200/90 p-1 rounded-xl shadow-xs">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-2 pr-1 hidden sm:inline flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-amber-500" /> Style:
      </span>
      {themes.map((t) => {
        const isSelected = currentTheme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => {
              triggerHapticFeedback('light');
              onSelectTheme(t.id);
            }}
            className={`px-2 py-0.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              isSelected
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
            title={`${t.label}: ${t.desc}`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${t.dotClass}`} />
            <span className="hidden md:inline text-[11px] font-semibold">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};
