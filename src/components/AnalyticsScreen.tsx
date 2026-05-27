import React from "react";
import { Lead } from "../types";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  TrendingUp,
  Target,
  Users,
  Activity,
  Zap,
  Globe,
  DollarSign,
  Briefcase
} from "lucide-react";

interface AnalyticsScreenProps {
  leads: Lead[];
}

export default function AnalyticsScreen({ leads }: AnalyticsScreenProps) {
  // Mock Metric Calculations
  const totalScans = 1240;
  const qualifiedLeads = leads.length + 84; // mock historic accumulation
  const averageICP = 91; // average % math match
  const meetingsBooked = 32;

  // Chart 1: Daily Scans Activity Trend (Area)
  const activityData = [
    { day: "May 20", scans: 140, leads: 8 },
    { day: "May 21", scans: 170, leads: 12 },
    { day: "May 22", scans: 165, leads: 10 },
    { day: "May 23", scans: 210, leads: 15 },
    { day: "May 24", scans: 190, leads: 14 },
    { day: "May 25", scans: 240, leads: 19 },
    { day: "May 26", scans: 125, leads: 10 },
  ];

  // Chart 2: Signal Categories Frequency (Bar counts)
  const signalFrequency = [
    { name: "Hiring SDRs", count: 24, fill: "#4f46e5" },
    { name: "Recent Funding", count: 18, fill: "#0ea5e9" },
    { name: "AI Adoption", count: 32, fill: "#3b82f6" },
    { name: "Leadership Hiring", count: 15, fill: "#6366f1" },
    { name: "Tech Stack", count: 21, fill: "#8b5cf6" },
    { name: "Competitor Churn", count: 14, fill: "#ef4444" },
  ];

  // Chart 3: Outreach Pipeline Funnel Distribution (Pie)
  const funnelData = [
    { name: "Emails Sent", value: 320, color: "#818cf8" },
    { name: "Replies Caught", value: 92, color: "#38bdf8" },
    { name: "Meetings Booked", value: 32, color: "#34d399" },
  ];

  return (
    <div className="space-y-6 py-4 font-sans">
      {/* KPI Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block leading-none">
              Daily Scans Run
            </span>
            <span className="text-2xl font-mono font-bold text-slate-800 leading-none">
              {totalScans}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold font-sans">
              <TrendingUp className="h-3 w-3" />
              <span>+14.2% from yesterday</span>
            </div>
          </div>
          <div className="w-11 h-11 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center shrink-0">
            <Activity className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block leading-none">
              Signals Discovered
            </span>
            <span className="text-2xl font-mono font-bold text-slate-800 leading-none">
              {qualifiedLeads}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold font-sans">
              <TrendingUp className="h-3 w-3" />
              <span>+24 accounts flagged</span>
            </div>
          </div>
          <div className="w-11 h-11 bg-sky-50 text-sky-700 rounded-xl flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block leading-none">
              ICP Scoring Average
            </span>
            <span className="text-2xl font-mono font-bold text-slate-800 leading-none">
              {averageICP}%
            </span>
            <div className="flex items-center gap-1 text-[10px] text-slate-505 font-medium font-sans">
              <span>Excellent alignment standard</span>
            </div>
          </div>
          <div className="w-11 h-11 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center shrink-0">
            <Target className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block leading-none">
              Pipeline Created Value
            </span>
            <span className="text-2xl font-mono font-bold text-indigo-700 leading-none">
              $144,200
            </span>
            <div className="flex items-center gap-1 text-[10px] text-indigo-650 font-bold font-sans">
              <span>{meetingsBooked} deals qualified</span>
            </div>
          </div>
          <div className="w-11 h-11 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Area Chart (8 columns) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h4 className="font-display font-semibold text-slate-850 text-sm leading-tight mb-1">Daily Scanning Activites</h4>
            <p className="text-slate-500 font-light text-xs">Tracking hourly pipeline leads scraped versus trigger thresholds.</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="scansGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 9, fontFamily: "monospace" }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 9, fontFamily: "monospace" }} stroke="#cbd5e1" />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: "1px solid #e2e8f0" }} />
                <Area type="monotone" dataKey="scans" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#scansGradient)" name="Total Scans" />
                <Area type="monotone" dataKey="leads" stroke="#0ea5e9" strokeWidth={1.5} fill="none" name="Qualified Leads" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel Distribution Chart (4 columns) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-display font-semibold text-slate-850 text-sm leading-tight mb-1">Outbound Conversion rate</h4>
            <p className="text-slate-500 font-light text-xs mb-4">Emails sent vs total replies.</p>
          </div>

          <div className="h-44 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={funnelData} innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 10 }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center score */}
            <div className="absolute text-center">
              <span className="font-mono text-xl font-bold text-slate-800">28.7%</span>
              <span className="text-[9px] text-slate-400 block leading-none">Response</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-slate-50">
            {funnelData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-600 font-light">
                  <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: d.color }}></span>
                  <span>{d.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-850">{d.value} accounts</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Signal Distribution (Full width) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="mb-6">
          <h4 className="font-display font-semibold text-slate-850 text-sm leading-tight mb-1">Buying Trigger Distribution Frequency</h4>
          <p className="text-slate-500 font-light text-xs">Tracking which triggers catch the highest number of ICP accounts.</p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={signalFrequency} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#cbd5e1" />
              <YAxis tick={{ fontSize: 9, fontFamily: "monospace" }} stroke="#cbd5e1" />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: "1px solid #e2e8f0" }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Caught events count">
                {signalFrequency.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
