import React, { useState } from 'react';
import {
  X,
  LifeBuoy,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Search,
  MessageSquare,
  FileQuestion,
  Sparkles,
  Paperclip,
  Check,
  Building2,
  AlertTriangle,
  Mail,
  HelpCircle
} from 'lucide-react';
import { Campaign, Subscriber } from '../../types';
import { triggerHapticFeedback } from '../../utils/haptics';

interface ComplaintsModalProps {
  campaign: Campaign;
  subscriber?: Subscriber;
  onClose: () => void;
}

export const ComplaintsModal: React.FC<ComplaintsModalProps> = ({
  campaign,
  subscriber,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'track' | 'charter'>('submit');
  
  // Custom Promoter Settings
  const promoterEmail = campaign.legalSettings?.customComplaintsEmail || `support@${campaign.slug.replace(/[^a-zA-Z0-9]/g, '') || 'promoter'}.com`;
  const customInstructions = campaign.legalSettings?.customComplaintsInstructions;

  // Form State
  const [category, setCategory] = useState<string>('missing_referral');
  const [name, setName] = useState<string>(subscriber?.name || '');
  const [email, setEmail] = useState<string>(subscriber?.email || '');
  const [referralCode, setReferralCode] = useState<string>(subscriber?.referralCode || '');
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal');
  const [subject, setSubject] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{
    id: string;
    category: string;
    createdAt: string;
    sla: string;
  } | null>(null);

  // Tracking Lookup State
  const [lookupTicketId, setLookupTicketId] = useState('');
  const [lookupResult, setLookupResult] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !description) return;

    triggerHapticFeedback('medium');
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedTicket({
        id: generatedId,
        category,
        createdAt: new Date().toISOString(),
        sla: priority === 'urgent' ? '4 Hours' : '24 Hours'
      });
      setIsSubmitting(false);
      triggerHapticFeedback('success');
    }, 900);
  };

  const handleLookupTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupTicketId.trim()) return;

    triggerHapticFeedback('light');
    setIsSearching(true);

    setTimeout(() => {
      setLookupResult({
        id: lookupTicketId.toUpperCase(),
        status: 'In Review with Promoter Desk',
        priority: 'High',
        assignedTo: `${campaign.clientName} Escalation Audit Desk`,
        lastUpdated: '15 minutes ago',
        notes: 'Verifying server-side referral ledger hashes and cryptographic entry proofs.'
      });
      setIsSearching(false);
      triggerHapticFeedback('success');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 uppercase">
                  Promoter Dispute Desk
                </span>
                <span className="text-xs text-slate-500 font-mono">SLA: Under 24h</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                Complaints & Dispute Resolution Portal
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

        {/* Platform Non-Liability Notice */}
        <div className="bg-amber-50/90 border-b border-amber-200 p-3.5 sm:p-4 shrink-0">
          <div className="flex items-start gap-3 text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <p className="font-extrabold text-amber-900">
                Notice: Disputes Are Handled By The Campaign Promoter
              </p>
              <p className="text-amber-800 leading-relaxed text-[11px]">
                Complaints regarding entries, prize fulfillment, or eligibility are submitted directly to the campaign sponsor (<strong className="text-amber-950">{campaign.clientName}</strong>). 
                <strong> ViralWins</strong> is an independent software technology provider and is <strong>not liable for any losses, unfulfilled prizes, or promoter dispute decisions</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white p-1.5 gap-1 shrink-0">
          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('submit');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'submit' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            File a Complaint
          </button>

          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('track');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'track' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Track Ticket Status
          </button>

          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('charter');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'charter' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Resolution Policy
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 text-slate-700 text-xs">
          
          {/* TAB 1: FILE COMPLAINT */}
          {activeTab === 'submit' && (
            <div>
              {submittedTicket ? (
                <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-slate-900">
                      Dispute Ticket Logged Successfully
                    </h4>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Your complaint has been submitted to the compliance team at <strong className="text-slate-900">{campaign.clientName}</strong>.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto text-left space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-semibold">Ticket ID:</span>
                      <span className="font-mono font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {submittedTicket.id}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-semibold">Assigned Desk:</span>
                      <span className="font-bold text-slate-800">{campaign.clientName} Dispute Team</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-semibold">Response SLA:</span>
                      <span className="font-bold text-emerald-600">{submittedTicket.sla}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-center gap-2">
                    <button
                      onClick={() => {
                        triggerHapticFeedback('light');
                        setLookupTicketId(submittedTicket.id);
                        setActiveTab('track');
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition"
                    >
                      Track This Ticket
                    </button>
                    <button
                      onClick={() => {
                        triggerHapticFeedback('light');
                        setSubmittedTicket(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition"
                    >
                      Submit Another
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitComplaint} className="space-y-4">
                  
                  {/* Custom Promoter Instructions if available */}
                  {customInstructions && (
                    <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950">
                      <strong className="block text-xs font-bold mb-0.5">Instructions from {campaign.clientName}:</strong>
                      <p className="text-[11px] leading-relaxed">{customInstructions}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Dispute Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white"
                      >
                        <option value="missing_referral">Missing Referral Multiplier / Entry Count</option>
                        <option value="action_verification">Bonus Action Verification Failed</option>
                        <option value="fraud_appeal">Anti-Fraud False Flag Appeal</option>
                        <option value="prize_fulfillment">Prize Claim & Fulfillment Issue</option>
                        <option value="privacy_request">GDPR / Privacy Data Erasure Request</option>
                        <option value="other">Other Promoter Dispute</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Priority Level
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white"
                      >
                        <option value="normal">Normal (24-Hour SLA)</option>
                        <option value="high">High (12-Hour SLA)</option>
                        <option value="urgent">Urgent (4-Hour SLA - Active Drawing Near)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Alex Johnson"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Registered Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="entrant@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Assigned Referral Code (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ALEX77"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        placeholder="Brief summary of the issue..."
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Detailed Explanation of the Dispute *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Provide specific details (referred friend's name, timestamp of action, screenshot details, etc.)..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white leading-relaxed resize-none"
                    />
                  </div>

                  {/* Optional File Attachment Simulation */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Paperclip className="w-4 h-4 text-slate-400" />
                      {attachedFileName ? (
                        <span className="font-bold text-indigo-600">{attachedFileName}</span>
                      ) : (
                        <span>Attach proof / screenshot (Optional)</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHapticFeedback('light');
                        setAttachedFileName('evidence_screenshot_referral.png');
                      }}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      {attachedFileName ? 'Change File' : 'Browse File'}
                    </button>
                  </div>

                  {/* Promoter Support Fallback */}
                  <div className="text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Direct Promoter Email: <strong>{promoterEmail}</strong></span>
                    <span>Target Response: <strong>Within 24 Hours</strong></span>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/25 transition disabled:opacity-50 active:scale-98"
                    >
                      {isSubmitting ? (
                        <>Submitting Dispute...</>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Submit to Promoter Desk
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}
            </div>
          )}

          {/* TAB 2: TRACK TICKET */}
          {activeTab === 'track' && (
            <div className="space-y-4">
              <form onSubmit={handleLookupTicket} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Ticket ID (e.g. TKT-892410)..."
                  value={lookupTicketId}
                  onChange={(e) => setLookupTicketId(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs font-mono font-bold text-slate-900 uppercase focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={isSearching || !lookupTicketId.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition disabled:opacity-50 shrink-0"
                >
                  {isSearching ? 'Searching...' : 'Lookup'}
                </button>
              </form>

              {lookupResult ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-mono font-extrabold text-slate-900 text-xs">{lookupResult.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                      {lookupResult.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Assigned Entity:</span>
                      <strong className="text-slate-800">{lookupResult.assignedTo}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Last Status Update:</span>
                      <span className="text-slate-700 font-medium">{lookupResult.lastUpdated}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs leading-relaxed">
                    <strong className="block text-slate-900 font-bold mb-1">Auditor Notes:</strong>
                    {lookupResult.notes}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 space-y-1">
                  <FileQuestion className="w-8 h-8 mx-auto text-slate-400" />
                  <p className="text-xs font-semibold">Enter your 6-digit Ticket ID above to track live progress.</p>
                  <p className="text-[11px] text-slate-400">Sample active ID: <strong>TKT-892410</strong></p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RESOLUTION CHARTER */}
          {activeTab === 'charter' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
                <h4 className="font-extrabold text-indigo-950 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  Dispute Framework & Responsibility Allocation
                </h4>
                <p className="text-indigo-900 text-xs leading-relaxed">
                  To ensure complete transparency, disputes are handled through clear separation between software data records and commercial promoter decisions.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 font-bold block mb-0.5">Tier 1: Automated Verification Ledger</strong>
                  <p className="text-slate-600 text-[11px]">
                    The platform server checks immutable SHA-256 entropy seeds, timestamped action receipts, and referral attribution tables.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 font-bold block mb-0.5">Tier 2: Promoter Review Desk</strong>
                  <p className="text-slate-600 text-[11px]">
                    The campaign sponsor ({campaign.clientName}) examines manual appeal claims, false positive anti-fraud flags, and proof submissions.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 font-bold block mb-0.5">Tier 3: Platform Non-Liability</strong>
                  <p className="text-slate-600 text-[11px]">
                    ViralWins operates exclusively as a technology software provider and assumes no financial or legal liability for the resolution or fulfillment of promoter prizes.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Promoter: <strong>{campaign.clientName}</strong> • Direct: {promoterEmail}
          </span>

          <button
            onClick={() => {
              triggerHapticFeedback('light');
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition"
          >
            Close Portal
          </button>
        </div>

      </div>
    </div>
  );
};
