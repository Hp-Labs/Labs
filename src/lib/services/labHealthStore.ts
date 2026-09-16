import fs from "fs";
import path from "path";
import crypto from "crypto";

const STORE_FILE = path.join(process.cwd(), "data", "lab_health.json");

//  Types 
export type HealthStatus = "healthy" | "degraded" | "failing" | "unknown";
export type CheckType =
  | "provisioning"
  | "target_availability"
  | "required_services"
  | "db_connectivity"
  | "flag_validation"
  | "session_state"
  | "reset_functionality";
export type RecoveryStatus = "not_attempted" | "success" | "failed";
export type IncidentStatus = "open" | "recovering" | "resolved" | "grouped";

export interface HealthCheckResult {
  checkId: string;
  labId: string;
  checkType: CheckType;
  status: HealthStatus;
  message: string;          // internal only  never returned to users
  checkedAt: string;        // ISO
  recoveryStatus: RecoveryStatus;
  recoveryNote?: string;
}

export interface LabIncident {
  incidentId: string;       // INC-XXXXXXXX
  labId: string;
  labName: string;
  checkType: CheckType;
  status: IncidentStatus;
  failureMessage: string;   // internal only
  firstOccurredAt: string;
  lastOccurredAt: string;
  occurrenceCount: number;
  recoveryAttempts: number;
  resolvedAt?: string;
  groupedWith?: string[];
  notifiedAt?: string;
}

interface HealthStore {
  checks: HealthCheckResult[];
  incidents: LabIncident[];
}

//  Persistence 
let store: HealthStore | null = null;

function loadStore(): HealthStore {
  if (store) return store;
  try {
    if (fs.existsSync(STORE_FILE)) {
      store = JSON.parse(fs.readFileSync(STORE_FILE, "utf-8"));
      return store!;
    }
  } catch (e) {
    console.error("[LabHealthStore] Load error:", e);
  }
  store = { checks: [], incidents: [] };
  return store;
}

function saveStore(): void {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2));
  } catch (e) {
    console.error("[LabHealthStore] Save error:", e);
  }
}

function newIncidentId(): string {
  return "INC-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}

//  Exports 
export function recordHealthCheck(result: HealthCheckResult): void {
  const s = loadStore();
  s.checks.unshift(result);
  // Keep last 500 checks
  if (s.checks.length > 500) s.checks = s.checks.slice(0, 500);
  saveStore();
}

export function createIncident(
  data: Omit<LabIncident, "incidentId" | "firstOccurredAt" | "lastOccurredAt" | "occurrenceCount" | "recoveryAttempts">
): LabIncident {
  const s = loadStore();
  const now = new Date().toISOString();
  const incident: LabIncident = {
    ...data,
    incidentId: newIncidentId(),
    firstOccurredAt: now,
    lastOccurredAt: now,
    occurrenceCount: 1,
    recoveryAttempts: 0,
  };
  s.incidents.push(incident);
  saveStore();
  return incident;
}

export function groupOrIncrementIncident(
  labId: string,
  checkType: CheckType,
  failureMessage: string
): LabIncident {
  const s = loadStore();
  const existing = s.incidents.find(
    i => i.labId === labId && i.checkType === checkType &&
         (i.status === "open" || i.status === "recovering")
  );
  if (existing) {
    existing.occurrenceCount += 1;
    existing.lastOccurredAt = new Date().toISOString();
    saveStore();
    return existing;
  }
  // Create new
  return createIncident({
    labId,
    labName: "",   // caller should fill
    checkType,
    status: "open",
    failureMessage,
  });
}

export function markIncidentRecovering(incidentId: string): void {
  const s = loadStore();
  const inc = s.incidents.find(i => i.incidentId === incidentId);
  if (inc) {
    inc.status = "recovering";
    inc.recoveryAttempts += 1;
    saveStore();
  }
}

export function markIncidentResolved(incidentId: string): void {
  const s = loadStore();
  const inc = s.incidents.find(i => i.incidentId === incidentId);
  if (inc) {
    inc.status = "resolved";
    inc.resolvedAt = new Date().toISOString();
    saveStore();
  }
}

export function markIncidentNotified(incidentId: string): void {
  const s = loadStore();
  const inc = s.incidents.find(i => i.incidentId === incidentId);
  if (inc) {
    inc.notifiedAt = new Date().toISOString();
    saveStore();
  }
}

export function getOpenIncidents(): LabIncident[] {
  const s = loadStore();
  return s.incidents.filter(i => i.status === "open" || i.status === "recovering");
}

export function getRecentChecks(labId?: string, limit = 50): HealthCheckResult[] {
  const s = loadStore();
  const filtered = labId ? s.checks.filter(c => c.labId === labId) : s.checks;
  return filtered.slice(0, limit);
}

export function getAllIncidents(): LabIncident[] {
  const s = loadStore();
  return [...s.incidents].sort(
    (a, b) => new Date(b.lastOccurredAt).getTime() - new Date(a.lastOccurredAt).getTime()
  );
}
