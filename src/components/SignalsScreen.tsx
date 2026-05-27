import React from "react";
import { BuyingSignal } from "../types";
import {
  Activity,
  UserPlus,
  Rocket,
  Wrench,
  Globe,
  Database,
  TrendingUp,
  Sliders,
  Sparkles
} from "lucide-react";

interface SignalsScreenProps {
  signals: BuyingSignal[];
  onToggleSignal: (id: string) => void;
  onUpdatePriority: (id: string, priority: "High" | "Medium" | "Low") => void;
  onUpdateScore: (id: string, score: number) => void;
}

export default function SignalsScreen({
  signals,
  onToggleSignal,
  onUpdatePriority,
  onUpdateScore,
}: SignalsScreenProps) {
  return (
    <div className="space-y-6 py-4">
      {/* Overview stats block */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-800">
            <Activity className="h-5 w-5 text-indigo-650" />
            <span className="font-display font-bold text-base">Signal Monitor Calibrations</span>
          </div>
          <p className="text-slate-600 font-light text-xs font-sans max-w-xl">
            Configure the specific buying triggers our managed crawlers scan for. Adjust priority weights to direct our SDR and personalizer team which events mandate instant outreach.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl min-w-24">
            <span className="text-[10px] font-mono text-slate-450 block uppercase leading-none mb-1">Active Triggers</span>
            <span className="font-mono text-xl font-bold text-slate-800">
              {signals.filter((s) => s.isEnabled).length}
            </span>
          </div>
          <div className="text-center bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl min-w-24">
            <span className="text-[10px] font-mono text-slate-450 block uppercase leading-none mb-1">Max Trigger Score</span>
            <span className="font-mono text-xl font-bold text-indigo-700">100</span>
          </div>
        </div>
      </div>

      {/* Grid containing signals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {signals.map((sig) => (
          <div
            key={sig.id}
            className={`border rounded-2xl p-5 space-y-4 hover:shadow-lg transition-all duration-300 ${
              sig.isEnabled
                ? "bg-white border-slate-200 shadow-xs"
                : "bg-slate-50/70 border-slate-150 opacity-70"
            }`}
          >
            {/* Header: Icon, Name and Toggle */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                    sig.isEnabled
                      ? "bg-indigo-50 border-indigo-100/80 text-indigo-600"
                      : "bg-slate-200/50 border-slate-250 text-slate-500"
                  }`}
                >
                  <Activity className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-xs text-slate-900 leading-tight">
                    {sig.name}
                  </h4>
                  <span className="text-[9px] font-mono text-slate-400 font-medium">
                    ID: {sig.id}
                  </span>
                </div>
              </div>

              {/* IOS Styled Switch */}
              <button
                onClick={() => onToggleSignal(sig.id)}
                className={`w-10 h-5.5 rounded-full p-0.5 cursor-pointer transition-colors duration-300 relative ${
                  sig.isEnabled ? "bg-indigo-600" : "bg-slate-200"
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs transition-transform transform ${
                    sig.isEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
                ></div>
              </button>
            </div>

            {/* Description */}
            <p className="text-slate-600 font-light text-[11px] leading-relaxed min-h-[36px]">
              {sig.description}
            </p>

            {/* Weights Adjusters only if enabled */}
            {sig.isEnabled ? (
              <div className="border-t border-slate-100 pt-3 space-y-3 font-sans">
                {/* Priority switcher */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium leading-none">Scoring Priority:</span>
                  <div className="bg-slate-50 border border-slate-100 p-0.5 rounded-md flex gap-0.5">
                    {(["High", "Medium", "Low"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => onUpdatePriority(sig.id, p)}
                        className={`px-2 py-1 rounded text-[10px] font-semibold tracking-tight transition-all cursor-pointer ${
                          sig.priority === p
                            ? p === "High"
                              ? "bg-rose-500 text-white"
                              : p === "Medium"
                                ? "bg-amber-500 text-white"
                                : "bg-slate-600 text-white"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Score Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono leading-none">
                    <span className="text-slate-500 font-bold">Intent Weight:</span>
                    <span className="text-indigo-600 font-bold">+{sig.score} Pts</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={sig.score}
                    onChange={(e) => onUpdateScore(sig.id, parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>
            ) : (
              <div className="border-t border-slate-100 pt-3 text-center text-slate-400 text-[10px] font-mono py-1">
                Trigger deactivated
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
