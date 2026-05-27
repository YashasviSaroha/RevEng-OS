import React, { useState } from "react";
import {
  Terminal,
  Activity,
  Globe,
  Plus,
  ArrowRight,
  Sparkles,
  Zap,
  Check,
  Search,
  Filter,
  Layers,
  Award,
  Share2,
  Users,
  Target,
  Megaphone,
  Network
} from "lucide-react";

interface LandingHeroProps {
  onLaunchConsole: () => void;
  onScrollTo: (id: string) => void;
}

export default function LandingHero({ onLaunchConsole, onScrollTo }: LandingHeroProps) {
  // Playground state
  const [testDomain, setTestDomain] = useState("stripe.com");
  const [testPersona, setTestPersona] = useState("CRO / VP Sales");
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [mockPersonalization, setMockPersonalization] = useState<any>(null);

  const handleSimulateScan = () => {
    setIsPlaying(true);
    setStep(1);
    setMockPersonalization(null);

    setTimeout(() => {
      setStep(2);
      setTimeout(() => {
        setStep(3);
        setTimeout(() => {
          setStep(4);
          // finalized state
          setMockPersonalization({
            score: 96,
            signal: "Hiring SDRs & AI Expansion",
            summary: "Stripe recently listed 6 senior outbound accounts listings in SF, focusing on AI-empowered commerce integrations.",
            emailSubject: "Scale Stripe's outgoing AI commerce accounts",
            emailBody: `Hi contact,\n\nI noticed Stripe listed 6 outbound roles in SF. Given your focus on AI commerce integrations, RevEngineer Signal OS can assist in pinpointing high-fit cloud merchants exhibiting buy signals right when they explore Stripe replacements.\n\nWorth a brief sync this Friday?\n\nBest,\nSDR Lead`
          });
          setIsPlaying(false);
        }, 1200);
      }, 1000);
    }, 1050);
  };

  return (
    <div className="bg-slate-50 relative pt-24 overflow-hidden">
      {/* Background Decorative Gradients & Radial Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>
      
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-200/50 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute top-[40%] right-10 w-[400px] h-[400px] bg-sky-200/30 rounded-full blur-[100px] -z-10"></div>

      {/* Hero Content Section */}
      <section id="hero" className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-indigo-50/50 border border-indigo-100/80 px-4 py-1.5 rounded-full text-indigo-700 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
          <span>Premium Managed Outbound Service Powered by Proprietary Signal Technology</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-medium tracking-tight text-slate-950 max-w-5xl mx-auto leading-[1.1] mb-6">
          Pre-Heated B2B Pipelines <br />
          <span className="bg-linear-to-r from-indigo-600 via-sky-600 to-violet-600 bg-clip-text text-transparent">
            Fully Managed For You
          </span>
        </h1>

        <p className="text-slate-600 text-base sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-sans font-light">
          We combine proprietary real-time buying signal monitoring with senior outbound specialists. 
          Stop buying cold list databases—let our team build, personalize, and deliver active sales meetings on autopilot.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button
            onClick={onLaunchConsole}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-100/50 transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm"
          >
            Configure Your Campaign Brief
          </button>
          <button
            onClick={() => onScrollTo("demo")}
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl border border-slate-200/80 transition-all cursor-pointer text-sm text-center"
          >
            Demo Campaign Simulator
          </button>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
        <div className="bg-white/80 p-2 sm:p-4 rounded-3xl border border-slate-200/60 shadow-2xl backdrop-blur-xl">
          <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
            {/* Window bar */}
            <div className="bg-slate-950/90 px-4 py-3 flex items-center justify-between border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="text-slate-500 font-mono text-[11px] ml-4">signal-os://demo-scan-playground</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-850 px-2.5 py-1 rounded-md text-slate-400 font-mono text-[10px]">
                <Activity className="h-3 w-3 text-emerald-500 animate-pulse" />
                <span>Simulated live connection</span>
              </div>
            </div>

            {/* Playground layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
              {/* Controls */}
              <div className="lg:col-span-5 p-6 border-r border-slate-800 flex flex-col justify-between bg-slate-950/40">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-4.5 w-4.5 text-amber-400" />
                    <h3 className="font-display text-base font-semibold text-slate-250">Try Our Real-Time Scraper</h3>
                  </div>
                  <p className="text-slate-400 text-xs mb-6 font-sans leading-normal">
                    Insert any target domain and persona below to discover active signals and personalizations in seconds.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1.5">Company Website Domain</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          value={testDomain}
                          disabled={isPlaying}
                          onChange={(e) => setTestDomain(e.target.value)}
                          placeholder="e.g. stripe.com, vercel.com"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-600 transition-colors font-mono disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1.5">Target Buyer Role</label>
                      <select
                        disabled={isPlaying}
                        value={testPersona}
                        onChange={(e) => setTestPersona(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-3 text-xs text-white focus:outline-hidden focus:border-indigo-600 font-sans disabled:opacity-50 cursor-pointer"
                      >
                        <option value="CEO / Founder">CEO / Founder</option>
                        <option value="CRO / VP Sales">CRO / VP Sales</option>
                        <option value="CMO / VP Marketing">CMO / VP Marketing</option>
                        <option value="Head of RevOps">Head of RevOps</option>
                        <option value="CTO">CTO</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-850 mt-6 sm:mt-0">
                  <button
                    onClick={handleSimulateScan}
                    disabled={isPlaying}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-900/10 cursor-pointer"
                  >
                    <span>{isPlaying ? "Scanning Signal Channels..." : "Trigger AI Signal Scan"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Visualization screen */}
              <div className="lg:col-span-7 p-6 bg-slate-900 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Live Scan Visualizer</span>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-550 animate-ping"></span>
                      <span className="font-mono text-[9px] text-slate-400 font-medium">Channel Active</span>
                    </div>
                  </div>

                  {/* Log console flow */}
                  <div className="space-y-3 font-mono text-[11px] leading-relaxed">
                    {step >= 1 && (
                      <div className="flex justify-between text-indigo-400 border-l-2 border-indigo-550 pl-3 py-0.5">
                        <span>● [INIT] Looking up DNS for {testDomain}...</span>
                        <span className="text-slate-500">200 OK</span>
                      </div>
                    )}
                    {step >= 2 && (
                      <div className="flex justify-between text-sky-400 border-l-2 border-sky-400 pl-3 py-0.5">
                        <span>● [SCRAPE] Indexing active job descriptions, G2, BuiltWith logs...</span>
                        <span className="text-emerald-500">COMPLETE</span>
                      </div>
                    )}
                    {step >= 3 && (
                      <div className="flex justify-between text-amber-400 border-l-2 border-amber-400 pl-3 py-0.5">
                        <span>● [SIGNAL] Buying Trigger caught: expansion hiring in enterprise segments</span>
                        <span className="text-slate-350 bg-amber-500/10 px-1 rounded text-[9px] font-bold">HIGH INTENT</span>
                      </div>
                    )}
                    {step >= 4 && (
                      <div className="flex justify-between text-violet-400 border-l-2 border-violet-500 pl-3 py-0.5">
                        <span>● [AI] Drafting hyper-personalized outreach to {testPersona}...</span>
                        <span className="text-slate-500">0.4 sec</span>
                      </div>
                    )}

                    {step === 0 && (
                      <div className="h-40 flex flex-col items-center justify-center text-slate-600 gap-2 border border-dashed border-slate-800 rounded-xl">
                        <Terminal className="h-8 w-8 text-slate-700 animate-bounce" />
                        <span className="text-xs">Awaiting signal simulation...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Finalized result box */}
                {mockPersonalization && (
                  <div className="mt-4 bg-slate-950/70 border border-slate-800 rounded-xl p-4 transition-all duration-500">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-400 font-semibold text-xs">AI Outreach to {testPersona}</span>
                        <span className="bg-emerald-500/15 text-emerald-400 font-bold px-1.5 py-0.5 rounded-sm text-[9px]">
                          Intent Match: {mockPersonalization.score}%
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-400 font-mono">Signal: {mockPersonalization.signal}</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-mono mr-2">Subject:</span>
                        <span className="text-slate-200 font-bold">{mockPersonalization.emailSubject}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-mono block mb-1">Generated Body:</span>
                        <p className="text-slate-300 font-light text-[11px] leading-relaxed bg-slate-900 border border-slate-850 p-2.5 rounded-lg whitespace-pre-line font-mono">
                          {mockPersonalization.emailBody}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Features Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-slate-200/50">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-medium text-slate-900 mb-4 tracking-tight">
            How Our Outbound Service Operates
          </h2>
          <p className="text-slate-650 text-sm sm:text-base font-light font-sans">
            We bypass traditional cold list static brokers by deploying custom real-time buying signals alongside world-class campaign creators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Signal Cards */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-lg transition-transform hover:-translate-y-1">
            <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
              <Network className="h-5 w-5" />
            </div>
            <h4 className="text-base font-semibold text-slate-900 mb-2 font-display">Custom Scraper Deployment</h4>
            <p className="text-slate-600 text-xs leading-relaxed font-light">
              We build custom web monitoring engines tailored to you. We track hiring postings, live tech stack adoptions, competitive swaps, and real-time news alerts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-lg transition-transform hover:-translate-y-1">
            <div className="h-10 w-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 mb-4">
              <Sparkles className="h-5 w-5" />
            </div>
            <h4 className="text-base font-semibold text-slate-900 mb-2 font-display">Bespoke copywriters & AI Personalization</h4>
            <p className="text-slate-600 text-xs leading-relaxed font-light">
              No generic layouts or spam templates. Our writers train fine-tuned custom Gemini pipelines to write engaging, relevant pitches matching exact triggers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-lg transition-transform hover:-translate-y-1">
            <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4">
              <Layers className="h-5 w-5" />
            </div>
            <h4 className="text-base font-semibold text-slate-900 mb-2 font-display">White-Glove Pipeline Sync</h4>
            <p className="text-slate-600 text-xs leading-relaxed font-light">
              We handle domain health, inbox warmups, lead routing, and sync every booking or hot reply directly into your HubSpot/Salesforce stack automatically.
            </p>
          </div>
        </div>
      </section>

      {/* Real Testimonial Grid section */}
      <section id="testimonials" className="max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-slate-200/50">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-display font-medium text-slate-900 mb-4">
            Trusted by Modern Growth Teams
          </h2>
          <p className="text-slate-500 font-light text-slate-600">
            Real sales development executives scaling their personalization workflows limitlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-slate-50 to-white/70 p-6 rounded-2xl border border-slate-100/80 shadow-xs relative">
            <p className="text-slate-700 italic text-xs leading-relaxed mb-6">
              "RevEngineer has fundamentally reshaped our approach to prospecting. Spotting hiring triggers for cold emails has raised our meeting booking rates by 2.4x."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">AS</div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Anton Sorenson</h5>
                <span className="text-[10px] text-slate-500">VP Marketing, Vanta Scale</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-white/70 p-6 rounded-2xl border border-slate-100/80 shadow-xs relative">
            <p className="text-slate-700 italic text-xs leading-relaxed mb-6">
              "We migrated from basic contact lists to buying signals. The precision is unmatched. Now, we only reach out when companies are actively hiring SDRs or adding integrations."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">JM</div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Julia Menendez</h5>
                <span className="text-[10px] text-slate-500">Head of Outbound, Deel Hub</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-white/70 p-6 rounded-2xl border border-slate-100/80 shadow-xs relative">
            <p className="text-slate-700 italic text-xs leading-relaxed mb-6">
              "Personalized emails used to take our reps 20 minutes each. RevEngineer OS combined with Gemini creates hyper-targeted pitches in 1 second based on real signals!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">TR</div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Tyler Rooks</h5>
                <span className="text-[10px] text-slate-500">VP Revenue Ops, Ramp</span>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Landing Footer CTA section */}
      <footer className="bg-slate-950 border-t border-slate-900 py-16 text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="bg-indigo-900/20 border border-indigo-900 p-8 rounded-3xl max-w-4xl mx-auto mb-12">
            <h3 className="text-white text-2xl font-display font-medium mb-3">Ready to RevEngineer Your Pipeline?</h3>
            <p className="text-slate-300 text-xs max-w-xl mx-auto mb-6">
              Connect your domain, configure your target personnel parameters, choose your preferred intent events, and scale.
            </p>
            <button
              onClick={onLaunchConsole}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-950 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 mx-auto transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Get Instant Access</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-900 pt-8 text-xs text-slate-500">
            <span>&copy; {new Date().getFullYear()} RevEngineer Signal OS. All rights reserved.</span>
            <div className="flex items-center gap-6 mt-4 sm:mt-0">
              <span className="hover:text-slate-450 cursor-pointer">Security Protocol</span>
              <span className="hover:text-slate-450 cursor-pointer">API Agreement</span>
              <span className="hover:text-slate-450 cursor-pointer">Privacy Charter</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
