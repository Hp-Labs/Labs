// ============================================================
// HP Labs — Source Adapter Base Class
// All adapters extend this. Provides normalization, canonical
// ID generation, and shared deduplication utilities.
// ============================================================

import type {
  SourceAdapter,
  AdapterResult,
  DetectorVulnerability,
} from "@/lib/detector/detectorTypes";
import type { DomainId } from "@/lib/data/types";

export abstract class BaseAdapter implements SourceAdapter {
  abstract readonly adapterId: string;
  abstract readonly domainId: DomainId;

  abstract run(): Promise<AdapterResult>;

  /** Normalize a vulnerability name for deduplication comparison */
  protected normalizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  /** Generate a stable canonical ID for a vulnerability */
  protected canonicalId(domainId: DomainId, adapterId: string, localId: string): string {
    return `${domainId}::${adapterId}::${localId}`;
  }

  /** Build a successful adapter result */
  protected success(vulnerabilities: DetectorVulnerability[]): AdapterResult {
    return {
      adapterId: this.adapterId,
      domainId: this.domainId,
      success: true,
      vulnerabilities,
      fetchedAt: new Date().toISOString(),
      recordsTotal: vulnerabilities.length,
    };
  }

  /** Build a failed adapter result */
  protected failure(error: string): AdapterResult {
    return {
      adapterId: this.adapterId,
      domainId: this.domainId,
      success: false,
      vulnerabilities: [],
      error,
      fetchedAt: new Date().toISOString(),
      recordsTotal: 0,
    };
  }
}
