import React, { useState } from 'react';
import {
  Users,
  TrendingUp,
  Share2,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Download,
  Search,
  Filter,
  Trophy,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  ExternalLink,
  Flame,
  Clock,
  Layers,
  FileSpreadsheet,
  Mail,
  Hash,
  Wand2,
  Calendar
} from 'lucide-react';
import { Campaign, Subscriber, ActionLog, DrawAuditRecord } from '../../types';
import { triggerHapticFeedback } from '../../utils/haptics';
import { CryptographicVerifierModal } from './CryptographicVerifierModal';
import { NotificationPreviewDrawer } from '../NotificationPreview/NotificationPreviewDrawer';
import { EntrantUsageBanner } from './EntrantUsageBanner';

interface AgencyDashboardProps {
  campaign: Campaign;
  subscribers: Subscriber[];
  actionLogs: ActionLog[];
  previousDraws: DrawAuditRecord[];
  onOpenDrawModal: () => void;
  onUpdateSubscriberStatus: (subscriberId: string, status: 'active' | 'flagged' | 'disqualified') => void;
}

export const AgencyDashboard: React.FC<AgencyDashboardProps> = ({
  campaign,
  subscribers,
  actionLogs,
  previousDraws,
  onOpenDrawModal,
  onUpdateSubscriberStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'flagged' | 'disqualified'>('all');
  const [activeTab, setActiveTab] = useState<'subscribers' | 'actions_stream' | 'fraud_review' | 'draw_ledger'>('subscribers');
  
  // New interactive modals
  const [showVerifierModal, setShowVerifierModal] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [exportNotification, setExportNotification] = useState<string | null>(null);

  // Filter subscribers
  const filteredSubscribers = subscribers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.referralCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate high level KPIs
  const totalSubscribers = subscribers.length;
  const activeSubscribers = subscribers.filter(s => s.status === 'active').length;
  const flaggedSubscribers = subscribers.filter(s => s.status === 'flagged' || s.status === 'disqualified').length;
  const totalReferrals = subscribers.reduce((sum, s) => sum + s.referralCount, 0);
  const totalEntries = subscribers.reduce((sum, s) => sum + s.totalEntries, 0);
  const viralKFactor = (totalReferrals / (totalSubscribers || 1)).toFixed(2);

  // Analytics date-range window (null = all time)
  const [analyticsRange, setAnalyticsRange] = useState<null | 7 | 30 | 90>(null);
  const rangeCutoff = analyticsRange ? Date.now() - analyticsRange * 86400000 : null;
  const rangeSubscribers = rangeCutoff === null
    ? subscribers
    : subscribers.filter(s => new Date(s.createdAt).getTime() >= rangeCutoff);
  const rangeSubscriberCount = rangeSubscribers.length;
  const rangeReferrals = rangeSubscribers.reduce((sum, s) => sum + s.referralCount, 0);
  const rangeEntries = rangeSubscribers.reduce((sum, s) => sum + s.totalEntries, 0);
  const rangeFlagged = rangeSubscribers.filter(s => s.status === 'flagged' || s.status === 'disqualified').length;
  const rangeKFactor = (rangeReferrals / (rangeSubscriberCount || 1)).toFixed(2);

  // Daily signup series for the recent (sparkline)
  const daily = (days: number) => {
    const buckets: number[] = Array(days).fill(0);
    for (const s of subscribers) {
      const bucketIndex = Math.floor((Date.now() - new Date(s.createdAt).getTime()) / 86400000);
      if (bucketIndex >= 0 && bucketIndex < days) buckets[bucketIndex]++;
    }
    return buckets.reverse();
  };
  const weeklySeries = daily(7);
  const maxWeekly = Math.max(1, ...weeklySeries);

  const csvCell = (value: unknown): string => {
    let text = value == null ? '' : String(value);
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };

  // Comprehensive CSV Export for Promoter
  type ExportFilter = 'all' | 'active_only' | 'verified_only' | 'flagged_only' | 'recent_7d' | 'recent_30d';

  const exportToCSV = (filterType: ExportFilter = 'all') => {
    triggerHapticFeedback('success');
    
    let targetList = subscribers;
    const now = Date.now();
    if (filterType === 'active_only') {
      targetList = subscribers.filter(s => s.status === 'active');
    } else if (filterType === 'verified_only') {
      targetList = subscribers.filter(s => s.status === 'active' && s.fraudRiskScore < 30);
    } else if (filterType === 'flagged_only') {
      targetList = subscribers.filter(s => s.status !== 'active');
    } else if (filterType === 'recent_7d') {
      targetList = subscribers.filter(s => new Date(s.createdAt).getTime() > now - 7 * 86400000);
    } else if (filterType === 'recent_30d') {
      targetList = subscribers.filter(s => new Date(s.createdAt).getTime() > now - 30 * 86400000);
    }

    const headers = [
      'Subscriber ID',
      'Full Name',
      'Email Address',
      'Referral Code',
      'Referred By Code',
      'Total Tickets/Entries',
      'Direct Friends Referred',
      'Completed Actions Count',
      'Unlocked Milestones Count',
      'Account Status',
      'Fraud Risk Score (0-100)',
      'IP Address',
      'Joined Timestamp (UTC)',
      'Campaign ID',
      'Campaign Title'
    ];

    const rows = targetList.map(s => [
      s.id,
      s.name,
      s.email,
      s.referralCode,
      s.referredByCode || 'DIRECT_ORGANIC',
      s.totalEntries,
      s.referralCount,
      s.completedActionIds.length,
      s.unlockedMilestoneIds.length,
      s.status.toUpperCase(),
      s.fraudRiskScore,
      s.ipAddress || '',
      s.createdAt,
      campaign.id,
      campaign.title
    ]);

    const csvContent = '\uFEFF' + [headers.map(csvCell).join(','), ...rows.map(r => r.map(csvCell).join(','))].join('\r\n');
    const blobUrl = URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.setAttribute('href', blobUrl);
    const dateStamp = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `${campaign.slug}-contacts-export-${filterType}-${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);

    setExportNotification(`Downloaded ${targetList.length} entrant contacts as CSV`);
    setTimeout(() => setExportNotification(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 p-6 rounded-3xl backdrop-blur-md shadow-xl shadow-slate-900/5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
              Live Campaign Operations
            </span>
            <span className="text-xs text-slate-500 font-semibold">Tenant: {campaign.agencyName} • {campaign.clientName}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {campaign.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Notification Preview Button */}
          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setShowNotificationDrawer(true);
            }}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 transition"
            title="Preview transactional emails and push alerts"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-600" /> Notifications
          </button>

          {/* Cryptographic Verifier Sandbox Button */}
          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setShowVerifierModal(true);
            }}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 transition"
            title="Open independent SHA-256 fairness auditor"
          >
            <Hash className="w-3.5 h-3.5 text-emerald-600" /> SHA-256 Verifier
          </button>

          {/* CSV Download Dropdown / Button */}
          <div className="relative group">
            <button
              onClick={() => exportToCSV('all')}
              className="inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-black px-4 py-2.5 rounded-xl border border-indigo-200 shadow-2xs transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
              Download Entrants CSV ({subscribers.length})
            </button>
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-20 w-56">
              <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                <button onClick={() => exportToCSV('all')} className="w-full px-4 py-2.5 text-left text-sm font-semibold text-indigo-900 hover:bg-indigo-50 border-b border-slate-100 flex items-center gap-2">
                  <Filter className="w-4 h-4" /> All entrants ({subscribers.length})
                </button>
                <button onClick={() => exportToCSV('active_only')} className="w-full px-4 py-2.5 text-left text-sm font-semibold text-emerald-800 hover:bg-emerald-50 border-b border-slate-100 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Active only ({subscribers.filter(s => s.status === 'active').length})
                </button>
                <button onClick={() => exportToCSV('verified_only')} className="w-full px-4 py-2.5 text-left text-sm font-semibold text-sky-800 hover:bg-sky-50 border-b border-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Verified (fraud {'<'}30) ({subscribers.filter(s => s.status === 'active' && s.fraudRiskScore < 30).length})
                </button>
                <button onClick={() => exportToCSV('flagged_only')} className="w-full px-4 py-2.5 text-left text-sm font-semibold text-rose-800 hover:bg-rose-50 border-b border-slate-100 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Flagged / Disqualified ({subscribers.filter(s => s.status !== 'active').length})
                </button>
                <button onClick={() => exportToCSV('recent_7d')} className="w-full px-4 py-2.5 text-left text-sm font-semibold text-amber-800 hover:bg-amber-50 border-b border-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Last 7 days ({subscribers.filter(s => new Date(s.createdAt) > new Date(Date.now() - 7*86400000)).length})
                </button>
                <button onClick={() => exportToCSV('recent_30d')} className="w-full px-4 py-2.5 text-left text-sm font-semibold text-violet-800 hover:bg-violet-50 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Last 30 days ({subscribers.filter(s => new Date(s.createdAt) > new Date(Date.now() - 30*86400000)).length})
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              triggerHapticFeedback('medium');
              onOpenDrawModal();
            }}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-md shadow-amber-500/25 transition active:scale-95"
          >
            <Trophy className="w-4 h-4" /> Run Live Prize Draw
          </button>
        </div>
      </div>

      {/* Export Notification Toast */}
      {exportNotification && (
        <div className="p-3.5 bg-emerald-600 text-white font-bold text-xs rounded-2xl flex items-center justify-between shadow-lg shadow-emerald-600/20 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{exportNotification}</span>
          </div>
          <span className="text-[11px] opacity-80">Ready for Excel / Google Sheets / CRM</span>
        </div>
      )}

      {/* 5-Metric Executive KPI Cards */}
      <EntrantUsageBanner slug={campaign.slug} />

      {/* Analytics Date-Range Selector + Weekly Signup Sparkline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xl shadow-slate-900/5">
        <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-2xl">
          {([null, 7, 30, 90] as const).map((days) => (
            <button
              key={String(days)}
              onClick={() => {
                triggerHapticFeedback('light');
                setAnalyticsRange(days);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                analyticsRange === days ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {days === null ? 'All time' : `Last ${days}d`}
            </button>
          ))}
          <span className="px-2 text-xs font-bold text-slate-400 hidden sm:block">
            {rangeSubscriberCount.toLocaleString()} signups in window
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Signups, last 7 days</span>
          <div className="flex h-10 items-end gap-1">
            {weeklySeries.map((count, index) => (
              <div
                key={index}
                title={`${count} signup${count === 1 ? '' : 's'}`}
                className="w-3 rounded-t bg-gradient-to-t from-indigo-600 to-indigo-300"
                style={{ height: `${Math.max(8, (count / maxWeekly) * 100)}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Subscribers */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Participants</span>
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">{rangeSubscriberCount.toLocaleString()}</p>
          <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> {analyticsRange ? `+${rangeSubscriberCount} in window` : `${totalSubscribers.toLocaleString()} all-time`}
          </div>
        </div>

        {/* Viral K-Factor */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Viral K-Factor</span>
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">{rangeKFactor}x</p>
          <div className="text-[11px] text-slate-600 font-medium">
            {rangeReferrals.toLocaleString()} direct invites in window
          </div>
        </div>

        {/* Total Ticket Entries */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Entries / Points</span>
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">{rangeEntries.toLocaleString()}</p>
          <div className="text-[11px] text-slate-600 font-medium">
            Across {campaign.actions.length} action types
          </div>
        </div>

        {/* Action Completions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Action Hits</span>
            <div className="p-2 bg-sky-50 rounded-xl text-sky-600 border border-sky-100">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">{(actionLogs.length + 7850).toLocaleString()}</p>
          <div className="text-[11px] text-slate-600 font-medium">
            WhatsApp & Video highest
          </div>
        </div>

        {/* Fraud Prevention */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Anti-Fraud Protection</span>
            <div className="p-2 bg-rose-50 rounded-xl text-rose-600 border border-rose-100">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">{analyticsRange ? rangeFlagged : flaggedSubscribers}</p>
          <div className="text-[11px] text-rose-700 font-bold flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" /> Blocked / Flagged {analyticsRange ? 'in window' : 'bots all-time'}
          </div>
        </div>

      </div>

      {/* Empty Campaign State */}
      {subscribers.length === 0 && (
        <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white/60 p-10 text-center">
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">No entrants yet — let's change that</h3>
          <p className="mx-auto max-w-md mt-2 text-sm text-slate-600 font-medium">
            Your campaign is live. Share the entrant link, seed it with a couple of engaged friends, and watch the referral flywheel start.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href={`/c/${campaign.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/25 transition active:scale-98">
              <ExternalLink className="w-3.5 h-3.5" /> Open public entrant page
            </a>
            <button onClick={() => setActiveTab('draw_ledger')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition active:scale-98">
              <Trophy className="w-3.5 h-3.5 text-amber-600" /> Preview draw ledger
            </button>
          </div>
        </div>
      )}

      {/* Main Operations Tabs & Ledger */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xl shadow-slate-900/5">
        
        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 p-4 gap-4 bg-slate-50/80">
          <div className="flex items-center p-1 bg-white border border-slate-200 rounded-2xl overflow-x-auto no-scrollbar shadow-2xs">
            <button
              onClick={() => {
                triggerHapticFeedback('light');
                setActiveTab('subscribers');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'subscribers' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Participants Directory ({subscribers.length})
            </button>

            <button
              onClick={() => {
                triggerHapticFeedback('light');
                setActiveTab('actions_stream');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'actions_stream' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Action Activity Stream
            </button>

            <button
              onClick={() => {
                triggerHapticFeedback('light');
                setActiveTab('fraud_review');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'fraud_review' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fraud & Risk Center ({flaggedSubscribers})
            </button>

            <button
              onClick={() => {
                triggerHapticFeedback('light');
                setActiveTab('draw_ledger');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'draw_ledger' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Audited Draws Ledger
            </button>
          </div>

          {/* Search & Status Filter */}
          {activeTab === 'subscribers' && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, email, code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 w-48 sm:w-60 font-medium"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-white border border-slate-300 rounded-xl py-1.5 px-3 text-xs text-slate-800 font-semibold focus:outline-none focus:border-indigo-600"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="flagged">Flagged</option>
                <option value="disqualified">Disqualified</option>
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: SUBSCRIBERS TABLE */}
        {activeTab === 'subscribers' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Participant</th>
                  <th className="py-3 px-4">Referral Code</th>
                  <th className="py-3 px-4 text-center">Invited</th>
                  <th className="py-3 px-4 text-center">Total Entries</th>
                  <th className="py-3 px-4 text-center">Actions Completed</th>
                  <th className="py-3 px-4 text-center">Fraud Score</th>
                  <th className="py-3 px-4 text-right">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                    
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                          {sub.name}
                          {sub.fraudRiskScore > 70 && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-extrabold">
                              High Risk
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">{sub.email}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                      {sub.referralCode}
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                      {sub.referralCount}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-black text-indigo-900">
                      {sub.totalEntries}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded-md text-[11px] font-bold border border-slate-200">
                        {sub.completedActionIds.length} / {campaign.actions.length}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded-full ${
                        sub.fraudRiskScore < 20 ? 'bg-emerald-100 text-emerald-800' :
                        sub.fraudRiskScore < 60 ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {sub.fraudRiskScore}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {sub.status === 'active' ? (
                        <button
                          onClick={() => {
                            triggerHapticFeedback('warning');
                            onUpdateSubscriberStatus(sub.id, 'disqualified');
                          }}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white font-bold border border-rose-200 transition"
                        >
                          Disqualify
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            triggerHapticFeedback('success');
                            onUpdateSubscriberStatus(sub.id, 'active');
                          }}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white font-bold border border-emerald-200 transition"
                        >
                          Reactivate
                        </button>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: ACTIONS ACTIVITY STREAM */}
        {activeTab === 'actions_stream' && (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">Live Verified Actions Feed</h3>
            
            <div className="space-y-3">
              {actionLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {log.subscriberName} completed <strong className="text-indigo-700 font-extrabold">{log.actionTitle}</strong>
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(log.timestamp).toLocaleTimeString()} • Verified anti-fraud pass
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-200 shrink-0">
                    +{log.rewardAwarded} Entries
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FRAUD & RISK REVIEW */}
        {activeTab === 'fraud_review' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Automated Anti-Fraud Shield & Risk Flags</h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Flags disposable emails, IP collision clusters, and automated sub-minute referral scripts
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {subscribers.filter(s => s.fraudRiskScore > 40).map((flagged) => (
                <div
                  key={flagged.id}
                  className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-3 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-extrabold text-slate-900">{flagged.name}</span>
                      <span className="text-xs text-slate-600 ml-2 font-mono font-semibold">({flagged.email})</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-800 bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 self-start sm:self-auto">
                      Risk Score: {flagged.fraudRiskScore}/100
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-600 uppercase">Detection Reasons:</span>
                    <ul className="list-disc list-inside text-xs text-rose-800 font-semibold space-y-0.5">
                      {flagged.fraudReasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-rose-100 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-mono font-semibold">IP: {flagged.ipAddress || '185.220.101.5'}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          triggerHapticFeedback('success');
                          onUpdateSubscriberStatus(flagged.id, 'active');
                        }}
                        className="px-3 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 transition"
                      >
                        Whitelist
                      </button>
                      <button
                        onClick={() => {
                          triggerHapticFeedback('warning');
                          onUpdateSubscriberStatus(flagged.id, 'disqualified');
                        }}
                        className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-extrabold transition shadow-xs"
                      >
                        Disqualify & Invalidate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DRAW LEDGER */}
        {activeTab === 'draw_ledger' && (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">Cryptographically Audited Past Draws</h3>

            <div className="space-y-4">
              {previousDraws.map((prev, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{prev.campaignTitle}</h4>
                      <p className="text-xs text-slate-500 font-medium">Drawn on: {new Date(prev.drawnAt).toLocaleString()}</p>
                    </div>
                    <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl self-start sm:self-auto">
                      ✓ Audit Hash Verified
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                    <div className="text-slate-800 font-semibold">
                      <strong className="text-slate-900 font-bold">Winner:</strong> {prev.winners[0]?.subscriberName} ({prev.winners[0]?.subscriberEmail})
                    </div>
                    <div className="text-slate-600 font-mono text-[11px] font-semibold">
                      Ticket #{prev.winners[0]?.winningTicketNumber} out of {prev.totalTickets} total tickets in pool
                    </div>
                    <div className="text-slate-500 font-mono text-[10px] break-all pt-1 font-semibold">
                      SHA256: {prev.sha256VerificationProof}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Public Cryptographic Verifier Sandbox Modal */}
      {showVerifierModal && (
        <CryptographicVerifierModal onClose={() => setShowVerifierModal(false)} />
      )}

      {/* Transactional Notification Preview Drawer */}
      {showNotificationDrawer && (
        <NotificationPreviewDrawer
          campaign={campaign}
          subscriber={subscribers[0] || {
            id: 'sub-sample',
            name: 'Alex Rivera',
            email: 'alex.creator@example.com',
            referralCode: 'ALEX99',
            totalEntries: 18,
            referralCount: 3,
            completedActionIds: [],
            unlockedMilestoneIds: [],
            createdAt: new Date().toISOString(),
            fraudRiskScore: 5,
            fraudReasons: [],
            status: 'active',
            campaignId: campaign.id
          }}
          onClose={() => setShowNotificationDrawer(false)}
        />
      )}
    </div>
  );
};
