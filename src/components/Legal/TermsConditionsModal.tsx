import React, { useState } from 'react';
import {
  X,
  FileCheck,
  Scale,
  Award,
  AlertTriangle,
  Download,
  CheckCircle2,
  HelpCircle,
  Clock,
  ShieldAlert,
  Hash,
  Building2,
  ExternalLink
} from 'lucide-react';
import { Campaign } from '../../types';
import { triggerHapticFeedback } from '../../utils/haptics';

interface TermsConditionsModalProps {
  campaign: Campaign;
  onClose: () => void;
}

export const TermsConditionsModal: React.FC<TermsConditionsModalProps> = ({
  campaign,
  onClose
}) => {
  const [hasAgreed, setHasAgreed] = useState(false);

  const useCustom = Boolean(
    campaign.legalSettings?.useCustomTermsConditions && campaign.legalSettings.customTermsConditionsText?.trim()
  );

  const customTcText = campaign.legalSettings?.customTermsConditionsText || '';
  const promoterDisclaimer = campaign.legalSettings?.promoterLegalDisclaimer || `${campaign.clientName} is solely responsible for prize procurement, sweepstakes administration, and winner validation.`;
  const promoterJurisdiction = campaign.legalSettings?.promoterJurisdiction || 'Jurisdiction of the Campaign Promoter';
  const promoterEmail = campaign.legalSettings?.customComplaintsEmail || `support@${campaign.slug.replace(/[^a-zA-Z0-9]/g, '') || 'promoter'}.com`;

  const downloadTextTC = () => {
    triggerHapticFeedback('medium');
    const tcText = `================================================================================
TERMS AND CONDITIONS & SWEEPSTAKES OPERATING AGREEMENT
Campaign: ${campaign.title}
Promoter / Sponsor: ${campaign.clientName}
Administrator: ${campaign.agencyName}
Technology Software Provider: ViralEngine Studio
Effective Date: August 15, 2026
================================================================================

*** CRITICAL DISCLAIMER & PLATFORM LIMITATION OF LIABILITY ***
ViralEngine Studio operates strictly as an independent software technology provider.
ViralEngine Studio is NOT the promoter, sponsor, or legal administrator of this campaign.
THE PLATFORM DISCLAIMS ALL LIABILITY FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL,
OR PUNITIVE LOSSES, DAMAGES, UNFULFILLED PRIZES, PROMOTER INSOLVENCY, DISPUTE OUTCOMES,
OR TECHNICAL INTERRUPTIONS ARISING FROM OR RELATED TO THIS CAMPAIGN.
ALL PARTICIPANTS ENTER INTO AN OPERATING AGREEMENT SOLELY AND DIRECTLY WITH THE PROMOTER (${campaign.clientName}).

${useCustom ? `--- PROMOTER CUSTOM TERMS & CONDITIONS ---
${customTcText}
` : `--- STANDARD SWEEPSTAKES OPERATING TERMS ---

1. NO PURCHASE NECESSARY TO ENTER OR WIN.
A purchase, payment, or monetary contribution of any kind will not increase your chances of winning. Void where prohibited by law.

2. PROMOTER RESPONSIBILITY & SPONSORSHIP
This promotion is organized and sponsored solely by ${campaign.clientName}. The Promoter is exclusively responsible for prize fulfillment, tax withholdings (if applicable), and compliance with promotional contest laws in ${promoterJurisdiction}.

3. ELIGIBILITY
Open to legal individuals aged 18 years or older at the date of registration. Employees, immediate family members, and affiliates of the Promoter are ineligible to claim grand prizes.

4. ENTRY PERIOD & DEADLINES
The promotional window begins upon public launch and concludes at ${new Date(campaign.drawDate).toISOString()}. The server's internal synchronized clock is the official timekeeper.

5. VERIFIED MULTIPLIERS & FRAUD RULES
- 1 Base Entry upon valid initial registration.
- +${campaign.referralRewardEntries} Bonus Entries per confirmed unique referral.
- Social actions award specified entry tickets upon verification.
- Disposable emails, bot scripts, proxy spoofing, or fraudulent referrals result in automatic disqualification and entry forfeiture.

6. WINNER SELECTION & CLAIM DEADLINE
Winners are determined via a deterministic cryptographic SHA-256 entropy algorithm.
Potential winners will be notified via their registered email address within 24 hours of the draw.
Potential winners must claim their prize and verify eligibility within ${campaign.claimDeadlineDays} calendar days, after which an alternate winner will be drawn.

7. PROMOTER DISCLAIMER
${promoterDisclaimer}`}

================================================================================
Promoter Entity: ${campaign.clientName}
Support Contact: ${promoterEmail}
Governing Law: ${promoterJurisdiction}
================================================================================`;

    const blob = new Blob([tcText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${campaign.slug}-terms-conditions.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 shadow-xs">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 uppercase">
                  Official Terms
                </span>
                {useCustom ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                    Promoter Custom Terms
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    Platform Standard
                  </span>
                )}
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                Terms & Conditions of Participation
              </h3>
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

        {/* Mandatory Non-Liability & Promoter Notice */}
        <div className="bg-amber-50/90 border-b border-amber-200 p-4 shrink-0">
          <div className="flex items-start gap-3 text-amber-950">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-extrabold text-amber-900">
                Notice on Platform Non-Liability & Promoter Liability:
              </p>
              <p className="text-amber-800 leading-relaxed font-medium">
                This campaign is organized, governed, and fulfilled exclusively by <strong className="text-amber-950">{campaign.clientName}</strong> (&ldquo;Promoter&rdquo;). 
                <strong> ViralEngine Studio</strong> is strictly the software infrastructure provider. 
                The platform <strong>disclaims all liability for any losses, damages, prize fulfillment delays, or promoter non-performance</strong>. 
                You enter into an agreement directly with the Promoter and should inspect all promoter terms carefully.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Content Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 text-slate-700 text-xs leading-relaxed">
          
          {useCustom ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                <div className="flex items-center gap-2 text-purple-900 font-extrabold text-xs mb-1">
                  <Building2 className="w-4 h-4 text-purple-700" />
                  Custom Terms Provided by {campaign.clientName}
                </div>
                <p className="text-purple-800 text-[11px]">
                  These specific terms and conditions are established by the campaign promoter and govern all entries and rewards.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 whitespace-pre-wrap font-sans text-xs text-slate-800 leading-relaxed">
                {customTcText}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between gap-3 text-[11px] text-slate-600">
                <span>Promoter Contact: <strong>{promoterEmail}</strong></span>
                <span>Jurisdiction: <strong>{promoterJurisdiction}</strong></span>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* Provision 1: No Purchase Necessary */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-emerald-950 text-xs uppercase tracking-wider mb-0.5">
                    1. No Purchase Necessary
                  </h4>
                  <p className="text-emerald-900 leading-relaxed font-medium">
                    No purchase, payment, or financial transaction of any kind is required to enter or win. A purchase will not enhance or alter an entrant&apos;s mathematical chances of winning. Void where prohibited by applicable jurisdiction.
                  </p>
                </div>
              </div>

              {/* Provision 2: Platform Technology Separation */}
              <section className="space-y-1.5">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  2. Role of the Platform Technology Provider
                </h4>
                <p className="text-slate-600">
                  ViralEngine Studio provides software tooling for referral management, action verification, and entropy-based lottery drawings. 
                  The platform is <strong>not an employer, partner, insurer, or fiduciary of the Promoter ({campaign.clientName})</strong>. 
                  The platform does not guarantee the availability, quality, or delivery of prizes and is held harmless by participants from all disputes.
                </p>
              </section>

              {/* Provision 3: Eligibility */}
              <section className="space-y-1.5">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  3. Eligibility Requirements
                </h4>
                <p className="text-slate-600">
                  Participation is open exclusively to individuals aged 18 years or older (or age of legal majority in their territory). 
                  Officers, contractors, and immediate family members of {campaign.clientName} and {campaign.agencyName} are disqualified from winning grand prizes.
                </p>
              </section>

              {/* Provision 4: Entry Window & Cryptographic Drawing */}
              <section className="space-y-1.5">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  4. Promotion Timeline & Cryptographic Odds
                </h4>
                <p className="text-slate-600">
                  The promotion concludes at <strong>{new Date(campaign.drawDate).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}</strong>. 
                  Winning tickets are selected via a deterministic SHA-256 pseudorandom entropy algorithm. 
                  Each participant&apos;s probability equals their verified entries divided by total valid entries in the draw ledger at the conclusion time.
                </p>
              </section>

              {/* Provision 5: Anti-Fraud & Disqualification */}
              <section className="space-y-1.5 bg-rose-50/60 p-3.5 rounded-2xl border border-rose-200">
                <h4 className="font-extrabold text-rose-950 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  5. Anti-Fraud Disqualification Clause
                </h4>
                <p className="text-rose-900 text-[11px] leading-relaxed">
                  Automated scripts, disposable temporary inbox rings, spam referrals, or fraudulent bot interaction will cause immediate disqualification. 
                  The Promoter and Platform reserve the right to audit IP logs, user-agent fingerprints, and time velocity to invalidate tainted entries.
                </p>
              </section>

              {/* Provision 6: Prize Claim SLA */}
              <section className="space-y-1.5">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Hash className="w-4 h-4 text-indigo-600" />
                  6. Winner Notification & Claim Period
                </h4>
                <p className="text-slate-600">
                  Potential winners will receive an email notification within 24 hours of the draw. Potential winners must confirm their identity and claim their prize within <strong>{campaign.claimDeadlineDays} calendar days</strong>. Unclaimed prizes will be awarded to an alternate entrant drawn from the audited ledger.
                </p>
              </section>

              {/* Provision 7: Promoter Disclaimer */}
              <section className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-1">
                  7. Promoter Responsibility & Governing Law
                </h4>
                <p className="text-slate-600 text-[11px]">
                  {promoterDisclaimer} This promotion is governed by the laws of <strong>{promoterJurisdiction}</strong>.
                </p>
              </section>

            </div>
          )}

        </div>

        {/* Agreement Checkbox & Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hasAgreed}
              onChange={(e) => {
                triggerHapticFeedback('light');
                setHasAgreed(e.target.checked);
              }}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <span className="text-xs font-bold text-slate-800">
              I acknowledge the Promoter terms and Platform non-liability
            </span>
          </label>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={downloadTextTC}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Download (.txt)
            </button>

            <button
              onClick={() => {
                triggerHapticFeedback('light');
                onClose();
              }}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 transition active:scale-98"
            >
              Accept & Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
