import React, { useState } from "react";
import { ActiveView } from "../types";
import { useFirebase } from "../context/FirebaseContext";
import {
  Bell,
  Search,
  Globe,
  Database,
  CloudLightning,
  RefreshCw,
  Sparkles,
  HelpCircle,
  TrendingUp,
  LogIn,
  LogOut
} from "lucide-react";

interface HeaderProps {
  currentView: ActiveView;
  leadCount: number;
}

export default function Header({ currentView, leadCount }: HeaderProps) {
  const { user, loading, signInWithGoogle, logout } = useFirebase();
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Gemini personalizations are ready for Stripe B2B Leads.", time: "2 min ago" },
    { id: 2, text: "Vercel flagged with 'AI Adoption' trigger.", time: "1 hour ago" },
  ]);
  const [showNotifyDrop, setShowNotifyDrop] = useState(false);


  const getBreadcrumb = () => {
    switch (currentView) {
      case ActiveView.SETUP:
        return "Setup Profile / ICP Model Builder";
      case ActiveView.SIGNALS:
        return "Buying Signals / Trigger Event Activator";
      case ActiveView.TOOLS:
        return "Tools / API Third Party Integrations";
      case ActiveView.RUN:
        return "Run Workflow / Real-Time B2B Scanner";
      case ActiveView.LEADS:
        return "Leads Dashboard / Dynamic Signal Pipeline";
      case ActiveView.ANALYTICS:
        return "Analytics OS / Conversion Metrics";
      default:
        return "Workspace Home";
    }
  };

  return (
    <header className="bg-white border-b border-slate-200/80 h-16 px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">
      {/* Search Input / Breadcrumbs */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] font-semibold">
          <span>Signal-OS</span>
          <span>/</span>
          <span className="text-slate-800 font-sans text-xs font-bold bg-slate-100/75 px-2.5 py-1 rounded-lg">
            {getBreadcrumb()}
          </span>
        </div>
      </div>

      {/* Sync stats indicators */}
      <div className="flex items-center gap-4">
        {/* API connection indicator */}
        <div className="hidden lg:flex items-center gap-1.5 bg-indigo-50/50 border border-indigo-100/50 px-3 py-1.5 rounded-xl">
          <Globe className="h-3.5 w-3.5 text-indigo-500" />
          <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-widest">
            Gemini Core Connected
          </span>
        </div>

        {/* Lead state count widget */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl font-mono text-[10px]">
          <Database className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-slate-500">Pipeline:</span>
          <span className="font-bold text-slate-800">{leadCount} qualified B2B profiles</span>
        </div>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifyDrop(!showNotifyDrop)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl relative transition-colors cursor-pointer"
          >
            <Bell className="h-4.5 w-4.5" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-650 rounded-full animate-pulse border-2 border-white"></span>
            )}
          </button>

          {showNotifyDrop && (
            <div className="absolute right-0 top-11 w-80 bg-white border border-slate-200/80 shadow-2xl rounded-2xl p-4 z-50 animate-fade-in text-xs font-sans">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <span className="font-bold text-slate-800">Workspace Alerts</span>
                <span className="text-[10px] text-indigo-600 font-semibold cursor-pointer" onClick={() => setNotifications([])}>
                  Clear all
                </span>
              </div>
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <p className="text-slate-400 text-center py-4 text-[11px]">No prospective alerts detected.</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="border-b border-slate-50 last:border-none pb-2 last:-pb-0">
                      <p className="text-slate-700 leading-normal font-light">{n.text}</p>
                      <span className="text-[9px] text-slate-400 font-mono block mt-1">{n.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User avatar wrapper */}
        {loading ? (
          <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center ml-4">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-500" />
          </div>
        ) : user ? (
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <button 
              onClick={logout}
              title="Click to sign out"
              className="flex items-center gap-2.5 cursor-pointer focus:outline-none hover:opacity-90 active:scale-98 transition-all group"
            >
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || "User"} 
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full border border-indigo-200 group-hover:border-indigo-400 transition-colors"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 border border-indigo-200 flex items-center justify-center font-bold text-white text-xs">
                  {user.displayName ? user.displayName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : 'U'}
                </div>
              )}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                  {user.displayName || "Active User"}
                </span>
                <span className="text-[9px] font-mono text-indigo-600 font-semibold uppercase tracking-wider leading-none">
                  Cloud Synced
                </span>
              </div>
              <LogOut className="h-3.5 w-3.5 text-slate-400 group-hover:text-red-500 transition-colors ml-0.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
            <button
              onClick={signInWithGoogle}
              className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold font-sans text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-indigo-100/50"
            >
              <LogIn className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
              <span>Sync To Cloud</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
