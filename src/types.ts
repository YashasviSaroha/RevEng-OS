export enum ActiveView {
  LANDING = "LANDING",
  SETUP = "SETUP",
  SIGNALS = "SIGNALS",
  TOOLS = "TOOLS",
  RUN = "RUN",
  LEADS = "LEADS",
  ANALYTICS = "ANALYTICS",
}

export interface WorkspaceConfig {
  companyWebsite: string;
  companyDescription: string;
  targetIndustry: string;
  targetGeography: string;
  companySizeRange: string;
  targetPersonas: string[]; // e.g. "CEO / Founder", "CRO / VP Sales", "CMO / VP Marketing", "Head of RevOps"
  fundingStages: string[];  // e.g. "Seed", "Series A"
}

export interface BuyingSignal {
  id: string;
  name: string;
  icon: string;
  description: string;
  isEnabled: boolean;
  priority: "High" | "Medium" | "Low";
  score: number;
}

export interface Integration {
  id: string;
  name: string;
  logo: string;
  description: string;
  isConnected: boolean;
  statusText: string;
  apiKeyLabel?: string;
}

export interface Lead {
  id: string;
  company: string;
  domain: string;
  logoUrl?: string;
  contactName: string;
  contactEmail: string;
  contactTitle: string;
  signalDetected: string;
  signalDate: string;
  intentScore: number;
  fundingStage: string;
  location: string;
  employeeCount: number;
  revenue?: string;
  aiSummary?: string;
  outreachStatus: "Ready" | "Generating" | "Email Sent" | "LinkedIn Connected" | "Skipped";
  customPersonalizedEmail?: string;
  customLinkedInOpener?: string;
  customFollowUp?: string;
  customSummary?: string;
}

export interface LiveLog {
  timestamp: string;
  type: "info" | "success" | "warning" | "error" | "ai";
  message: string;
}

export interface AnalyticsMetric {
  scansRun: number;
  leadsFound: number;
  qualifiedPercent: number;
  conversionPercent: number;
  pipelineAddedValue: number;
}

export interface WorkflowStep {
  id: string;
  name: string;
  status: "idle" | "processing" | "completed" | "error";
  description: string;
}
