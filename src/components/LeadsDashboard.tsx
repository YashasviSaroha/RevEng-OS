import React, { useState } from "react";
import { Lead, WorkspaceConfig } from "../types";
import {
  Search,
  Filter,
  Download,
  SlidersHorizontal,
  Mail,
  Linkedin,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  ChevronDown,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  X,
  FileSpreadsheet,
  Layers,
  Globe,
  Plus
} from "lucide-react";

interface LeadsDashboardProps {
  leads: Lead[];
  workspaceConfig: WorkspaceConfig;
  onUpdateLead: (updated: Lead) => void;
}

export default function LeadsDashboard({
  leads,
  workspaceConfig,
  onUpdateLead,
}: LeadsDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSignalFilter, setSelectedSignalFilter] = useState("All");
  const [selectedFundingFilter, setSelectedFundingFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"intentScore" | "company">("intentScore");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // AI Generation States
  const [generationTone, setGenerationTone] = useState<"professional" | "creative" | "direct">("professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"email" | "linkedin" | "followup" | "summary">("email");

  // CSV Mock Toast Alert State
  const [csvAlert, setCsvAlert] = useState(false);

  // Filters Options lists
  const signalOptions = ["All", ...Array.from(new Set(leads.map((l) => l.signalDetected)))];
  const fundingOptions = ["All", ...Array.from(new Set(leads.map((l) => l.fundingStage)))];

  // Search/Filters handlers
  const filteredLeads = leads
    .filter((l) => {
      const matchSearch =
        l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.contactTitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSignal = selectedSignalFilter === "All" || l.signalDetected === selectedSignalFilter;
      const matchFunding = selectedFundingFilter === "All" || l.fundingStage === selectedFundingFilter;
      return matchSearch && matchSignal && matchFunding;
    })
    .sort((a, b) => {
      if (sortBy === "intentScore") {
        return b.intentScore - a.intentScore; // High to low
      } else {
        return a.company.localeCompare(b.company);
      }
    });

  const triggerExportCSV = () => {
    setCsvAlert(true);
    setTimeout(() => setCsvAlert(false), 3000);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // API Outreach generation proxy call (fetches live personalize)
  const handleGenerateOutreach = async (lead: Lead) => {
    setIsGenerating(true);
    onUpdateLead({ ...lead, outreachStatus: "Generating" });

    try {
      const response = await fetch("/api/personalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead,
          config: workspaceConfig,
          tone: generationTone,
        }),
      });

      if (!response.ok) {
        throw new Error("API call failed.");
      }

      const data = await response.json();
      const updated: Lead = {
        ...lead,
        outreachStatus: "Ready",
        customPersonalizedEmail: data.emailBody,
        customLinkedInOpener: data.linkedinOpener,
        customFollowUp: data.followUp,
        customSummary: data.prospectSummary,
      };

      onUpdateLead(updated);
      setSelectedLead(updated);
    } catch (err) {
      console.error("Personalization failed:", err);
      onUpdateLead({ ...lead, outreachStatus: "Ready" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* Search Grid and Controls */}
      <div className="bg-white border border-slate-200/85 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Senders filters input */}
          <div className="flex-1 max-w-md relative font-sans">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies, contacts or roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Signal Categories */}
            <div className="relative font-sans text-xs flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-500 font-medium">Signal:</span>
              <select
                value={selectedSignalFilter}
                onChange={(e) => setSelectedSignalFilter(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                {signalOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Funding stages filter */}
            <div className="relative font-sans text-xs flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
              <span className="text-slate-500 font-medium">Stage:</span>
              <select
                value={selectedFundingFilter}
                onChange={(e) => setSelectedFundingFilter(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                {fundingOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorter */}
            <button
              onClick={() => setSortBy(sortBy === "intentScore" ? "company" : "intentScore")}
              className="px-3 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Sort: {sortBy === "intentScore" ? "Score" : "Name"}</span>
            </button>

            {/* Export Sheet */}
            <button
              onClick={triggerExportCSV}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <FileSpreadsheet className="h-4 w-4 shrink-0" />
              <span>Export Ledger CSV</span>
            </button>
          </div>
        </div>
      </div>

      {csvAlert && (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-emerald-800 text-xs text-center flex items-center justify-center gap-2 animate-fade-in shadow-lg">
          <Check className="h-4.5 w-4.5 animate-bounce" />
          <span>Success! Downloaded customized campaign ledger export - csv_campaign_ledger_{new Date().getDate()}.csv ready</span>
        </div>
      )}

      {/* Main Grid: list + personalizer side panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Contacts datagrid table */}
        <div className={`xl:col-span-8 bg-white border border-slate-200/85 rounded-2xl overflow-hidden shadow-xs`}>
          {filteredLeads.length === 0 ? (
            <div className="px-6 py-20 text-center font-sans space-y-3">
              <Layers className="h-10 w-10 text-slate-300 mx-auto animate-bounce" />
              <h4 className="font-bold text-slate-800 text-sm">No Campaign Ledger Handoffs Yet</h4>
              <p className="text-slate-500 text-xs max-w-md mx-auto">
                Authorize your Campaign Intake Brief first and run a Pilot Simulation scan to witness our signal filters curating verified B2B prospect handoffs live.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase font-mono tracking-wider font-bold border-b border-slate-200/70">
                    <th className="py-4 px-4 font-semibold text-[10px]">Company & domain</th>
                    <th className="py-4 px-4 font-semibold text-[10px]">Contact Buyer</th>
                    <th className="py-4 px-4 font-semibold text-[10px]">Signal Detected</th>
                    <th className="py-4 px-4 font-semibold text-[10px] text-center">Score</th>
                    <th className="py-4 px-4 font-semibold text-[10px] text-center font-mono">Stage</th>
                    <th className="py-4 px-4 font-semibold text-[10px] text-right">Outreach</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {filteredLeads.map((lead) => {
                    const isSelected = selectedLead?.id === lead.id;

                    return (
                      <tr
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`hover:bg-indigo-50/20 cursor-pointer transition-colors ${
                          isSelected ? "bg-indigo-50/40 border-l-4 border-l-indigo-650" : ""
                        }`}
                      >
                        {/* Company field */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0 select-none">
                              {lead.company[0]}
                            </div>
                            <div className="overflow-hidden">
                              <span className="font-bold text-slate-900 leading-normal block truncate">
                                {lead.company}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 hover:text-indigo-600 transition-colors">
                                <Globe className="h-3 w-3" />
                                {lead.domain}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Contact User */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 leading-normal truncate font-sans">
                              {lead.contactName}
                            </span>
                            <span className="text-[10px] text-slate-500 truncate">{lead.contactTitle}</span>
                          </div>
                        </td>

                        {/* Signal Catch */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 leading-normal block">
                              {lead.signalDetected}
                            </span>
                            <span className="text-[9.5px] text-slate-400 leading-none">
                              {lead.signalDate}
                            </span>
                          </div>
                        </td>

                        {/* Weighted score pill */}
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              lead.intentScore >= 90
                                ? "bg-rose-50 text-rose-600"
                                : "bg-amber-50 text-amber-600"
                            }`}
                          >
                            {lead.intentScore}%
                          </span>
                        </td>

                        {/* Funding Stage */}
                        <td className="py-4 px-4 text-center">
                          <span className="text-[10.5px] font-mono font-medium text-slate-500">
                            {lead.fundingStage}
                          </span>
                        </td>

                        {/* Selection check out */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end">
                            <ChevronRight className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* AI Outreach Personalizer Sidepanel */}
        <div className="xl:col-span-4 space-y-4">
          {selectedLead ? (
            <div className="bg-slate-950 text-white rounded-2xl border border-slate-900 overflow-hidden shadow-2xl p-6 space-y-6 relative transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-550/10 rounded-full blur-xl pointer-events-none"></div>

              {/* Close Button if responsive */}
              <div className="flex items-start justify-between border-b border-slate-900 pb-4">
                <div className="space-y-1 overflow-hidden font-sans">
                  <span className="text-[9px] font-mono text-indigo-400 tracking-wider font-bold block uppercase leading-none">
                    Intelligence Details
                  </span>
                  <h4 className="font-display font-medium text-slate-200 text-sm truncate leading-tight">
                    {selectedLead.company}
                  </h4>
                  <span className="font-mono text-[10px] text-slate-500">
                    Lead Score: {selectedLead.intentScore}%
                  </span>
                </div>

                <div className="flex items-center bg-indigo-650/15 border border-indigo-900/40 px-2.5 py-1 rounded-lg">
                  <span className="text-[10px] font-semibold text-indigo-400">
                    {selectedLead.signalDetected}
                  </span>
                </div>
              </div>

              {/* Company Metrics Info Block */}
              <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-900 space-y-2 text-[10.5px]">
                <div className="flex items-center justify-between text-slate-450 border-b border-slate-900 pb-1.5 last:border-none last:pb-0">
                  <span>Contact:</span>
                  <span className="text-white font-bold">{selectedLead.contactName} ({selectedLead.contactTitle})</span>
                </div>
                <div className="flex items-center justify-between text-slate-450 border-b border-slate-900 pb-1.5 last:border-none last:pb-0">
                  <span>Headcount:</span>
                  <span className="text-white font-mono">{selectedLead.employeeCount} employees</span>
                </div>
                <div className="flex items-center justify-between text-slate-450">
                  <span>Location:</span>
                  <span className="text-white">{selectedLead.location}</span>
                </div>
              </div>

              {/* Custom AI Scraped Summary description */}
              <div className="space-y-1 font-sans text-xs">
                <span className="text-slate-450 text-[10.5px] font-semibold">Signal Findings:</span>
                <p className="text-slate-350 bg-slate-900 border border-slate-850 p-3 rounded-lg leading-normal italic font-light">
                  "{selectedLead.aiSummary || "Hiring activity recently matches outbound parameters."}"
                </p>
              </div>

              {/* Tones Selection & Re-generate Panel */}
              <div className="border-t border-slate-900 pt-4 space-y-3 font-sans">
                <div className="flex items-center justify-between">
                  <span className="text-slate-450 text-xs">Outreach Tone:</span>
                  <div className="bg-slate-900 border border-slate-850 p-0.5 rounded-lg flex gap-0.5">
                    {(["professional", "creative", "direct"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setGenerationTone(t)}
                        className={`px-2 py-1 rounded text-[10px] font-semibold capitalize transition-all cursor-pointer ${
                          generationTone === t
                            ? "bg-indigo-650 text-white"
                            : "text-slate-500 hover:text-slate-200"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleGenerateOutreach(selectedLead)}
                  disabled={isGenerating}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Gemini personalization drafts ...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
                      <span>{selectedLead.customPersonalizedEmail ? "Re-Generate Outbound" : "Generate Custom AI Personalizations"}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Personalization Result Area */}
              {selectedLead.customPersonalizedEmail ? (
                <div className="space-y-4 border-t border-slate-900 pt-4 font-sans">
                  {/* Tab Selector */}
                  <div className="flex bg-slate-900 p-0.5 rounded-lg text-[10.5px] font-semibold">
                    <button
                      onClick={() => setActiveTab("email")}
                      className={`flex-1 py-1.5 rounded-md text-center cursor-pointer capitalize ${
                        activeTab === "email" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Email
                    </button>
                    <button
                      onClick={() => setActiveTab("linkedin")}
                      className={`flex-1 py-1.5 rounded-md text-center cursor-pointer capitalize ${
                        activeTab === "linkedin" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      LinkedIn
                    </button>
                    <button
                      onClick={() => setActiveTab("followup")}
                      className={`flex-1 py-1.5 rounded-md text-center cursor-pointer capitalize ${
                        activeTab === "followup" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Bump
                    </button>
                  </div>

                  {/* Render Tab Contents */}
                  <div className="bg-slate-900 border border-slate-850 rounded-xl p-4 space-y-3 relative">
                    <button
                      onClick={() =>
                        handleCopy(
                          activeTab === "email"
                            ? selectedLead.customPersonalizedEmail || ""
                            : activeTab === "linkedin"
                              ? selectedLead.customLinkedInOpener || ""
                              : selectedLead.customFollowUp || "",
                          activeTab
                        )
                      }
                      className="absolute top-3 right-3 p-1.5 bg-slate-950/80 hover:bg-slate-950 text-slate-400 hover:text-white rounded-md cursor-pointer border border-slate-800 transition-colors"
                      title="Copy content"
                    >
                      {copiedKey === activeTab ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>

                    {/* Content textareas */}
                    {activeTab === "email" && (
                      <div className="space-y-2">
                        <span className="text-[10px] text-indigo-400 font-mono">SUBJECT: {selectedLead.company} Signal Match Update</span>
                        <p className="text-slate-300 text-xs font-mono whitespace-pre-line leading-relaxed">
                          {selectedLead.customPersonalizedEmail}
                        </p>
                      </div>
                    )}

                    {activeTab === "linkedin" && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-indigo-400 font-mono uppercase">Short Request (Under 300 char)</span>
                        <p className="text-slate-300 text-xs leading-relaxed font-mono">
                          {selectedLead.customLinkedInOpener}
                        </p>
                      </div>
                    )}

                    {activeTab === "followup" && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-indigo-400 font-mono">BUMP SEQUENCE (3 days later)</span>
                        <p className="text-slate-300 text-xs font-mono whitespace-pre-line leading-relaxed">
                          {selectedLead.customFollowUp}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-slate-850 rounded-xl p-8 text-center text-slate-500 text-[11px]">
                  Click "Generate Custom AI Personalizations" above to connect to Gemini and create custom sales templates!
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border rounded-2xl p-6 text-center text-slate-500 text-xs font-sans h-80 flex flex-col items-center justify-center gap-3 border-dashed shadow-xs">
              <Award className="h-8 w-8 text-slate-400 animate-bounce" />
              <h4 className="font-bold text-slate-700">Explore Intelligence Dossier</h4>
              <p className="text-[10.5px] leading-normal font-light">
                Select any qualified target account row on the left grid to view deep buying triggers, contact emails, and generate direct personalized outreach messages.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
