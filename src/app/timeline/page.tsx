"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { ALL_WEB_LABS } from "@/lib/data/redteam";
import {
  Clock,
  Shield,
  Zap,
  ChevronRight,
  Target,
  Globe,
  Flag,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

const HISTORICAL_EVENTS = [
  {
    year: 1971,
    name: "Creeper Worm",
    cvss: undefined as number | undefined,
    description:
      "The first self-replicating program appeared on ARPANET, moving between DEC PDP-10 computers and displaying 'I'm the creeper, catch me if you can!'",
    milestone: true,
    domain: "network",
    labId: null as string | null,
    severity: undefined as string | undefined,
  },
  {
    year: 1983,
    name: "First DNS Implementation",
    cvss: undefined as number | undefined,
    description:
      "Paul Mockapetris introduced DNS (Domain Name System), creating the foundation for subdomain enumeration attacks used in recon today.",
    milestone: false,
    domain: "network",
    labId: null as string | null,
    severity: undefined as string | undefined,
  },
  {
    year: 1986,
    name: "Brain Virus — First PC Virus",
    cvss: undefined as number | undefined,
    description:
      "Two Pakistani brothers wrote the first IBM PC-compatible virus that spread via floppy disks, overwriting the boot sector — the precursor to modern malware.",
    milestone: true,
    domain: "malware",
    labId: null as string | null,
    severity: undefined as string | undefined,
  },
  {
    year: 1988,
    name: "Morris Worm",
    cvss: undefined as number | undefined,
    description:
      "Created by Robert Morris at Cornell, this worm exploited sendmail, fingerd, and rsh/rexec bugs, infecting ~6,000 machines (~10% of the internet) and becoming the first widely publicised internet worm.",
    milestone: true,
    domain: "network",
    labId: null as string | null,
    severity: undefined as string | undefined,
  },
  {
    year: 1993,
    name: "First Web Application Attacks via CGI",
    cvss: undefined as number | undefined,
    description:
      "With the birth of CGI scripts, the first web application attack vectors emerged — malformed input in web forms causing server-side crashes or unexpected behavior.",
    milestone: false,
    domain: "web",
    labId: null as string | null,
    severity: undefined as string | undefined,
  },
  {
    year: 1995,
    name: "JavaScript Introduced — XSS Foundation",
    cvss: undefined as number | undefined,
    description:
      "Brendan Eich created JavaScript for Netscape Navigator, which would soon become the primary vector for Cross-Site Scripting (XSS) attacks on the web.",
    milestone: false,
    domain: "web",
    labId: null as string | null,
    severity: undefined as string | undefined,
  },
  {
    year: 1996,
    name: "HTTP Cookie Session Hijacking",
    cvss: undefined as number | undefined,
    description:
      "Session cookies were introduced and almost immediately found to be vulnerable to theft via network sniffing and later via XSS. First documented session hijacking techniques emerged.",
    milestone: false,
    domain: "web",
    labId: null as string | null,
    severity: undefined as string | undefined,
  },
  {
    year: 1998,
    name: "SQL Injection — First Documented",
    cvss: 10.0,
    description:
      "Jeff Forristal (rain.forest.puppy) publicly documented SQL injection in Phrack magazine, showing how unsanitised database queries could be manipulated to dump data, bypass authentication, or execute OS commands.",
    milestone: true,
    domain: "web",
    labId: null as string | null,
    severity: undefined as string | undefined,
  },
  {
    year: 1999,
    name: "XSS (Cross-Site Scripting) Named",
    cvss: 6.1,
    description:
      "Microsoft engineers formally named the Cross-Site Scripting attack vector after discovering that malicious scripts could be injected into trusted websites and executed in victims' browsers.",
    milestone: true,
    domain: "web",
    labId: null as string | null,
    severity: undefined as string | undefined,
  },
];

function getDomainColor(domain: string): string {
  const map: Record<string, string> = {
    web: "#bf5fff",
    network: "#00e5ff",
    malware: "#ff6b6b",
    api: "#a78bfa",
    cloud: "#60a5fa",
    mobile: "#f59e0b",
  };
  return map[domain] ?? "#9ca3af";
}

function getCvssColor(cvss?: number): string {
  if (!cvss) return "#6b7280";
  if (cvss >= 9) return "#f87171";
  if (cvss >= 7) return "#fb923c";
  if (cvss >= 4) return "#facc15";
  return "#4ade80";
}

function getCvssLabel(cvss?: number): string {
  if (!cvss) return "N/A";
  if (cvss >= 9) return "Critical";
  if (cvss >= 7) return "High";
  if (cvss >= 4) return "Medium";
  return "Low";
}

type TimelineEntry = {
  year: number;
  name: string;
  cvss?: number;
  description: string;
  milestone: boolean;
  domain: string;
  labId: string | null;
  severity?: string;
};

function buildTimeline(): TimelineEntry[] {
  const entries: TimelineEntry[] = HISTORICAL_EVENTS.map((e) => ({ ...e }));

  for (const lab of ALL_WEB_LABS) {
    const isDuplicate = entries.some(
      (e) =>
        e.year === lab.firstDiscoveredYear &&
        e.name.toLowerCase().includes(lab.shortName.toLowerCase().slice(0, 6))
    );
    if (!isDuplicate) {
      entries.push({
        year: lab.firstDiscoveredYear,
        name: lab.name,
        cvss: lab.cvssScore,
        description:
          lab.description.slice(0, 200) + (lab.description.length > 200 ? "…" : ""),
        milestone: (lab.cvssScore ?? 0) >= 9,
        domain: lab.domain,
        labId: lab.id,
        severity: lab.severity,
      });
    }
  }

  return entries.sort((a, b) => a.year - b.year || a.name.localeCompare(b.name));
}

const DECADES = [
  { label: "1970s", start: 1970, end: 1979 },
  { label: "1980s", start: 1980, end: 1989 },
  { label: "1990s", start: 1990, end: 1999 },
  { label: "2000s", start: 2000, end: 2009 },
  { label: "2010s", start: 2010, end: 2019 },
  { label: "2020s", start: 2020, end: 2029 },
];

export default function TimelinePage() {
  const [activeDecade, setActiveDecade] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const allEntries = useMemo(() => buildTimeline(), []);

  const filteredEntries = useMemo(() => {
    if (!searchQuery) return allEntries;
    const q = searchQuery.toLowerCase();
    return allEntries.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.domain.toLowerCase().includes(q)
    );
  }, [allEntries, searchQuery]);

  const groupedByDecade = useMemo(
    () =>
      DECADES.map((decade) => ({
        ...decade,
        entries: filteredEntries.filter(
          (e) => e.year >= decade.start && e.year <= decade.end
        ),
      })),
    [filteredEntries]
  );

  const visibleDecades = activeDecade
    ? groupedByDecade.filter((d) => d.label === activeDecade)
    : groupedByDecade;

  const totalEntries = allEntries.length;
  const milestones = allEntries.filter((e) => e.milestone).length;
  const withLabs = allEntries.filter((e) => e.labId).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#06030c",
        color: "#e2e8f0",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <Navbar />

      {/* Ambient background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(191, 95, 255,0.04) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      <main style={{ position: "relative", zIndex: 1, paddingTop: "96px", paddingBottom: "80px" }}>
        {/* Header */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 48px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <Clock size={13} style={{ color: "#bf5fff" }} />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "#bf5fff",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              1971 → 2026
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 46px)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "16px",
              background: "linear-gradient(135deg, #ffffff 0%, #bf5fff 60%, #00e5ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Attack Vector Timeline
          </h1>
          <p
            style={{
              color: "#94a3b8",
              maxWidth: "580px",
              lineHeight: 1.7,
              fontSize: "15px",
              marginBottom: "32px",
            }}
          >
            Every major vulnerability, hacking milestone, and web exploit — from the{" "}
            <span style={{ color: "#bf5fff" }}>Morris Worm (1988)</span> to{" "}
            <span style={{ color: "#bf5fff" }}>2026</span>. Entries with labs link directly
            to hands-on exploitation practice.
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {[
              { label: "Total Events", value: String(totalEntries), icon: Globe },
              { label: "Major Milestones", value: String(milestones), icon: Zap },
              { label: "Live Labs", value: String(withLabs), icon: Target },
              { label: "Years Covered", value: "55+", icon: Clock },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 18px",
                  borderRadius: "10px",
                  border: "1px solid rgba(191, 95, 255,0.12)",
                  backgroundColor: "rgba(191, 95, 255,0.03)",
                }}
              >
                <Icon size={15} style={{ color: "#bf5fff", flexShrink: 0 }} />
                <div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#bf5fff",
                      lineHeight: 1,
                    }}
                  >
                    {value}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto 40px",
            padding: "0 24px",
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", flex: "1 1 200px" }}>
            <BookOpen
              size={13}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#4b5563",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search vulnerabilities…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                paddingLeft: "36px",
                paddingRight: "16px",
                paddingTop: "9px",
                paddingBottom: "9px",
                borderRadius: "8px",
                border: "1px solid rgba(191, 95, 255,0.15)",
                backgroundColor: "rgba(255,255,255,0.03)",
                color: "#e2e8f0",
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {[{ label: "All" }, ...DECADES].map((d) => {
              const isActive = d.label === "All" ? !activeDecade : activeDecade === d.label;
              return (
                <button
                  key={d.label}
                  onClick={() =>
                    setActiveDecade(
                      d.label === "All" ? null : activeDecade === d.label ? null : d.label
                    )
                  }
                  style={{
                    padding: "6px 14px",
                    borderRadius: "99px",
                    border: `1px solid ${isActive ? "rgba(191, 95, 255,0.5)" : "rgba(255,255,255,0.08)"}`,
                    backgroundColor: isActive ? "rgba(191, 95, 255,0.1)" : "transparent",
                    color: isActive ? "#bf5fff" : "#9ca3af",
                    fontSize: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: "monospace",
                  }}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
          {visibleDecades.map((decade) => {
            if (decade.entries.length === 0) return null;
            return (
              <div key={decade.label} style={{ marginBottom: "64px" }}>
                {/* Decade header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "32px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#bf5fff",
                      letterSpacing: "0.08em",
                      padding: "4px 12px",
                      border: "1px solid rgba(191, 95, 255,0.3)",
                      borderRadius: "4px",
                      backgroundColor: "rgba(191, 95, 255,0.06)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {decade.label}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      background:
                        "linear-gradient(to right, rgba(191, 95, 255,0.3), transparent)",
                    }}
                  />
                  <span style={{ fontSize: "11px", color: "#374151", whiteSpace: "nowrap" }}>
                    {decade.entries.length} events
                  </span>
                </div>

                {/* Entries */}
                <div style={{ position: "relative", paddingLeft: "32px" }}>
                  {/* Vertical line */}
                  <div
                    style={{
                      position: "absolute",
                      left: "7px",
                      top: 0,
                      bottom: 0,
                      width: "1px",
                      background:
                        "linear-gradient(to bottom, rgba(191, 95, 255,0.35), rgba(191, 95, 255,0.04))",
                    }}
                  />

                  {decade.entries.map((entry, idx) => {
                    const domainColor = getDomainColor(entry.domain);
                    const cvssColor = getCvssColor(entry.cvss);

                    return (
                      <div
                        key={`${entry.year}-${entry.name}-${idx}`}
                        style={{ position: "relative", marginBottom: "20px" }}
                      >
                        {/* Dot */}
                        <div
                          style={{
                            position: "absolute",
                            left: "-29px",
                            top: "18px",
                            width: entry.milestone ? "14px" : "10px",
                            height: entry.milestone ? "14px" : "10px",
                            borderRadius: "50%",
                            backgroundColor: entry.milestone
                              ? "#bf5fff"
                              : "rgba(191, 95, 255,0.15)",
                            border: `2px solid ${entry.milestone ? "#bf5fff" : "rgba(191, 95, 255,0.25)"}`,
                            boxShadow: entry.milestone
                              ? "0 0 14px rgba(191, 95, 255,0.7)"
                              : "none",
                            transform: "translateX(50%)",
                            zIndex: 1,
                          }}
                        />

                        {/* Card */}
                        <div
                          style={{
                            padding: "16px 20px",
                            borderRadius: "10px",
                            border: `1px solid ${
                              entry.milestone
                                ? "rgba(191, 95, 255,0.2)"
                                : "rgba(255,255,255,0.05)"
                            }`,
                            backgroundColor: entry.milestone
                              ? "rgba(191, 95, 255,0.03)"
                              : "rgba(255,255,255,0.015)",
                          }}
                        >
                          {/* Top row */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              justifyContent: "space-between",
                              gap: "10px",
                              marginBottom: "8px",
                              flexWrap: "wrap",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                flexWrap: "wrap",
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: "monospace",
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  color: domainColor,
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  border: `1px solid ${domainColor}33`,
                                  backgroundColor: `${domainColor}11`,
                                }}
                              >
                                {entry.year}
                              </span>

                              {entry.milestone && (
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    fontSize: "10px",
                                    color: "#bf5fff",
                                    padding: "2px 8px",
                                    borderRadius: "4px",
                                    border: "1px solid rgba(191, 95, 255,0.3)",
                                    backgroundColor: "rgba(191, 95, 255,0.08)",
                                    fontWeight: 600,
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  <Zap size={9} />
                                  Milestone
                                </span>
                              )}

                              {entry.severity && (
                                <span
                                  style={{
                                    fontSize: "10px",
                                    color: cvssColor,
                                    padding: "2px 8px",
                                    borderRadius: "4px",
                                    border: `1px solid ${cvssColor}33`,
                                    backgroundColor: `${cvssColor}11`,
                                    textTransform: "capitalize",
                                    fontWeight: 600,
                                  }}
                                >
                                  {entry.severity}
                                </span>
                              )}

                              <span
                                style={{
                                  fontSize: "10px",
                                  color: domainColor,
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  border: `1px solid ${domainColor}22`,
                                  backgroundColor: `${domainColor}08`,
                                  textTransform: "capitalize",
                                }}
                              >
                                {entry.domain}
                              </span>
                            </div>

                            {entry.cvss !== undefined && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  flexShrink: 0,
                                }}
                              >
                                <Shield size={11} style={{ color: cvssColor }} />
                                <span
                                  style={{
                                    fontFamily: "monospace",
                                    fontSize: "11px",
                                    color: cvssColor,
                                    fontWeight: 700,
                                  }}
                                >
                                  CVSS {entry.cvss.toFixed(1)}
                                </span>
                                <span
                                  style={{
                                    fontSize: "10px",
                                    color: cvssColor,
                                    padding: "1px 6px",
                                    borderRadius: "3px",
                                    backgroundColor: `${cvssColor}22`,
                                  }}
                                >
                                  {getCvssLabel(entry.cvss)}
                                </span>
                              </div>
                            )}
                          </div>

                          <h3
                            style={{
                              fontSize: "14px",
                              fontWeight: 700,
                              color: entry.milestone ? "#ffffff" : "#cbd5e1",
                              marginBottom: "6px",
                              lineHeight: 1.4,
                            }}
                          >
                            {entry.name}
                          </h3>

                          <p
                            style={{
                              fontSize: "13px",
                              color: "#6b7280",
                              lineHeight: 1.65,
                              marginBottom: entry.labId ? "12px" : 0,
                            }}
                          >
                            {entry.description}
                          </p>

                          {entry.labId && (
                            <Link
                              href={`/labs/${entry.labId}`}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "12px",
                                color: "#bf5fff",
                                textDecoration: "none",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                border: "1px solid rgba(191, 95, 255,0.25)",
                                backgroundColor: "rgba(191, 95, 255,0.05)",
                                fontWeight: 600,
                              }}
                            >
                              <Target size={11} />
                              Practice Lab
                              <ChevronRight size={11} />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filteredEntries.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "80px 24px",
                color: "#374151",
              }}
            >
              <Flag size={36} style={{ margin: "0 auto 16px", opacity: 0.3, display: "block" }} />
              <p style={{ fontSize: "15px" }}>No vulnerabilities match your search.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
