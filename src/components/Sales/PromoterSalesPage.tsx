import React, { useState } from 'react';
import { ArrowRight, BarChart3, CheckCircle2, FileSpreadsheet, Flame, Lock, Share2, ShieldCheck, Sparkles } from 'lucide-react';

type Plan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
};

const plans: Plan[] = [
  {
    name: 'Growth Launch',
    price: '$97',
    period: '/ campaign',
    description: 'For one focused giveaway, waitlist, or product launch.',
    features: ['1 live campaign', 'Up to 2,500 entrants', 'Share and referral hub', 'Entrant CSV export', 'Standard fraud controls'],
  },
  {
    name: 'Promoter Agency Pro',
    price: '$249',
    period: '/ month',
    description: 'For agencies and brands running continuous viral campaigns.',
    features: ['Unlimited campaigns', 'Up to 50,000 monthly entrants', 'Brand themes and custom domains', 'Teable data integration', 'Advanced analytics and fraud review'],
    popular: true,
  },
  {
    name: 'Enterprise Scale',
    price: '$499',
    period: '/ month',
    description: 'For larger teams needing dedicated operational support.',
    features: ['Everything in Pro', 'Sub-account provisioning', 'Developer API and webhooks', 'Regional legal configuration', 'Priority onboarding'],
  },
];

export function PromoterSalesPage({ onTestAccess }: { onTestAccess: (email: string) => Promise<void> }) {
  const [testEmail, setTestEmail] = useState('test@dynamicmike.com');
  const [accessError, setAccessError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const requestTestAccess = async (event: React.FormEvent) => {
    event.preventDefault();
    setAccessError('');
    setIsLoading(true);
    try {
      await onTestAccess(testEmail.trim());
    } catch (error) {
      setAccessError(error instanceof Error ? error.message : 'Access could not be confirmed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      <div className="border-b border-indigo-500/20 bg-gradient-to-r from-indigo-950 via-indigo-800 to-indigo-950 px-4 py-2 text-center text-xs font-bold text-indigo-100">
        <Sparkles className="mr-2 inline h-3.5 w-3.5 text-amber-300" /> Turn your audience into your growth engine.
      </div>
      <header className="mx-auto flex max-w-7xl items-center justify-between border-b border-slate-800 px-6 py-5">
        <div className="flex items-center gap-3"><div className="rounded-xl bg-indigo-600 p-2.5"><Flame /></div><strong className="text-xl">Viral<span className="text-indigo-400">Wins</span></strong></div>
        <a href="#pricing" className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold hover:bg-indigo-500">Get dashboard access</a>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-6 pb-20 pt-20 text-center">
          <span className="inline-flex rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-widest text-indigo-300">The promoter growth studio</span>
          <h1 className="mx-auto mt-7 max-w-4xl text-5xl font-black tracking-tight sm:text-7xl">Turn every subscriber into your next growth signal.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">Launch referral campaigns, sweepstakes, waitlists, and reward programmes with a branded participant experience and a secure Teable-powered promoter dashboard.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><a href="#pricing" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-7 py-4 font-bold shadow-xl shadow-indigo-950 hover:bg-indigo-500">Start a campaign <ArrowRight className="h-4 w-4" /></a><a href="/c/creator-launch-2026" className="rounded-2xl border border-slate-700 bg-slate-900 px-7 py-4 font-bold text-slate-300 hover:bg-slate-800">View campaign demo</a></div>
          <div className="mt-9 flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-500"><span><ShieldCheck className="mr-1 inline h-4 w-4 text-emerald-400" /> Secure data boundary</span><span><BarChart3 className="mr-1 inline h-4 w-4 text-indigo-400" /> Live campaign analytics</span><span><FileSpreadsheet className="mr-1 inline h-4 w-4 text-amber-400" /> Promoter exports</span></div>
        </section>

        <section className="border-y border-slate-800 bg-slate-900/60 px-6 py-16"><div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">{[
          [Share2, 'Viral action hub', 'Let promoters choose referral, social, video, newsletter, and custom actions.'],
          [ShieldCheck, 'Responsible operations', 'Keep verification, fraud review, rules, and promoter ownership visible.'],
          [BarChart3, 'Useful growth data', 'Turn signups, referrals, points, entries, and exports into decisions.'],
        ].map(([Icon, title, copy]) => <div key={title as string} className="rounded-3xl border border-slate-800 bg-slate-950 p-7"><Icon className="mb-5 h-7 w-7 text-indigo-400" /><h2 className="font-bold">{title as string}</h2><p className="mt-2 text-sm leading-relaxed text-slate-400">{copy as string}</p></div>)}</div></section>

        <section id="pricing" className="mx-auto max-w-7xl px-6 py-20"><h2 className="text-center text-4xl font-black">Choose your access level</h2><p className="mx-auto mt-3 max-w-xl text-center text-sm text-slate-400">Payment and promoter provisioning will be handled by Stripe before dashboard access is granted.</p><div className="mt-12 grid gap-7 lg:grid-cols-3">{plans.map((plan) => <article key={plan.name} className={`relative rounded-3xl border p-7 ${plan.popular ? 'border-indigo-500 bg-slate-900 shadow-2xl shadow-indigo-950' : 'border-slate-800 bg-slate-950'}`}>{plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-3 py-1 text-[10px] font-black uppercase">Most popular</span>}<h3 className="text-xl font-bold">{plan.name}</h3><p className="mt-2 min-h-12 text-sm text-slate-400">{plan.description}</p><div className="mt-6 text-4xl font-black">{plan.price}<small className="ml-1 text-xs font-normal text-slate-500">{plan.period}</small></div><ul className="mt-6 space-y-3 border-y border-slate-800 py-5">{plan.features.map((feature) => <li key={feature} className="text-sm text-slate-300"><CheckCircle2 className="mr-2 inline h-4 w-4 text-emerald-400" />{feature}</li>)}</ul><a href="#paid-test" className="mt-6 block rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-bold hover:bg-indigo-500">Request access</a></article>)}</div></section>

        <section id="paid-test" className="mx-auto max-w-xl px-6 pb-20"><div className="rounded-3xl border border-amber-500/30 bg-amber-950/20 p-6"><h2 className="font-bold text-amber-200">Promoter access</h2><p className="mt-2 text-sm text-amber-100/70">Stripe entitlement will be connected here. The authorised test account can use this temporary access check.</p><form onSubmit={requestTestAccess} className="mt-5 flex flex-col gap-3 sm:flex-row"><input value={testEmail} onChange={(event) => setTestEmail(event.target.value)} type="email" className="min-w-0 flex-1 rounded-xl border border-amber-500/30 bg-slate-950 px-4 py-3 text-sm" placeholder="promoter@example.com" /><button disabled={isLoading} className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-black text-slate-950 hover:bg-amber-400">{isLoading ? 'Checking…' : 'Open dashboard'}</button></form>{accessError && <p className="mt-3 text-sm text-red-300">{accessError}</p>}</div></section>
      </main>
      <footer className="border-t border-slate-800 px-6 py-8 text-center text-xs text-slate-500">ViralWins provides campaign infrastructure. Promoters remain responsible for their campaign terms, prizes, eligibility, and legal compliance.</footer>
    </div>
  );
}
