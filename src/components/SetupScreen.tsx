import React from "react";
import { WorkspaceConfig } from "../types";
import { Sliders, Target, Eye, Landmark, HelpCircle, Save, Sparkles } from "lucide-react";

interface SetupScreenProps {
  config: WorkspaceConfig;
  onUpdateConfig: (newConfig: WorkspaceConfig) => void;
  onSave: () => void;
}

const AVAILABLE_PERSONAS = [
  "CEO / Founder",
  "CRO / VP Sales",
  "CMO / VP Marketing",
  "Head of RevOps",
  "Head of Growth",
  "CTO",
  "COO",
  "Partnerships Manager",
];

const AVAILABLE_FUNDING_STAGES = [
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C+",
  "Bootstrapped",
  "Public",
];

export default function SetupScreen({ config, onUpdateConfig, onSave }: SetupScreenProps) {
  const togglePersona = (persona: string) => {
    const isSelected = config.targetPersonas.includes(persona);
    const updated = isSelected
      ? config.targetPersonas.filter((p) => p !== persona)
      : [...config.targetPersonas, persona];
    onUpdateConfig({ ...config, targetPersonas: updated });
  };

  const toggleFundingStage = (stage: string) => {
    const isSelected = config.fundingStages.includes(stage);
    const updated = isSelected
      ? config.fundingStages.filter((s) => s !== stage)
      : [...config.fundingStages, stage];
    onUpdateConfig({ ...config, fundingStages: updated });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Intro Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-50/70 via-indigo-20 hover:from-indigo-100/50 p-6 rounded-2xl border border-indigo-150/45 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-700">
            <Sliders className="h-4.5 w-4.5" />
            <h2 className="font-display font-semibold text-lg">Campaign Intake Briefing</h2>
          </div>
          <p className="text-slate-600 font-light text-xs font-sans max-w-xl">
            Submit your product specifications to help our growth team calibrate buying signal filters and draft bespoke Outreach sequences for highly verified B2B segments.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-indigo-200/50 font-mono text-[10px] text-indigo-700">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          <span>Configuring Managed Services</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Parameters */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 border-b border-slate-100 pb-2 mb-4">
              Company & Product Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 leading-none">Company Website URL</label>
                <input
                  type="text"
                  placeholder="e.g. https://www.yourcompany.com"
                  value={config.companyWebsite}
                  onChange={(e) => onUpdateConfig({ ...config, companyWebsite: e.target.value })}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 leading-none">Target Industry / Segment</label>
                <input
                  type="text"
                  placeholder="e.g. Enterprise Software, FinTech, Cybersecurity"
                  value={config.targetIndustry}
                  onChange={(e) => onUpdateConfig({ ...config, targetIndustry: e.target.value })}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 leading-none">Geography & Regions</label>
                <input
                  type="text"
                  placeholder="e.g. North America, APAC, Europe (West)"
                  value={config.targetGeography}
                  onChange={(e) => onUpdateConfig({ ...config, targetGeography: e.target.value })}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 leading-none">ICP Company Employee Count</label>
                <select
                  value={config.companySizeRange}
                  onChange={(e) => onUpdateConfig({ ...config, companySizeRange: e.target.value })}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-800 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-colors"
                >
                  <option value="1-10 employees">1-10 employees (Micro)</option>
                  <option value="11-50 employees">11-50 employees (Early Stage)</option>
                  <option value="51-200 employees">51-200 employees (Mid Market Scale)</option>
                  <option value="201-1000 employees">201-1000 employees (Enterprise)</option>
                  <option value="1000+ employees">1000+ employees (Global Fortune)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 leading-none">Company / Product Value Description</label>
              <textarea
                rows={3}
                placeholder="Briefly describe what your product actually does, and the core pain point it solves. This allows Gemini to contextually pitch your target prospects."
                value={config.companyDescription}
                onChange={(e) => onUpdateConfig({ ...config, companyDescription: e.target.value })}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-colors resize-none leading-relaxed"
              ></textarea>
            </div>
          </div>

          {/* Buyer Personas Multi-select pills */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-2">
              <Target className="h-4 w-4 text-indigo-600" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
                Target Buyer Job Personas
              </h3>
            </div>
            <p className="text-slate-500 text-[11px] leading-normal font-light">
              We focus contact scraping on these specific departments. Select all relevant buyers.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {AVAILABLE_PERSONAS.map((p) => {
                const isSelected = config.targetPersonas.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => togglePersona(p)}
                    className={`px-3.5 py-2.5 rounded-full text-xs font-semibold font-sans border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                        : "bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Funding Stages multi-select */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-2">
              <Landmark className="h-4 w-4 text-sky-600" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
                Target Funding Stages
              </h3>
            </div>
            <p className="text-slate-500 text-[11px] leading-normal font-light">
              Track companies falling strictly under these venture backing classes.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {AVAILABLE_FUNDING_STAGES.map((s) => {
                const isSelected = config.fundingStages.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleFundingStage(s)}
                    className={`px-3.5 py-2.5 rounded-full text-xs font-semibold font-sans border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-sky-600 border-sky-600 text-white shadow-xs"
                        : "bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-sky-50 hover:text-slate-900"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Panel / Onboarding Help */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl border border-slate-855 p-6 space-y-6 shadow-xl relative overflow-hidden">
            {/* Ambient visual badge */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider leading-none">
                Submit Campaign Brief
              </span>
              <h4 className="font-display font-medium text-base text-white">Calibrate Outbound Scrapers</h4>
              <p className="text-slate-400 font-light text-[11px] leading-relaxed">
                Saving this campaign brief instantly calibrates our managed outbound crawler priorities. This ensures the curated pipeline delivered to your Ledger aligns with your precise B2B segments.
              </p>
            </div>

            <button
              onClick={onSave}
              className="w-full py-3.5 bg-indigo-650 hover:bg-indigo-550 transition-colors rounded-xl font-bold text-xs text-white shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Authorize & Calibrate Campaign Brief</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-slate-600  pb-2 mb-2">
              <HelpCircle className="h-4.5 w-4.5 text-slate-400" />
              <h4 className="text-xs font-bold text-slate-800">Professional SDR Copywriting</h4>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed font-light font-sans">
              Our service connects proprietary Signal OS algorithms with Gemini-3.5-flash and expert growth copywriters. By providing real, articulate details of your value propositions, we map buying events to highly compelling, contextually relevant sales sequences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
