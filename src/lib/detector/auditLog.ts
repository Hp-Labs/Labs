// ============================================================
// HP Labs — Detector Audit Log
// Internal audit log structure for admin/developer use only.
// NEVER expose this data to normal users.
// ============================================================

export interface AuditLogEntry {
  runId: string;
  timestamp: string;
  domain: string;
  source: string;
  lastCheck: string;
  lastSuccessfulSync: string | null;
  recordsFetched: number;
  recordsValidated: number;
  recordsRejected: number;
  duplicatesSkipped: number;
  newVulnerabilities: number;
  newLabs: number;
  comingSoon: number;
  errors: string[];
}

/** In-memory audit log (replace with persistent DB in production) */
const auditLog: AuditLogEntry[] = [];

export function appendAuditEntry(entry: AuditLogEntry): void {
  auditLog.unshift(entry); // newest first
  // Keep last 100 entries in memory
  if (auditLog.length > 100) auditLog.splice(100);
}

export function getAuditLog(): AuditLogEntry[] {
  return [...auditLog];
}

export function clearAuditLog(): void {
  auditLog.splice(0);
}
