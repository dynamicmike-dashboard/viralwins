import React, { useState, useEffect } from 'react';
import { 
  mockCampaigns, 
  mockSubscribers, 
  mockActionLogs, 
  mockPreviousDraws 
} from './data/mockData';
import { Campaign, Subscriber, ActionLog, DrawAuditRecord } from './types';
import { Navbar, ActiveTab } from './components/Navbar';
import { ParticipantLanding } from './components/ParticipantHub/ParticipantLanding';
import { ParticipantDashboard } from './components/ParticipantHub/ParticipantDashboard';
import { AgencyCustomizer } from './components/AgencyCustomizer/AgencyCustomizer';
import { AgencyDashboard } from './components/AnalyticsAndDraw/AgencyDashboard';
import { FairDrawModal } from './components/AnalyticsAndDraw/FairDrawModal';
import { OfficialRulesModal } from './components/ParticipantHub/OfficialRulesModal';
import { PrivacyPolicyModal } from './components/Legal/PrivacyPolicyModal';
import { TermsConditionsModal } from './components/Legal/TermsConditionsModal';
import { ComplaintsModal } from './components/Legal/ComplaintsModal';
import { Footer } from './components/Footer/Footer';
import { PwaInstallModal } from './components/PWA/PwaInstallModal';
import { PwaBottomNav } from './components/PWA/PwaBottomNav';
import { PwaThemeMode } from './components/PWA/PwaThemeEngine';
import { triggerFireworks, triggerActionReward } from './utils/confetti';
import { triggerHapticFeedback } from './utils/haptics';
import { toPrototypeCampaign } from './utils/publicCampaign';
import { PromoterSalesPage } from './components/Sales/PromoterSalesPage';
import { SpinWheelWidget } from './components/SpinWheel/SpinWheelWidget';

function App() {
  const [appPath] = useState(() => window.location.pathname);
  const [paidAccessLoading, setPaidAccessLoading] = useState(appPath === '/dashboard');
  const [paidAccess, setPaidAccess] = useState(false);

  useEffect(() => {
    if (appPath !== '/dashboard') return;
    const testToken = sessionStorage.getItem('vw_test_token');
    const headers: Record<string, string> = {};
    if (testToken) headers['x-vw-test-token'] = testToken;
    fetch('/api/access/session', { credentials: 'include', headers })
      .then((response) => response.json())
      .then((result) => setPaidAccess(result.authorized === true))
      .catch(() => setPaidAccess(false))
      .finally(() => setPaidAccessLoading(false));
  }, [appPath]);

  const requestTestAccess = async (email: string) => {
    const response = await fetch('/api/access/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Access denied');
    if (result.testToken) {
      sessionStorage.setItem('vw_test_token', result.testToken);
    }
    window.location.assign('/dashboard');
  };

  const isSalesRoute = appPath === '/' || (appPath === '/dashboard' && !paidAccess && !paidAccessLoading);

  if (appPath === '/dashboard' && paidAccessLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF8EF]">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-slate-500 shadow-lg">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-fuchsia-500 border-t-transparent" />
          Checking dashboard access…
        </div>
      </div>
    );
  }

  if (isSalesRoute) {
    return <PromoterSalesPage onTestAccess={requestTestAccess} />;
  }

  return <StudioApp defaultTab={appPath === '/dashboard' ? 'operations_analytics' : 'participant_hub'} />;
}

function StudioApp({ defaultTab }: { defaultTab: ActiveTab }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [activeCampaign, setActiveCampaign] = useState<Campaign>(mockCampaigns[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>(defaultTab);

  // PWA Aesthetic & Lifecycle State
  const [pwaTheme, setPwaTheme] = useState<PwaThemeMode>('cyber_aurora');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPwaModal, setShowPwaModal] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  // Participant State for Public Hub View
  const [isAuthenticatedParticipant, setIsAuthenticatedParticipant] = useState<boolean>(true);
  const [subscribers, setSubscribers] = useState<Subscriber[]>(mockSubscribers);
  const [currentParticipant, setCurrentParticipant] = useState<Subscriber>(mockSubscribers[0]);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>(mockActionLogs);
  const [pendingActionIds, setPendingActionIds] = useState<string[]>([]);
  const [previousDraws, setPreviousDraws] = useState<DrawAuditRecord[]>(mockPreviousDraws);

  // Global Legal & Compliance Modals
  const [showFairDrawModal, setShowFairDrawModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showComplaintsModal, setShowComplaintsModal] = useState(false);
  const [isLiveCampaign, setIsLiveCampaign] = useState(false);

  useEffect(() => {
    const match = window.location.pathname.match(/^\/c\/([^/]+)/);
    if (!match) return;

    const slug = decodeURIComponent(match[1]);
    fetch(`/api/campaigns/${encodeURIComponent(slug)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Campaign could not be loaded');
        return response.json();
      })
      .then(({ campaign }) => {
        const liveCampaign = toPrototypeCampaign(campaign);
        setCampaigns([liveCampaign]);
        setActiveCampaign(liveCampaign);
        setIsLiveCampaign(true);
        setIsAuthenticatedParticipant(false);
      })
      .catch((error) => console.error('[campaign] load failed', error));
  }, []);

  // Listen to PWA Install Prompt and Standalone state
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // Update theme attributes on document element
  useEffect(() => {
    document.documentElement.setAttribute('data-pwa-theme', pwaTheme);
    document.documentElement.style.setProperty('--primary-color', activeCampaign.theme.primaryColor);
  }, [pwaTheme, activeCampaign.theme.primaryColor]);

  // Handler: Join Campaign (New Public Entrant)
  const handleJoinCampaign = async (name: string, email: string, referrerCode?: string) => {
    if (isLiveCampaign) {
      try {
        const response = await fetch(`/api/campaigns/${encodeURIComponent(activeCampaign.slug)}/join`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, referrerCode }),
        });
        if (!response.ok) throw new Error((await response.json()).error || 'Join failed');
        const result = await response.json();
        const liveSubscriber: Subscriber = {
          id: result.subscriberId,
          campaignId: activeCampaign.id,
          name,
          email,
          referralCode: result.referralCode,
          referredByCode: result.referredByCode,
          totalEntries: activeCampaign.referralRewardEntries > 0 ? 1 : 0,
          referralCount: 0,
          completedActionIds: [],
          unlockedMilestoneIds: [],
          createdAt: new Date().toISOString(),
          fraudRiskScore: 0,
          fraudReasons: [],
          status: 'active',
        };
        setCurrentParticipant(liveSubscriber);
        setSubscribers([liveSubscriber]);
        setIsAuthenticatedParticipant(true);
        triggerHapticFeedback('success');
      } catch (error) {
        console.error('[campaign] join failed', error);
        window.alert(error instanceof Error ? error.message : 'Unable to join this campaign.');
      }
      return;
    }

    triggerHapticFeedback('success');
    const newReferralCode = name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 5) + Math.floor(10 + Math.random() * 90);
    const initialReward = referrerCode ? (1 + activeCampaign.referralRewardEntries) : 1;

    const newSub: Subscriber = {
      id: `sub-${Date.now()}`,
      campaignId: activeCampaign.id,
      name,
      email,
      referralCode: newReferralCode,
      referredByCode: referrerCode,
      totalEntries: initialReward,
      referralCount: 0,
      completedActionIds: [],
      unlockedMilestoneIds: [],
      createdAt: new Date().toISOString(),
      fraudRiskScore: 0,
      fraudReasons: [],
      status: 'active'
    };

    // If referred by someone in the database, award them +5 entries atomically
    let updatedSubscribers = [...subscribers];
    if (referrerCode) {
      updatedSubscribers = updatedSubscribers.map(sub => {
        if (sub.referralCode.toUpperCase() === referrerCode.toUpperCase()) {
          return {
            ...sub,
            referralCount: sub.referralCount + 1,
            totalEntries: sub.totalEntries + activeCampaign.referralRewardEntries
          };
        }
        return sub;
      });
    }

    updatedSubscribers.unshift(newSub);
    setSubscribers(updatedSubscribers);
    setCurrentParticipant(newSub);
    setIsAuthenticatedParticipant(true);

    // Update campaign stats
    setActiveCampaign(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        totalSubscribers: prev.stats.totalSubscribers + 1,
        totalReferrals: referrerCode ? prev.stats.totalReferrals + 1 : prev.stats.totalReferrals
      }
    }));

    triggerFireworks();
  };

  // Handler: Complete Bonus Action
  const handleActionCompleted = (actionId: string, reward: number) => {
    if (currentParticipant.completedActionIds.includes(actionId)) return;

    if (isLiveCampaign) {
      setPendingActionIds((previous) => previous.includes(actionId) ? previous : [...previous, actionId]);
      void fetch(`/api/campaigns/${encodeURIComponent(activeCampaign.slug)}/actions/${encodeURIComponent(actionId)}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriberId: currentParticipant.id }),
      })
        .then(async (response) => {
          if (!response.ok) throw new Error((await response.json()).error || 'Action could not be logged');
          return response.json() as Promise<{ awarded: number; status: string }>;
        })
        .then(() => {
          // Intent actions remain pending until an approved verifier confirms them.
          triggerHapticFeedback('light');
        })
        .catch((error) => {
          setPendingActionIds((previous) => previous.filter((id) => id !== actionId));
          console.error('[campaign] action failed', error);
        });
      return;
    }

    triggerHapticFeedback('success');
    const targetAction = activeCampaign.actions.find(a => a.id === actionId);
    const actionTitle = targetAction ? targetAction.title : 'Bonus Task';

    const updatedParticipant: Subscriber = {
      ...currentParticipant,
      totalEntries: currentParticipant.totalEntries + reward,
      completedActionIds: [...currentParticipant.completedActionIds, actionId]
    };

    setCurrentParticipant(updatedParticipant);
    setSubscribers(prev => prev.map(s => s.id === updatedParticipant.id ? updatedParticipant : s));

    // Log Action
    const newLog: ActionLog = {
      id: `log-${Date.now()}`,
      subscriberId: updatedParticipant.id,
      subscriberName: updatedParticipant.name,
      campaignId: activeCampaign.id,
      actionId,
      actionTitle,
      rewardAwarded: reward,
      timestamp: new Date().toISOString(),
      verified: true
    };

    setActionLogs(prev => [newLog, ...prev]);
    triggerActionReward();
  };

  // Handler: Update Campaign Configuration
  const handleUpdateCampaign = (updated: Campaign) => {
    setActiveCampaign(updated);
    setCampaigns(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  // Handler: Select Active Campaign from navbar dropdown
  const handleSelectCampaign = (camp: Campaign) => {
    setActiveCampaign(camp);
  };

  // Handler: Save Fair Draw Record
  const handleSaveDrawAudit = (record: DrawAuditRecord) => {
    setPreviousDraws(prev => [record, ...prev]);
  };

  // Handler: Update Subscriber Status (Disqualify / Whitelist)
  const handleUpdateSubscriberStatus = (subscriberId: string, status: 'active' | 'flagged' | 'disqualified') => {
    setSubscribers(prev => prev.map(s => s.id === subscriberId ? { ...s, status } : s));
  };

  return (
    <div className="min-h-screen pwa-mesh-bg text-slate-900 antialiased flex flex-col selection:bg-indigo-500 selection:text-white pb-20 lg:pb-8 transition-colors duration-500">
      
      {/* Universal PWA Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        campaign={activeCampaign}
        campaigns={campaigns}
        onSelectCampaign={handleSelectCampaign}
        isAuthenticatedParticipant={isAuthenticatedParticipant}
        onToggleParticipantAuth={() => setIsAuthenticatedParticipant(!isAuthenticatedParticipant)}
        onOpenDrawModal={() => setShowFairDrawModal(true)}
        onOpenPwaModal={() => setShowPwaModal(true)}
        currentPwaTheme={pwaTheme}
        onSelectPwaTheme={setPwaTheme}
        isStandalone={isStandalone}
      />

      {/* Main View Area */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* VIEW 1: PUBLIC PARTICIPANT HUB */}
        {activeTab === 'participant_hub' && (
          <>
            {activeCampaign.campaignType === 'spin_wheel' && activeCampaign.spinWheel ? (
              <div className="space-y-8">
                <SpinWheelWidget config={activeCampaign.spinWheel} />
                {!isAuthenticatedParticipant && (
                  <ParticipantLanding
                    campaign={activeCampaign}
                    referrerCode="ALEX77"
                    onJoinSuccess={handleJoinCampaign}
                    onOpenRules={() => setShowRulesModal(true)}
                    onOpenPrivacy={() => setShowPrivacyModal(true)}
                    onOpenTerms={() => setShowTermsModal(true)}
                  />
                )}
              </div>
            ) : !isAuthenticatedParticipant ? (
              <ParticipantLanding
                campaign={activeCampaign}
                referrerCode="ALEX77"
                onJoinSuccess={handleJoinCampaign}
                onOpenRules={() => setShowRulesModal(true)}
                onOpenPrivacy={() => setShowPrivacyModal(true)}
                onOpenTerms={() => setShowTermsModal(true)}
              />
            ) : (
              <ParticipantDashboard
                campaign={activeCampaign}
                subscriber={currentParticipant}
                allSubscribers={subscribers}
                pendingActionIds={pendingActionIds}
                onActionCompleted={handleActionCompleted}
                onOpenRules={() => setShowRulesModal(true)}
              />
            )}
          </>
        )}

        {/* VIEW 2: AGENCY VISUAL CUSTOMIZER & STAGING */}
        {activeTab === 'agency_customizer' && (
          <AgencyCustomizer
            campaign={activeCampaign}
            onUpdateCampaign={handleUpdateCampaign}
          />
        )}

        {/* VIEW 3: OPERATIONS ANALYTICS & FAIR DRAW */}
        {activeTab === 'operations_analytics' && (
          <AgencyDashboard
            campaign={activeCampaign}
            subscribers={subscribers}
            actionLogs={actionLogs}
            previousDraws={previousDraws}
            onOpenDrawModal={() => setShowFairDrawModal(true)}
            onUpdateSubscriberStatus={handleUpdateSubscriberStatus}
          />
        )}

      </main>

      {/* Universal Compliance & Directory Footer */}
      <Footer
        campaign={activeCampaign}
        onOpenPrivacy={() => setShowPrivacyModal(true)}
        onOpenTerms={() => setShowTermsModal(true)}
        onOpenComplaints={() => setShowComplaintsModal(true)}
        onOpenInstallApp={() => setShowPwaModal(true)}
        onOpenRules={() => setShowRulesModal(true)}
        onOpenFairDraw={() => setShowFairDrawModal(true)}
        isStandalone={isStandalone}
      />

      {/* PWA Mobile Floating Bottom Dock */}
      <PwaBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPwaModal={() => setShowPwaModal(true)}
        isInstallable={!isStandalone}
      />

      {/* Global Modals */}
      {showPwaModal && (
        <PwaInstallModal
          onClose={() => setShowPwaModal(false)}
          deferredPrompt={deferredPrompt}
          onInstalled={() => setIsStandalone(true)}
        />
      )}

      {showFairDrawModal && (
        <FairDrawModal
          campaign={activeCampaign}
          subscribers={subscribers}
          onClose={() => setShowFairDrawModal(false)}
          onSaveDrawAudit={handleSaveDrawAudit}
        />
      )}

      {showRulesModal && (
        <OfficialRulesModal
          campaign={activeCampaign}
          onClose={() => setShowRulesModal(false)}
        />
      )}

      {showPrivacyModal && (
        <PrivacyPolicyModal
          campaign={activeCampaign}
          onClose={() => setShowPrivacyModal(false)}
        />
      )}

      {showTermsModal && (
        <TermsConditionsModal
          campaign={activeCampaign}
          onClose={() => setShowTermsModal(false)}
        />
      )}

      {showComplaintsModal && (
        <ComplaintsModal
          campaign={activeCampaign}
          subscriber={isAuthenticatedParticipant ? currentParticipant : undefined}
          onClose={() => setShowComplaintsModal(false)}
        />
      )}

    </div>
  );
}
export default App;