import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'motion/react';
import { ArrowRight, BarChart3, Check, ChevronRight, FileSpreadsheet, Flame, Gauge, Gift, Globe, Megaphone, Rocket, Share2, ShieldCheck, Smartphone, Sparkles, Star, TrendingUp, Trophy, Users, Zap } from 'lucide-react';
import { SalesFooter } from './SalesFooter';

type Plan = {
  name: string;
  tagline: string;
  priceDisplay: string;
  priceNote: string;
  features: string[];
  popular?: boolean;
  accent: string;
  chip: string;
};

const plans: Plan[] = [
  {
    name: 'Starter',
    tagline: 'For one focused campaign.',
    priceDisplay: '$18/mo',
    priceNote: 'billed annually · $216/year',
    features: ['1 live campaign', 'Standard entrant volume', 'Share and referral hub', 'Entrant CSV export', 'Standard fraud controls'],
    accent: 'from-sky-400 to-cyan-400',
    chip: 'bg-sky-100 text-sky-700',
  },
  {
    name: 'Growth',
    tagline: 'For growing local brands.',
    priceDisplay: '$24/mo',
    priceNote: 'up to 2,500 monthly entrants',
    features: ['Up to 2,500 monthly entrants', 'Entrant cap monitor + auto-upgrade offer', 'Everything in Starter', 'Priority verification queue', 'All theme bundles'],
    popular: true,
    accent: 'from-fuchsia-500 to-rose-500',
    chip: 'bg-fuchsia-100 text-fuchsia-700',
  },
  {
    name: 'Scale',
    tagline: 'For sustained viral programmes.',
    priceDisplay: '$36/mo',
    priceNote: 'billed annually · or $42/mo monthly · up to 25,000 entrants',
    features: ['Up to 25,000 monthly entrants', 'Unlimited campaigns', 'Everything in Growth', 'Advanced analytics and fraud review', 'Brand themes and custom domain', 'CSV export to any spreadsheet'],
    accent: 'from-violet-600 to-indigo-500',
    chip: 'bg-violet-100 text-violet-700',
  },
];

const marqueeWords = ['VIRAL GIVEAWAYS', 'SWEEPSTAKES', 'REFERRAL REWARDS', 'WAITLISTS', 'LOCAL LEAD MAGNETS', 'SHARE-TO-EARN', 'COMPETITIONS', 'COMMUNITY GROWTH'];

function CountUp({ to, suffix = '', decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, to]);
  return (
    <span ref={ref}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function Reveal({ children, className, delay = 0, key }: { children: React.ReactNode; className?: string; delay?: number; key?: React.Key }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

export function PromoterSalesPage({ onTestAccess }: { onTestAccess: (email: string) => Promise<void> }) {
  const [testEmail, setTestEmail] = useState('');
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
    <div className="min-h-screen bg-[#FFF8EF] text-[#1B1035] antialiased selection:bg-fuchsia-200 selection:text-fuchsia-950">
      {/* Announcement marquee */}
      <div className="animate-vw-gradient overflow-hidden bg-gradient-to-r from-rose-500 via-fuchsia-500 to-violet-500 text-white">
        <div className="vw-marquee-mask flex py-2">
          <div className="animate-vw-marquee flex min-w-full shrink-0 items-center gap-8 pr-8 text-xs font-black uppercase tracking-widest">
            {marqueeWords.concat(marqueeWords).map((word, index) => (
              <span key={index} className="flex items-center gap-8">
                {word} <Star className="h-3 w-3 fill-amber-200 text-amber-200" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="animate-vw-gradient rounded-2xl bg-gradient-to-br from-orange-400 via-rose-500 to-fuchsia-500 p-2.5 shadow-lg shadow-rose-500/30">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <strong className="text-2xl font-black tracking-tight">Viral<span className="text-fuchsia-600">Wins</span></strong>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-bold text-slate-600 sm:flex">
          <a href="#benefits" className="transition-colors hover:text-fuchsia-600">Why ViralWins</a>
          <a href="#pricing" className="transition-colors hover:text-fuchsia-600">Pricing</a>
        </nav>
        <a href="#access" className="rounded-xl bg-gradient-to-r from-fuchsia-600 to-rose-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-fuchsia-500/30 transition-transform hover:scale-105">Get dashboard access</a>
      </header>

      <main>
        {/* HERO */}
        <section className="relative mx-auto max-w-7xl overflow-hidden px-6 pb-24 pt-14">
          <div className="animate-vw-blob pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-orange-300/50 blur-3xl" />
          <div className="animate-vw-blob pointer-events-none absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-fuchsia-300/50 blur-3xl" style={{ animationDelay: '-4s' }} />
          <div className="animate-vw-blob pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-sky-300/40 blur-3xl" style={{ animationDelay: '-8s' }} />

          <div className="relative grid items-center gap-14 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-fuchsia-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-widest text-fuchsia-700 shadow-sm">
                <Zap className="h-3.5 w-3.5 fill-amber-400 text-amber-500" /> The viral growth studio
              </span>
              <h1 className="mt-7 text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                Reach <span className="animate-vw-gradient bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 bg-clip-text text-transparent">100x more</span> local customers than paid ads.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                One viral competition can reach more local potential customers than any ad budget at the same price — because every entrant invites their friends. Launch giveaway, sweepstakes, or referral campaigns your town can&apos;t ignore.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a href="#pricing" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 px-8 py-4 text-base font-black text-white shadow-xl shadow-rose-500/30 transition-transform hover:scale-105 active:scale-95">
                  Start a campaign <ArrowRight className="h-5 w-5" />
                </a>
                <a href="/c/creator-launch-2026" className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white/80 px-8 py-4 text-base font-black text-slate-700 transition-colors hover:border-fuchsia-300 hover:text-fuchsia-600">
                  See a live campaign <ChevronRight className="h-5 w-5" />
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-bold text-slate-500">
                <span className="flex items-center gap-2"><Gift className="h-4 w-4 text-orange-500" /> Prize-funded growth, not ad spend</span>
                <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Fraud review built in</span>
              </div>
            </div>

            {/* Animated entrant meter card */}
            <motion.div
              className="relative mx-auto w-full max-w-md"
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="animate-vw-float absolute -top-9 -left-6 z-10 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-fuchsia-500/20 ring-4 ring-fuchsia-200">
                <p className="text-2xl font-black text-fuchsia-600">+97</p>
                <p className="text-xs font-bold text-slate-500">local entrants today</p>
              </div>
              <div className="animate-vw-float absolute -top-6 -right-8 z-10 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-orange-500/20 ring-4 ring-orange-200" style={{ animationDelay: '-2.5s' }}>
                <p className="flex items-center gap-1.5 text-sm font-black text-orange-600"><Sparkles className="h-4 w-4 fill-orange-300" /> +5 entries</p>
                <p className="text-xs font-bold text-slate-500">4 friends joined</p>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-2xl shadow-fuchsia-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 p-2"><Trophy className="h-5 w-5 text-white" /></div>
                    <div>
                      <p className="text-sm font-black">Creator Launch 2026</p>
                      <p className="text-xs font-bold text-slate-400">Local competition</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">LIVE</span>
                </div>
                <p className="mt-6 mb-2 flex items-end justify-between">
                  <span className="text-3xl font-black"><CountUp to={2318} /></span>
                  <span className="text-xs font-bold text-slate-400">of 2,500 entrants</span>
                </p>
                <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    className="animate-vw-gradient h-full rounded-full bg-gradient-to-r from-orange-400 via-rose-500 to-fuchsia-500"
                    initial={{ width: '0%' }}
                    animate={{ width: '92%' }}
                    transition={{ duration: 1.4, ease: 'easeOut', delay: 0.4 }}
                  />
                </div>
                <p className="mt-3 flex items-center gap-2 text-xs font-bold text-fuchsia-600">
                  <Gauge className="h-4 w-4" /> 92% full — we&apos;ll auto-offer an upgrade before the cap.
                </p>
                <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Referral math</p>
                  <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                    <div><p className="text-xl font-black text-orange-500"><CountUp to={812} /></p><p className="text-[11px] font-bold text-slate-500">referrals</p></div>
                    <div><p className="text-xl font-black text-fuchsia-500"><CountUp to={6.4} decimals={1} /></p><p className="text-[11px] font-bold text-slate-500">avg shares/entrant</p></div>
                    <div><p className="text-xl font-black text-emerald-600">$0</p><p className="text-[11px] font-bold text-slate-500">cost per view</p></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* STAT STRIP */}
        <section className="animate-vw-gradient bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 py-10 text-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 text-center md:grid-cols-4">
            {[
              { value: '100x', label: 'more local reach than paid ads' },
              { value: <CountUp to={6} suffix="+" />, label: 'shares per entrant on average' },
              { value: '5 min', label: 'to launch a live campaign' },
              { value: '$0', label: 'cost per engaged local view' },
            ].map((stat, index) => (
              <div key={index}>
                <p className="text-4xl font-black tracking-tight drop-shadow-sm sm:text-5xl">{stat.value}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WHY / COMPARISON */}
        <section id="benefits" className="mx-auto max-w-7xl px-6 py-24">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="rounded-full border-2 border-orange-200 bg-orange-100/70 px-4 py-2 text-xs font-black uppercase tracking-widest text-orange-600">Why a competition beats the ad spend</span>
            <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">Same budget. One gets clicks. <span className="animate-vw-gradient bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 bg-clip-text text-transparent">One builds a crowd.</span></h2>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="rounded-[2rem] border-2 border-dashed border-slate-300 bg-white/60 p-8">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-200 p-3"><Megaphone className="h-6 w-6 text-slate-500" /></div>
                  <p className="text-xl font-black text-slate-400">Paid ads</p>
                </div>
                <ul className="mt-6 space-y-4 text-slate-500">
                  <li className="flex items-start gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-slate-300" /><span>Reaches people <strong>once</strong>, only while you keep paying.</span></li>
                  <li className="flex items-start gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-slate-300" /><span>Every view has a hard cost — and clicks stop when spend stops.</span></li>
                  <li className="flex items-start gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-slate-300" /><span>You <strong>rent</strong> attention and keep almost nothing.</span></li>
                </ul>
                <p className="mt-8 rounded-2xl bg-slate-100 px-5 py-4 text-center font-black text-slate-400">Attention that vanishes</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="animate-vw-gradient rounded-[2rem] bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-8 text-white shadow-2xl shadow-rose-500/30">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/20 p-3 backdrop-blur"><Users className="h-6 w-6 text-white" /></div>
                  <p className="text-xl font-black">A ViralWins competition</p>
                </div>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-white/20 p-0.5" /><span>Every entrant invites friends — reach <strong>compounds</strong> while you&apos;re busy selling.</span></li>
                  <li className="flex items-start gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-white/20 p-0.5" /><span>One prize works <strong>24/7</strong> for weeks, for roughly the cost of a campaign ad.</span></li>
                  <li className="flex items-start gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-white/20 p-0.5" /><span>You <strong>own</strong> the list, the referrals, and the local data forever.</span></li>
                </ul>
                <p className="mt-8 rounded-2xl bg-white/15 px-5 py-4 text-center font-black backdrop-blur">A crowd you keep</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* BENEFIT FEATURES */}
        <section className="border-y-2 border-slate-100 bg-white/60 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="mx-auto max-w-3xl text-center">
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Every feature is built to <span className="animate-vw-gradient bg-gradient-to-r from-sky-500 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent">grow your local brand</span></h2>
              <p className="mt-4 text-lg text-slate-600">Not a checkbox parade — a growth engine your whole town can talk about.</p>
            </Reveal>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Share2, color: 'from-orange-400 to-rose-500', shadow: 'shadow-orange-500/25', title: 'Viral action hub', desc: 'Let entrants earn entries by referring friends, sharing, posting, subscribing, or watching. Every action throws your brand further into the local conversation.' },
                { icon: TrendingUp, color: 'from-rose-500 to-fuchsia-500', shadow: 'shadow-fuchsia-500/25', title: 'Reach that compounds', desc: 'Each entrant is a potential customer who brings their friends. One prize can out-perform an entire month of ad spend — for the same price.' },
                { icon: ShieldCheck, color: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/25', title: 'Responsible operations', desc: 'Verification, fraud review, official rules, and promoter ownership stay visible — so your campaign stays fair and your brand stays protected.' },
                { icon: BarChart3, color: 'from-sky-400 to-indigo-500', shadow: 'shadow-sky-500/25', title: 'Decisions, not guesses', desc: 'Turn signups, referrals, points, and entries into clear growth data — with live analytics and one-click promoter exports.' },
                { icon: Gauge, color: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-500/25', title: 'No-surprise entrant caps', desc: 'We monitor your entrant volume in real time and auto-offer an upgrade as you approach your plan limit. You never stall mid-campaign.' },
                { icon: Globe, color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/25', title: 'Your data, yours', desc: 'Every entrant, referral, and action belongs to you. Export clean CSV files for any spreadsheet or CRM, or go further with custom brand themes and domains on higher plans.' },
              ].map((feature, index) => (
                <Reveal key={index} delay={index * 0.05}>
                  <div className="group h-full rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-fuchsia-500/10">
                    <div className={`inline-flex rounded-2xl bg-gradient-to-br ${feature.color} p-3.5 shadow-lg ${feature.shadow} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-6 text-xl font-black">{feature.title}</h3>
                    <p className="mt-3 text-base leading-relaxed text-slate-600">{feature.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* PROMOTER APP HIGHLIGHT CARD */}
            <Reveal delay={0.3}>
              <div className="mt-6 grid overflow-hidden rounded-[2rem] border-2 border-fuchsia-200 bg-white shadow-lg shadow-fuchsia-500/10 lg:grid-cols-3">
                <div className="flex flex-col justify-center gap-4 bg-gradient-to-br from-fuchsia-500 via-rose-500 to-orange-400 p-8 text-white">
                  <div className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white/20 px-3 py-1.5 text-xs font-black uppercase tracking-widest backdrop-blur">
                    <Smartphone className="h-4 w-4" /> On every plan
                  </div>
                  <h3 className="text-2xl font-black leading-tight sm:text-3xl">Run your whole campaign from the promoter app</h3>
                  <p className="text-sm font-semibold leading-relaxed text-white/90">Launch, monitor, and scale your competitions from any phone, tablet, or laptop — no design or dev skills needed.</p>
                </div>
                <div className="grid gap-1.5 p-7 sm:grid-cols-2 lg:col-span-2">
                  {[
                    { icon: Rocket, label: 'One-click launch', desc: 'Go live in minutes from the dashboard.' },
                    { icon: BarChart3, label: 'Live entrant analytics', desc: 'Watch signups, referrals, and entries in real time.' },
                    { icon: Gauge, label: 'Cap monitoring', desc: 'See when you approach your plan limit with auto-upgrade offers.' },
                    { icon: FileSpreadsheet, label: 'In-app CSV exports', desc: 'Pull your clean entrant list straight to a spreadsheet or CRM.' },
                  ].map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                      <div className="rounded-xl bg-gradient-to-br from-orange-400 to-fuchsia-500 p-2.5 shadow-sm"><Icon className="h-4 w-4 text-white" /></div>
                      <div>
                        <p className="text-sm font-black">{label}</p>
                        <p className="text-xs font-semibold text-slate-500">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="rounded-full border-2 border-fuchsia-200 bg-fuchsia-100/70 px-4 py-2 text-xs font-black uppercase tracking-widest text-fuchsia-600">Simple pricing</span>
            <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">Pick your growth level</h2>
            <p className="mt-4 text-lg text-slate-600">Start at <strong className="text-slate-900">$18/mo billed annually</strong>. Every plan includes live entrant-cap monitoring. Stripe payment and promoter provisioning happen before dashboard access is granted.</p>
          </Reveal>

          <div className="mt-14 grid gap-7 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <Reveal key={plan.name} delay={index * 0.08} className="h-full">
                <article className={`relative flex h-full flex-col rounded-[2rem] p-8 ${plan.popular ? 'animate-vw-gradient bg-gradient-to-b from-fuchsia-600 to-rose-500 text-white shadow-2xl shadow-fuchsia-500/30' : 'border border-slate-200 bg-white shadow-sm'}`}>
                  {plan.popular && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 rotate-[-2deg] rounded-full bg-orange-400 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-orange-500/30 animate-vw-wiggle">
                      Most popular
                    </span>
                  )}
                  <div className={`flex items-center gap-2 self-start rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest ${plan.popular ? 'bg-white/20 text-white' : plan.chip}`}>
                    <Rocket className="h-3.5 w-3.5" /> {plan.name}
                  </div>
                  <h3 className="mt-4 text-2xl font-black">{plan.tagline}</h3>
                  <div className="mt-6">
                    <p className={`text-5xl font-black tracking-tight ${plan.popular ? '' : 'text-slate-900'}`}>{plan.priceDisplay}</p>
                    <p className={`mt-2 text-sm font-bold ${plan.popular ? 'text-white/85' : 'text-slate-500'}`}>{plan.priceNote}</p>
                  </div>
                  <ul className={`mt-7 flex-1 space-y-3 border-y py-6 ${plan.popular ? 'border-white/25' : 'border-slate-200'}`}>
                    {plan.features.map((featureLine) => (
                      <li key={featureLine} className={`flex items-start gap-3 text-sm font-semibold ${plan.popular ? 'text-white' : 'text-slate-700'}`}>
                        <Check className={`mt-0.5 h-5 w-5 shrink-0 rounded-full p-0.5 ${plan.popular ? 'bg-white/25 text-white' : 'bg-emerald-100 text-emerald-600'}`} />
                        <span>{featureLine}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="#access" className={`mt-7 block rounded-2xl px-6 py-4 text-center text-base font-black transition-transform hover:scale-[1.03] active:scale-95 ${plan.popular ? 'bg-white text-fuchsia-700 shadow-lg' : `animate-vw-gradient bg-gradient-to-r ${plan.accent} text-white shadow-lg`}`}>
                    Choose {plan.name}
                  </a>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 mx-auto max-w-3xl">
            <div className="flex flex-col items-center gap-3 rounded-[2rem] border-2 border-dashed border-slate-300 bg-white/60 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <p className="flex items-center justify-center gap-2 text-base font-black sm:justify-start">Need more than 25,000 entrants a month? <Trophy className="h-5 w-5 text-orange-500" /></p>
                <p className="mt-1 text-sm font-semibold text-slate-500">Agencies and high-volume brands — contact us for custom volume, sub-accounts, and onboarding.</p>
              </div>
              <a href="mailto:hello@viralwins.app" className="shrink-0 rounded-xl border-2 border-fuchsia-200 bg-white px-6 py-3 text-sm font-black text-fuchsia-600 transition-colors hover:border-fuchsia-400">Contact us</a>
            </div>
          </Reveal>
        </section>

        {/* ACCESS FORM */}
        <section id="access" className="mb-20">
          <Reveal className="mx-auto max-w-2xl">
            <div className="animate-vw-gradient overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-600 via-fuchsia-600 to-rose-500 p-9 text-white shadow-2xl shadow-fuchsia-500/30">
              <h2 className="text-center text-3xl font-black tracking-tight">Ready to grow?</h2>
              <p className="mx-auto mt-3 max-w-md text-center text-sm font-semibold text-white/85">Enter your promoter email to open the dashboard. Payment and provisioning are handled securely by Stripe before access is granted.</p>
              <form onSubmit={requestTestAccess} className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row">
                <input
                  value={testEmail}
                  onChange={(event) => setTestEmail(event.target.value)}
                  type="email"
                  required
                  placeholder="promoter@yourbrand.com"
                  className="min-w-0 flex-1 rounded-2xl border border-white/25 bg-white/15 px-5 py-4 text-sm font-semibold text-white placeholder-white/60 outline-none backdrop-blur focus:border-white/60"
                />
                <button disabled={isLoading} className="rounded-2xl bg-white px-7 py-4 text-base font-black text-fuchsia-700 shadow-lg transition-transform hover:scale-105 disabled:opacity-60 disabled:hover:scale-100">
                  {isLoading ? 'Checking…' : 'Open dashboard'}
                </button>
              </form>
              {accessError && <p className="mt-4 text-center text-sm font-bold text-amber-300">{accessError}</p>}
              <p className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-white/70">
                <FileSpreadsheet className="h-4 w-4" /> One-click entrant CSV export on every plan
              </p>
            </div>
          </Reveal>
        </section>
      </main>

      <SalesFooter />
    </div>
  );
}