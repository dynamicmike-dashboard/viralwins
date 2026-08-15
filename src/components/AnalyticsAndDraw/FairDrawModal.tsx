import React, { useState, useEffect } from 'react';
import {
  X,
  Trophy,
  Sparkles,
  ShieldCheck,
  Hash,
  CheckCircle2,
  Users,
  Copy,
  Check,
  RefreshCw,
  Award
} from 'lucide-react';
import { Campaign, Subscriber, DrawAuditRecord } from '../../types';
import { executeFairRaffleDraw } from '../../utils/fairnessDraw';
import { triggerFireworks } from '../../utils/confetti';
import { triggerHapticFeedback } from '../../utils/haptics';

interface FairDrawModalProps {
  campaign: Campaign;
  subscribers: Subscriber[];
  onClose: () => void;
  onSaveDrawAudit: (record: DrawAuditRecord) => void;
}

export const FairDrawModal: React.FC<FairDrawModalProps> = ({
  campaign,
  subscribers,
  onClose,
  onSaveDrawAudit
}) => {
  const [drawState, setDrawState] = useState<'idle' | 'spinning' | 'revealed'>('idle');
  const [animationIndex, setAnimationIndex] = useState(0);
  const [auditRecord, setAuditRecord] = useState<DrawAuditRecord | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const eligibleSubscribers = subscribers.filter(s => s.status === 'active' && s.totalEntries > 0);

  // Animated ticker during draw
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (drawState === 'spinning') {
      interval = setInterval(() => {
        setAnimationIndex(prev => (prev + 1) % (eligibleSubscribers.length || 1));
      }, 70);
    }
    return () => clearInterval(interval);
  }, [drawState, eligibleSubscribers.length]);

  const handleStartDraw = () => {
    if (eligibleSubscribers.length === 0) {
      triggerHapticFeedback('warning');
      return;
    }

    triggerHapticFeedback('medium');
    setDrawState('spinning');

    // Run deterministic calculation
    const result = executeFairRaffleDraw(
      subscribers,
      campaign.winnerCount,
      campaign.prizeTitle,
      campaign.id,
      campaign.title
    );

    // Simulate 3.2 seconds dramatic spinning reveal
    setTimeout(() => {
      setAuditRecord(result);
      setDrawState('revealed');
      onSaveDrawAudit(result);
      triggerHapticFeedback('success');
      triggerFireworks();
    }, 3200);
  };

  const copyProof = () => {
    if (auditRecord) {
      triggerHapticFeedback('success');
      navigator.clipboard.writeText(JSON.stringify(auditRecord, null, 2));
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={() => {
            triggerHapticFeedback('light');
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600">
              Verifiable Cryptographic Lottery
            </span>
            <h3 className="text-xl font-extrabold text-slate-900">
              Official Fair Prize Draw Engine
            </h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto space-y-6 pr-1">
          
          {/* Target Prize Overview */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Prize at Stake</span>
              <p className="text-sm font-extrabold text-slate-900 leading-tight">{campaign.prizeTitle}</p>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                Value: ${campaign.prizeValueUsd.toLocaleString()} USD • {campaign.winnerCount} Winner{campaign.winnerCount > 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-500">Eligible Pool</span>
              <p className="text-sm font-mono font-black text-indigo-700">
                {eligibleSubscribers.length} Entrants
              </p>
            </div>
          </div>

          {/* STATE 1: IDLE */}
          {drawState === 'idle' && (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-10 h-10 text-indigo-600 animate-pulse" />
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <h4 className="text-lg font-extrabold text-slate-900">Ready for Official Live Draw</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Each participant's odds are proportionally weighted by their accumulated entries ({campaign.actions.length} action types + referral multipliers).
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 py-2 px-4 rounded-xl max-w-sm mx-auto font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Deterministic SHA-256 seed logging enabled</span>
              </div>

              <button
                onClick={handleStartDraw}
                className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm px-8 py-4 rounded-2xl shadow-lg shadow-amber-500/25 transition active:scale-95"
              >
                <Trophy className="w-5 h-5" /> Execute Verifiable Draw Now
              </button>
            </div>
          )}

          {/* STATE 2: SPINNING */}
          {drawState === 'spinning' && (
            <div className="text-center py-10 space-y-6">
              <div className="w-24 h-24 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin mx-auto flex items-center justify-center" />
              
              <div className="space-y-2">
                <p className="text-xs font-extrabold uppercase tracking-wider text-amber-600">
                  Selecting Winner Randomly...
                </p>
                <div className="text-2xl font-black text-slate-900 font-mono bg-slate-50 border border-slate-300 py-3 px-6 rounded-2xl max-w-sm mx-auto shadow-inner">
                  {eligibleSubscribers[animationIndex]?.name || "Searching Ticket Pool..."}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 font-mono font-medium">
                Calculating SHA-256 entropy from ticket ranges...
              </p>
            </div>
          )}

          {/* STATE 3: WINNER REVEALED */}
          {drawState === 'revealed' && auditRecord && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              
              <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-50 to-white border border-amber-200 text-center space-y-4 shadow-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase shadow">
                  <Award className="w-4 h-4" /> Official Winner Selected
                </div>

                <div className="space-y-1">
                  {auditRecord.winners.map((winner) => (
                    <div key={winner.subscriberId} className="pt-2">
                      <h4 className="text-2xl sm:text-3xl font-black text-slate-900">
                        {winner.subscriberName}
                      </h4>
                      <p className="text-xs font-mono text-slate-600 mt-1 font-semibold">
                        Email: {winner.subscriberEmail} • Ref Code: <strong className="text-indigo-700">{winner.referralCode}</strong>
                      </p>
                      <div className="inline-flex items-center gap-3 mt-3 text-xs bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs font-medium">
                        <span className="text-slate-700">
                          Winning Ticket: <strong className="text-amber-600 font-mono">#{winner.winningTicketNumber}</strong> / {winner.totalTicketsInPool}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-700">
                          Total Entries: <strong className="text-emerald-700 font-mono font-bold">{winner.totalEntriesAtDraw}</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit Proof Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600 uppercase flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-indigo-600" /> Cryptographic Audit Proof
                  </span>
                  <button
                    onClick={copyProof}
                    className="inline-flex items-center gap-1 text-[11px] text-indigo-700 hover:text-indigo-800 font-bold"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copiedHash ? 'Copied' : 'Copy Proof JSON'}
                  </button>
                </div>

                <p className="text-[10px] font-mono text-slate-700 break-all bg-white p-2.5 rounded-lg border border-slate-200 font-semibold">
                  {auditRecord.sha256VerificationProof}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleStartDraw}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
                >
                  <RefreshCw className="w-4 h-4" /> Re-Draw
                </button>

                <button
                  onClick={() => {
                    triggerHapticFeedback('light');
                    onClose();
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition shadow-md shadow-indigo-600/25"
                >
                  <CheckCircle2 className="w-4 h-4" /> Finalize & Log Winner
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
