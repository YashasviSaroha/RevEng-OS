import React, { useState, useEffect } from "react";
import { ActiveView, WorkspaceConfig, BuyingSignal, Integration, Lead } from "./types";
import Navbar from "./components/Navbar";
import LandingHero from "./components/LandingHero";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import SetupScreen from "./components/SetupScreen";
import SignalsScreen from "./components/SignalsScreen";
import ToolsScreen from "./components/ToolsScreen";
import RunWorkflowScreen from "./components/RunWorkflowScreen";
import LeadsDashboard from "./components/LeadsDashboard";
import AnalyticsScreen from "./components/AnalyticsScreen";
import { Sparkles, ArrowRight, ShieldCheck, Mail, Sliders } from "lucide-react";
import { useFirebase } from "./context/FirebaseContext";

// Initial Signal Configs
const DEFAULT_SIGNALS: BuyingSignal[] = [
  { id: "s1", name: "Hiring SDRs", icon: "UserPlus", description: "Target flags listing for sales roles, signalling outbound pipeline growth.", isEnabled: true, priority: "High", score: 85 },
  { id: "s2", name: "Recent Funding", icon: "DollarSign", description: "Track announcements of seed / venture rounds indicating expansion capital.", isEnabled: true, priority: "High", score: 95 },
  { id: "s3", name: "AI Adoption", icon: "Sparkles", description: "Identify Newly embedded AI tools (e.g. OpenAI SDK) inside tech stacks.", isEnabled: true, priority: "Medium", score: 65 },
  { id: "s4", name: "Product Launch", icon: "Rocket", description: "Discover announcements on Product Hunt, G2, or press releases.", isEnabled: false, priority: "Medium", score: 50 },
  { id: "s5", name: "Leadership Hiring", icon: "Briefcase", description: "Flag newly appointed heads of sales, marketing, or operations.", isEnabled: true, priority: "High", score: 80 },
  { id: "s6", name: "Expansion Hiring", icon: "TrendingUp", description: "Detect multiple open postings across international offices.", isEnabled: true, priority: "Medium", score: 60 },
  { id: "s7", name: "Tech Stack Changes", icon: "Layers", description: "Identify migrations from Legacy tools to modern alternatives.", isEnabled: false, priority: "Low", score: 40 },
  { id: "s8", name: "Website Changes", icon: "Globe", description: "Spot updates on target service landing pages or terms agreements.", isEnabled: false, priority: "Low", score: 35 },
  { id: "s9", name: "Competitor Usage", icon: "Activity", description: "Detect deployments of direct competing products (e.g. Apollo alternatives).", isEnabled: true, priority: "Medium", score: 70 },
];

// Initial Integration Lists
const DEFAULT_INTEGRATIONS: Integration[] = [
  { id: "apollo", name: "Apollo.io", logo: "AP", description: "Push verified emails directly into sequences.", isConnected: true, statusText: "API Live", apiKeyLabel: "Apollo Private API Key" },
  { id: "hubspot", name: "HubSpot CRM", logo: "HS", description: "Sink signal leads and historic outreach notes.", isConnected: true, statusText: "OAuth Synced", apiKeyLabel: "HubSpot Account Access Token" },
  { id: "salesforce", name: "Salesforce CRM", logo: "SF", description: "Convert buying entities into active pipeline accounts.", isConnected: false, statusText: "Offline", apiKeyLabel: "Salesforce Client Secret Token" },
  { id: "slack", name: "Slack channel", logo: "SL", description: "Receive real-time notifications on trigger catches.", isConnected: true, statusText: "Webhook Connected", apiKeyLabel: "Slack Webhook Endpoint Url" },
  { id: "gmail", name: "Gmail account", logo: "GM", description: "Send automated personalizations from personal handles.", isConnected: false, statusText: "Offline", apiKeyLabel: "Google OAuth Secret ID" },
  { id: "openai", name: "OpenAI API", logo: "OA", description: "Alternative AI model processing customization engines.", isConnected: false, statusText: "Offline", apiKeyLabel: "OpenAI Secret Key" },
  { id: "linkedin", name: "LinkedIn Messenger", logo: "LN", description: "Draft short connection opener pitches to target accounts.", isConnected: true, statusText: "Profile Attached" },
  { id: "clay", name: "Clay platform", logo: "CL", description: "Export outbound batches into custom sheets workflows.", isConnected: false, statusText: "Offline", apiKeyLabel: "Clay Workspace Authorization Token" },
];

// Default Leads before first run (realistic look)
const DEFAULT_LEADS: Lead[] = [
  {
    id: "lead-1",
    company: "Vercel",
    domain: "vercel.com",
    contactName: "Lee Robinson",
    contactEmail: "lee@vercel.com",
    contactTitle: "VP Developer Relations",
    signalDetected: "AI Adoption",
    signalDate: "2 hours ago",
    intentScore: 94,
    fundingStage: "Series D",
    location: "San Francisco, CA",
    employeeCount: 450,
    aiSummary: "Recently deployed OpenAI LLM endpoints inside hosting framework analytics logs.",
    outreachStatus: "Ready"
  },
  {
    id: "lead-2",
    company: "Linear",
    domain: "linear.app",
    contactName: "Tuomas Artman",
    contactEmail: "tuomas@linear.app",
    contactTitle: "Head of Growth & Co-founder",
    signalDetected: "Hiring SDRs",
    signalDate: "1 day ago",
    intentScore: 89,
    fundingStage: "Series A",
    location: "Helsinki, Finland",
    employeeCount: 85,
    aiSummary: "Open listing for 3 senior outbound sales representatives focusing on US enterprise cohorts.",
    outreachStatus: "Ready"
  },
  {
    id: "lead-3",
    company: "Ramp Card",
    domain: "ramp.com",
    contactName: "Eric Glyman",
    contactEmail: "eric@ramp.com",
    contactTitle: "CEO / Founder",
    signalDetected: "Recent Funding",
    signalDate: "3 days ago",
    intentScore: 98,
    fundingStage: "Series D",
    location: "New York, NY",
    employeeCount: 1100,
    aiSummary: "Announced $150M corporate debt and equity expansion round to scale commercial segments.",
    outreachStatus: "Ready"
  },
  {
    id: "lead-4",
    company: "Retool",
    domain: "retool.com",
    contactName: "John Doe",
    contactEmail: "john@retool.com",
    contactTitle: "CRO / VP Sales",
    signalDetected: "Competitor Usage",
    signalDate: "4 days ago",
    intentScore: 82,
    fundingStage: "Series C",
    location: "San Francisco, CA",
    employeeCount: 380,
    aiSummary: "Recently canceled a competitive contract with legacy outbound vendors, redirecting budget to signal-based outreach.",
    outreachStatus: "Ready"
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState<ActiveView>(ActiveView.LANDING);
  const { user, loadUserData, saveWorkspaceConfig, saveSignal, saveIntegration, saveLead, saveLeadsBatch } = useFirebase();

  // Onboarding Setup Configuration
  const [workspaceConfig, setWorkspaceConfig] = useState<WorkspaceConfig>({
    companyWebsite: "https://www.retarget.com",
    companyDescription: "Convert silent web visitors into high conversion qualified pipelines automatically by scanning G2 activity.",
    targetIndustry: "B2B Enterprise Software & Tech platforms",
    targetGeography: "North America / EuropeWest",
    companySizeRange: "51-200 employees",
    targetPersonas: ["CEO / Founder", "CRO / VP Sales", "Head of Growth"],
    fundingStages: ["Seed", "Series A", "Series B"],
  });

  // System states lists
  const [signals, setSignals] = useState<BuyingSignal[]>(DEFAULT_SIGNALS);
  const [integrations, setIntegrations] = useState<Integration[]>(DEFAULT_INTEGRATIONS);
  const [leads, setLeads] = useState<Lead[]>(DEFAULT_LEADS);

  // App notification banner state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync data with Cloud Firestore when user signs in
  useEffect(() => {
    async function syncUserData() {
      if (user) {
        try {
          const cloud = await loadUserData();
          if (cloud.config || cloud.signals || cloud.integrations || cloud.leads) {
            if (cloud.config) setWorkspaceConfig(cloud.config);
            if (cloud.signals) setSignals(cloud.signals);
            if (cloud.integrations) setIntegrations(cloud.integrations);
            if (cloud.leads) setLeads(cloud.leads);
            showToast(`Synchronized ${user.email} campaign workspace!`);
          } else {
            // New user in DB - populate cloud collections with default templates
            await saveWorkspaceConfig(workspaceConfig);
            await saveLeadsBatch(leads);
            const signalPromises = signals.map(s => saveSignal(s));
            const intPromises = integrations.map(i => saveIntegration(i));
            await Promise.all([...signalPromises, ...intPromises]);
            showToast("Created secure cloud replica of your campaign configurations!");
          }
        } catch (e) {
          console.error("Cloud synchronizer error:", e);
        }
      }
    }
    syncUserData();
  }, [user]);

  // Navigations scrolls
  const handleScrollToSection = (id: string) => {
    setCurrentView(ActiveView.LANDING);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  };

  // Signals actions
  const handleToggleSignal = (id: string) => {
    setSignals((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s));
      const updated = next.find(s => s.id === id);
      if (user && updated) {
        saveSignal(updated);
      }
      return next;
    });
  };

  const handleUpdatePriority = (id: string, priority: "High" | "Medium" | "Low") => {
    setSignals((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, priority } : s));
      const updated = next.find(s => s.id === id);
      if (user && updated) {
        saveSignal(updated);
      }
      return next;
    });
  };

  const handleUpdateScore = (id: string, score: number) => {
    setSignals((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, score } : s));
      const updated = next.find(s => s.id === id);
      if (user && updated) {
        saveSignal(updated);
      }
      return next;
    });
  };

  // Integrations actions
  const handleToggleConnect = (id: string, apiKey?: string) => {
    setIntegrations((prev) => {
      const next = prev.map((item) => {
        if (item.id === id) {
          const connectedState = !item.isConnected;
          return {
            ...item,
            isConnected: connectedState,
            statusText: connectedState ? "API Live" : "Offline",
          };
        }
        return item;
      });
      const updated = next.find(i => i.id === id);
      if (user && updated) {
        saveIntegration(updated);
      }
      return next;
    });
    const item = integrations.find((i) => i.id === id);
    if (item) {
      showToast(item.isConnected ? `Disconnected API key for ${item.name}` : `Connected API key for ${item.name} successfully!`);
    }
  };

  const handleUpdateLead = (updated: Lead) => {
    setLeads((prev) => {
      const next = prev.map((l) => (l.id === updated.id ? updated : l));
      if (user) {
        saveLead(updated);
      }
      return next;
    });
  };

  const handleWorkflowRunComplete = (newLeadsGenerated: any[]) => {
    // Inject custom generated Leads matching actual ICP config
    // Make ID unique with timestamp to prevent multi-session collision
    const timestamp = Date.now();
    const leadEntities: Lead[] = newLeadsGenerated.map((item, idx) => ({
      id: `generated-lead-${idx}-${timestamp}`,
      company: item.company,
      domain: item.domain,
      contactName: item.contactName,
      contactEmail: item.contactEmail,
      contactTitle: item.contactTitle,
      signalDetected: item.signalDetected,
      signalDate: item.signalDate,
      intentScore: item.intentScore,
      fundingStage: item.fundingStage,
      location: item.location,
      employeeCount: item.employeeCount,
      aiSummary: item.aiSummary,
      outreachStatus: "Ready",
    }));

    setLeads(leadEntities);
    if (user) {
      saveLeadsBatch(leadEntities);
    }
    showToast(`Signal Scan Completed! Loaded ${leadEntities.length} matching prospects tailored to your exact profile.`);
    setCurrentView(ActiveView.LEADS); // Auto switch to Leads dashboard to let them review
  };

  const handleSaveConfig = () => {
    if (user) {
      saveWorkspaceConfig(workspaceConfig);
    }
    showToast("Workspace configuration saved! Scrapers updated with target criteria.");
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 antialiased font-sans">
      {/* Dynamic Toast Notifications */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-slate-850 px-5 py-3.5 rounded-2xl shadow-2xl animate-bounce flex items-center gap-2.5 max-w-sm">
          <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
          <span className="text-xs font-semibold leading-relaxed">{toastMessage}</span>
        </div>
      )}

      {/* RENDER VIEW SELECTION */}
      {currentView === ActiveView.LANDING ? (
        <div className="flex flex-col">
          <Navbar
            onLaunchConsole={() => {
              setCurrentView(ActiveView.SETUP);
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
            onScrollTo={handleScrollToSection}
          />
          <LandingHero
            onLaunchConsole={() => {
              setCurrentView(ActiveView.SETUP);
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
            onScrollTo={handleScrollToSection}
          />
        </div>
      ) : (
        /* Console Dashboard Layout container */
        <div className="flex bg-slate-50 min-h-screen">
          <Sidebar
            currentView={currentView}
            onChangeView={setCurrentView}
            onExitConsole={() => setCurrentView(ActiveView.LANDING)}
          />

          <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
            <Header currentView={currentView} leadCount={leads.length} />

            <main className="flex-1 overflow-y-auto p-6 max-w-7xl w-full mx-auto">
              {currentView === ActiveView.SETUP && (
                <SetupScreen
                  config={workspaceConfig}
                  onUpdateConfig={setWorkspaceConfig}
                  onSave={handleSaveConfig}
                />
              )}

              {currentView === ActiveView.SIGNALS && (
                <SignalsScreen
                  signals={signals}
                  onToggleSignal={handleToggleSignal}
                  onUpdatePriority={handleUpdatePriority}
                  onUpdateScore={handleUpdateScore}
                />
              )}

              {currentView === ActiveView.TOOLS && (
                <ToolsScreen integrations={integrations} onToggleConnect={handleToggleConnect} />
              )}

              {currentView === ActiveView.RUN && (
                <RunWorkflowScreen config={workspaceConfig} onRunComplete={handleWorkflowRunComplete} />
              )}

              {currentView === ActiveView.LEADS && (
                <LeadsDashboard
                  leads={leads}
                  workspaceConfig={workspaceConfig}
                  onUpdateLead={handleUpdateLead}
                />
              )}

              {currentView === ActiveView.ANALYTICS && <AnalyticsScreen leads={leads} />}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
