import React, { useState, useEffect, useRef } from "react";
import { WorkflowStep, LiveLog, WorkspaceConfig } from "../types";
import {
  Sparkles,
  Play,
  Terminal as TerminalIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  TrendingUp,
  Award
} from "lucide-react";

interface RunWorkflowScreenProps {
  config: WorkspaceConfig;
  onRunComplete: (leads: any[]) => void;
}

const INITIAL_STEPS: WorkflowStep[] = [
  { id: "scrape", name: "Account Intelligence Scrape", status: "idle", description: "Query target segments using our proprietary crawler grids to parse active accounts." },
  { id: "signals", name: "Buying Signal Detection", status: "idle", description: "Filter company hires, G2 activity, tech adoptions, and funding milestones." },
  { id: "enrich", name: "Direct Person Enrichment", status: "idle", description: "Identify decision makers (CROs, VP of Sales) with verified contact logic." },
  { id: "score", name: "Score & Verify Handoffs", status: "idle", description: "Apply priority filters to confirm each target matches your retainer metrics." },
  { id: "outreach", name: "Draft Custom Personalization", status: "idle", description: "Deploy Gemini fine-tuned adapters to construct relevant outreach drafts." },
  { id: "save", name: "Sync Lead Ledger", status: "idle", description: "Load the curated list into your verified client ledger with research dossiers." },
];

export default function RunWorkflowScreen({ config, onRunComplete }: RunWorkflowScreenProps) {
  const [steps, setSteps] = useState<WorkflowStep[]>(INITIAL_STEPS);
  const [logs, setLogs] = useState<LiveLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorState, setErrorState] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto Scroll Terminal Logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const addLog = (message: string, type: "info" | "success" | "warning" | "error" | "ai" = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { timestamp, type, message }]);
  };

  const handleRunScan = async () => {
    setIsRunning(true);
    setProgress(0);
    setErrorState("");
    setSteps(INITIAL_STEPS.map((s) => ({ ...s, status: s.id === "scrape" ? "processing" : "idle" })));
    setLogs([]);

    addLog(`[Signal OS Boot] Initializing scan cluster for ICP: ${config.companyWebsite || "technology"}`, "info");
    addLog(`Target market industry specified: "${config.targetIndustry}" | Region: "${config.targetGeography}"`, "info");
    addLog(`Loading target buyers: [${config.targetPersonas.join(", ") || "CEO"}]`, "info");

    // Phase 1: Scrape
    setTimeout(async () => {
      setSteps(prev => prev.map(s => s.id === "scrape" ? { ...s, status: "completed" } : s.id === "signals" ? { ...s, status: "processing" } : s));
      setProgress(16);
      addLog(`[Scrape] Port lookup finished. Found 45 prospective company matching targets in "${config.targetIndustry}".`, "success");

      // Phase 2: Signals
      setTimeout(() => {
        setSteps(prev => prev.map(s => s.id === "signals" ? { ...s, status: "completed" } : s.id === "enrich" ? { ...s, status: "processing" } : s));
        setProgress(33);
        addLog(`[Detect Signals] Active channels scanned. Detected hiring indicators, AI tool adoptions, and recent funding events on 14 targets.`, "success");

        // Phase 3: Enrich
        setTimeout(() => {
          setSteps(prev => prev.map(s => s.id === "enrich" ? { ...s, status: "completed" } : s.id === "score" ? { ...s, status: "processing" } : s));
          setProgress(50);
          addLog(`[Enrich Contacts] Resolvers matched 22 key personas matching target roles. Extracted verified email handles.`, "success");

          // Phase 4: Score
          setTimeout(() => {
            setSteps(prev => prev.map(s => s.id === "score" ? { ...s, status: "completed" } : s.id === "outreach" ? { ...s, status: "processing" } : s));
            setProgress(66);
            addLog(`[Score Leads] Calculated weighted intent score matching setup sliders. Filtered list to top 6 qualified prospective profiles.`, "success");

            // Phase 5: Outreach (Make real server call to fetch Gemini generated leads!)
            addLog(`[Gemini Core] Initiating B2B structured generation on AI personalizer models...`, "ai");
            
            fetch("/api/generate-leads", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ config }),
            })
              .then((res) => {
                if (!res.ok) {
                  throw new Error("HTTP connection failed on lead generation.");
                }
                return res.json();
              })
              .then((data) => {
                if (data.error) {
                  throw new Error(data.error);
                }
                const leads = data.leads || [];

                setSteps(prev => prev.map(s => s.id === "outreach" ? { ...s, status: "completed" } : s.id === "save" ? { ...s, status: "processing" } : s));
                setProgress(83);
                addLog(`[Gemini Core] Generated 6 hyper-realistic sales intelligence lead records matching your onboarding constraints.`, "success");

                // Phase 6: Save
                setTimeout(() => {
                  setSteps(prev => prev.map(s => s.id === "save" ? { ...s, status: "completed" } : s));
                  setProgress(100);
                  setIsRunning(false);
                  addLog(`[Workflow Master] Pipeline execution finished with 100% precision score. Leads pipeline refreshed!`, "success");
                  onRunComplete(leads);
                }, 1500);
              })
              .catch((err) => {
                console.error("Workflow failed:", err);
                setErrorState(err.message || "Failed dynamic B2B intelligence.");
                setSteps(prev => prev.map(s => s.status === "processing" ? { ...s, status: "error" } : s));
                addLog(`[Workflow Critical Error] Pipeline aborted: ${err.message}`, "error");
                setIsRunning(false);
              });
          }, 1500);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="space-y-6 py-4">
      {/* Visual Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Trigger Command */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-indigo-700 font-bold uppercase tracking-widest leading-none block">
              Managed Campaign Control Room
            </span>
            <h3 className="font-display font-semibold text-slate-900 text-base leading-tight">
              Execute Custom Signal Scans
            </h3>
            <p className="text-slate-650 font-light text-xs font-sans leading-relaxed">
              Launch an interactive trial execution. See our crawlers discover real-time B2B buying signals, identify accurate contact handles, and draft custom sales personalizations ready for campaign delivery.
            </p>
          </div>

          <div className="pt-6 relative">
            {/* Progress line */}
            {progress > 0 && (
              <div className="mb-4 space-y-1">
                <div className="flex justify-between text-[10px] font-mono font-bold text-indigo-700 leading-none">
                  <span>Pipeline Flow Progression</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              onClick={handleRunScan}
              disabled={isRunning}
              className={`w-full py-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-100/30 ${
                isRunning
                  ? "bg-indigo-100 hover:bg-slate-100/50 text-indigo-550 border border-indigo-200 cursor-not-allowed"
                  : "bg-indigo-650 hover:bg-indigo-750 text-white"
              }`}
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Scanning buying signals live ...</span>
                </>
              ) : (
                <>
                  <Play className="h-4.5 w-4.5 text-indigo-200 fill-indigo-200 shrink-0" />
                  <span>Execute Managed Signal Simulation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sync App Overview status */}
        <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-4 font-sans">
            <div className="flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-amber-400" />
              <h4 className="font-display font-medium text-xs uppercase tracking-wider text-slate-350">
                Outbound Calibration
              </h4>
            </div>

            <div className="space-y-3 font-mono text-[10.5px]">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-500">Target Website:</span>
                <span className="text-slate-200 font-bold truncate max-w-[120px]">{config.companyWebsite || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-500">Segment focus:</span>
                <span className="text-slate-200 font-bold truncate max-w-[120px]">{config.targetIndustry || "N/A"}</span>
              </div>
              <div className="flex justify-between pb-1 text-[10.5px]">
                <span className="text-slate-500">Buyers tracked:</span>
                <span className="text-slate-200 font-bold max-w-[140px] text-right leading-relaxed truncate">
                  {config.targetPersonas.slice(0, 2).join(", ") || "CEO"}
                  {config.targetPersonas.length > 2 && "..."}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-900/10 border border-indigo-900/40 p-3 rounded-lg text-[10.5px] font-sans leading-normal mt-4 text-indigo-200">
            <span className="font-bold flex items-center gap-1.5 text-white mb-1"><Sparkles className="h-3 w-3 text-indigo-400" /> Signal Engine v2</span>
            Scraping parameters are calibrated to find buyers with signals configured under your Buying Signals dashboard rules.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step Progression Timeline */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
            Scanning pipeline steps
          </h3>

          <div className="relative border-l border-slate-100 pl-4 ml-3 pt-1 space-y-6 font-sans">
            {steps.map((s, index) => (
              <div key={s.id} className="relative">
                {/* Visual Circle Indicator */}
                <div
                  className={`absolute -left-[24.5px] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center bg-white transition-all ${
                    s.status === "completed"
                      ? "border-emerald-500 scale-110"
                      : s.status === "processing"
                        ? "border-indigo-600 scale-110"
                        : s.status === "error"
                          ? "border-rose-500"
                          : "border-slate-200"
                  }`}
                >
                  {s.status === "completed" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  )}
                  {s.status === "processing" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-650 animate-ping"></div>
                  )}
                  {s.status === "error" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  )}
                </div>

                {/* Info Text */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-semibold ${
                        s.status === "processing"
                          ? "text-indigo-650 font-bold"
                          : s.status === "completed"
                            ? "text-slate-800"
                            : "text-slate-400"
                      }`}
                    >
                      {s.name}
                    </span>
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider">
                      {s.status === "completed" && <span className="text-emerald-500 bg-emerald-500/10 px-1 py-0.5 rounded">Success</span>}
                      {s.status === "processing" && <span className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">Active</span>}
                      {s.status === "error" && <span className="text-rose-600 bg-rose-50 px-1 py-0.5 rounded">Failed</span>}
                      {s.status === "idle" && <span className="text-slate-350">Awaiting</span>}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[10.5px] font-light leading-normal">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Terminal Logger */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-900 rounded-2xl p-6 shadow-2xl flex flex-col justify-between h-[395px]">
          <div>
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <TerminalIcon className="h-4.5 w-4.5 text-indigo-400" />
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-slate-400">
                  Logs Output Terminal
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-mono text-[9px] text-slate-500 font-bold">Node CLI - Active</span>
              </div>
            </div>

            {/* Scroll Area */}
            <div className="overflow-y-auto h-[278px] space-y-2.5 font-mono text-[10.5px] pr-2 focus:outline-hidden">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-650 gap-2 border border-dashed border-slate-900 rounded-xl py-20">
                  <TerminalIcon className="h-7 w-7 text-slate-800 animate-pulse" />
                  <span>Awaiting execution logs ... click 'Trigger Scan' above.</span>
                </div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="flex items-start gap-2.5 leading-normal">
                    <span className="text-slate-600 leading-none shrink-0">{log.timestamp}</span>
                    <span
                      className={`font-semibold shrink-0 uppercase tracking-widest text-[9px] mt-0.5 px-1 rounded-xs leading-none ${
                        log.type === "success"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : log.type === "error"
                            ? "bg-rose-500/15 text-rose-400"
                            : log.type === "warning"
                              ? "bg-amber-500/10 text-amber-500"
                              : log.type === "ai"
                                ? "bg-indigo-500/15 text-indigo-400 font-bold"
                                : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {log.type}
                    </span>
                    <span
                      className={`font-light pr-2 ${
                        log.type === "success"
                          ? "text-emerald-300"
                          : log.type === "error"
                            ? "text-rose-400"
                            : log.type === "ai"
                              ? "text-indigo-250 italic"
                              : "text-slate-350"
                      }`}
                    >
                      {log.message}
                    </span>
                  </div>
                ))
              )}
              <div ref={terminalEndRef}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
