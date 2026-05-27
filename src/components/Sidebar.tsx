import React from "react";
import { ActiveView } from "../types";
import {
  HelpCircle,
  Settings as SettingsIcon,
  Sparkles,
  Target,
  Activity,
  Workflow,
  Users,
  BarChart3,
  Sliders,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Terminal
} from "lucide-react";

interface SidebarProps {
  currentView: ActiveView;
  onChangeView: (view: ActiveView) => void;
  onExitConsole: () => void;
}

export default function Sidebar({ currentView, onChangeView, onExitConsole }: SidebarProps) {
  const menuItems = [
    { view: ActiveView.SETUP, label: "Campaign Intake Brief", icon: Sliders, badge: "Briefing" },
    { view: ActiveView.SIGNALS, label: "Signal Filter Weights", icon: Activity, badge: "9 Tuned" },
    { view: ActiveView.TOOLS, label: "Client Integrations", icon: Workflow, badge: "API" },
    { view: ActiveView.RUN, label: "Simulation Pilot", icon: Sparkles, badge: "Trial Scan", alert: true },
    { view: ActiveView.LEADS, label: "Verified Lead Pipeline", icon: Users, count: 6 },
    { view: ActiveView.ANALYTICS, label: "Outbound Ledger", icon: BarChart3 },
  ];

  return (
    <aside className="w-68 bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 shrink-0">
      <div>
        {/* Brand Banner */}
        <div className="p-6 border-b border-slate-150/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-linear-to-tr from-sky-500 via-indigo-600 to-violet-600 p-2 rounded-xl text-white shadow-md shadow-indigo-100">
              <Terminal className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold tracking-tight text-slate-900 text-sm leading-tight">
                RevEngineer
              </span>
              <span className="font-mono text-[8px] font-semibold text-indigo-600 uppercase tracking-widest leading-none">
                Signal OS
              </span>
            </div>
          </div>
          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-xs animate-pulse" title="System online"></div>
        </div>

        {/* Console Workspace Tracker */}
        <div className="px-4 pt-5 pb-2">
          <div className="bg-slate-50 border border-slate-100/80 p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 bg-indigo-100/50 text-indigo-700 font-bold flex items-center justify-center rounded-lg text-xs leading-none shrink-0">
                W
              </div>
              <div className="overflow-hidden">
                <h4 className="text-[11px] font-semibold text-slate-800 leading-tight truncate">
                  Outbound-Alpha
                </h4>
                <span className="text-[9px] font-mono text-slate-450 leading-none block">
                  Workspace sandbox
                </span>
              </div>
            </div>
            <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
          </div>
        </div>

        {/* Sidebar Tabs */}
        <nav className="p-3 space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block px-3 py-2">
            Workspace Panels
          </span>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = currentView === item.view;

            return (
              <button
                key={item.view}
                onClick={() => onChangeView(item.view)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold font-sans transition-all text-left group cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-md shadow-slate-950/10"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 shrink-0 transition-transform ${isSelected ? "text-indigo-400" : "text-slate-450 group-hover:scale-105"}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.alert && !isSelected && (
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                )}

                {item.badge && !isSelected && (
                  <span className="text-[9px] font-mono text-slate-400 bg-slate-100/80 px-1.5 py-0.5 rounded font-normal">
                    {item.badge}
                  </span>
                )}

                {item.count !== undefined && !isSelected && (
                  <span className="text-[9px] font-mono font-bold text-white bg-indigo-650 px-1.5 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Support and Back exit */}
      <div className="p-4 border-t border-slate-150/80 space-y-2">
        <div className="rounded-xl bg-indigo-50/40 border border-indigo-100/40 p-3 text-[11px] text-slate-600 leading-normal flex items-start gap-2">
          <HelpCircle className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-800">Support Terminal</span>
            <p className="font-light text-[10px] text-slate-500 mt-0.5">Need customized signal scrapers? Email SDR help desk.</p>
          </div>
        </div>

        <button
          onClick={onExitConsole}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
        >
          <LogOut className="h-4 w-4 shrink-0 text-rose-500" />
          <span>Exit to Landing Page</span>
        </button>
      </div>
    </aside>
  );
}
