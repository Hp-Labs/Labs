import type { PipelineItem, LabSpecification } from "./vulnPipelineStore";

export function generateSmartLabSpec(item: PipelineItem): LabSpecification {
  // In a full environment, this would call an LLM with the item details
  // and a strict prompt to output JSON. Here we create a structured template
  // based on the item's known data.
  return {
    vulnerability: item.rawTitle,
    vulnerabilityClass: item.cwe.length > 0 ? item.cwe[0] : "Unknown CWE",
    affectedTechnology: item.affectedProducts?.join(", ") || "General Web Application",
    applicationType: item.domain || "web",
    difficulty: item.severity || "medium",
    learningObjective: `Understand and exploit ${item.rawTitle} to gain unauthorized access or exfiltrate data.`,
    intendedChallenge: "Identify the vulnerable input, bypass basic filters, and execute the payload.",
    requiredApplicationFunctionality: "An input vector (e.g., search field, file upload, or API endpoint) vulnerable to the specified class.",
    syntheticDataRequirements: "Dummy user accounts, mock sensitive database records (e.g., credit cards or PII) to demonstrate impact.",
    flagRequirement: "The flag should be placed in `/flag.txt` or within the database, accessible only after successful exploitation.",
    hintStructure: "Hint 1: Directional. Hint 2: Technical flow. Hint 3: Specific payload vector.",
    validationRequirements: "MUST be verified in an isolated Docker network. MUST NOT expose host system.",
    references: item.cve.map((c: any) => `https://nvd.nist.gov/vuln/detail/${c}`)
  };
}
