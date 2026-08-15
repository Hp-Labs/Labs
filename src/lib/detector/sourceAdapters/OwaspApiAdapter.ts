// ============================================================
// HP Labs — OWASP API Security Adapter
// Authoritative API vulnerability list from
// OWASP API Security Top 10 2023 + PortSwigger API Testing.
// ============================================================

import { BaseAdapter } from "@/lib/detector/sourceAdapters/BaseAdapter";
import type { AdapterResult, DetectorVulnerability } from "@/lib/detector/detectorTypes";

const SOURCE_REF = "https://owasp.org/API-Security/editions/2023/en/0x00-header/";

const OWASP_API_VULNS: Omit<DetectorVulnerability, "canonicalId" | "normalizedName" | "sourceAdapterId" | "domainId" | "detectedAt">[] = [
  // ── Information ──────────────────────────────────────────────
  { name: "API Discovery & Endpoint Enumeration", severity: "information", sourceIdentifiers: ["owasp-api-discovery"], cwe: ["CWE-200"], cve: [], cvssScore: 0.0, description: "Enumerating undocumented API endpoints.", labFeasible: true, firstDiscoveredYear: 2014, references: [SOURCE_REF] },
  { name: "GraphQL Introspection Enabled", severity: "information", sourceIdentifiers: ["owasp-api-graphql-introspection"], cwe: ["CWE-200"], cve: [], cvssScore: 0.0, description: "GraphQL introspection reveals full schema.", labFeasible: true, firstDiscoveredYear: 2015, references: [SOURCE_REF] },
  { name: "OpenAPI / Swagger Spec Exposed", severity: "information", sourceIdentifiers: ["owasp-api-swagger-exposed"], cwe: ["CWE-200"], cve: [], cvssScore: 0.0, description: "Public Swagger spec exposes all API endpoints.", labFeasible: true, firstDiscoveredYear: 2011, references: [SOURCE_REF] },
  { name: "API Version Enumeration (Legacy Endpoints)", severity: "information", sourceIdentifiers: ["owasp-api9-assets-mgmt"], cwe: ["CWE-16"], cve: [], cvssScore: 0.0, description: "Legacy API versions active without security controls.", labFeasible: true, firstDiscoveredYear: 2014, references: [SOURCE_REF] },
  { name: "CORS Preflight Policy Inspection", severity: "information", sourceIdentifiers: ["owasp-api-cors-preflight"], cwe: ["CWE-942"], cve: [], cvssScore: 0.0, description: "CORS policies permitting arbitrary origins.", labFeasible: true, firstDiscoveredYear: 2014, references: [SOURCE_REF] },
  // ── Low ──────────────────────────────────────────────────────
  { name: "Broken Object Level Authorization (BOLA/IDOR)", severity: "low", sourceIdentifiers: ["owasp-api1-2023"], cwe: ["CWE-639"], cve: [], cvssScore: 3.7, description: "API1:2023 — accessing other users' objects by changing IDs.", labFeasible: true, firstDiscoveredYear: 2010, references: [SOURCE_REF] },
  { name: "Mass Assignment — Privilege Escalation via API", severity: "low", sourceIdentifiers: ["owasp-api6-mass-assign"], cwe: ["CWE-915"], cve: [], cvssScore: 3.8, description: "Binding request body fields to internal model properties.", labFeasible: true, firstDiscoveredYear: 2012, references: [SOURCE_REF] },
  { name: "JWT Algorithm Confusion (None Algorithm)", severity: "low", sourceIdentifiers: ["owasp-api2-jwt-none"], cwe: ["CWE-347"], cve: ["CVE-2015-9235"], cvssScore: 3.8, description: "JWT forged with alg:none bypasses signature verification.", labFeasible: true, firstDiscoveredYear: 2015, references: [SOURCE_REF] },
  { name: "Rate Limiting Header Bypass via X-Forwarded-For", severity: "low", sourceIdentifiers: ["owasp-api4-rate-bypass"], cwe: ["CWE-307"], cve: [], cvssScore: 3.5, description: "X-Forwarded-For rotation bypasses IP-based rate limiter.", labFeasible: true, firstDiscoveredYear: 2016, references: [SOURCE_REF] },
  { name: "API Key Over-Privilege (Unrestricted Scope)", severity: "low", sourceIdentifiers: ["owasp-api2-key-scope"], cwe: ["CWE-269"], cve: [], cvssScore: 3.7, description: "Read-only API keys accepting write/delete operations.", labFeasible: true, firstDiscoveredYear: 2014, references: [SOURCE_REF] },
  { name: "JSON Parameter Pollution (JPP)", severity: "low", sourceIdentifiers: ["owasp-api-jpp"], cwe: ["CWE-235"], cve: [], cvssScore: 3.8, description: "Duplicate JSON keys cause validation bypass.", labFeasible: true, firstDiscoveredYear: 2015, references: [SOURCE_REF] },
  // ── Medium ───────────────────────────────────────────────────
  { name: "Broken Function Level Authorization (BFLA)", severity: "medium", sourceIdentifiers: ["owasp-api5-2023"], cwe: ["CWE-285"], cve: [], cvssScore: 5.4, description: "API5:2023 — regular users invoking admin API functions.", labFeasible: true, firstDiscoveredYear: 2015, references: [SOURCE_REF] },
  { name: "JWT RS256 to HS256 Algorithm Confusion", severity: "medium", sourceIdentifiers: ["owasp-api2-alg-confusion"], cwe: ["CWE-347"], cve: ["CVE-2016-5431"], cvssScore: 6.5, description: "Public key used as HMAC secret for HS256 token forgery.", labFeasible: true, firstDiscoveredYear: 2015, references: [SOURCE_REF] },
  { name: "Server-Side Request Forgery (SSRF) via API", severity: "medium", sourceIdentifiers: ["owasp-api7-2023"], cwe: ["CWE-918"], cve: [], cvssScore: 6.5, description: "API7:2023 — URL parameters coerced to internal service requests.", labFeasible: true, firstDiscoveredYear: 2012, references: [SOURCE_REF] },
  { name: "GraphQL Query Batching Brute Force", severity: "medium", sourceIdentifiers: ["owasp-api4-graphql-batch"], cwe: ["CWE-799"], cve: [], cvssScore: 5.3, description: "Batching bypasses rate limiting for credential brute-force.", labFeasible: true, firstDiscoveredYear: 2017, references: [SOURCE_REF] },
  { name: "Improper Assets Management — Staging API Exposed", severity: "medium", sourceIdentifiers: ["owasp-api9-staging"], cwe: ["CWE-16"], cve: [], cvssScore: 6.1, description: "Non-production API endpoints share production data.", labFeasible: true, firstDiscoveredYear: 2018, references: [SOURCE_REF] },
  { name: "OAuth 2.0 State Parameter Omission (CSRF)", severity: "medium", sourceIdentifiers: ["owasp-api2-oauth-state"], cwe: ["CWE-352"], cve: [], cvssScore: 6.5, description: "OAuth without state parameter enables CSRF account binding.", labFeasible: true, firstDiscoveredYear: 2012, references: [SOURCE_REF] },
  { name: "NoSQL Injection via API Filter Parameters", severity: "medium", sourceIdentifiers: ["owasp-api-nosql-injection"], cwe: ["CWE-943"], cve: [], cvssScore: 6.5, description: "MongoDB query operators injected via JSON API parameters.", labFeasible: true, firstDiscoveredYear: 2012, references: [SOURCE_REF] },
  { name: "LDAP Injection via API Search Parameters", severity: "medium", sourceIdentifiers: ["owasp-api-ldap-injection"], cwe: ["CWE-90"], cve: [], cvssScore: 5.9, description: "LDAP filter injection via user search API parameters.", labFeasible: true, firstDiscoveredYear: 2005, references: [SOURCE_REF] },
  // ── High ─────────────────────────────────────────────────────
  { name: "GraphQL SQL Injection via Nested Queries", severity: "high", sourceIdentifiers: ["owasp-api-graphql-sqli"], cwe: ["CWE-89"], cve: [], cvssScore: 8.6, description: "Filter arguments passed unsanitized to SQL backend.", labFeasible: true, firstDiscoveredYear: 2018, references: [SOURCE_REF] },
  { name: "API Command Injection via Webhook Callbacks", severity: "high", sourceIdentifiers: ["owasp-api-cmd-injection"], cwe: ["CWE-78"], cve: [], cvssScore: 8.8, description: "Shell commands triggered by unsanitized webhook URL parameters.", labFeasible: true, firstDiscoveredYear: 2014, references: [SOURCE_REF] },
  { name: "Insecure JWT kid Parameter (Path Traversal)", severity: "high", sourceIdentifiers: ["owasp-api2-kid-traversal"], cwe: ["CWE-22"], cve: [], cvssScore: 8.1, description: "JWT kid header traversal to known file path for HMAC forgery.", labFeasible: true, firstDiscoveredYear: 2018, references: [SOURCE_REF] },
  { name: "Server-Side Prototype Pollution in Node.js APIs", severity: "high", sourceIdentifiers: ["owasp-api-prototype-pollution"], cwe: ["CWE-1321"], cve: [], cvssScore: 8.6, description: "__proto__ injection overrides Node.js application globals.", labFeasible: true, firstDiscoveredYear: 2018, references: [SOURCE_REF] },
  { name: "REST to Internal Java RMI Deserialization", severity: "high", sourceIdentifiers: ["owasp-api-rmi-deserial"], cwe: ["CWE-502"], cve: ["CVE-2015-4852"], cvssScore: 8.8, description: "Serialized Java objects forwarded to internal RMI registry.", labFeasible: true, firstDiscoveredYear: 2015, references: [SOURCE_REF] },
  { name: "OAuth Authorization Code Interception (PKCE Bypass)", severity: "high", sourceIdentifiers: ["owasp-api-oauth-pkce"], cwe: ["CWE-287"], cve: [], cvssScore: 7.5, description: "PKCE S256 challenge validation absent or bypassable.", labFeasible: true, firstDiscoveredYear: 2017, references: [SOURCE_REF] },
  { name: "GraphQL Circular Query Denial of Service", severity: "high", sourceIdentifiers: ["owasp-api4-graphql-dos"], cwe: ["CWE-400"], cve: [], cvssScore: 7.5, description: "Recursive nested GraphQL queries exhaust server CPU.", labFeasible: true, firstDiscoveredYear: 2018, references: [SOURCE_REF] },
  // ── Critical ─────────────────────────────────────────────────
  { name: "API Authentication Bypass — Admin Object Access", severity: "critical", sourceIdentifiers: ["owasp-api-auth-bypass-admin"], cwe: ["CWE-287"], cve: [], cvssScore: 9.8, description: "Unauthenticated access to all user records via admin API.", labFeasible: true, firstDiscoveredYear: 2018, references: [SOURCE_REF] },
  { name: "Mass Data Exfiltration via Broken Object Authorization", severity: "critical", sourceIdentifiers: ["owasp-api1-mass-exfil"], cwe: ["CWE-639"], cve: [], cvssScore: 9.1, description: "Bulk scraping of all user records via BOLA in list endpoints.", labFeasible: true, firstDiscoveredYear: 2019, references: [SOURCE_REF] },
  { name: "Injection via GraphQL Mutation Arguments (RCE Path)", severity: "critical", sourceIdentifiers: ["owasp-api-graphql-rce"], cwe: ["CWE-94"], cve: [], cvssScore: 9.8, description: "GraphQL mutation arguments evaluated in server-side execution context.", labFeasible: true, firstDiscoveredYear: 2020, references: [SOURCE_REF] },
];

export class OwaspApiAdapter extends BaseAdapter {
  readonly adapterId = "owasp-api-2023";
  readonly domainId = "api" as const;

  async run(): Promise<AdapterResult> {
    try {
      const now = new Date().toISOString();
      const vulns: DetectorVulnerability[] = OWASP_API_VULNS.map((v) => ({
        ...v,
        canonicalId: this.canonicalId(this.domainId, this.adapterId, v.sourceIdentifiers[0]),
        normalizedName: this.normalizeName(v.name),
        sourceAdapterId: this.adapterId,
        domainId: this.domainId,
        detectedAt: now,
      }));
      return this.success(vulns);
    } catch (err) {
      return this.failure(String(err));
    }
  }
}
