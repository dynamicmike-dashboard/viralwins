import React from 'react';
import { X, Scale, ShieldCheck, CheckCircle, Calendar, Trophy, AlertTriangle, Building2, Download } from 'lucide-react';
import { Campaign } from '../../types';
import { triggerHapticFeedback } from '../../utils/haptics';

interface OfficialRulesModalProps {
  campaign: Campaign;
  onClose: () => void;
}

export const OfficialRulesModal: React.FC<OfficialRulesModalProps> = ({
  campaign,
  onClose
}) => {
  const useCustom = Boolean(
    campaign.legalSettings?.useCustomOfficialRules && campaign.legalSettings.customOfficialRulesText?.trim()
  );
  const customRulesText = campaign.legalSettings?.customOfficialRulesText || '';
  const promoterJurisdiction = campaign.legalSettings?.promoterJurisdiction || 'Jurisdiction of the Campaign Sponsor';
  const promoterDisclaimer = campaign.legalSettings?.promoterLegalDisclaimer || `${campaign.clientName} is solely responsible for sweepstakes administration, winner validation, and prize delivery.`;

  const downloadRulesText = () => {
    triggerHapticFeedback('medium');
    const rulesText = `================================================================================
OFFICIAL SWEEPSTAKES & CAMPAIGN RULES
Campaign: ${campaign.title}
Sponsor / Promoter: ${campaign.clientName}
Administrator: ${campaign.agencyName}
Technology Provider: ViralWins (Software Platform)
================================================================================

*** NOTICE ON PLATFORM NON-LIABILITY & SPONSOR IDENTITY ***
This campaign is independently organized and operated by ${campaign.clientName}.
ViralWins provides the technology platform only and is NOT liable for any losses,
claims, or unfulfilled promoter prizes. Entrants contract directly with the Sponsor.

${useCustom ? `--- SPONSOR CUSTOM OFFICIAL RULES ---
${customRulesText}
` : `--- OFFICIAL SWEEPSTAKES RULES ---

1. NO PURCHASE NECESSARY TO ENTER OR WIN.
A purchase will not increase your chances of winning. Void where prohibited by law.

2. GRAND PRIZE SPECIFICATIONS
- Prize: ${campaign.prizeTitle}
- Approximate Retail Value (ARV): $${campaign.prizeValueUsd.toLocaleString()} USD
- Total Winners: ${campaign.winnerCount}

3. ENTRY PERIOD
Begins immediately and concludes strictly at ${new Date(campaign.drawDate).toISOString()}.

4. VERIFIED REFERRALS & ACTIONS
Each validated referral grants +${campaign.referralRewardEntries} bonus entries. Bonus social tasks grant specified ticket weights.

5. VERIFIABLE LOTTERY ALGORITHM
Winner(s) selected randomly via deterministic cryptographic SHA-256 entropy algorithm.

6. CLAIM PERIOD
Winners have ${campaign.claimDeadlineDays} calendar days from notification to verify identity and accept the prize.

7. SPONSOR DISCLAIMER & JURISDICTION
${promoterDisclaimer}
Governing Law: ${promoterJurisdiction}`}
================================================================================`;

    const blob = new Blob([rulesText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${campaign.slug}-official-rules.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                  Audited Rules
                </span>
                {useCustom ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    Sponsor Custom Rules
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Platform Standard
                  </span>
                )}
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">Official Sweepstakes Rules</h3>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHapticFeedback('light');
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Non-Liability Notice */}
        <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-amber-950 shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
            <strong>Platform Notice:</strong> Sponsored independently by <strong className="text-amber-950">{campaign.clientName}</strong>. 
            ViralWins is solely the software provider and is not liable for campaign execution or participant losses. Entrants must consult sponsor terms.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto py-4 space-y-4 text-xs text-slate-700 pr-1">
          
          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex items-start gap-3 text-indigo-950">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-indigo-950 block text-sm mb-0.5 font-extrabold">NO PURCHASE NECESSARY TO ENTER OR WIN</strong>
              A purchase, payment, or donation of any kind will not increase your chances of winning. Void where prohibited by law.
            </div>
          </div>

          {useCustom ? (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 flex items-center gap-2 text-purple-900 font-bold text-xs">
                <Building2 className="w-4 h-4 text-purple-700" />
                Custom Rules Established by {campaign.clientName}
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 whitespace-pre-wrap font-sans text-xs text-slate-800 leading-relaxed">
                {customRulesText}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm mb-1 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" /> 1. Promotion Details & Prize Description
                </h4>
                <p className="text-slate-600 leading-relaxed font-medium">
                  <strong>Grand Prize:</strong> {campaign.prizeTitle} (Approximate Retail Value: ${campaign.prizeValueUsd.toLocaleString()} USD). 
                  Total Winner Count: {campaign.winnerCount}. Prizes are non-transferable and no cash substitutions are permitted except at the sole discretion of the Sponsor.
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-sm mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" /> 2. Eligibility & Entry Window
                </h4>
                <p className="text-slate-600 leading-relaxed font-medium">
                  The Campaign begins upon public publishing and ends promptly on <strong>{new Date(campaign.drawDate).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}</strong>. 
                  Open to legal individuals age 18 or older. Employees, officers, and directors of {campaign.clientName}, {campaign.agencyName}, and their affiliates are not eligible.
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-sm mb-1 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> 3. Random Selection & Fairness Proof
                </h4>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Winners are selected via a verifiable deterministic pseudo-random lottery algorithm based on total accumulated entries. 
                  Each valid referral grants +{campaign.referralRewardEntries} entries. Completed social and content actions grant specified bonus entry weights.
                  The draw results, including timestamped hashes and ticket indices, are permanently recorded on our auditable ledger.
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-sm mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" /> 4. Anti-Fraud & Disqualification
                </h4>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Any attempt to submit automated, bot, duplicate, disposable email, or fraudulent referrals will result in immediate disqualification and forfeiture of all accumulated entries.
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-sm mb-1">5. Winner Notification & Claim Deadline</h4>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Selected potential winners will be notified via registered email within 24 hours of the draw. Potential winners must reply within {campaign.claimDeadlineDays} calendar days to claim their prize.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={downloadRulesText}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            Download Rules (.txt)
          </button>

          <button
            onClick={() => {
              triggerHapticFeedback('light');
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition shadow-md shadow-indigo-600/25"
          >
            I Understand & Agree
          </button>
        </div>

      </div>
    </div>
  );
};
