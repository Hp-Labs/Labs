// ============================================================
// HpLabs — Core Type System
// All data types used across the platform
// ============================================================

export type Severity = "information" | "low" | "medium" | "high" | "critical";

export type DomainId =
  | "web"
  | "api"
  | "network"
  | "cloud"
  | "mobile"
  | "active-directory"
  | "wireless"
  | "iot"
  | "ot-ics"
  | "kubernetes"
  | "container";

export type LabStatus = "active" | "new" | "upcoming";

export interface MethodologyStep {
  step: number;
  title: string;
  description: string;
  command?: string;
  hint?: string;
  note?: string;
}

export interface Lab {
  id: string;            // e.g. "web-low-001"
  level: number;         // sequential within severity+domain
  severity: Severity;
  domain: DomainId;

  // Identity
  name: string;
  shortName: string;

  // Theory
  description: string;
  history: string;
  firstDiscoveredYear: number;

  // Technical Metadata
  cvssScore?: number;
  cvssVector?: string;
  cwe: string[];              // e.g. ["CWE-79"]
  cveExamples?: string[];     // legacy field — use cve going forward
  cve?: string[];             // e.g. ["CVE-2022-1234"]
  owaspMapping: string[];     // e.g. ["A03:2021 - Injection"]
  mitreMapping: string[];     // e.g. ["T1190 - Exploit Public-Facing Application"]
  osiLayer: string[];         // e.g. ["Application Layer (L7)"]

  // Impact
  impact: string;
  realWorldExample: string;
  financialImpact?: string;

  // Lab Guide
  methodology: MethodologyStep[];
  recommendedTools: string[];
  recommendedPayloads?: string[];
  prevention?: string;
  solution?: string;
  references?: string[];

// Lab Meta
xpReward: number;
timeLimitMinutes: number;
tags: string[];
addedDate?: string;   // Optional for legacy labs
labType?: string;     // e.g. "vulnerability", "boss", "assessment"
status: LabStatus;
}

// Severity unlock requirements
export interface UnlockRequirement {
  previousSeverity: Severity | null;
  minLabsCompleted: number;
  minXP: number;
  assessmentRequired: boolean;
  assessmentName?: string;
}

export const SEVERITY_UNLOCK_REQUIREMENTS: Record<Severity, UnlockRequirement> = {
  information: {
    previousSeverity: null,
    minLabsCompleted: 0,
    minXP: 0,
    assessmentRequired: false,
  },
  low: {
    previousSeverity: "information",
    minLabsCompleted: 1,
    minXP: 500,
    assessmentRequired: false,
  },
  medium: {
    previousSeverity: "low",
    minLabsCompleted: 2,
    minXP: 2000,
    assessmentRequired: true,
    assessmentName: "Basic Web Pentesting Assessment",
  },
  high: {
    previousSeverity: "medium",
    minLabsCompleted: 2,
    minXP: 5000,
    assessmentRequired: true,
    assessmentName: "Intermediate Web Assessment",
  },
  critical: {
    previousSeverity: "high",
    minLabsCompleted: 2,
    minXP: 10000,
    assessmentRequired: true,
    assessmentName: "Advanced Web Assessment",
  },
};

// Severity display config
export const SEVERITY_CONFIG: Record<
  Severity,
  { label: string; color: string; bg: string; border: string; glow: string; cvssRange: string }
> = {
  information: {
    label: "Information",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
    glow: "rgba(96,165,250,0.15)",
    cvssRange: "0.0",
  },
  low: {
    label: "Low",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/30",
    glow: "rgba(74,222,128,0.15)",
    cvssRange: "0.1–3.9",
  },
  medium: {
    label: "Medium",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/30",
    glow: "rgba(250,204,21,0.15)",
    cvssRange: "4.0–6.9",
  },
  high: {
    label: "High",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/30",
    glow: "rgba(251,146,60,0.15)",
    cvssRange: "7.0–8.9",
  },
  critical: {
    label: "Critical",
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/30",
    glow: "rgba(248,113,113,0.2)",
    cvssRange: "9.0–10.0",
  },
};

// Red Team module structure
export interface SubDomain {
  id: DomainId;
  name: string;
  icon: string;
  description: string;
  status: "available" | "coming_soon";
  labCounts: Partial<Record<Severity, number>>;
}

export interface RedTeamModule {
  id: string;
  name: string;
  icon: string;
  description: string;
  status: "available" | "coming_soon";
  subDomains?: SubDomain[];
}

// Unique flag generation (client-side simulation — wire to backend in production)
export function generateUniqueFlag(
  userId: string,
  labId: string,
  sessionSalt: string
): string {
  // Simple hash simulation — replace with crypto HMAC in backend
  const raw = `${userId}::${labId}::${sessionSalt}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  const prefix = labId.replace(/-/g, "_").toUpperCase();
  return `FLAG{${prefix}_${hex}}`;
}

// XP to Rank mapping
export const XP_TO_RANK = [
  { rank: "Script Kiddie", minXP: 0,     icon: "💻", color: "text-[var(--hp-text-muted)]" },
  { rank: "Apprentice",    minXP: 500,   icon: "🔍", color: "text-violet-400" },
  { rank: "Hacker",        minXP: 2000,  icon: "🎯", color: "text-[var(--hp-primary)]" },
  { rank: "Elite Hacker",  minXP: 5000,  icon: "⚡", color: "text-fuchsia-400" },
  { rank: "Red Teamer",    minXP: 10000, icon: "🔴", color: "text-orange-400" },
  { rank: "Legend",        minXP: 25000, icon: "💀", color: "text-red-400" },
];


export function getRank(xp: number) {
  return XP_TO_RANK.reduce((acc, r) => (xp >= r.minXP ? r : acc), XP_TO_RANK[0]);
}

export function getNextRank(xp: number) {
  const current = getRank(xp);
  const idx = XP_TO_RANK.indexOf(current);
  return XP_TO_RANK[idx + 1] || current;
}
