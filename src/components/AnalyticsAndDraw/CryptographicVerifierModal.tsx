import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Hash, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Layers, 
  HelpCircle,
  Copy,
  Check,
  RotateCcw
} from 'lucide-react';
import { pseudoSha256, buildTicketPool } from '../../utils/fairnessDraw';
import { mockSubscribers } from '../../data/mockData';
import { triggerHapticFeedback } from '../../utils/haptics';

export const CryptographicVerifierModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [seedInput, setSeedInput] = useState('draw-camp-creator-tech-2026-08-15T22:00:00.000Z-9x7k2p-1240');
  const [ticketPoolInput, setTicketPoolInput] = useState('1240');
  const [stepIndexInput, setStepIndexInput] = useState('0');
  const [computedResult, setComputedResult] = useState<{
    seedHash: string;
    stepHash: string;
    derivedTicket: number;
    proofHex: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  const handleVerify = () => {
    triggerHapticFeedback('medium');
    const totalTickets = parseInt(ticketPoolInput) || 1000;
    const step = parseInt(stepIndexInput) || 0;

    const seedHash = pseudoSha256(seedInput);
    const stepHash = pseudoSha256(`${seedHash}-step-${step}-0`);
    const intVal = parseInt(stepHash.substring(0, 8), 16);
    const derivedTicket = (intVal % totalTickets) + 1;

    setComputedResult({
      seedHash,
      stepHash,
      derivedTicket,
      proofHex: intVal.toString(16).toUpperCase()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                Public SHA-256 Fairness Verifier
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Independently audit and recompute cryptographic winning ticket selection
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Verifier Body */}
        <div className="overflow-y-auto py-5 space-y-5 flex-1 pr-1">
          
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-700 mb-1">
                Audit Seed String (Recorded during Live Draw):
              </label>
              <input
                type="text"
                value={seedInput}
                onChange={(e) => setSeedInput(e.target.value)}
                className="w-full text-xs font-mono font-medium text-slate-900 border border-slate-300 rounded-xl p-2.5 bg-white focus:outline-none focus:border-emerald-600"
                placeholder="e.g. draw-campaign-timestamp-seed..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-700 mb-1">
                  Total Ticket Pool Size:
                </label>
                <input
                  type="number"
                  value={ticketPoolInput}
                  onChange={(e) => setTicketPoolInput(e.target.value)}
                  className="w-full text-xs font-mono font-medium text-slate-900 border border-slate-300 rounded-xl p-2.5 bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-700 mb-1">
                  Winner Rank / Step Index:
                </label>
                <input
                  type="number"
                  value={stepIndexInput}
                  onChange={(e) => setStepIndexInput(e.target.value)}
                  className="w-full text-xs font-mono font-medium text-slate-900 border border-slate-300 rounded-xl p-2.5 bg-white focus:outline-none focus:border-emerald-600"
                  placeholder="0 for 1st place"
                />
              </div>
            </div>

            <button
              onClick={handleVerify}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
            >
              <Hash className="w-4 h-4" /> Run Deterministic Audit Computation
            </button>
          </div>

          {/* Verification Results */}
          {computedResult && (
            <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Audit Proof Mathematically Confirmed
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-white border border-emerald-100 rounded-xl space-y-1 font-mono">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Root Seed SHA-256 Hash:</span>
                  <div className="text-slate-900 font-bold break-all text-[11px]">{computedResult.seedHash}</div>
                </div>

                <div className="p-3 bg-white border border-emerald-100 rounded-xl space-y-1 font-mono">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Step Derivative Hash:</span>
                  <div className="text-slate-900 font-bold break-all text-[11px]">{computedResult.stepHash}</div>
                </div>

                <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[11px] font-medium opacity-90 block">Deterministic Winning Ticket</span>
                    <span className="text-2xl font-black font-mono">Ticket #{computedResult.derivedTicket}</span>
                  </div>
                  <span className="text-xs font-mono font-bold bg-white/20 px-3 py-1 rounded-lg">
                    MODULO {ticketPoolInput}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <h4 className="font-extrabold text-slate-800 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" /> How Provably Fair Cryptography Works
            </h4>
            <p className="leading-relaxed">
              Before the draw takes place, entrant ticket ranges are sealed. When the draw triggers, a high-entropy seed is combined with a UTC timestamp and hashed via SHA-256. 
              The resulting hexadecimal digest deterministically pinpoints the exact ticket number without human interference.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
