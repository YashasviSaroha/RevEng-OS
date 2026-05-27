import React, { useState } from "react";
import { Integration } from "../types";
import { Key, Check, Plus, AlertCircle, X, ExternalLink, Link2, Sparkles } from "lucide-react";

interface ToolsScreenProps {
  integrations: Integration[];
  onToggleConnect: (id: string, apiKey?: string) => void;
}

export default function ToolsScreen({ integrations, onToggleConnect }: ToolsScreenProps) {
  const [selectedTools, setSelectedTools] = useState<Integration | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [errorText, setErrorText] = useState("");

  const handleOpenModal = (tool: Integration) => {
    setSelectedTools(tool);
    setApiKeyInput("");
    setErrorText("");
  };

  const handleSaveConnection = () => {
    if (selectedTools?.apiKeyLabel && !apiKeyInput.trim()) {
      setErrorText(`Please insert a valid ${selectedTools.apiKeyLabel} credential.`);
      return;
    }
    if (selectedTools) {
      onToggleConnect(selectedTools.id, apiKeyInput);
      setSelectedTools(null);
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* Overview stats block */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-850">
            <Link2 className="h-4.5 w-4.5 text-indigo-650" />
            <span className="font-display font-bold text-base">Client Integration Stack</span>
          </div>
          <p className="text-slate-600 font-light text-xs font-sans max-w-xl">
            Authorize CRMs, email hubs, and communication triggers. Our engineering team uses these endpoints to securely route qualified buying-signal handoffs directly into your CRM sequences.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl min-w-24">
            <span className="text-[10px] font-mono text-slate-450 block uppercase leading-none mb-1">Total Apps connected</span>
            <span className="font-mono text-xl font-bold text-slate-800">
              {integrations.filter((i) => i.isConnected).length} / {integrations.length}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of integrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {integrations.map((app) => (
          <div
            key={app.id}
            className={`bg-white border rounded-2xl p-5 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[190px] relative overflow-hidden ${
              app.isConnected ? "border-indigo-150 shadow-xs" : "border-slate-200/80"
            }`}
          >
            {/* Visual glow indicator for connected apps */}
            {app.isConnected && (
              <div className="absolute top-0 right-0 w-2 h-2 rounded-bl-xl bg-indigo-600 animate-pulse"></div>
            )}

            <div>
              {/* Header section: logo and connection status badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="bg-slate-50 border border-slate-100 w-11 h-11 rounded-xl flex items-center justify-center font-bold text-slate-700 text-sm shadow-sm select-none">
                  {app.logo}
                </div>
                <div className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${app.isConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`}></span>
                  <span className="font-mono text-[9px] text-slate-450 font-bold uppercase tracking-wider">
                    {app.statusText}
                  </span>
                </div>
              </div>

              {/* Company Info */}
              <h4 className="text-xs font-bold text-slate-900 leading-tight mb-1.5">{app.name}</h4>
              <p className="text-slate-500 font-light text-[11.2px] leading-relaxed mb-4">
                {app.description}
              </p>
            </div>

            {/* Connection Actions */}
            <div className="pt-2 border-t border-slate-50 flex items-center justify-between gap-2">
              {app.isConnected ? (
                <>
                  <button
                    onClick={() => onToggleConnect(app.id)}
                    className="text-[10.5px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                  >
                    Disconnect Key
                  </button>
                  <div className="bg-indigo-50/60 text-indigo-700 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold">
                    <Check className="h-3 w-3" />
                    <span>Active API</span>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => handleOpenModal(app)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-transform hover:-translate-y-0.5"
                >
                  <span>Connect {app.name}</span>
                  <Plus className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Prompt Dialog */}
      {selectedTools && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl max-w-md w-full p-6 animate-fade-in relative">
            {/* Close */}
            <button
              onClick={() => setSelectedTools(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Title */}
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-4">
              <div className="bg-indigo-50 text-indigo-700 w-9 h-9 rounded-xl flex items-center justify-center font-bold">
                {selectedTools.logo}
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm text-slate-900 leading-tight">
                  Connect {selectedTools.name}
                </h4>
                <p className="text-[10px] text-slate-450 font-mono">SECURE API CREDENTIAL BIND</p>
              </div>
            </div>

            {/* Explainer */}
            <p className="text-slate-600 font-light text-xs leading-relaxed mb-4">
              Input your keys below safely. Signal OS encrypts credentials client-side and forwards requests securely via a private node proxy.
            </p>

            {/* Input field */}
            <div className="space-y-4">
              {selectedTools.apiKeyLabel && (
                <div>
                  <label className="block text-[10.5px] uppercase font-mono tracking-wider text-slate-450 mb-1.5">
                    {selectedTools.apiKeyLabel}
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      placeholder={`e.g. sk_live_... or cl_${selectedTools.name.toLowerCase()}_api`}
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      className="w-full bg-slate-100/50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-xs text-slate-800 placeholder-slate-400 font-mono focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              )}

              {errorText && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-rose-700 text-[11px] leading-tight flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorText}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setSelectedTools(null)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveConnection}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Authorize & Connect</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
