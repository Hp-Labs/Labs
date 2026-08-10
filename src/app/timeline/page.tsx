"use client";

import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { HISTORICAL_VULNERABILITY_CATALOG } from "@/lib/data/historicalVulnerabilities";
import { getCombinedVulnerabilityCatalog, getCurrentDynamicDate } from "@/lib/services/vulnerabilitySync";
import {
  Clock, Shield, Zap, ChevronRight, Target, Globe, Flag, BookOpen, RefreshCw, Sparkles
} from "lucide-react";
import Link from "next/link";

function getDomainColor(domain: string): string {
  const map: Record<string, string> = {
    web: "var(--hp-primary)",
    network: "var(--hp-cyan)",
    malware: "#ff6b6b",
    api: "#a78bfa",
    cloud: "#60a5fa",
    mobile: "#f59e0b",
    iot: "#10b981",
    "active-directory": "#ec4899",
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

const DECADES = [
  { label: "1940s", start: 1940, end: 1949 },
  { label: "1950s", start: 1950, end: 1959 },
  { label: "1960s", start: 1960, end: 1969 },
  { label: "1970s", start: 1970, end: 1979 },
  { label: "1980s", start: 1980, end: 1989 },
  { label: "1990s", start: 1990, end: 1999 },
  { label: "2000s", start: 2000, end: 2009 },
  { label: "2010s", start: 2010, end: 2019 },
  { label: "2020s+", start: 2020, end: 2030 },
];

export default function TimelinePage() {
  const [activeDecade, setActiveDecade] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [catalog, setCatalog] = useState(() => getCombinedVulnerabilityCatalog());
  const [isSyncing, setIsSyncing] = useState(false);
  const { year: currentYear, fullDate: currentDate } = useMemo(() => getCurrentDynamicDate(), []);

  // Background silent synchronization without page reload
  useEffect(() => {
    async function triggerSilentSync() {
      try {
        setIsSyncing(true);
        const res = await fetch("/api/vulnerabilities/sync");
        if (res.ok) {
          setCatalog(getCombinedVulnerabilityCatalog());
        }
      } catch {} finally {
        setIsSyncing(false);
      }
    }
    triggerSilentSync();
  }, []);

  const filteredEntries = useMemo(() => {
    let result = catalog;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.domain.toLowerCase().includes(q) ||
          (e.cve && e.cve.some((c) => c.toLowerCase().includes(q)))
      );
    }
    return result.sort((a, b) => a.firstDiscoveredYear - b.firstDiscoveredYear || a.name.localeCompare(b.name));
  }, [catalog, searchQuery]);

  const groupedByDecade = useMemo(
    () =>
      DECADES.map((decade) => ({
        ...decade,
        entries: filteredEntries.filter(
          (e) => e.firstDiscoveredYear >= decade.start && e.firstDiscoveredYear <= decade.end
        ),
      })),
    [filteredEntries]
  );

  const visibleDecades = activeDecade
    ? groupedByDecade.filter((d) => d.label === activeDecade)
    : groupedByDecade;

  const totalEntries = catalog.length;
  const milestones = catalog.filter((e) => e.severity === "critical" || e.severity === "high").length;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--hp-bg)",
        color: "var(--hp-text)",
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
            "radial-gradient(ellipse 80% 40% at 50% 0%, var(--hp-primary) 0%, transparent 70%)",
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
              justifyContent: "space-between",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Clock size={14} style={{ color: "var(--hp-primary)" }} />
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "12px",
                  color: "var(--hp-primary)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                1940 → UPDATED TODAY
              </span>
            </div>

            {/* Silent Sync Status Indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--hp-text-muted)", fontFamily: "monospace" }}>
              <RefreshCw size={12} style={{ animation: isSyncing ? "spin 2s linear infinite" : "none", color: "var(--hp-cyan)" }} />
              <span>{isSyncing ? "Synchronizing Live Feed..." : "Updated Today"}</span>
            </div>
          </div>

          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 46px)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "16px",
              background: "linear-gradient(135deg, var(--hp-text) 0%, #bf5fff 60%, #00e5ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Historical Vulnerability Research Catalog
          </h1>
          <p
            style={{
              color: "var(--hp-text-muted)",
              maxWidth: "680px",
              lineHeight: 1.7,
              fontSize: "15px",
              marginBottom: "32px",
            }}
          >
            Exhaustive, year-by-year security research from the{" "}
            <span style={{ color: "var(--hp-primary)", fontWeight: 600 }}>1947 Harvard Relay Bug</span> to{" "}
            <span style={{ color: "var(--hp-cyan)", fontWeight: 600 }}>Updated Today</span>.
            Every documented vulnerability maps to hands-on practical or historical lab environments.
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {[
              { label: "Total Vulnerabilities", value: String(totalEntries), icon: Globe },
              { label: "High / Critical", value: String(milestones), icon: Zap },
              { label: "Historical Catalog", value: String(HISTORICAL_VULNERABILITY_CATALOG.length), icon: Sparkles },
              { label: "Years Covered", value: `${currentYear - 1940}+`, icon: Clock },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 18px",
                  borderRadius: "10px",
                  border: "1px solid var(--hp-border)",
                  backgroundColor: "var(--hp-card-bg)",
                }}
              >
                <Icon size={15} style={{ color: "var(--hp-primary)", flexShrink: 0 }} />
                <div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "var(--hp-primary)",
                      lineHeight: 1,
                    }}
                  >
                    {value}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--hp-text-muted)", marginTop: "2px" }}>
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
                color: "var(--hp-text-muted)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search vulnerabilities, CVEs, or years…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                paddingLeft: "36px",
                paddingRight: "16px",
                paddingTop: "9px",
                paddingBottom: "9px",
                borderRadius: "8px",
                border: "1px solid var(--hp-primary)",
                backgroundColor: "var(--hp-bg-3)",
                color: "var(--hp-text)",
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
                    border: `1px solid ${isActive ? "var(--hp-primary)" : "var(--hp-border)"}`,
                    backgroundColor: isActive ? "var(--hp-primary)" : "transparent",
                    color: isActive ? "#ffffff" : "var(--hp-text-muted)",
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

        {/* Timeline Entries */}
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
                      color: "var(--hp-primary)",
                      letterSpacing: "0.08em",
                      padding: "4px 12px",
                      border: "1px solid var(--hp-primary)",
                      borderRadius: "4px",
                      backgroundColor: "var(--hp-primary)",
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
                        "linear-gradient(to right, var(--hp-primary), transparent)",
                    }}
                  />
                  <span style={{ fontSize: "11px", color: "var(--hp-text-muted)", whiteSpace: "nowrap" }}>
                    {decade.entries.length} vulnerabilities
                  </span>
                </div>

                {/* Entries */}
                <div style={{ position: "relative", paddingLeft: "32px" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "7px",
                      top: 0,
                      bottom: 0,
                      width: "1px",
                      background:
                        "linear-gradient(to bottom, var(--hp-primary), var(--hp-primary))",
                    }}
                  />

                  {decade.entries.map((entry, idx) => {
                    const domainColor = getDomainColor(entry.domain);
                    const cvssColor = getCvssColor(entry.cvssScore);
                    const isMilestone = entry.severity === "critical" || entry.severity === "high";

                    return (
                      <div
                        key={`${entry.id}-${idx}`}
                        style={{ position: "relative", marginBottom: "20px" }}
                      >
                        {/* Dot */}
                        <div
                          style={{
                            position: "absolute",
                            left: "-29px",
                            top: "18px",
                            width: isMilestone ? "14px" : "10px",
                            height: isMilestone ? "14px" : "10px",
                            borderRadius: "50%",
                            backgroundColor: isMilestone
                              ? "var(--hp-primary)"
                              : "var(--hp-primary)",
                            border: `2px solid ${isMilestone ? "var(--hp-primary)" : "var(--hp-primary)"}`,
                            boxShadow: isMilestone
                              ? "0 0 14px var(--hp-primary)"
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
                              isMilestone
                                ? "var(--hp-primary)"
                                : "var(--hp-border)"
                            }`,
                            backgroundColor: isMilestone
                              ? "var(--hp-card-bg)"
                              : "var(--hp-card-bg)",
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
                                {entry.firstDiscoveredYear}
                              </span>

                              {entry.cve && entry.cve.length > 0 && (
                                <span
                                  style={{
                                    fontFamily: "monospace",
                                    fontSize: "10px",
                                    color: "var(--hp-cyan)",
                                    padding: "2px 8px",
                                    borderRadius: "4px",
                                    border: "1px solid rgba(0, 229, 255, 0.3)",
                                    backgroundColor: "rgba(0, 229, 255, 0.08)",
                                    fontWeight: 600,
                                  }}
                                >
                                  {entry.cve.join(", ")}
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

                            {entry.cvssScore !== undefined && (
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
                                  CVSS {entry.cvssScore.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>

                          <h3
                            style={{
                              fontSize: "15px",
                              fontWeight: 700,
                              color: "var(--hp-text)",
                              marginBottom: "6px",
                              lineHeight: 1.4,
                            }}
                          >
                            {entry.name}
                          </h3>

                          <p
                            style={{
                              fontSize: "13px",
                              color: "var(--hp-text-muted)",
                              lineHeight: 1.65,
                              marginBottom: "12px",
                            }}
                          >
                            {entry.description}
                          </p>

                          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "11px",
                                color: "var(--hp-text-muted)",
                                fontFamily: "monospace",
                                padding: "4px 10px",
                                borderRadius: "6px",
                                border: "1px solid var(--hp-border)",
                                backgroundColor: "var(--hp-bg-3)",
                              }}
                            >
                              Domain: <strong style={{ color: "var(--hp-primary)" }}>{entry.domain}</strong>
                            </span>

                            {entry.references && entry.references.length > 0 && (
                              <a
                                href={entry.references[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: "11px",
                                  color: "var(--hp-text-muted)",
                                  textDecoration: "none",
                                  fontFamily: "monospace",
                                }}
                              >
                                Reference ↗
                              </a>
                            )}
                          </div>
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
                color: "var(--hp-text-muted)",
              }}
            >
              <Flag size={36} style={{ margin: "0 auto 16px", opacity: 0.3, display: "block" }} />
              <p style={{ fontSize: "15px" }}>No vulnerabilities match your search query.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
