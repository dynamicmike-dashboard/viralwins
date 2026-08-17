import React, { useEffect, useState } from 'react';
import { Gauge, Lock, TrendingUp, Zap } from 'lucide-react';

type Usage = {
  count: number;
  cap: number;
  tier: string;
  pct: number;
  resetsAt: string;
};

const tierLabels: Record<string, string> = { starter: 'Starter', growth: 'Growth', scale: 'Scale' };
const nextTier: Record<string, string> = { starter: 'Growth', growth: 'Scale' };

export function EntrantUsageBanner({ slug }: { slug: string }) {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/campaigns/${encodeURIComponent(slug)}/usage`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('no usage'))))
      .then((data) => { if (active) setUsage(data.usage); })
      .catch(() => { if (active) setHidden(true); });
    return () => { active = false; };
  }, [slug]);

  if (hidden || !usage || usage.cap <= 0) return null;

  const pct = Math.round(usage.pct * 100);
  const locked = pct >= 100;
  const warn = pct >= 80;
  const upcoming = !locked && nextTier[usage.tier] && pct >= 75;
  const resetLabel = usage.resetsAt ? new Date(usage.resetsAt).toLocaleDateString() : '';

  return (
    <div className={`overflow-hidden rounded-3xl border p-5 shadow-sm ${locked ? 'border-rose-200 bg-rose-50' : warn ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`rounded-2xl p-2.5 ${locked ? 'bg-rose-500 text-white' : warn ? 'bg-amber-400 text-amber-950' : 'bg-emerald-500 text-white'}`}>
            {locked ? <Lock className="h-5 w-5" /> : <Gauge className="h-5 w-5" />}
          </div>
          <div>
            <p className={`text-sm font-black ${locked ? 'text-rose-900' : warn ? 'text-amber-900' : 'text-emerald-900'}`}>
              {locked ? 'Entrant limit reached' : warn ? 'Approaching your entrant limit' : 'Entrant usage'}
            </p>
            <p className={`text-xs font-semibold ${locked ? 'text-rose-700' : warn ? 'text-amber-700' : 'text-emerald-700'}`}>
              {usage.count.toLocaleString()} of {usage.cap.toLocaleString()} monthly entrants · {tierLabels[usage.tier] ?? usage.tier} plan
              {resetLabel ? ` · resets ${resetLabel}` : ''}
            </p>
          </div>
        </div>
        <p className={`text-2xl font-black ${locked ? 'text-rose-900' : warn ? 'text-amber-900' : 'text-emerald-900'}`}>{pct}%</p>
      </div>

      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-white/70">
        <div
          className={`h-full rounded-full transition-all duration-700 ${locked ? 'bg-gradient-to-r from-rose-500 to-rose-600' : warn ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-emerald-400 to-teal-500'}`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>

      {(locked || upcoming) && (
        <div className={`mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3 ${locked ? 'bg-white/70' : 'bg-white/60'}`}>
          <p className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Zap className={`h-4 w-4 ${locked ? 'text-rose-500' : 'text-orange-500'}`} />
            {locked
              ? `Your ${tierLabels[usage.tier] ?? usage.tier} plan has reached 100% of its monthly entrant cap. New entrants are paused until you upgrade or the period resets.`
              : `You're nearly at your monthly cap. Upgrade to ${nextTier[usage.tier]} for a ${usage.tier === 'growth' ? '25,000' : '2,500'} limit and keep growing.`}
          </p>
          {nextTier[usage.tier] && (
            <a href="/#pricing" className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 px-4 py-2 text-xs font-black text-white shadow-sm transition-transform hover:scale-105">
              <TrendingUp className="h-3.5 w-3.5" /> Upgrade to {nextTier[usage.tier]}
            </a>
          )}
        </div>
      )}
    </div>
  );
}