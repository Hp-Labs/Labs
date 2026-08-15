// ============================================================
// HP Labs — Smart Detector Type System
// All types used by the Smart Detector engine and adapters
// ============================================================

import type { Severity, DomainId } from "@/lib/data/types";

/** A vulnerability record as produced by a source adapter */
export interface DetectorVulnerability {
  /** Globally unique canonical ID — stable across runs */
  canonicalId: string;
  /** Human-readable vulnerability name */
  name: string;
  /** Normalized short name for deduplication */
  normalizedName: string;
  /** Domain this vulnerability belongs to */
  domainId: DomainId;
  /** Severity tier */
  severity: Severity;
  /** Source adapter that produced this record */
  sourceAdapterId: string;
  /** Source-specific identifier (CVE, CWE, OWASP ID, etc.) */
  sourceIdentifiers: string[];
  /** CWE identifiers */
  cwe: string[];
  /** CVE identifiers if known */
  cve: string[];
  /** CVSS score if known */
  cvssScore?: number;
  /** Brief description */
  description: string;
  /** Whether this is feasible as an active HP Labs lab */
  labFeasible: boolean;
  /** Year first discovered/published */
  firstDiscoveredYear?: number;
  /** Provenance references */
  references: string[];
  /** When this record was produced */
  detectedAt: string;
}

/** Result produced by a single adapter run */
export interface AdapterResult {
  adapterId: string;
  domainId: DomainId;
  success: boolean;
  vulnerabilities: DetectorVulnerability[];
  error?: string;
  fetchedAt: string;
  recordsTotal: number;
}

/** Classification of how an existing lab maps to a detected vulnerability */
export type DuplicateReason =
  | "exact-id-match"
  | "same-cve"
  | "same-cwe-normalized-name"
  | "name-normalized-match";

/** Deduplication result for a single vulnerability */
export interface DeduplicationResult {
  vulnerability: DetectorVulnerability;
  isDuplicate: boolean;
  duplicateReason?: DuplicateReason;
  existingLabId?: string;
}

/** Action taken by the detector for a single vulnerability */
export type DetectorAction =
  | "duplicate-skipped"
  | "lab-created"
  | "coming-soon-created"
  | "review-required"
  | "rejected-not-feasible";

export interface DetectorActionRecord {
  vulnerability: DetectorVulnerability;
  action: DetectorAction;
  reason: string;
  timestamp: string;
}

/** Full audit report produced by one detector run */
export interface DetectorReport {
  runId: string;
  startedAt: string;
  completedAt: string;
  domainsScanned: DomainId[];
  adapterResults: AdapterResult[];
  deduplicationResults: DeduplicationResult[];
  actionRecords: DetectorActionRecord[];
  summary: {
    totalAdapters: number;
    successfulAdapters: number;
    failedAdapters: number;
    totalVulnerabilitiesFetched: number;
    totalValidated: number;
    totalRejected: number;
    duplicatesSkipped: number;
    newLabsCreated: number;
    comingSoonCreated: number;
    reviewRequired: number;
  };
}

/** Interface every source adapter must implement */
export interface SourceAdapter {
  readonly adapterId: string;
  readonly domainId: DomainId;
  /** Run the adapter and return discovered vulnerabilities */
  run(): Promise<AdapterResult>;
}
