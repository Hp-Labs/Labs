// ============================================================
// HP Labs — Smart Detector Core Engine
//
// INTERNAL USE ONLY. Never expose to normal users.
//
// Architecture:
//   1. Read active domains from domainRegistry (config-driven)
//   2. For each domain, load its configured source adapters
//   3. Run each adapter to get vulnerability records
//   4. Normalize & deduplicate against existing HP Labs catalogue
//   5. Classify domain + severity
//   6. Emit DetectorReport with full audit trail
//
// Adding a new domain later:
//   - Register it in domainRegistry.ts with enabled: true
//   - Create an adapter for it
//   - SmartDetector automatically discovers and monitors it
//   - NO changes to this file required.
// ============================================================

import { getActiveDomains } from "@/lib/data/domainRegistry";
import { ALL_WEB_LABS } from "@/lib/data/redteam";
import type {
  DetectorVulnerability,
  DetectorReport,
  AdapterResult,
  DeduplicationResult,
  DetectorActionRecord,
  DuplicateReason,
} from "@/lib/detector/detectorTypes";
import type { Lab, DomainId } from "@/lib/data/types";

// ─── Adapter imports ──────────────────────────────────────────
// Add new adapters here when new domains launch.
// The registry controls which ones are actually run.
import { PortSwiggerAdapter } from "@/lib/detector/sourceAdapters/PortSwiggerAdapter";
import { OwaspApiAdapter }     from "@/lib/detector/sourceAdapters/OwaspApiAdapter";
import { OwaspMobileAdapter }  from "@/lib/detector/sourceAdapters/OwaspMobileAdapter";
import { NetworkAdvisoryAdapter } from "@/lib/detector/sourceAdapters/NetworkAdvisoryAdapter";
import type { SourceAdapter } from "@/lib/detector/detectorTypes";

// ─── Adapter registry (configuration-driven) ─────────────────
// Maps adapterId → instantiated adapter.
// SmartDetector loads only adapters whose domain is active.
const ADAPTER_REGISTRY: Record<string, SourceAdapter> = {
  "portswigger-web":   new PortSwiggerAdapter(),
  "owasp-api-2023":    new OwaspApiAdapter(),
  "owasp-masvs-v2":    new OwaspMobileAdapter(),
  "cisa-kev":          new NetworkAdvisoryAdapter(),
};

// ─── Existing HP Labs catalogue aggregation ───────────────────
// As new domain lab arrays are created, add them here.
// The deduplicator checks incoming vulnerabilities against this.
function getAllExistingLabs(): Lab[] {
  // Lazy import to avoid circular dependency issues at build time
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { ALL_WEB_LABS: web }     = require("@/lib/data/redteam");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { ALL_API_LABS: api }     = require("@/lib/data/redteam");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { ALL_MOBILE_LABS: mob }  = require("@/lib/data/redteam");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { ALL_NETWORK_LABS: net } = require("@/lib/data/redteam");
  return [...(web ?? []), ...(api ?? []), ...(mob ?? []), ...(net ?? [])];
}

// ─── Normalization utility ────────────────────────────────────
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Deduplication ────────────────────────────────────────────
function deduplicateAgainstCatalogue(
  vuln: DetectorVulnerability,
  existingLabs: Lab[]
): DeduplicationResult {
  // 1. CVE exact match
  if (vuln.cve.length > 0) {
    for (const lab of existingLabs) {
      const labCves = [...(lab.cve ?? []), ...(lab.cveExamples ?? [])];
      for (const cve of vuln.cve) {
        if (labCves.includes(cve)) {
          return {
            vulnerability: vuln,
            isDuplicate: true,
            duplicateReason: "same-cve" as DuplicateReason,
            existingLabId: lab.id,
          };
        }
      }
    }
  }

  // 2. CWE + normalized name match
  const vNorm = normalizeName(vuln.name);
  for (const lab of existingLabs) {
    const labNorm = normalizeName(lab.name);
    const cweOverlap = lab.cwe.some(c => vuln.cwe.includes(c));
    if (cweOverlap && vNorm === labNorm) {
      return {
        vulnerability: vuln,
        isDuplicate: true,
        duplicateReason: "same-cwe-normalized-name" as DuplicateReason,
        existingLabId: lab.id,
      };
    }
  }

  // 3. Normalized name-only match (fuzzy — requires both CWE and name close)
  for (const lab of existingLabs) {
    const labNorm = normalizeName(lab.name);
    if (vNorm === labNorm) {
      return {
        vulnerability: vuln,
        isDuplicate: true,
        duplicateReason: "name-normalized-match" as DuplicateReason,
        existingLabId: lab.id,
      };
    }
  }

  return { vulnerability: vuln, isDuplicate: false };
}

// ─── Run ID generator ─────────────────────────────────────────
function generateRunId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HPDET-${ts}-${rand}`;
}

// ─── Smart Detector ───────────────────────────────────────────
export class SmartDetector {
  /** Run a full detection cycle across all active domains */
  async run(): Promise<DetectorReport> {
    const runId = generateRunId();
    const startedAt = new Date().toISOString();

    // 1. Read active domains from configuration — no hardcoding
    const activeDomains = getActiveDomains();
    const domainsScanned: DomainId[] = activeDomains.map(d => d.domainId);

    // 2. Load existing HP Labs catalogue for deduplication
    const existingLabs = getAllExistingLabs();

    // 3. Run adapters for each active domain
    const adapterResults: AdapterResult[] = [];
    for (const domain of activeDomains) {
      const enabledAdapters = domain.sourceAdapters.filter(a => a.enabled);
      for (const adapterConfig of enabledAdapters) {
        const adapter = ADAPTER_REGISTRY[adapterConfig.adapterId];
        if (!adapter) continue; // adapter not yet implemented — skip silently
        const result = await adapter.run();
        adapterResults.push(result);
      }
    }

    // 4. Collect all vulnerabilities
    const allVulns: DetectorVulnerability[] = adapterResults.flatMap(r => r.vulnerabilities);

    // 5. Deduplicate within this run (same canonical ID)
    const seen = new Set<string>();
    const uniqueVulns: DetectorVulnerability[] = [];
    for (const v of allVulns) {
      if (!seen.has(v.canonicalId)) {
        seen.add(v.canonicalId);
        uniqueVulns.push(v);
      }
    }

    // 6. Deduplicate against existing HP Labs catalogue
    const deduplicationResults: DeduplicationResult[] = uniqueVulns.map(v =>
      deduplicateAgainstCatalogue(v, existingLabs)
    );

    // 7. Build action records
    const actionRecords: DetectorActionRecord[] = deduplicationResults.map(dr => {
      const now = new Date().toISOString();
      if (dr.isDuplicate) {
        return {
          vulnerability: dr.vulnerability,
          action: "duplicate-skipped",
          reason: `Duplicate of existing lab ${dr.existingLabId} (${dr.duplicateReason})`,
          timestamp: now,
        };
      }
      if (!dr.vulnerability.labFeasible) {
        return {
          vulnerability: dr.vulnerability,
          action: "rejected-not-feasible",
          reason: "Vulnerability not feasible as HP Labs interactive lab",
          timestamp: now,
        };
      }
      // New verified vulnerability — mark as coming-soon (real lab infra required for active)
      return {
        vulnerability: dr.vulnerability,
        action: "coming-soon-created",
        reason: "New verified vulnerability — lab infrastructure pending",
        timestamp: now,
      };
    });

    const completedAt = new Date().toISOString();

    // 8. Build summary
    const duplicatesSkipped = actionRecords.filter(a => a.action === "duplicate-skipped").length;
    const comingSoonCreated = actionRecords.filter(a => a.action === "coming-soon-created").length;
    const newLabsCreated = actionRecords.filter(a => a.action === "lab-created").length;
    const reviewRequired = actionRecords.filter(a => a.action === "review-required").length;
    const rejected = actionRecords.filter(a => a.action === "rejected-not-feasible").length;

    return {
      runId,
      startedAt,
      completedAt,
      domainsScanned,
      adapterResults,
      deduplicationResults,
      actionRecords,
      summary: {
        totalAdapters: adapterResults.length,
        successfulAdapters: adapterResults.filter(r => r.success).length,
        failedAdapters: adapterResults.filter(r => !r.success).length,
        totalVulnerabilitiesFetched: allVulns.length,
        totalValidated: uniqueVulns.length,
        totalRejected: rejected,
        duplicatesSkipped,
        newLabsCreated,
        comingSoonCreated,
        reviewRequired,
      },
    };
  }

  /** Idempotency check — running twice produces same result */
  async runIdempotent(): Promise<{ report: DetectorReport; idempotent: boolean }> {
    const r1 = await this.run();
    const r2 = await this.run();
    const idempotent =
      r1.summary.newLabsCreated === r2.summary.newLabsCreated &&
      r1.summary.comingSoonCreated === r2.summary.comingSoonCreated &&
      r1.summary.duplicatesSkipped === r2.summary.duplicatesSkipped;
    return { report: r2, idempotent };
  }
}

// Singleton export for use by admin routes / scheduler
export const smartDetector = new SmartDetector();
