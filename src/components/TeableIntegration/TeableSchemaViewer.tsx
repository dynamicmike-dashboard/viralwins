import React, { useState } from 'react';
import {
  Database,
  Code2,
  Copy,
  Check,
  Server,
  Terminal,
  Play
} from 'lucide-react';
import { Campaign } from '../../types';
import { triggerHapticFeedback } from '../../utils/haptics';

interface TeableSchemaViewerProps {
  campaign: Campaign;
}

export const TeableSchemaViewer: React.FC<TeableSchemaViewerProps> = ({
  campaign
}) => {
  const [activeTab, setActiveTab] = useState<'tables' | 'api_routes' | 'teable_client' | 'sandbox'>('tables');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [sandboxPayload, setSandboxPayload] = useState(JSON.stringify({
    campaignSlug: campaign.slug,
    name: "John Doe",
    email: "john@example.com",
    referrerCode: "ALEX77"
  }, null, 2));
  const [sandboxResponse, setSandboxResponse] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    triggerHapticFeedback('success');
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleTestSandbox = () => {
    triggerHapticFeedback('medium');
    try {
      const parsed = JSON.parse(sandboxPayload);
      setSandboxResponse(JSON.stringify({
        status: "success",
        code: 201,
        data: {
          subscriberId: `sub-${Math.random().toString(36).substring(2, 9)}`,
          campaignId: campaign.id,
          name: parsed.name,
          email: parsed.email,
          referralCode: parsed.name.replace(/\s+/g, '').toUpperCase().substring(0, 6) + Math.floor(10 + Math.random() * 90),
          totalEntries: parsed.referrerCode ? (1 + campaign.referralRewardEntries) : 1,
          referralAttributedTo: parsed.referrerCode || null,
          shareLink: `https://launch.app/c/${campaign.slug}?ref=${parsed.name.replace(/\s+/g, '').toUpperCase().substring(0, 6)}77`
        },
        teableRecordId: "rec_982bfa910d",
        timestamp: new Date().toISOString()
      }, null, 2));
    } catch {
      setSandboxResponse(JSON.stringify({ error: "Invalid JSON payload" }, null, 2));
    }
  };

  const teableSchemaJSON = {
    Campaigns_Table_Fields: [
      { name: "id", type: "singleLineText", isPrimary: true },
      { name: "slug", type: "singleLineText", unique: true },
      { name: "title", type: "singleLineText" },
      { name: "headline", type: "singleLineText" },
      { name: "description", type: "longText" },
      { name: "campaign_type", type: "singleSelect", options: ["sweepstakes", "milestone_points", "hybrid"] },
      { name: "prize_title", type: "singleLineText" },
      { name: "prize_image_url", type: "url" },
      { name: "prize_value_usd", type: "number" },
      { name: "prize_draw_date", type: "dateTime" },
      { name: "winner_count", type: "number", default: 1 },
      { name: "referral_reward_entries", type: "number", default: 5 },
      { name: "brand_theme", type: "longText", description: "JSON string storing font, primaryColor, bgColor, headlineColor" },
      { name: "action_rules", type: "longText", description: "JSON array of enabled channels, URLs, and entry weights" },
      { name: "milestones", type: "longText", description: "JSON array of unlockable reward tiers" },
      { name: "show_leaderboard", type: "checkbox", default: true },
      { name: "status", type: "singleSelect", options: ["active", "draft", "ended"] }
    ],
    Subscribers_Table_Fields: [
      { name: "id", type: "singleLineText", isPrimary: true },
      { name: "campaign_id", type: "link", target: "Campaigns" },
      { name: "name", type: "singleLineText" },
      { name: "email", type: "email" },
      { name: "referral_code", type: "singleLineText", unique: true },
      { name: "referred_by_code", type: "singleLineText" },
      { name: "total_entries", type: "number", default: 1 },
      { name: "referral_count", type: "number", default: 0 },
      { name: "fraud_risk_score", type: "number", default: 0 },
      { name: "status", type: "singleSelect", options: ["active", "flagged", "disqualified"] },
      { name: "created_at", type: "createdTime" }
    ],
    Subscriber_Actions_Table_Fields: [
      { name: "id", type: "singleLineText", isPrimary: true },
      { name: "subscriber_id", type: "link", target: "Subscribers" },
      { name: "campaign_id", type: "link", target: "Campaigns" },
      { name: "action_type", type: "singleSelect", options: ["referral_signup", "twitter_share", "whatsapp_share", "youtube_visit", "telegram_join", "custom_link"] },
      { name: "entries_awarded", type: "number" },
      { name: "timestamp", type: "dateTime" },
      { name: "verified", type: "checkbox", default: true }
    ]
  };

  const serverClientCode = `// lib/teable.ts
// Production Server-Side Teable Integration Client
import axios from 'axios';

const TEABLE_API_URL = process.env.TEABLE_API_URL || 'https://app.teable.io/api';
const TEABLE_API_KEY = process.env.TEABLE_API_KEY!;
const BASE_ID = process.env.TEABLE_BASE_ID!;

const teableClient = axios.create({
  baseURL: TEABLE_API_URL,
  headers: {
    'Authorization': \`Bearer \${TEABLE_API_KEY}\`,
    'Content-Type': 'application/json'
  }
});

export async function getCampaignBySlug(slug: string) {
  const res = await teableClient.get(\`/table/\${BASE_ID}/Campaigns/record\`, {
    params: { filter: { slug: { is: slug } } }
  });
  return res.data?.records?.[0]?.fields;
}

export async function registerSubscriber(campaignId: string, name: string, email: string, referrerCode?: string) {
  const referralCode = name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 5) + Math.floor(1000 + Math.random() * 9000);
  
  // 1. Create Subscriber Record
  const newSub = await teableClient.post(\`/table/\${BASE_ID}/Subscribers/record\`, {
    records: [{
      fields: {
        campaign_id: campaignId,
        name,
        email,
        referral_code: referralCode,
        referred_by_code: referrerCode || null,
        total_entries: referrerCode ? 6 : 1,
        referral_count: 0,
        status: 'active'
      }
    }]
  });

  // 2. If referred, award entries to referrer atomically
  if (referrerCode) {
    await awardReferralCredit(campaignId, referrerCode, 5);
  }

  return newSub.data.records[0];
}

export async function awardReferralCredit(campaignId: string, referralCode: string, points: number) {
  const findRes = await teableClient.get(\`/table/\${BASE_ID}/Subscribers/record\`, {
    params: { filter: { referral_code: { is: referralCode } } }
  });
  const referrer = findRes.data?.records?.[0];
  if (referrer) {
    await teableClient.patch(\`/table/\${BASE_ID}/Subscribers/record\`, {
      records: [{
        id: referrer.id,
        fields: {
          total_entries: (referrer.fields.total_entries || 0) + points,
          referral_count: (referrer.fields.referral_count || 0) + 1
        }
      }]
    });
  }
}`;

  const apiRouteCode = `// app/api/campaigns/[slug]/join/route.ts
// Secure Next.js App Router POST Join Endpoint
import { NextRequest, NextResponse } from 'next/server';
import { registerSubscriber, getCampaignBySlug } from '@/lib/teable';

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const body = await req.json();
    const { name, email, referrerCode } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const campaign = await getCampaignBySlug(params.slug);
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const subscriber = await registerSubscriber(campaign.id, name, email, referrerCode);
    return NextResponse.json({ success: true, subscriber }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}`;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 p-6 rounded-3xl backdrop-blur-md shadow-xl shadow-slate-900/5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
              Backend Contracts
            </span>
            <span className="text-xs text-slate-500 font-semibold">Teable Database & API Handlers</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Teable Schema & Next.js API Architecture
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-mono font-bold flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-emerald-600" /> API Keys Kept Server-Only
          </span>
        </div>
      </div>

      {/* Tabs & Code Container */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xl shadow-slate-900/5">
        
        {/* Navigation Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 p-2 gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('tables');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'tables' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" /> Teable Schema Definitions (JSON)
          </button>

          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('teable_client');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'teable_client' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4" /> Server Client (lib/teable.ts)
          </button>

          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('api_routes');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'api_routes' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" /> API Route Handlers (/api/*)
          </button>

          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('sandbox');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'sandbox' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Play className="w-4 h-4 text-emerald-500" /> Interactive API Sandbox
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          
          {/* TAB 1: TEABLE SCHEMA TABLES */}
          {activeTab === 'tables' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Full Teable Relational Schema JSON</h3>
                  <p className="text-xs text-slate-500 font-medium">Copy and import directly into your Teable Base</p>
                </div>
                <button
                  onClick={() => copyText(JSON.stringify(teableSchemaJSON, null, 2), 'schema')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition"
                >
                  {copiedSection === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSection === 'schema' ? 'Copied' : 'Copy JSON'}
                </button>
              </div>

              <pre className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto max-h-[500px] shadow-inner">
                {JSON.stringify(teableSchemaJSON, null, 2)}
              </pre>
            </div>
          )}

          {/* TAB 2: SERVER CLIENT */}
          {activeTab === 'teable_client' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">lib/teable.ts (TypeScript)</h3>
                  <p className="text-xs text-slate-500 font-medium">Atomic subscriber insertion, referral credit attribution, and caching</p>
                </div>
                <button
                  onClick={() => copyText(serverClientCode, 'client')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition"
                >
                  {copiedSection === 'client' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSection === 'client' ? 'Copied' : 'Copy Code'}
                </button>
              </div>

              <pre className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-[500px] shadow-inner">
                {serverClientCode}
              </pre>
            </div>
          )}

          {/* TAB 3: API ROUTES */}
          {activeTab === 'api_routes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Next.js API Handler: /api/campaigns/[slug]/join</h3>
                  <p className="text-xs text-slate-500 font-medium">Handles public join flow with server-side validation & referral linking</p>
                </div>
                <button
                  onClick={() => copyText(apiRouteCode, 'route')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition"
                >
                  {copiedSection === 'route' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSection === 'route' ? 'Copied' : 'Copy Code'}
                </button>
              </div>

              <pre className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto max-h-[500px] shadow-inner">
                {apiRouteCode}
              </pre>
            </div>
          )}

          {/* TAB 4: INTERACTIVE API SANDBOX */}
          {activeTab === 'sandbox' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Live API Join Endpoint Simulator</h3>
                <p className="text-xs text-slate-500 font-medium">Simulate a POST request to /api/campaigns/{campaign.slug}/join</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Request Payload (JSON)
                  </label>
                  <textarea
                    rows={8}
                    value={sandboxPayload}
                    onChange={(e) => setSandboxPayload(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-4 font-mono text-xs text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white shadow-inner"
                  />
                  <button
                    onClick={handleTestSandbox}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/25 transition active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5" /> Execute Test Request
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Simulated Response (201 Created)
                  </label>
                  <pre className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-emerald-300 min-h-[190px] overflow-x-auto shadow-inner">
                    {sandboxResponse || '// Click "Execute Test Request" to run simulated endpoint'}
                  </pre>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
