// ============================================================
// HP Labs — Network Advisory Adapter
// Authoritative network vulnerability list from:
// - CISA Known Exploited Vulnerabilities (KEV)
// - NVD/CVE network device categories
// - Cisco / Fortinet / Juniper / F5 vendor advisories
// - Protocol security references (SSH, SMB, DNS, SNMP, TLS)
// ============================================================

import { BaseAdapter } from "@/lib/detector/sourceAdapters/BaseAdapter";
import type { AdapterResult, DetectorVulnerability } from "@/lib/detector/detectorTypes";

const CISA_REF = "https://www.cisa.gov/known-exploited-vulnerabilities-catalog";
const NVD_REF = "https://nvd.nist.gov/";
const CISCO_REF = "https://tools.cisco.com/security/center/publicationListing.x";

const NETWORK_VULNS: Omit<DetectorVulnerability, "canonicalId" | "normalizedName" | "sourceAdapterId" | "domainId" | "detectedAt">[] = [
  // ── Information ──────────────────────────────────────────────
  { name: "Nmap Port Scanning & Service Fingerprinting", severity: "information", sourceIdentifiers: ["net-info-nmap"], cwe: ["CWE-200"], cve: [], cvssScore: 0.0, description: "Enumerating open ports and service versions.", labFeasible: true, firstDiscoveredYear: 1997, references: [NVD_REF] },
  { name: "SNMP Community String Enumeration (v1/v2c)", severity: "information", sourceIdentifiers: ["net-info-snmp-community"], cwe: ["CWE-200"], cve: [], cvssScore: 0.0, description: "Default or guessable SNMP community strings expose device MIB.", labFeasible: true, firstDiscoveredYear: 1998, references: [NVD_REF] },
  { name: "DNS Zone Transfer Reconnaissance", severity: "information", sourceIdentifiers: ["net-info-dns-zone-transfer"], cwe: ["CWE-200"], cve: [], cvssScore: 0.0, description: "AXFR zone transfers expose full internal DNS records.", labFeasible: true, firstDiscoveredYear: 1995, references: [NVD_REF] },
  { name: "LDAP Anonymous Bind — Directory Enumeration", severity: "information", sourceIdentifiers: ["net-info-ldap-anon"], cwe: ["CWE-200"], cve: [], cvssScore: 0.0, description: "Anonymous LDAP bind exposes directory structure and users.", labFeasible: true, firstDiscoveredYear: 1997, references: [NVD_REF] },
  { name: "Banner Grabbing — Service Version Disclosure", severity: "information", sourceIdentifiers: ["net-info-banner-grab"], cwe: ["CWE-200"], cve: [], cvssScore: 0.0, description: "Verbose service banners reveal OS and software versions.", labFeasible: true, firstDiscoveredYear: 1990, references: [NVD_REF] },
  { name: "Firewall Ruleset Fingerprinting via TTL Analysis", severity: "information", sourceIdentifiers: ["net-info-fw-fingerprint"], cwe: ["CWE-200"], cve: [], cvssScore: 0.0, description: "TTL manipulation reveals firewall presence and OS.", labFeasible: true, firstDiscoveredYear: 2000, references: [NVD_REF] },
  { name: "ARP Cache Poisoning Detection (Network Recon)", severity: "information", sourceIdentifiers: ["net-info-arp-recon"], cwe: ["CWE-200"], cve: [], cvssScore: 0.0, description: "ARP scanning reveals live hosts and MAC-to-IP mappings.", labFeasible: true, firstDiscoveredYear: 1988, references: [NVD_REF] },
  { name: "SSH Algorithm Negotiation Fingerprinting", severity: "information", sourceIdentifiers: ["net-info-ssh-algo"], cwe: ["CWE-327"], cve: [], cvssScore: 0.0, description: "SSH cipher/MAC algorithm negotiation reveals deprecated algorithms.", labFeasible: true, firstDiscoveredYear: 1995, references: [NVD_REF] },
  { name: "TLS Certificate & Cipher Suite Enumeration", severity: "information", sourceIdentifiers: ["net-info-tls-enum"], cwe: ["CWE-327"], cve: [], cvssScore: 0.0, description: "Weak cipher suites and expired certificates enumerated.", labFeasible: true, firstDiscoveredYear: 1994, references: [NVD_REF] },
  { name: "SMTP User Enumeration (VRFY/EXPN/RCPT)", severity: "information", sourceIdentifiers: ["net-info-smtp-enum"], cwe: ["CWE-200"], cve: [], cvssScore: 0.0, description: "VRFY/EXPN commands confirm valid email accounts on mail servers.", labFeasible: true, firstDiscoveredYear: 1988, references: [NVD_REF] },
  // ── Low ──────────────────────────────────────────────────────
  { name: "SNMP Community String Brute Force", severity: "low", sourceIdentifiers: ["net-low-snmp-brute"], cwe: ["CWE-521"], cve: [], cvssScore: 3.7, description: "Weak SNMP community strings brute-forced for device read access.", labFeasible: true, firstDiscoveredYear: 1998, references: [NVD_REF] },
  { name: "FTP Anonymous Login", severity: "low", sourceIdentifiers: ["net-low-ftp-anon"], cwe: ["CWE-287"], cve: [], cvssScore: 3.5, description: "Anonymous FTP access exposing files without authentication.", labFeasible: true, firstDiscoveredYear: 1990, references: [NVD_REF] },
  { name: "Telnet Cleartext Credential Transmission", severity: "low", sourceIdentifiers: ["net-low-telnet"], cwe: ["CWE-319"], cve: [], cvssScore: 3.7, description: "Telnet transmits credentials and session data in plaintext.", labFeasible: true, firstDiscoveredYear: 1969, references: [NVD_REF] },
  { name: "NFS World-Readable Export", severity: "low", sourceIdentifiers: ["net-low-nfs-export"], cwe: ["CWE-732"], cve: [], cvssScore: 3.5, description: "NFS shares exported with no_root_squash and wildcard hosts.", labFeasible: true, firstDiscoveredYear: 1985, references: [NVD_REF] },
  { name: "Weak SSH Password Authentication Enabled", severity: "low", sourceIdentifiers: ["net-low-ssh-weak-password"], cwe: ["CWE-521"], cve: [], cvssScore: 3.7, description: "SSH server accepts password authentication without fail2ban.", labFeasible: true, firstDiscoveredYear: 1995, references: [NVD_REF] },
  { name: "ICMP Timestamp Request Information Disclosure", severity: "low", sourceIdentifiers: ["net-low-icmp-timestamp"], cwe: ["CWE-200"], cve: [], cvssScore: 2.6, description: "ICMP timestamp responses reveal system uptime and timezone.", labFeasible: true, firstDiscoveredYear: 1981, references: [NVD_REF] },
  { name: "DNS Cache Poisoning (Kaminsky Attack Variant)", severity: "low", sourceIdentifiers: ["net-low-dns-cache-poison"], cwe: ["CWE-345"], cve: ["CVE-2008-1447"], cvssScore: 3.7, description: "DNS cache poisoning via predictable transaction IDs.", labFeasible: true, firstDiscoveredYear: 2008, references: [NVD_REF] },
  { name: "RIP Route Table Injection", severity: "low", sourceIdentifiers: ["net-low-rip-inject"], cwe: ["CWE-290"], cve: [], cvssScore: 3.5, description: "Unauthenticated RIPv1/v2 route injection redirecting network traffic.", labFeasible: true, firstDiscoveredYear: 1988, references: [NVD_REF] },
  // ── Medium ───────────────────────────────────────────────────
  { name: "SMB Relay (NTLM Relay Attack)", severity: "medium", sourceIdentifiers: ["net-med-smb-relay"], cwe: ["CWE-290"], cve: [], cvssScore: 6.8, description: "Relaying NTLM challenge-response to authenticate to other SMB services.", labFeasible: true, firstDiscoveredYear: 2001, references: [NVD_REF] },
  { name: "LLMNR/NetBIOS Poisoning & Credential Capture", severity: "medium", sourceIdentifiers: ["net-med-llmnr-poison"], cwe: ["CWE-290"], cve: [], cvssScore: 6.5, description: "Responder captures NTLM hashes via LLMNR/NBT-NS broadcast spoofing.", labFeasible: true, firstDiscoveredYear: 2001, references: [NVD_REF] },
  { name: "SSL POODLE — CBC Padding Oracle Attack", severity: "medium", sourceIdentifiers: ["net-med-poodle"], cwe: ["CWE-327"], cve: ["CVE-2014-3566"], cvssScore: 4.3, description: "SSLv3 CBC mode padding oracle decrypts encrypted data via adaptive attack.", labFeasible: true, firstDiscoveredYear: 2014, references: [NVD_REF, CISA_REF] },
  { name: "TLS BEAST Attack (CBC IV Predictability)", severity: "medium", sourceIdentifiers: ["net-med-beast"], cwe: ["CWE-327"], cve: ["CVE-2011-3389"], cvssScore: 5.9, description: "TLS 1.0 CBC block prediction allows session decryption by MitM.", labFeasible: true, firstDiscoveredYear: 2011, references: [NVD_REF] },
  { name: "BGP Route Hijacking via Prefix Injection", severity: "medium", sourceIdentifiers: ["net-med-bgp-hijack"], cwe: ["CWE-290"], cve: [], cvssScore: 6.5, description: "Unauthorized BGP prefix announcements redirect internet traffic.", labFeasible: true, firstDiscoveredYear: 1998, references: [NVD_REF] },
  { name: "VPN Split Tunneling Traffic Interception", severity: "medium", sourceIdentifiers: ["net-med-vpn-split-tunnel"], cwe: ["CWE-319"], cve: [], cvssScore: 5.3, description: "VPN split tunneling routes non-corporate traffic unsecured.", labFeasible: true, firstDiscoveredYear: 2000, references: [NVD_REF] },
  { name: "OSPF Route Injection (Unauthenticated)", severity: "medium", sourceIdentifiers: ["net-med-ospf-inject"], cwe: ["CWE-290"], cve: [], cvssScore: 5.7, description: "Unauthenticated OSPF peers inject false route advertisements.", labFeasible: true, firstDiscoveredYear: 1998, references: [NVD_REF] },
  // ── High ─────────────────────────────────────────────────────
  { name: "EternalBlue — SMBv1 Remote Code Execution (MS17-010)", severity: "high", sourceIdentifiers: ["net-high-eternalblue"], cwe: ["CWE-119"], cve: ["CVE-2017-0144", "CVE-2017-0145"], cvssScore: 8.1, description: "SMBv1 buffer overflow enabling unauthenticated RCE — WannaCry vector.", labFeasible: true, firstDiscoveredYear: 2017, references: [NVD_REF, CISA_REF] },
  { name: "PrintNightmare — Windows Print Spooler RCE (CVE-2021-34527)", severity: "high", sourceIdentifiers: ["net-high-printnightmare"], cwe: ["CWE-269"], cve: ["CVE-2021-34527"], cvssScore: 8.8, description: "Print Spooler privilege escalation to SYSTEM / remote code execution.", labFeasible: true, firstDiscoveredYear: 2021, references: [NVD_REF, CISA_REF] },
  { name: "Cisco ASA ASDM Authentication Bypass (CVE-2022-20828)", severity: "high", sourceIdentifiers: ["net-high-cisco-asa-asdm"], cwe: ["CWE-287"], cve: ["CVE-2022-20828"], cvssScore: 7.2, description: "ASDM software authentication bypass on Cisco ASA firewalls.", labFeasible: true, firstDiscoveredYear: 2022, references: [NVD_REF, CISCO_REF] },
  { name: "Fortinet SSL-VPN Pre-Auth Path Traversal (CVE-2018-13379)", severity: "high", sourceIdentifiers: ["net-high-fortinet-vpn"], cwe: ["CWE-22"], cve: ["CVE-2018-13379"], cvssScore: 9.8, description: "Unauthenticated path traversal exposes VPN session files on Fortinet.", labFeasible: true, firstDiscoveredYear: 2019, references: [NVD_REF, CISA_REF] },
  { name: "F5 BIG-IP iControl REST Auth Bypass (CVE-2022-1388)", severity: "high", sourceIdentifiers: ["net-high-f5-bigip"], cwe: ["CWE-306"], cve: ["CVE-2022-1388"], cvssScore: 9.8, description: "Unauthenticated REST API access leads to RCE on F5 BIG-IP.", labFeasible: true, firstDiscoveredYear: 2022, references: [NVD_REF, CISA_REF] },
  { name: "RDP BlueKeep Pre-Auth RCE (CVE-2019-0708)", severity: "high", sourceIdentifiers: ["net-high-bluekeep"], cwe: ["CWE-416"], cve: ["CVE-2019-0708"], cvssScore: 9.8, description: "Pre-authentication UAF in RDP allows unauthenticated RCE.", labFeasible: true, firstDiscoveredYear: 2019, references: [NVD_REF, CISA_REF] },
  { name: "Zerologon — Netlogon Privilege Escalation (CVE-2020-1472)", severity: "high", sourceIdentifiers: ["net-high-zerologon"], cwe: ["CWE-330"], cve: ["CVE-2020-1472"], cvssScore: 10.0, description: "MS-NRPC authentication bypass grants domain admin without credentials.", labFeasible: true, firstDiscoveredYear: 2020, references: [NVD_REF, CISA_REF] },
  { name: "Log4Shell in Network Infrastructure (CVE-2021-44228)", severity: "high", sourceIdentifiers: ["net-high-log4shell"], cwe: ["CWE-917"], cve: ["CVE-2021-44228"], cvssScore: 10.0, description: "JNDI injection via Log4j in network management services — RCE.", labFeasible: true, firstDiscoveredYear: 2021, references: [NVD_REF, CISA_REF] },
  // ── Critical ─────────────────────────────────────────────────
  { name: "PetitPotam — NTLM Relay to AD CS (CVE-2021-36942)", severity: "critical", sourceIdentifiers: ["net-crit-petitpotam"], cwe: ["CWE-287"], cve: ["CVE-2021-36942"], cvssScore: 9.8, description: "MS-EFSRPC coerces DC authentication for NTLM relay to obtain domain certs.", labFeasible: true, firstDiscoveredYear: 2021, references: [NVD_REF, CISA_REF] },
  { name: "ProxyLogon — Exchange Server RCE Chain (CVE-2021-26855)", severity: "critical", sourceIdentifiers: ["net-crit-proxylogon"], cwe: ["CWE-918"], cve: ["CVE-2021-26855", "CVE-2021-26857", "CVE-2021-26858"], cvssScore: 9.8, description: "SSRF + deserialization chain on Exchange Server enabling unauthenticated RCE.", labFeasible: true, firstDiscoveredYear: 2021, references: [NVD_REF, CISA_REF] },
  { name: "Cisco IOS XE Web UI Auth Bypass (CVE-2023-20198)", severity: "critical", sourceIdentifiers: ["net-crit-cisco-ios-xe"], cwe: ["CWE-306"], cve: ["CVE-2023-20198"], cvssScore: 10.0, description: "Unauthenticated admin account creation on Cisco IOS XE web UI.", labFeasible: true, firstDiscoveredYear: 2023, references: [NVD_REF, CISA_REF, CISCO_REF] },
  { name: "VMware ESXi OpenSLP RCE (CVE-2021-21974 / ESXiArgs)", severity: "critical", sourceIdentifiers: ["net-crit-esxi-openslp"], cwe: ["CWE-122"], cve: ["CVE-2021-21974"], cvssScore: 9.8, description: "OpenSLP heap overflow in ESXi enabling unauthenticated RCE — ESXiArgs ransomware.", labFeasible: true, firstDiscoveredYear: 2021, references: [NVD_REF, CISA_REF] },
];

export class NetworkAdvisoryAdapter extends BaseAdapter {
  readonly adapterId = "cisa-kev";
  readonly domainId = "network" as const;

  async run(): Promise<AdapterResult> {
    try {
      const now = new Date().toISOString();
      const vulns: DetectorVulnerability[] = NETWORK_VULNS.map((v) => ({
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
