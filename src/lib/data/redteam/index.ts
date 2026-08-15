// ============================================================
// HpLabs — Red Team Module Index
// Central registry for all Red Team sub-modules & domains
// ============================================================

import type { RedTeamModule, SubDomain } from "../types";
import type { Lab, Severity, DomainId } from "../types";

// ─── Web Pentesting ──────────────────────────────────────────
export { WEB_INFORMATION_LABS } from "./pentesting/web/information";
export { WEB_LOW_LABS }         from "./pentesting/web/low";
export { WEB_MEDIUM_LABS }      from "./pentesting/web/medium";
export { WEB_HIGH_LABS }        from "./pentesting/web/high";
export { WEB_CRITICAL_LABS }    from "./pentesting/web/critical";

// ─── Web Pentesting Extended (Burp Suite Catalogue) ──────────
export { WEB_INFORMATION_EXT_LABS } from "./pentesting/web/information_ext";
export { WEB_LOW_EXT_LABS }         from "./pentesting/web/low_ext";
export { WEB_MEDIUM_EXT_LABS }      from "./pentesting/web/medium_ext";
export { WEB_HIGH_EXT_LABS }        from "./pentesting/web/high_ext";

import { WEB_INFORMATION_LABS } from "./pentesting/web/information";
import { WEB_LOW_LABS }         from "./pentesting/web/low";
import { WEB_MEDIUM_LABS }      from "./pentesting/web/medium";
import { WEB_HIGH_LABS }        from "./pentesting/web/high";
import { WEB_CRITICAL_LABS }    from "./pentesting/web/critical";

import { WEB_INFORMATION_EXT_LABS } from "./pentesting/web/information_ext";
import { WEB_LOW_EXT_LABS }         from "./pentesting/web/low_ext";
import { WEB_MEDIUM_EXT_LABS }      from "./pentesting/web/medium_ext";
import { WEB_HIGH_EXT_LABS }        from "./pentesting/web/high_ext";

// ─── API Pentesting ──────────────────────────────────────────
export { API_INFORMATION_LABS }                                      from "./pentesting/api/information";
export { API_LOW_LABS, API_MEDIUM_LABS, API_HIGH_LABS, API_CRITICAL_LABS } from "./pentesting/api/labs";

import { API_INFORMATION_LABS }                                      from "./pentesting/api/information";
import { API_LOW_LABS, API_MEDIUM_LABS, API_HIGH_LABS, API_CRITICAL_LABS } from "./pentesting/api/labs";

// ─── Network Pentesting ──────────────────────────────────────
export { NETWORK_INFORMATION_LABS }                                                            from "./pentesting/network/information";
export { NETWORK_LOW_LABS, NETWORK_MEDIUM_LABS, NETWORK_HIGH_LABS, NETWORK_CRITICAL_LABS }    from "./pentesting/network/labs";

import { NETWORK_INFORMATION_LABS }                                                            from "./pentesting/network/information";
import { NETWORK_LOW_LABS, NETWORK_MEDIUM_LABS, NETWORK_HIGH_LABS, NETWORK_CRITICAL_LABS }    from "./pentesting/network/labs";

// ─── Cloud Pentesting ────────────────────────────────────────
export { CLOUD_INFORMATION_LABS, CLOUD_LOW_LABS, CLOUD_MEDIUM_LABS, CLOUD_HIGH_LABS, CLOUD_CRITICAL_LABS } from "./pentesting/cloud/labs";

import { CLOUD_INFORMATION_LABS, CLOUD_LOW_LABS, CLOUD_MEDIUM_LABS, CLOUD_HIGH_LABS, CLOUD_CRITICAL_LABS } from "./pentesting/cloud/labs";

// ─── Active Directory Pentesting ─────────────────────────────
export { AD_INFORMATION_LABS, AD_LOW_LABS, AD_MEDIUM_LABS, AD_HIGH_LABS, AD_CRITICAL_LABS } from "./pentesting/ad/labs";

import { AD_INFORMATION_LABS, AD_LOW_LABS, AD_MEDIUM_LABS, AD_HIGH_LABS, AD_CRITICAL_LABS } from "./pentesting/ad/labs";

// ─── Aggregated exports ──────────────────────────────────────
export const ALL_WEB_LABS: Lab[] = [
  ...WEB_INFORMATION_LABS,
  ...WEB_INFORMATION_EXT_LABS,
  ...WEB_LOW_LABS,
  ...WEB_LOW_EXT_LABS,
  ...WEB_MEDIUM_LABS,
  ...WEB_MEDIUM_EXT_LABS,
  ...WEB_HIGH_LABS,
  ...WEB_HIGH_EXT_LABS,
  ...WEB_CRITICAL_LABS,
];

export const ALL_API_LABS: Lab[] = [
  ...API_INFORMATION_LABS,
  ...API_LOW_LABS,
  ...API_MEDIUM_LABS,
  ...API_HIGH_LABS,
  ...API_CRITICAL_LABS,
];

export const ALL_NETWORK_LABS: Lab[] = [
  ...NETWORK_INFORMATION_LABS,
  ...NETWORK_LOW_LABS,
  ...NETWORK_MEDIUM_LABS,
  ...NETWORK_HIGH_LABS,
  ...NETWORK_CRITICAL_LABS,
];

export const ALL_CLOUD_LABS: Lab[] = [
  ...CLOUD_INFORMATION_LABS,
  ...CLOUD_LOW_LABS,
  ...CLOUD_MEDIUM_LABS,
  ...CLOUD_HIGH_LABS,
  ...CLOUD_CRITICAL_LABS,
];

export const ALL_AD_LABS: Lab[] = [
  ...AD_INFORMATION_LABS,
  ...AD_LOW_LABS,
  ...AD_MEDIUM_LABS,
  ...AD_HIGH_LABS,
  ...AD_CRITICAL_LABS,
];

export const ALL_LABS: Lab[] = [
  ...ALL_WEB_LABS,
  ...ALL_API_LABS,
  ...ALL_NETWORK_LABS,
  ...ALL_CLOUD_LABS,
  ...ALL_AD_LABS,
];

// ─── Domain resolver ─────────────────────────────────────────
export function getLabsByDomainAndSeverity(
  domain: DomainId,
  severity: Severity
): Lab[] {
  if (domain === "web") {
    switch (severity) {
      case "information": return [...WEB_INFORMATION_LABS, ...WEB_INFORMATION_EXT_LABS];
      case "low":         return [...WEB_LOW_LABS,         ...WEB_LOW_EXT_LABS];
      case "medium":      return [...WEB_MEDIUM_LABS,      ...WEB_MEDIUM_EXT_LABS];
      case "high":        return [...WEB_HIGH_LABS,        ...WEB_HIGH_EXT_LABS];
      case "critical":    return WEB_CRITICAL_LABS;
    }
  }
  if (domain === "api") {
    switch (severity) {
      case "information": return API_INFORMATION_LABS;
      case "low":         return API_LOW_LABS;
      case "medium":      return API_MEDIUM_LABS;
      case "high":        return API_HIGH_LABS;
      case "critical":    return API_CRITICAL_LABS;
    }
  }
  if (domain === "network") {
    switch (severity) {
      case "information": return NETWORK_INFORMATION_LABS;
      case "low":         return NETWORK_LOW_LABS;
      case "medium":      return NETWORK_MEDIUM_LABS;
      case "high":        return NETWORK_HIGH_LABS;
      case "critical":    return NETWORK_CRITICAL_LABS;
    }
  }
  if (domain === "cloud") {
    switch (severity) {
      case "information": return CLOUD_INFORMATION_LABS;
      case "low":         return CLOUD_LOW_LABS;
      case "medium":      return CLOUD_MEDIUM_LABS;
      case "high":        return CLOUD_HIGH_LABS;
      case "critical":    return CLOUD_CRITICAL_LABS;
    }
  }
  if (domain === "active-directory") {
    switch (severity) {
      case "information": return AD_INFORMATION_LABS;
      case "low":         return AD_LOW_LABS;
      case "medium":      return AD_MEDIUM_LABS;
      case "high":        return AD_HIGH_LABS;
      case "critical":    return AD_CRITICAL_LABS;
    }
  }
  return [];
}

export function getLabById(id: string): Lab | undefined {
  return ALL_LABS.find((l) => l.id === id);
}

// ─── Pentesting sub-domains ───────────────────────────────────
export const PENTESTING_SUBDOMAINS: SubDomain[] = [
  {
    id: "web",
    name: "Web Pentesting",
    icon: "🌐",
    description:
      "Web application security from recon to critical RCE. Every vulnerability 1990–2026 — OWASP Top 10, logic flaws, injection, auth bypass, modern frameworks.",
    status: "available",
    labCounts: {
      information: WEB_INFORMATION_LABS.length + WEB_INFORMATION_EXT_LABS.length,
      low:         WEB_LOW_LABS.length         + WEB_LOW_EXT_LABS.length,
      medium:      WEB_MEDIUM_LABS.length      + WEB_MEDIUM_EXT_LABS.length,
      high:        WEB_HIGH_LABS.length        + WEB_HIGH_EXT_LABS.length,
      critical:    WEB_CRITICAL_LABS.length,
    },
  },
  {
    id: "api",
    name: "API Pentesting",
    icon: "🔌",
    description:
      "REST, GraphQL, SOAP, gRPC security. BOLA, mass assignment, JWT attacks, OAuth exploitation, SSRF via API endpoints.",
    status: "available",
    labCounts: {
      information: API_INFORMATION_LABS.length,
      low:         API_LOW_LABS.length,
      medium:      API_MEDIUM_LABS.length,
      high:        API_HIGH_LABS.length,
      critical:    API_CRITICAL_LABS.length,
    },
  },
  {
    id: "network",
    name: "Network Pentesting",
    icon: "🕸️",
    description:
      "Layer 2–7 attacks. Port scanning, service enumeration, protocol attacks — from Morris Worm (1988) to EternalBlue (2017) to SMBGhost (2020).",
    status: "available",
    labCounts: {
      information: NETWORK_INFORMATION_LABS.length,
      low:         NETWORK_LOW_LABS.length,
      medium:      NETWORK_MEDIUM_LABS.length,
      high:        NETWORK_HIGH_LABS.length,
      critical:    NETWORK_CRITICAL_LABS.length,
    },
  },
  {
    id: "cloud",
    name: "Cloud Pentesting",
    icon: "☁️",
    description:
      "AWS, GCP, Azure misconfig exploitation. S3 exposure, IAM privilege escalation, SSRF to metadata, container escape, Capital One breach simulation.",
    status: "available",
    labCounts: {
      information: CLOUD_INFORMATION_LABS.length,
      low:         CLOUD_LOW_LABS.length,
      medium:      CLOUD_MEDIUM_LABS.length,
      high:        CLOUD_HIGH_LABS.length,
      critical:    CLOUD_CRITICAL_LABS.length,
    },
  },
  {
    id: "active-directory",
    name: "Active Directory",
    icon: "🏛️",
    description:
      "Kerberoasting, AS-REP Roasting, Pass-the-Hash, BloodHound, DCSync, Golden Ticket, ADCS ESC1-8, Zerologon, full domain takeover.",
    status: "available",
    labCounts: {
      information: AD_INFORMATION_LABS.length,
      low:         AD_LOW_LABS.length,
      medium:      AD_MEDIUM_LABS.length,
      high:        AD_HIGH_LABS.length,
      critical:    AD_CRITICAL_LABS.length,
    },
  },
  {
    id: "mobile",
    name: "Mobile Pentesting",
    icon: "📱",
    description:
      "Android and iOS application security. APK analysis, SSL pinning bypass, root detection bypass, insecure storage, Frida dynamic instrumentation.",
    status: "coming_soon",
    labCounts: {},
  },
  {
    id: "wireless",
    name: "Wireless Pentesting",
    icon: "📡",
    description:
      "WPA2 cracking, PMKID attack, Evil Twin AP, WPS PIN brute force, Deauth attacks, Captive portal bypass, 802.11 protocol analysis.",
    status: "coming_soon",
    labCounts: {},
  },
  {
    id: "iot",
    name: "IoT Pentesting",
    icon: "🔧",
    description:
      "Firmware extraction & analysis, UART/JTAG interfaces, default credentials, MQTT/CoAP exploitation, hardware hacking fundamentals.",
    status: "coming_soon",
    labCounts: {},
  },
  {
    id: "ot-ics",
    name: "OT/ICS Pentesting",
    icon: "🏭",
    description:
      "Modbus, DNP3, Profinet protocol attacks. SCADA system testing, HMI exploitation, PLC logic manipulation, industrial network attacks.",
    status: "coming_soon",
    labCounts: {},
  },
  {
    id: "kubernetes",
    name: "Kubernetes Security",
    icon: "⚙️",
    description:
      "K8s RBAC misconfig, pod escape, service account token abuse, etcd exposure, privileged container escape, cluster takeover.",
    status: "coming_soon",
    labCounts: {},
  },
  {
    id: "container",
    name: "Container Security",
    icon: "🐳",
    description:
      "Docker socket escape, privileged container abuse, volume mount attacks, registry poisoning, Dockerfile security scanning.",
    status: "coming_soon",
    labCounts: {},
  },
];

// ─── Red Team top-level modules ───────────────────────────────
export const RED_TEAM_MODULES: RedTeamModule[] = [
  {
    id: "pentesting",
    name: "Pentesting",
    icon: "🎯",
    description:
      "End-to-end penetration testing across Web, API, Network, Cloud, Active Directory, Mobile, Wireless, IoT, OT/ICS, Kubernetes, and Container environments.",
    status: "available",
    subDomains: PENTESTING_SUBDOMAINS,
  },
  {
    id: "red-team-ops",
    name: "Red Team Operations",
    icon: "🔴",
    description:
      "Full adversary simulation. C2 frameworks (Cobalt Strike, Havoc, Sliver), persistence, defense evasion, lateral movement, OPSEC.",
    status: "coming_soon",
  },
  {
    id: "exploit-dev",
    name: "Exploit Development",
    icon: "💥",
    description:
      "Buffer overflows, format strings, heap exploitation, ROP chains, kernel exploits. From basic stack smashing to modern bypass techniques.",
    status: "coming_soon",
  },
  {
    id: "reverse-engineering",
    name: "Reverse Engineering",
    icon: "🔍",
    description:
      "Binary analysis, Ghidra/IDA disassembly, GDB dynamic analysis, malware reverse engineering, CTF-style RE challenges.",
    status: "coming_soon",
  },
  {
    id: "social-engineering",
    name: "Social Engineering",
    icon: "🎭",
    description:
      "Phishing simulation, vishing, pretexting, physical security, badge cloning, OSINT-driven targeting campaigns.",
    status: "coming_soon",
  },
];
