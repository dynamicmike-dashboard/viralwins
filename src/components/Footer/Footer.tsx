import React from 'react';
import { 
  ShieldCheck, 
  Scale, 
  LifeBuoy, 
  Download, 
  Lock, 
  FileText, 
  Sparkles, 
  Smartphone, 
  CheckCircle2, 
  ExternalLink,
  Award,
  Hash,
  Database,
  Layers,
  Heart,
  AlertTriangle,
  Building2
} from 'lucide-react';
import { Campaign } from '../../types';
import { triggerHapticFeedback } from '../../utils/haptics';

interface FooterProps {
  campaign: Campaign;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenComplaints: () => void;
  onOpenInstallApp: () => void;
  onOpenRules: () => void;
  onOpenFairDraw?: () => void;
  isStandalone?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  campaign,
  onOpenPrivacy,
  onOpenTerms,
  onOpenComplaints,
  onOpenInstallApp,
  onOpenRules,
  onOpenFairDraw,
  isStandalone = false
}) => {
  return (
    <footer className="w-full bg-white border-t border-slate-200/90 text-slate-700 mt-16 pt-12 pb-24 lg:pb-12 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Feature / Trust Bar */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-pink-50/60 border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/25 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Verifiable Cryptographic Fairness & Regulatory Transparency
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                100% Deterministic SHA-256 entropy lottery draws, anti-fraud bot protection, and independent promoter governance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                triggerHapticFeedback('light');
                onOpenInstallApp();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 transition active:scale-98"
            >
              <Download className="w-3.5 h-3.5" />
              {isStandalone ? 'PWA Installed' : 'Install App to Device'}
            </button>

            <button
              onClick={() => {
                triggerHapticFeedback('light');
                onOpenComplaints();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 shadow-2xs transition active:scale-98"
            >
              <LifeBuoy className="w-3.5 h-3.5 text-indigo-600" />
              Complaints & Dispute Portal
            </button>
          </div>
        </div>

        {/* Platform Technology Notice / Non-Liability Ribbon */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs text-slate-600">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="leading-relaxed">
            <strong className="text-slate-900 font-bold">Technology Provider Separation Notice: </strong>
            ViralEngine Studio is strictly the software infrastructure provider. 
            This promotion is organized and sponsored independently by <strong className="text-slate-900">{campaign.clientName}</strong>. 
            This platform is not liable for any losses, claims, or prize fulfillments. Entrants must inspect the specific terms and policies provided by the promoter.
          </div>
        </div>

        {/* 4-Column Navigation & Compliance Directory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-2">
          
          {/* Col 1: Platform & Campaign Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-xs">
                <img src="/favicon.svg" alt="Logo" className="w-full h-full rounded-xl" />
              </div>
              <span className="font-black text-slate-900 text-sm tracking-tight">
                ViralEngine Studio
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Enterprise viral referral software, automated dual-sided reward allocation, and provably fair cryptographic sweepstakes draws.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Sponsor: <strong className="text-slate-900">{campaign.clientName}</strong>
              </span>
            </div>
          </div>

          {/* Col 2: Legal & Regulations */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-600" /> Legal & Terms
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    triggerHapticFeedback('light');
                    onOpenPrivacy();
                  }}
                  className="text-slate-600 hover:text-indigo-600 font-semibold transition flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Privacy Policy & Data Notice
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    triggerHapticFeedback('light');
                    onOpenTerms();
                  }}
                  className="text-slate-600 hover:text-indigo-600 font-semibold transition flex items-center gap-1.5"
                >
                  <Scale className="w-3.5 h-3.5 text-amber-600" /> Terms & Conditions (T&C)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    triggerHapticFeedback('light');
                    onOpenRules();
                  }}
                  className="text-slate-600 hover:text-indigo-600 font-semibold transition flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600" /> Official Sweepstakes Rules
                </button>
              </li>
              <li>
                <span className="text-[11px] text-slate-500 font-mono">
                  No Purchase Necessary • 18+
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Complaints, Disputes & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <LifeBuoy className="w-3.5 h-3.5 text-indigo-600" /> Trust & Disputes
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    triggerHapticFeedback('light');
                    onOpenComplaints();
                  }}
                  className="text-slate-600 hover:text-indigo-600 font-semibold transition flex items-center gap-1.5"
                >
                  <LifeBuoy className="w-3.5 h-3.5 text-indigo-600" /> Promoter Complaints Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    triggerHapticFeedback('light');
                    onOpenComplaints();
                  }}
                  className="text-slate-600 hover:text-indigo-600 font-semibold transition flex items-center gap-1.5"
                >
                  <Hash className="w-3.5 h-3.5 text-purple-600" /> Track Ticket / Appeal Status
                </button>
              </li>
              {onOpenFairDraw && (
                <li>
                  <button
                    onClick={() => {
                      triggerHapticFeedback('light');
                      onOpenFairDraw();
                    }}
                    className="text-slate-600 hover:text-indigo-600 font-semibold transition flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-500" /> Cryptographic Draw Ledger
                  </button>
                </li>
              )}
              <li>
                <span className="text-[11px] text-slate-500">
                  Target Promoter SLA: &lt; 24h
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Progressive Web App & Technology */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-indigo-600" /> App & Infrastructure
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    triggerHapticFeedback('light');
                    onOpenInstallApp();
                  }}
                  className="text-indigo-700 hover:text-indigo-900 font-bold transition flex items-center gap-1.5 bg-indigo-50/80 px-2.5 py-1 rounded-lg border border-indigo-200"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-600" /> Install App (iOS, Android, PC)
                </button>
              </li>
              <li className="flex items-center gap-1.5 text-slate-600">
                <Database className="w-3.5 h-3.5 text-indigo-600" /> Offline Storage Engine: Active
              </li>
              <li className="flex items-center gap-1.5 text-slate-600">
                <Layers className="w-3.5 h-3.5 text-emerald-600" /> Teable REST Backend Sync
              </li>
            </ul>
          </div>

        </div>

        {/* Quick Modal Direct Trigger Ribbon */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-bold">
          <button
            onClick={() => {
              triggerHapticFeedback('light');
              onOpenPrivacy();
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Privacy Policy
          </button>

          <button
            onClick={() => {
              triggerHapticFeedback('light');
              onOpenTerms();
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center gap-1"
          >
            <Scale className="w-3.5 h-3.5 text-amber-600" /> Terms & Conditions
          </button>

          <button
            onClick={() => {
              triggerHapticFeedback('light');
              onOpenComplaints();
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center gap-1"
          >
            <LifeBuoy className="w-3.5 h-3.5 text-indigo-600" /> Complaints & Disputes
          </button>

          <button
            onClick={() => {
              triggerHapticFeedback('light');
              onOpenInstallApp();
            }}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" /> Install App
          </button>

          <button
            onClick={() => {
              triggerHapticFeedback('light');
              onOpenRules();
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" /> Official Rules
          </button>
        </div>

        {/* Bottom Legal Copyright & Security Seals */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="text-center sm:text-left space-y-0.5">
            <p>© 2026 {campaign.agencyName}. All rights reserved.</p>
            <p className="text-[11px] text-slate-400">
              Sponsored solely by {campaign.clientName}. Grand Prize ARV: ${campaign.prizeValueUsd.toLocaleString()} USD.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-slate-600">
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" /> TLS 1.3
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-indigo-600" /> SHA-256 Entropy
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> PWA Ready
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
