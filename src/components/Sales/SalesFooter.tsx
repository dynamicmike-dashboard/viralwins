import React, { useState } from 'react';
import { X, ShieldCheck, Scale, AlertTriangle, Download, Flame, Smartphone, Lock, FileText, Check, Copy } from 'lucide-react';

const PLATFORM = 'ViralWins';

type ModalKind = 'privacy' | 'terms' | 'disclaimer' | 'install' | null;

function ModalShell({ title, icon, onClose, children }: { title: string; icon: React.ReactNode; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B1035]/50 backdrop-blur-md" onClick={onClose}>
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-[#FFF8EF] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="animate-vw-gradient rounded-2xl bg-gradient-to-br from-orange-400 via-rose-500 to-fuchsia-500 p-2.5 text-white">{icon}</div>
            <h3 className="text-lg font-black text-[#1B1035]">{title}</h3>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button>
        </div>
        <div className="overflow-y-auto px-6 py-6 text-sm leading-relaxed text-slate-700">{children}</div>
      </div>
    </div>
  );
}

function Section({ number, heading, children }: { number: string; heading: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <h4 className="mb-1.5 font-black text-slate-900">{number}. {heading}</h4>
      <div className="space-y-2 text-slate-600">{children}</div>
    </section>
  );
}

function InstallAppModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ModalShell title="Install the ViralWins app" icon={<Smartphone className="h-4 w-4" />} onClose={onClose}>
      <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-orange-400 via-rose-500 to-fuchsia-500 p-2.5"><Flame className="h-5 w-5 text-white" /></div>
          <div>
            <p className="font-black text-slate-900">{PLATFORM}</p>
            <p className="text-xs font-semibold text-slate-500">Progressive Web App — installs on iOS, Android, Windows, and macOS</p>
          </div>
        </div>
        <button onClick={copyLink} className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-fuchsia-600 hover:text-fuchsia-800">{copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}{copied ? 'Copied' : 'Copy link'}</button>
      </div>

      <Section number="1" heading="iPhone / iPad (Safari)">
        <p>Open the dashboard in Safari &rarr; tap the <strong>Share</strong> button &rarr; <strong>Add to Home Screen</strong> &rarr; tap <strong>Add</strong>. The app then opens its own full-screen window.</p>
      </Section>
      <Section number="2" heading="Android (Chrome / Brave)">
        <p>Tap the browser menu (⋮) &rarr; select <strong>Add to Home screen</strong> (or <strong>Install app</strong>). The app installs like any Android app.</p>
      </Section>
      <Section number="3" heading="Windows / Chrome & Edge">
        <p>Click the <strong>Install</strong> icon in the address bar &rarr; confirm. A dedicated desktop window launches instantly.</p>
      </Section>
      <Section number="4" heading="Why the app?">
        <p>Native app speed, offline caching of the dashboard, and home-screen shortcuts to your campaigns — with no app-store fees or installers.</p>
      </Section>
    </ModalShell>
  );
}

function PrivacyModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell title="Privacy Policy" icon={<ShieldCheck className="h-4 w-4" />} onClose={onClose}>
      <div className="mb-5 rounded-2xl bg-amber-50 p-4 text-xs text-amber-900">
        <strong className="mb-1 flex items-center gap-1.5 font-extrabold text-amber-950"><AlertTriangle className="h-4 w-4 text-amber-600" /> {PLATFORM} is a software provider.</strong>
        <p>This privacy policy covers the {PLATFORM} platform itself. Each campaign{'s'} promoter remains the data controller for the entrants they collect and is responsible for their own campaign-level privacy notices.</p>
      </div>
      <Section number="1" heading="Who we are">
        <p>{PLATFORM} provides campaign infrastructure — giveaway, sweepstakes, and referral software — used by independent promoters. We process platform-account data on behalf of each promoter.</p>
      </Section>
      <Section number="2" heading="Information we collect">
        <p>When you create a promoter account: your name, email address, and a derived sign-in credential. When you configure a campaign: the content and entrant/action settings you provide.</p>
      </Section>
      <Section number="3" heading="How we use it">
        <p>To operate your account, power your campaigns, display live analytics, and keep the platform secure. We do not sell promoter or entrant personal data.</p>
      </Section>
      <Section number="4" heading="Entrant data">
        <p>Entrants who join your campaigns submit their name and email directly to the campaign. You own that list and can export it. Promoters must publish their own entrant-facing privacy notice describing how they use entrant contact details.</p>
      </Section>
      <Section number="5" heading="Retention & security">
        <p>We retain account data for as long as your account is active, plus a short reconciliation window. Communications are encrypted in transit (TLS); stored records are access-controlled.</p>
      </Section>
      <Section number="6" heading="Your rights">
        <p>You may request access, correction, or deletion of your account data at any time by contacting support. Entrants should direct privacy requests to the promoter of the campaign they joined.</p>
      </Section>
      <p className="text-xs text-slate-400">Last updated: August 2026.</p>
    </ModalShell>
  );
}

function TermsModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell title="Terms & Conditions" icon={<Scale className="h-4 w-4" />} onClose={onClose}>
      <div className="mb-5 rounded-2xl bg-amber-50 p-4 text-xs text-amber-900">
        <strong className="mb-1 flex items-center gap-1.5 font-extrabold text-amber-950"><AlertTriangle className="h-4 w-4 text-amber-600" /> Summary for promoters.</strong>
        <p>You are responsible for your own campaigns: prizes, eligibility, terms, and legal compliance in the jurisdictions you operate in. {PLATFORM} supplies software only.</p>
      </div>
      <Section number="1" heading="Using the platform">
        <p>You must be 18+ and use {PLATFORM} lawfully. We grant you a non-exclusive right to run campaigns through your plan, subject to these terms and fair use.</p>
      </Section>
      <Section number="2" heading="Promoter responsibilities">
        <p>Each promoter is solely responsible for their campaign: the prize and its fulfillment, eligibility rules, entrant communications, and compliance with all applicable promotional and data-protection laws. You must make your own rules, terms, and privacy notice available to entrants.</p>
      </Section>
      <Section number="3" heading="Fees & plans">
        <p>Plans are billed in advance (annually or monthly, as shown at signup). Entrant-volume caps on each plan are monitored automatically; approaching your cap triggers an upgrade offer rather than an abrupt stop.</p>
      </Section>
      <Section number="4" heading="Acceptable use">
        <p>No illegal promotions, deceptive entry mechanics, spamming, or violating third-party platform terms. We may suspend campaigns that abuse the platform or harm entrants.</p>
      </Section>
      <Section number="5" heading="Limitation of liability">
        <p>To the maximum extent permitted by law, {PLATFORM} is not liable for lost, delayed, or unfulfilled prizes, promoter non-performance, entrant disputes, or any indirect or consequential losses arising from your use of the platform.</p>
      </Section>
      <Section number="6" heading="Contact">
        <p>Questions about these terms: <a className="font-bold text-fuchsia-600 hover:underline" href="mailto:hello@viralwins.app">hello@viralwins.app</a>. For campaign-level disputes, contact the campaign promoter directly.</p>
      </Section>
      <p className="text-xs text-slate-400">Last updated: August 2026.</p>
    </ModalShell>
  );
}

function DisclaimerModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell title="Platform Disclaimer" icon={<AlertTriangle className="h-4 w-4" />} onClose={onClose}>
      <div className="mb-5 rounded-2xl bg-rose-50 p-4 text-xs text-rose-900">
        <strong className="mb-1 flex items-center gap-1.5 font-extrabold text-rose-950"><AlertTriangle className="h-4 w-4 text-rose-600" /> Important.</strong>
        <p>{PLATFORM} is exclusively a technology provider. It is not the promoter, sponsor, or organizer of any specific campaign.</p>
      </div>
      <Section number="1" heading="Technology-provider separation">
        <p>Every campaign on {PLATFORM} is independently conceived, organized, sponsored, and fulfilled by its promoter. {PLATFORM} only supplies the software, hosting, and analytics that make the campaign run.</p>
      </Section>
      <Section number="2" heading="No liability for prizes or promoter conduct">
        <p>{PLATFORM} does not fund, procure, warrant, insure, or guarantee any prize, draw outcome, or promoter obligation. Promoters are solely responsible for prize fulfillment, winner validation, tax treatment, and compliance with the law.</p>
      </Section>
      <Section number="3" heading="Entrants' information">
        <p>Entrants join a campaign with the specific promoter, not with {PLATFORM}. Entrants should read the campaign's official rules and the promoter's own terms and privacy notice before participating.</p>
      </Section>
      <Section number="4" heading="Availability of the software">
        <p>We work to keep the platform available, but we do not guarantee uninterrupted availability. We are not liable for outages, third-party service failures, or actions taken by external networks.</p>
      </Section>
      <Section number="5" heading="Not legal advice">
        <p>Content on this site, including these disclaimers, is general information, not legal advice. Promoters should consult a qualified professional for their specific jurisdiction.</p>
      </Section>
    </ModalShell>
  );
}

export function SalesFooter() {
  const [modal, setModal] = useState<ModalKind>(null);

  const links: { kind: ModalKind; label: string; icon: React.ReactNode }[] = [
    { kind: 'privacy', label: 'Privacy Policy', icon: <ShieldCheck className="h-4 w-4 text-emerald-600" /> },
    { kind: 'terms', label: 'Terms & Conditions', icon: <Scale className="h-4 w-4 text-amber-600" /> },
    { kind: 'disclaimer', label: 'Disclaimer', icon: <AlertTriangle className="h-4 w-4 text-orange-500" /> },
    { kind: 'install', label: 'Install App', icon: <Download className="h-4 w-4 text-fuchsia-600" /> },
  ];

  return (
    <footer className="border-t-2 border-slate-200 bg-white/60 px-6 py-12 text-[#1B1035]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="max-w-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="animate-vw-gradient rounded-2xl bg-gradient-to-br from-orange-400 via-rose-500 to-fuchsia-500 p-2.5 shadow-lg shadow-rose-500/30"><Flame className="h-5 w-5 text-white" /></div>
              <strong className="text-xl font-black tracking-tight">Viral<span className="text-fuchsia-600">Wins</span></strong>
            </div>
            <p className="text-sm font-semibold leading-relaxed text-slate-600">Campaign infrastructure for prize-funded local growth. Promoters run their own competitions — and keep every entrant, referral, and action they earn.</p>
            <p className="flex items-center gap-2 text-xs font-bold text-slate-500"><Lock className="h-3.5 w-3.5 text-emerald-600" /> Secure cloud data sync · TLS encrypted</p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Legal & platform</h4>
            <ul className="grid gap-2 sm:grid-cols-2">
              {links.map(({ kind, label, icon }) => (
                <li key={label}>
                  <button onClick={() => setModal(kind)} className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-fuchsia-50 hover:text-fuchsia-700">
                    {icon} {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-slate-200 pt-6 text-xs font-semibold text-slate-500 sm:flex-row sm:items-center">
          <p>ViralWins provides campaign infrastructure. Promoters remain responsible for their campaign terms, prizes, eligibility, and legal compliance. Prizes are promoter-funded — you grow with your own budget, not ad spend.</p>
          <p className="shrink-0">© 2026 ViralWins</p>
        </div>
      </div>

      {modal === 'privacy' && <PrivacyModal onClose={() => setModal(null)} />}
      {modal === 'terms' && <TermsModal onClose={() => setModal(null)} />}
      {modal === 'disclaimer' && <DisclaimerModal onClose={() => setModal(null)} />}
      {modal === 'install' && <InstallAppModal onClose={() => setModal(null)} />}
    </footer>
  );
}