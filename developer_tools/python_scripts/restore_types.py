path = "src/lib/data/types.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

lab_freshness_type = """
export type ReproductionStatus = "verified" | "failed" | "untested";
export type CompatibilityStatus = "compatible" | "needs-update" | "broken";

export interface LabFreshness {
  sourceVulnerability: string;
  labVersion: string;
  targetVersion: string;
  lastValidationDate: string;
  reproductionStatus: ReproductionStatus;
  compatibilityStatus: CompatibilityStatus;
  needsReview: boolean;
}
"""

if "LabFreshness" not in c:
    c = c.replace("export interface Lab {", lab_freshness_type + "\nexport interface Lab {")
    c = c.replace("status: LabStatus;", "status: LabStatus;\n  freshness?: LabFreshness;")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

path2 = "src/lib/data/vulnerabilities.ts"
with open(path2, "r", encoding="utf-8") as f:
    c2 = f.read()

if "targetRequiredForHpVuln?: boolean;" not in c2:
    c2 = c2.replace("export interface Vulnerability {", "export interface Vulnerability {\n  targetRequiredForHpVuln?: boolean;\n  hpVulnIntegrationId?: string;")
    with open(path2, "w", encoding="utf-8") as f:
        f.write(c2)

print("Restored lost types.")
