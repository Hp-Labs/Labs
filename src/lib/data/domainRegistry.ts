// ============================================================
// HP Labs — Domain Registry
// Configuration-driven source of truth for all active and
// future pentesting domains. The Smart Detector reads this
// at runtime — never hardcodes domain names.
// ============================================================

import type { DomainId, Severity } from "@/lib/data/types";

export interface SourceAdapterConfig {
  adapterId: string;
  displayName: string;
  type: "static" | "rss" | "api";
  /** URL or identifier used by the live adapter (backend use) */
  sourceUrl?: string;
  /** Authoritative reference URL for humans */
  referenceUrl: string;
  enabled: boolean;
}

export interface DomainConfig {
  domainId: DomainId;
  displayName: string;
  parentModule: "red-team" | "blue-team" | "forensics" | "grc" | "threat-intel" | "cloud";
  /** Whether this domain is publicly live in HP Labs */
  enabled: boolean;
  /** Whether the Smart Detector should actively monitor this domain */
  monitoringEnabled: boolean;
  /** Source adapters providing vulnerability data for this domain */
  sourceAdapters: SourceAdapterConfig[];
  supportedVulnerabilityTypes: string[];
  severityMapping: Partial<Record<Severity, string>>;
  labCreationEnabled: boolean;
  notificationEnabled: boolean;
}

// ─── ACTIVE DOMAINS (currently launched) ─────────────────────

const ACTIVE_DOMAINS: DomainConfig[] = [
  {
    domainId: "web",
    displayName: "Web Pentesting",
    parentModule: "red-team",
    enabled: true,
    monitoringEnabled: true,
    labCreationEnabled: true,
    notificationEnabled: true,
    supportedVulnerabilityTypes: [
      "injection", "xss", "authentication", "authorization", "csrf",
      "ssrf", "deserialization", "misconfiguration", "crypto", "information-disclosure",
      "rce", "lfi", "rfi", "xxe", "ssti", "request-smuggling", "cache-poisoning",
    ],
    severityMapping: {
      information: "CVSS 0.0 — Passive recon, fingerprinting",
      low: "CVSS 0.1–3.9 — Low-impact disclosure",
      medium: "CVSS 4.0–6.9 — Significant but limited impact",
      high: "CVSS 7.0–8.9 — Significant impact, partial system control",
      critical: "CVSS 9.0–10.0 — Full system compromise",
    },
    sourceAdapters: [
      {
        adapterId: "portswigger-web",
        displayName: "PortSwigger Web Security Academy",
        type: "static",
        referenceUrl: "https://portswigger.net/web-security/all-topics",
        enabled: true,
      },
      {
        adapterId: "owasp-top10-2021",
        displayName: "OWASP Top 10 2021",
        type: "static",
        referenceUrl: "https://owasp.org/www-project-top-ten/",
        enabled: true,
      },
      {
        adapterId: "nvd-web",
        displayName: "NVD CVE Database (Web)",
        type: "api",
        sourceUrl: "https://services.nvd.nist.gov/rest/json/cves/2.0",
        referenceUrl: "https://nvd.nist.gov/",
        enabled: true,
      },
    ],
  },

  {
    domainId: "api",
    displayName: "API Pentesting",
    parentModule: "red-team",
    enabled: true,
    monitoringEnabled: true,
    labCreationEnabled: true,
    notificationEnabled: true,
    supportedVulnerabilityTypes: [
      "bola", "bfla", "mass-assignment", "authentication", "rate-limiting",
      "graphql", "grpc", "soap", "rest", "oauth", "jwt", "ssrf",
      "injection", "deserialization", "information-disclosure",
    ],
    severityMapping: {
      information: "CVSS 0.0 — API fingerprinting, schema recon",
      low: "CVSS 0.1–3.9",
      medium: "CVSS 4.0–6.9",
      high: "CVSS 7.0–8.9",
      critical: "CVSS 9.0–10.0",
    },
    sourceAdapters: [
      {
        adapterId: "owasp-api-2023",
        displayName: "OWASP API Security Top 10 2023",
        type: "static",
        referenceUrl: "https://owasp.org/API-Security/editions/2023/en/0x00-header/",
        enabled: true,
      },
      {
        adapterId: "portswigger-api",
        displayName: "PortSwigger API Testing",
        type: "static",
        referenceUrl: "https://portswigger.net/web-security/api-testing",
        enabled: true,
      },
      {
        adapterId: "nvd-api",
        displayName: "NVD CVE Database (API)",
        type: "api",
        sourceUrl: "https://services.nvd.nist.gov/rest/json/cves/2.0",
        referenceUrl: "https://nvd.nist.gov/",
        enabled: true,
      },
    ],
  },

  {
    domainId: "mobile",
    displayName: "Mobile Pentesting",
    parentModule: "red-team",
    enabled: true,
    monitoringEnabled: true,
    labCreationEnabled: true,
    notificationEnabled: true,
    supportedVulnerabilityTypes: [
      "insecure-storage", "authentication", "network", "cryptography",
      "privacy", "code-quality", "resilience", "webview", "ipc",
      "deep-link", "intent", "backup", "permissions", "clipboard",
    ],
    severityMapping: {
      information: "CVSS 0.0 — Passive mobile recon",
      low: "CVSS 0.1–3.9",
      medium: "CVSS 4.0–6.9",
      high: "CVSS 7.0–8.9",
      critical: "CVSS 9.0–10.0",
    },
    sourceAdapters: [
      {
        adapterId: "owasp-masvs-v2",
        displayName: "OWASP MASVS v2 / MAS Testing Guide",
        type: "static",
        referenceUrl: "https://mas.owasp.org/MASVS/",
        enabled: true,
      },
      {
        adapterId: "android-advisories",
        displayName: "Android Security Bulletins",
        type: "rss",
        sourceUrl: "https://source.android.com/docs/security/bulletin",
        referenceUrl: "https://source.android.com/docs/security/bulletin",
        enabled: true,
      },
      {
        adapterId: "apple-advisories",
        displayName: "Apple Security Releases",
        type: "rss",
        sourceUrl: "https://support.apple.com/en-us/111900",
        referenceUrl: "https://support.apple.com/en-us/111900",
        enabled: true,
      },
      {
        adapterId: "nvd-mobile",
        displayName: "NVD CVE Database (Mobile)",
        type: "api",
        sourceUrl: "https://services.nvd.nist.gov/rest/json/cves/2.0",
        referenceUrl: "https://nvd.nist.gov/",
        enabled: true,
      },
    ],
  },

  {
    domainId: "network",
    displayName: "Network Pentesting",
    parentModule: "red-team",
    enabled: true,
    monitoringEnabled: true,
    labCreationEnabled: true,
    notificationEnabled: true,
    supportedVulnerabilityTypes: [
      "snmp", "smb", "rdp", "dns", "ssh", "ftp", "smtp", "ldap",
      "vpn", "firewall", "router", "switch", "tls", "ipsec",
      "protocol-weakness", "credential-attack", "relay", "mitm",
    ],
    severityMapping: {
      information: "CVSS 0.0 — Passive network recon",
      low: "CVSS 0.1–3.9",
      medium: "CVSS 4.0–6.9",
      high: "CVSS 7.0–8.9",
      critical: "CVSS 9.0–10.0",
    },
    sourceAdapters: [
      {
        adapterId: "cisa-kev",
        displayName: "CISA Known Exploited Vulnerabilities",
        type: "api",
        sourceUrl: "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json",
        referenceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
        enabled: true,
      },
      {
        adapterId: "nvd-network",
        displayName: "NVD CVE Database (Network)",
        type: "api",
        sourceUrl: "https://services.nvd.nist.gov/rest/json/cves/2.0",
        referenceUrl: "https://nvd.nist.gov/",
        enabled: true,
      },
      {
        adapterId: "cisco-advisories",
        displayName: "Cisco Security Advisories",
        type: "rss",
        sourceUrl: "https://tools.cisco.com/security/center/rss.x?label=cisco_sa",
        referenceUrl: "https://tools.cisco.com/security/center/publicationListing.x",
        enabled: true,
      },
    ],
  },
];

// ─── FUTURE DOMAINS (not yet launched — DO NOT ENABLE) ────────

const FUTURE_DOMAINS: DomainConfig[] = [
  {
    domainId: "active-directory",
    displayName: "Active Directory Pentesting",
    parentModule: "red-team",
    enabled: false,
    monitoringEnabled: false,
    labCreationEnabled: false,
    notificationEnabled: false,
    supportedVulnerabilityTypes: ["kerberos", "ldap", "ntlm", "smb", "gpo", "acl", "trusts"],
    severityMapping: {},
    sourceAdapters: [
      { adapterId: "ad-msrc", displayName: "Microsoft Security Response Center", type: "rss", referenceUrl: "https://msrc.microsoft.com/", enabled: false },
    ],
  },
  {
    domainId: "cloud",
    displayName: "Cloud Pentesting",
    parentModule: "red-team",
    enabled: false,
    monitoringEnabled: false,
    labCreationEnabled: false,
    notificationEnabled: false,
    supportedVulnerabilityTypes: ["aws", "gcp", "azure", "iam", "s3", "ssrf", "misconfig"],
    severityMapping: {},
    sourceAdapters: [
      { adapterId: "cloud-nvd", displayName: "NVD (Cloud)", type: "api", referenceUrl: "https://nvd.nist.gov/", enabled: false },
    ],
  },
  {
    domainId: "wireless",
    displayName: "Wireless Security",
    parentModule: "red-team",
    enabled: false,
    monitoringEnabled: false,
    labCreationEnabled: false,
    notificationEnabled: false,
    supportedVulnerabilityTypes: ["wpa", "wep", "evil-twin", "deauth", "pmkid"],
    severityMapping: {},
    sourceAdapters: [],
  },
  {
    domainId: "iot",
    displayName: "IoT Security",
    parentModule: "red-team",
    enabled: false,
    monitoringEnabled: false,
    labCreationEnabled: false,
    notificationEnabled: false,
    supportedVulnerabilityTypes: ["firmware", "mqtt", "zigbee", "z-wave", "ble", "uart"],
    severityMapping: {},
    sourceAdapters: [],
  },
  {
    domainId: "ot-ics",
    displayName: "OT/ICS/SCADA Security",
    parentModule: "red-team",
    enabled: false,
    monitoringEnabled: false,
    labCreationEnabled: false,
    notificationEnabled: false,
    supportedVulnerabilityTypes: ["modbus", "dnp3", "profinet", "scada", "plc"],
    severityMapping: {},
    sourceAdapters: [],
  },
  {
    domainId: "kubernetes",
    displayName: "Kubernetes Security",
    parentModule: "red-team",
    enabled: false,
    monitoringEnabled: false,
    labCreationEnabled: false,
    notificationEnabled: false,
    supportedVulnerabilityTypes: ["rbac", "pod-escape", "etcd", "secrets", "network-policy"],
    severityMapping: {},
    sourceAdapters: [],
  },
  {
    domainId: "container",
    displayName: "Container Security",
    parentModule: "red-team",
    enabled: false,
    monitoringEnabled: false,
    labCreationEnabled: false,
    notificationEnabled: false,
    supportedVulnerabilityTypes: ["escape", "privesc", "image-vulns", "registry", "runtime"],
    severityMapping: {},
    sourceAdapters: [],
  },
];

// ─── Unified registry ─────────────────────────────────────────

export const DOMAIN_REGISTRY: DomainConfig[] = [
  ...ACTIVE_DOMAINS,
  ...FUTURE_DOMAINS,
];

/** Returns only domains that are currently live and being monitored */
export function getActiveDomains(): DomainConfig[] {
  return DOMAIN_REGISTRY.filter(d => d.enabled && d.monitoringEnabled);
}

/** Returns the config for a specific domain ID */
export function getDomainConfig(domainId: DomainId): DomainConfig | undefined {
  return DOMAIN_REGISTRY.find(d => d.domainId === domainId);
}

/** Returns all enabled source adapters for a domain */
export function getEnabledAdapters(domainId: DomainId): SourceAdapterConfig[] {
  const domain = getDomainConfig(domainId);
  if (!domain) return [];
  return domain.sourceAdapters.filter(a => a.enabled);
}
