import React from "react";
import { Terminal, ArrowRight, Activity, ShieldCheck } from "lucide-react";

interface NavbarProps {
  onLaunchConsole: () => void;
  onScrollTo: (elementId: string) => void;
}

export default function Navbar({ onLaunchConsole, onScrollTo }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onScrollTo("hero")}>
          <div className="bg-linear-to-tr from-sky-500 via-indigo-600 to-violet-600 p-2 rounded-xl text-white shadow-md shadow-indigo-100">
            <Terminal className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold tracking-tight text-slate-800 text-lg leading-tight">
              RevEngineer
            </span>
            <span className="font-mono text-[9px] font-semibold text-indigo-600 uppercase tracking-widest leading-none">
              Signal OS
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => onScrollTo("features")}
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            Our Service model
          </button>
          <button
            onClick={() => onScrollTo("demo")}
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            Pilot Simulator
          </button>
          <button
            onClick={() => onScrollTo("testimonials")}
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            Client Reviews
          </button>
        </div>

        {/* Launch Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLaunchConsole}
            className="group relative inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xl hover:bg-slate-850 transition-all duration-300 transform hover:-translate-y-0.5 pointer-events-auto"
          >
            <span className="relative">Client Dashboard</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </nav>
  );
}
