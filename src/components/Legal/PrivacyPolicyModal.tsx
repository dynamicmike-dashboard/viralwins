import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  Database,
  Globe,
  Download,
  CheckCircle,
  HelpCircle,
  Mail,
  Search,
  AlertTriangle,
  ExternalLink,
  Building2
} from 'lucide-react';
import { Campaign } from '../../types';
import { triggerHapticFeedback } from '../../utils/haptics';

interface PrivacyPolicyModalProps {
  campaign: Campaign;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  campaign,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<'all' | 'disclaimer' | 'collection' | 'processing' | 'storage' | 'rights' | 'security'>('all');

  const useCustom = Boolean(
    campaign.legalSettings?.useCustomPrivacyPolicy && campaign.legalSettings.customPrivacyPolicyText?.trim()
  );

  const customPolicyText = campaign.legalSettings?.customPrivacyPolicyText || '';
  const promoterEmail = campaign.legalSettings?.customComplaintsEmail || `privacy@${campaign.slug.replace(/[^a-zA-Z0-9]/g, '') || 'promoter'}.com`;
  const promoterJurisdiction = campaign.legalSettings?.promoterJurisdiction || 'Jurisdiction of the Campaign Promoter';

  const downloadTextPolicy = () => {
    triggerHapticFeedback('medium');
    const policyText = `================================================================================
PRIVACY POLICY & DATA PROTECTION NOTICE
Campaign: ${campaign.title}
Promoter / Sponsor: ${campaign.clientName}
Agency / Administrator: ${campaign.agencyName}
Technology Platform: ViralWins (Software Provider)
Effective Date: August 15, 2026
================================================================================

*** CRITICAL NOTICE ON PLATFORM NON-LIABILITY & INDEPENDENT PROMOTER ***
ViralWins is strictly an independent software technology provider and data processor.
The platform is NOT the promoter, sponsor, or administrator of this campaign.
The platform accepts NO liability for any losses, damages, claims, promoter unresponsiveness,
or data processing conducted by the Promoter outside the platform.
Entrants must review the specific terms, rules, and privacy practices of the Promoter (${campaign.clientName}).

${useCustom ? `--- PROMOTER CUSTOM PRIVACY DISCLOSURE ---
${customPolicyText}
` : `--- STANDARD PLATFORM DATA PRIVACY CHARTER ---

1. DATA CONTROLLER & DATA PROCESSOR ROLES
- Data Controller: ${campaign.clientName} (The Campaign Promoter).
- Data Processor: ViralWins (The software platform infrastructure).
- The Promoter determines the purpose of participant engagement. The Platform securely processes entries and cryptographic fairness proofs on behalf of the Promoter.

2. INFORMATION COLLECTED
We collect:
- Participant Identity: Name, email address, assigned referral code, referrer attribution code.
- Verification Telemetry: Timestamped bonus action completions, device user-agent hash, and fraud velocity indicators.
- Purpose: Entry authentication, calculating deterministic SHA-256 draw odds, distributing verified referral multipliers (+${campaign.referralRewardEntries} entries/referral), and anti-bot spam prevention.

3. DATA RETENTION & SECURITY ENCRYPTION
- Encryption in Transit: TLS 1.3 cryptographic transport.
- Encryption at Rest: AES-256 encrypted database ledgers.
- Retention Period: For the duration of the campaign plus an audit reconciliation window of 90 days.

4. YOUR GDPR & CCPA CONSUMER RIGHTS
Entrants possess the right to:
- Request access to their entry logs and referral multipliers.
- Request correction of inaccurate contact information.
- Request deletion and permanent withdrawal from the promotion.
Requests should be directed to the Promoter at: ${promoterEmail}.

5. THIRD-PARTY PLATFORMS & WEBSITES
Actions involving external platforms (e.g. YouTube, X/Twitter, WhatsApp, Telegram) are governed by those third parties' respective terms and privacy policies. The Platform is not responsible for external services.`}

================================================================================
Generated for: ${campaign.title}
Promoter Entity: ${campaign.clientName}
Governing Region: ${promoterJurisdiction}
================================================================================`;

    const blob = new Blob([policyText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${campaign.slug}-privacy-policy.txt`;
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
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                  GDPR / CCPA Standards
                </span>
                {useCustom ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                    Promoter Custom Policy
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    Platform Standard
                  </span>
                )}
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                Privacy Policy & Data Notice
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

        {/* Mandatory Platform Disclaimer & Non-Liability Banner */}
        <div className="bg-amber-50/90 border-b border-amber-200 p-4 shrink-0">
          <div className="flex items-start gap-3 text-amber-950">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-extrabold text-amber-900 flex items-center gap-1.5">
                <span>Platform Notice & Limitation of Liability:</span>
              </p>
              <p className="text-amber-800 leading-relaxed font-medium">
                This promotion is independently operated and sponsored by <strong className="text-amber-950">{campaign.clientName}</strong> (&ldquo;Promoter&rdquo;). 
                <strong> ViralWins</strong> is solely the technology software provider and data processor. 
                The platform is <strong>not liable for any losses, unfulfilled campaign rewards, promoter acts or omissions, or dispute outcomes</strong>. 
                Entrants are required to check the specific legal terms and privacy disclosures directly with the Promoter.
              </p>
            </div>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="p-3 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar gap-1 text-xs">
            <button
              onClick={() => {
                triggerHapticFeedback('light');
                setActiveSection('all');
              }}
              className={`px-3 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                activeSection === 'all' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Provisions
            </button>
            <button
              onClick={() => {
                triggerHapticFeedback('light');
                setActiveSection('collection');
              }}
              className={`px-3 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                activeSection === 'collection' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Data Collected
            </button>
            <button
              onClick={() => {
                triggerHapticFeedback('light');
                setActiveSection('rights');
              }}
              className={`px-3 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                activeSection === 'rights' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Your Privacy Rights
            </button>
            <button
              onClick={() => {
                triggerHapticFeedback('light');
                setActiveSection('security');
              }}
              className={`px-3 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                activeSection === 'security' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Security & Storage
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search policy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-44 pl-8 pr-3 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Policy Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 text-slate-700 text-xs leading-relaxed">
          
          {/* If Custom Policy is Configured by Promoter */}
          {useCustom ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                <div className="flex items-center gap-2 text-purple-900 font-extrabold text-xs mb-1">
                  <Building2 className="w-4 h-4 text-purple-700" />
                  Custom Privacy Policy Provided by {campaign.clientName}
                </div>
                <p className="text-purple-800 text-[11px]">
                  The Promoter has published custom privacy terms governing their collection, use, and retention of participant data.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 whitespace-pre-wrap font-sans text-xs text-slate-800 leading-relaxed">
                {customPolicyText}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between gap-3 text-[11px] text-slate-600">
                <span>Promoter Privacy Contact: <strong>{promoterEmail}</strong></span>
                <span>Jurisdiction: <strong>{promoterJurisdiction}</strong></span>
              </div>
            </div>
          ) : (
            /* Platform Standard GDPR / CCPA Template */
            <div className="space-y-6">
              
              {/* Section 1: Parties & Roles */}
              <section className="space-y-2">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  1. Identification of Parties & Technology Provider Separation
                </h4>
                <p className="text-slate-600">
                  This promotion is independently organized and sponsored by <strong>{campaign.clientName}</strong> (the &ldquo;Promoter&rdquo; / &ldquo;Data Controller&rdquo;). 
                  <strong> ViralWins</strong> provides the software engine and serves strictly as the &ldquo;Data Processor&rdquo;. 
                  The platform operates the technical mechanics of referral counting, fraud detection, and cryptographic entropy calculations.
                  The platform does not sell, market, or independently monetize participant contact records.
                </p>
              </section>

              {/* Section 2: Data Collection */}
              {(activeSection === 'all' || activeSection === 'collection') && (
                <section className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-600" />
                    2. Categories of Information Collected
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li><strong>Contact Credentials:</strong> Legal Name, Email Address, and assigned unique referral tracking URL.</li>
                    <li><strong>Activity Telemetry:</strong> Timestamped completions of verified social tasks, video views, and newsletter confirmations.</li>
                    <li><strong>Device & Anti-Fraud Indicators:</strong> Anonymized IP hash, device user-agent signature, and referral velocity logs to deter click-farms and automated bot accounts.</li>
                  </ul>
                </section>
              )}

              {/* Section 3: Legal Basis & Purpose */}
              {(activeSection === 'all' || activeSection === 'processing') && (
                <section className="space-y-2">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    3. Purpose of Processing & Entry Allocations
                  </h4>
                  <p className="text-slate-600">
                    Participant data is processed solely for the legitimate interests of conducting the sweepstakes:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <strong className="text-slate-900 block font-bold">Referral Credit Tracking:</strong>
                      Awarding confirmed multipliers (+{campaign.referralRewardEntries} entries) when friends register.
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <strong className="text-slate-900 block font-bold">Draw Verification:</strong>
                      Generating deterministic SHA-256 entropy proofs for winner selection.
                    </div>
                  </div>
                </section>
              )}

              {/* Section 4: Storage & Security */}
              {(activeSection === 'all' || activeSection === 'security' || activeSection === 'storage') && (
                <section className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-600" />
                    4. Security Measures & Encryption Standards
                  </h4>
                  <p className="text-slate-600">
                    All network communication is secured with <strong>TLS 1.3 protocol encryption</strong>. 
                    Stored participant identifiers are guarded behind role-based access controls and encrypted at rest with AES-256. 
                    Data is retained for the duration of the campaign and retained for a 90-day post-draw audit reconciliation period before automated archival.
                  </p>
                </section>
              )}

              {/* Section 5: Your Rights */}
              {(activeSection === 'all' || activeSection === 'rights') && (
                <section className="space-y-2">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    5. Participant Rights (GDPR / CCPA / International)
                  </h4>
                  <p className="text-slate-600">
                    Under applicable data protection laws, you retain the right to:
                  </p>
                  <div className="space-y-1.5 text-slate-600 pl-2">
                    <div>• <strong>Right of Access:</strong> Obtain a transparent report of your entry score and actions.</div>
                    <div>• <strong>Right to Rectification:</strong> Request correction of misspelt names or email addresses.</div>
                    <div>• <strong>Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> Request full deletion of your record (which forfeits active sweepstakes tickets).</div>
                  </div>
                  <div className="mt-3 p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 text-indigo-950">
                    To exercise your data protection rights, submit a request directly to the Promoter at <strong>{promoterEmail}</strong> or use our in-app Complaints & Dispute Portal.
                  </div>
                </section>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 text-center sm:text-left">
            Platform Technology Provider: <strong>ViralWins</strong> • Not liable for campaign losses
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={downloadTextPolicy}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Download Policy (.txt)
            </button>

            <button
              onClick={() => {
                triggerHapticFeedback('light');
                onClose();
              }}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 transition active:scale-98"
            >
              Close Policy
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
