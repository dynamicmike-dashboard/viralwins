import React, { useState } from 'react';
import {
  Cpu,
  Palette,
  CheckCircle2,
  Code,
  ChevronRight
} from 'lucide-react';
import { triggerHapticFeedback } from '../../utils/haptics';

export const DesignBenchmarkView: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<'ai_studio' | 'stitch' | 'opencode'>('ai_studio');

  const benchmarkData = {
    ai_studio: {
      name: "Google AI Studio",
      badge: "State & Architecture Winner",
      accent: "text-indigo-700 border-indigo-200 bg-indigo-50",
      description: "Full-stack React & TypeScript integration with deep reactive state, deterministic fairness lottery math, live countdown logic, and client-side anti-fraud filters.",
      keyStrengths: [
        "Interactive countdown ticker with sub-second accuracy & zero memory leaks",
        "Deterministic cryptographic pseudo-random raffle picker with SHA-256 proofs",
        "Seamless state coordination between Participant Hub, Agency Customizer & Analytics",
        "Video watch-time verification timers with celebratory confetti unlocks"
      ],
      architecturalApproach: "Single-source-of-truth TypeScript state engine powering instant customizer live-sync, Web Share fallback protocols, and mock API data persistence.",
      bestUsedFor: "Functional production web applications, full-stack prototypes, and reactive gamified consumer experiences."
    },
    stitch: {
      name: "Google Stitch",
      badge: "Visual & Micro-Interaction Winner",
      accent: "text-emerald-800 border-emerald-200 bg-emerald-50",
      description: "Ultra-clean visual component design system emphasizing glassmorphism, responsive mobile-first typography, fluid touch targets, and high-converting prize spotlights.",
      keyStrengths: [
        "1px slate-200 border styling with subtle ambient backdrop blur glow",
        "Adaptive split-screen layout (Agency visual controls on left, mobile preview on right)",
        "Distinct brand-colored action badges (+3 Entries, +5 Entries) with instant hover states",
        "Refined typographic hierarchy with Google Fonts (Plus Jakarta Sans, Syne, Outfit)"
      ],
      architecturalApproach: "Component-driven design system with CSS custom property injection for instant primary & accent theme mutations without DOM re-renders.",
      bestUsedFor: "Visual design exploration, high-fidelity UI mockup testing, and executive design presentations."
    },
    opencode: {
      name: "OpenCode / Antigravity",
      badge: "Full-Stack Orchestration Winner",
      accent: "text-amber-800 border-amber-200 bg-amber-50",
      description: "Backend database layer wiring, server-only secret isolation, Teable REST endpoints, rate limiting, and automated multi-tenant table migrations.",
      keyStrengths: [
        "Server-only Teable client keeping API secrets away from client bundles",
        "Atomic subscriber registration & dual-sided referral attribution (+5 entries to inviter)",
        "Fraud detection rules: duplicate IP cluster detection & disposable email filtering",
        "CSV export and immutable audit log serialization"
      ],
      architecturalApproach: "Next.js App Router API endpoints (`/api/campaigns/[slug]/join`) with structured JSON schema contracts and database middleware.",
      bestUsedFor: "Scalable SaaS backends, database schema syncing, and hardened API production infrastructure."
    }
  };

  const current = benchmarkData[selectedPlatform];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white border border-slate-200/90 p-6 rounded-3xl backdrop-blur-md shadow-xl shadow-slate-900/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 uppercase">
              Design & Architecture Benchmark
            </span>
            <span className="text-xs text-slate-500 font-semibold">Viral Referral & Sweepstakes Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Google AI Studio vs. Google Stitch vs. OpenCode
          </h1>
        </div>

        {/* Platform Selector */}
        <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-2xl overflow-x-auto no-scrollbar shadow-2xs">
          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setSelectedPlatform('ai_studio');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedPlatform === 'ai_studio' ? 'bg-white text-indigo-600 shadow-xs ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Google AI Studio
          </button>
          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setSelectedPlatform('stitch');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedPlatform === 'stitch' ? 'bg-white text-indigo-600 shadow-xs ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Google Stitch
          </button>
          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setSelectedPlatform('opencode');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedPlatform === 'opencode' ? 'bg-white text-indigo-600 shadow-xs ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            OpenCode / Backend
          </button>
        </div>
      </div>

      {/* Benchmark Dimension Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: AI Studio */}
        <div 
          onClick={() => {
            triggerHapticFeedback('light');
            setSelectedPlatform('ai_studio');
          }}
          className={`p-6 rounded-3xl border transition cursor-pointer ${
            selectedPlatform === 'ai_studio'
              ? 'bg-white border-indigo-600 ring-2 ring-indigo-100 shadow-xl'
              : 'bg-white/80 border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
              State & Logic
            </span>
          </div>

          <h3 className="text-lg font-extrabold text-slate-900 mb-2">Google AI Studio</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
            Excels at full functional application logic, reactive state hooks, deterministic lottery draws, and countdown synchronization.
          </p>

          <div className="text-xs font-bold text-indigo-600 flex items-center gap-1">
            Explore AI Studio Implementation <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 2: Google Stitch */}
        <div 
          onClick={() => {
            triggerHapticFeedback('light');
            setSelectedPlatform('stitch');
          }}
          className={`p-6 rounded-3xl border transition cursor-pointer ${
            selectedPlatform === 'stitch'
              ? 'bg-white border-emerald-600 ring-2 ring-emerald-100 shadow-xl'
              : 'bg-white/80 border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Palette className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Visual & UI/UX
            </span>
          </div>

          <h3 className="text-lg font-extrabold text-slate-900 mb-2">Google Stitch</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
            Focuses on aesthetic design systems, responsive glassmorphism, fluid micro-interactions, and high-impact hero presentation.
          </p>

          <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            Explore Stitch Design System <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3: OpenCode */}
        <div 
          onClick={() => {
            triggerHapticFeedback('light');
            setSelectedPlatform('opencode');
          }}
          className={`p-6 rounded-3xl border transition cursor-pointer ${
            selectedPlatform === 'opencode'
              ? 'bg-white border-amber-600 ring-2 ring-amber-100 shadow-xl'
              : 'bg-white/80 border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
              <Code className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Backend & Schema
            </span>
          </div>

          <h3 className="text-lg font-extrabold text-slate-900 mb-2">OpenCode / Antigravity</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
            Focuses on Teable relational schema wiring, server-side environment variable security, rate limits, and audit logs.
          </p>

          <div className="text-xs font-bold text-amber-600 flex items-center gap-1">
            Explore Backend Architecture <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>

      {/* Detailed Deep-Dive for Selected Platform */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl shadow-slate-900/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${current.accent} uppercase font-mono`}>
              {current.badge}
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-2">
              {current.name} Focus & Implementation Highlights
            </h2>
          </div>
        </div>

        <p className="text-sm text-slate-700 font-medium leading-relaxed">
          {current.description}
        </p>

        {/* Key Strengths */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Key Capabilities</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {current.keyStrengths.map((strength, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{strength}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Architectural Approach & Recommendation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-indigo-700">Architectural Core</span>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">{current.architecturalApproach}</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-emerald-700">Best Deployed In</span>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">{current.bestUsedFor}</p>
          </div>
        </div>

      </div>

    </div>
  );
};
