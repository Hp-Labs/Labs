// ============================================================
// HpLabs  Vulnerability Deduplication Engine
// Pure functions  no side effects, no file I/O
//
// Checks a candidate vulnerability against ALL existing lab
// sources to prevent duplicate vulnerability classes from
// being created, especially from CVE instances.
// ============================================================

import type { Lab, DomainId, Severity } from "@/lib/data/types";
import { ALL_LABS } from "@/lib/data/redteam";
import { HISTORICAL_VULNERABILITY_CATALOG } from "@/lib/data/historicalVulnerabilities";

export interface DedupResult {
  isDuplicate: boolean;
  /** Reason code, present only when isDuplicate === true */
  reason?: "duplicate_id" | "duplicate_cve" | "duplicate_cve_pipeline";
  /** Human-readable explanation */
  explanation?: string;
  /** The lab ID that triggered the duplicate match */
  matchedLabId?: string;
  /** CVE(s) that collided */
  matchedCves?: string[];
}

export interface DedupWarning {
  type: "cwe_domain_saturation";
  message: string;
}

export interface DedupCheckResult {
  isDuplicate: boolean;
  reason?: DedupResult["reason"];
  explanation?: string;
  matchedLabId?: string;
  matchedCves?: string[];
  warnings: DedupWarning[];
}

/**
 * Check a candidate against all known lab sources.
 *
 * @param candidateId     Proposed lab/pipeline ID
 * @param cves            CVEs associated with the candidate (may be empty)
 * @param cwe             CWEs of the candidate
 * @param domain          Proposed domain
 * @param severity        Proposed severity
 * @param publishedLabs   Pipeline-published labs (passed in to avoid circular import)
 * @param pipelineCves    CVEs already tracked in the active pipeline (to prevent same CVE entering twice)
 */
export function checkDuplicate(
  candidateId: string,
  cves: string[],
  cwe: string[],
  domain: DomainId | undefined,
  severity: Severity | undefined,
  publishedLabs: Lab[],
  pipelineCves: string[],
): DedupCheckResult {
  const allStaticLabs = [...ALL_LABS, ...HISTORICAL_VULNERABILITY_CATALOG, ...publishedLabs];
  const warnings: DedupWarning[] = [];

  //  1. Exact ID collision 
  if (allStaticLabs.some((l) => l.id === candidateId)) {
    return {
      isDuplicate: true,
      reason: "duplicate_id",
      explanation: `A lab with ID "${candidateId}" already exists in the static catalog.`,
      matchedLabId: candidateId,
      warnings,
    };
  }

  //  2. CVE already in static/historical/published labs 
  if (cves.length > 0) {
    for (const lab of allStaticLabs) {
      const labCves = [...(lab.cve ?? []), ...(lab.cveExamples ?? [])];
      const collision = cves.filter((c) => labCves.includes(c));
      if (collision.length > 0) {
        return {
          isDuplicate: true,
          reason: "duplicate_cve",
          explanation: `CVE(s) ${collision.join(", ")} already covered by existing lab "${lab.id}" (${lab.name}).`,
          matchedLabId: lab.id,
          matchedCves: collision,
          warnings,
        };
      }
    }
  }

  //  3. CVE already in the active pipeline (not yet published) 
  if (cves.length > 0) {
    const pipelineCollision = cves.filter((c) => pipelineCves.includes(c));
    if (pipelineCollision.length > 0) {
      return {
        isDuplicate: true,
        reason: "duplicate_cve_pipeline",
        explanation: `CVE(s) ${pipelineCollision.join(", ")} are already tracked in an active pipeline item.`,
        matchedCves: pipelineCollision,
        warnings,
      };
    }
  }

  //  4. CWE+Domain saturation warning (soft, non-blocking) 
  if (cwe.length > 0 && domain) {
    const sameClass = allStaticLabs.filter((l) => {
      const labCwes = l.cwe ?? [];
      return l.domain === domain && labCwes.some((c) => cwe.includes(c));
    });
    if (sameClass.length >= 3) {
      warnings.push({
        type: "cwe_domain_saturation",
        message: `${sameClass.length} existing labs already cover ${cwe.join("/")} in domain "${domain}". Consider whether a new lab adds distinct learning value.`,
      });
    }
  }

  return { isDuplicate: false, warnings };
}

/**
 * Collect all CVEs currently tracked in the non-published pipeline.
 * Called by the pipeline store to pass into checkDuplicate.
 */
export function collectActivePipelineCves(
  pipelineItems: Array<{ cve: string[]; stage: string }>,
): string[] {
  return pipelineItems
    .filter((i) => i.stage !== "Published")
    .flatMap((i) => i.cve);
}
