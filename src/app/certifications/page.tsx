"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import {
  Shield,
  Award,
  CheckCircle,
  Globe,
  Lock,
  Star,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Zap,
  BookOpen,
  Info,
} from "lucide-react";

// ─── HpLabs Internal Certs ────────────────────────────────────
const INTERNAL_CERTS = [
  {
    id: "HPL-WebPT",
    name: "HPL-WebPT",
    fullName: "HpLabs Web Penetration Testing",
    description:
      "Comprehensive web application security certification covering OWASP Top 10, injection attacks, authentication bypass, XSS, SSRF, and business logic flaws.",
    domains: ["Information Recon", "Low Severity", "Medium Severity", "High Severity", "Critical Exploits"],
    progress: {
      "Information Recon": 100,
      "Low Severity": 85,
      "Medium Severity": 60,
      "High Severity": 20,
      "Critical Exploits": 0,
    },
    totalLabs: 89,
    completedLabs: 52,
    xpRequired: 15000,
    currentXP: 18450,
    status: "in_progress" as const,
    color: "var(--hp-primary)",
    icon: "🌐",
  },
  {
    id: "HPL-NetPT",
    name: "HPL-NetPT",
    fullName: "HpLabs Network Penetration Testing",
    description:
      "Network infrastructure security testing covering layer 2-7 attacks, protocol exploitation, firewall evasion, MITM, and Active Directory compromise.",
    domains: ["Network Recon", "Service Exploitation", "Active Directory", "Lateral Movement", "Post-Exploitation"],
    progress: {
      "Network Recon": 0,
      "Service Exploitation": 0,
      "Active Directory": 0,
      "Lateral Movement": 0,
      "Post-Exploitation": 0,
    },
    totalLabs: 72,
    completedLabs: 0,
    xpRequired: 20000,
    currentXP: 0,
    status: "locked" as const,
    color: "var(--hp-cyan)",
    icon: "🕸️",
  },
  {
    id: "HPL-CloudPT",
    name: "HPL-CloudPT",
    fullName: "HpLabs Cloud Penetration Testing",
    description:
      "Cloud infrastructure security covering AWS, GCP, Azure misconfigurations, S3 exposure, IAM privilege escalation, metadata SSRF, and container escape.",
    domains: ["Cloud Recon", "IAM Exploitation", "Storage Attacks", "Kubernetes", "Container Escape"],
    progress: {
      "Cloud Recon": 0,
      "IAM Exploitation": 0,
      "Storage Attacks": 0,
      "Kubernetes": 0,
      "Container Escape": 0,
    },
    totalLabs: 65,
    completedLabs: 0,
    xpRequired: 25000,
    currentXP: 0,
    status: "locked" as const,
    color: "#60a5fa",
    icon: "☁️",
  },
];

// ─── External Certs ───────────────────────────────────────────
const EXTERNAL_CERTS = [
  {
    id: "eJPT",
    name: "eJPT",
    org: "eLearnSecurity / INE",
    fullName: "eLearnSecurity Junior Penetration Tester",
    description:
      "Entry-level penetration testing certification from eLearnSecurity. Covers web application testing, network scanning, and basic exploitation techniques.",
    difficulty: "Beginner",
    difficultyColor: "#4ade80",
    cost: "$200",
    color: "#4ade80",
    logo: "💚",
  },
  {
    id: "CEH",
    name: "CEH",
    org: "EC-Council",
    fullName: "Certified Ethical Hacker",
    description:
      "EC-Council's flagship certification covering ethical hacking methodologies, tools, and techniques across 20 security domains.",
    difficulty: "Intermediate",
    difficultyColor: "#facc15",
    cost: "$950",
    color: "#facc15",
    logo: "⚡",
  },
  {
    id: "OSCP",
    name: "OSCP",
    org: "Offensive Security",
    fullName: "Offensive Security Certified Professional",
    description:
      "The gold standard in penetration testing certifications. 24-hour hands-on exam requiring exploiting a lab network of machines.",
    difficulty: "Advanced",
    difficultyColor: "#f87171",
    cost: "$1,499",
    color: "#f87171",
    logo: "💀",
  },
  {
    id: "PNPT",
    name: "PNPT",
    org: "TCM Security",
    fullName: "Practical Network Penetration Tester",
    description:
      "Practical, hands-on certification from TCM Security covering OSINT, network exploitation, Active Directory attacks, and post-exploitation.",
    difficulty: "Intermediate",
    difficultyColor: "#facc15",
    cost: "$399",
    color: "#a78bfa",
    logo: "🎯",
  },
  {
    id: "eCPPT",
    name: "eCPPT",
    org: "eLearnSecurity / INE",
    fullName: "eLearnSecurity Certified Professional Penetration Tester",
    description:
      "Professional-level practical exam covering web applications, network security, metasploit, and report writing with a 7-day exam window.",
    difficulty: "Intermediate",
    difficultyColor: "#facc15",
    cost: "$400",
    color: "#fb923c",
    logo: "🔴",
  },
];

// ─── Planned Integrations ─────────────────────────────────────
const PLANNED_INTEGRATIONS = [
  {
    name: "EC-Council API",
    description: "Automatically verify and display your CEH, CEH Master, CPENT, and LPT certifications by linking your EC-Council account.",
    eta: "Q3 2026",
    org: "EC-Council",
    color: "#facc15",
  },
  {
    name: "OffSec API",
    description: "Link your Offensive Security account to auto-display OSCP, OSEP, OSED, OSWE, and OSWP certifications with verification badges.",
    eta: "Q3 2026",
    org: "Offensive Security",
    color: "#f87171",
  },
  {
    name: "INE / eLearnSecurity API",
    description: "Connect your INE account to automatically pull and verify eJPT, eCPPT, eMAPT, and eWPT certifications.",
    eta: "Q4 2026",
    org: "INE Security",
    color: "#4ade80",
  },
  {
    name: "TCM Security API",
    description: "Verify your PNPT, PJPT, PEAT, and other TCM Security certifications automatically via API integration.",
    eta: "Q4 2026",
    org: "TCM Security",
    color: "#a78bfa",
  },
];

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div
      style={{
        height: "6px",
        borderRadius: "99px",
        backgroundColor: "var(--hp-bg-3)",
        overflow: "hidden",
        flex: 1,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${value}%`,
          borderRadius: "99px",
          backgroundColor: color,
          boxShadow: value > 0 ? `0 0 6px ${color}88` : "none",
          transition: "width 0.6s ease",
        }}
      />
    </div>
  );
}

export default function CertificationsPage() {
  const [verifyInputs, setVerifyInputs] = useState<Record<string, string>>({});
  const [verifyResults, setVerifyResults] = useState<Record<string, "valid" | "invalid" | null>>({});

  function handleVerify(certId: string) {
    const val = verifyInputs[certId] ?? "";
    if (!val.trim()) return;
    // Simulate verification — accept IDs with length 8-16 and alphanumeric
    const isValid = /^[A-Za-z0-9\-]{8,20}$/.test(val.trim());
    setVerifyResults((prev) => ({ ...prev, [certId]: isValid ? "valid" : "invalid" }));
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--hp-bg)",
        color: "var(--hp-text)",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
      suppressHydrationWarning
    >
      <Navbar />

      {/* Ambient */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 70% 35% at 50% 0%, var(--hp-primary) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      <main style={{ position: "relative", zIndex: 1, paddingTop: "96px", paddingBottom: "80px" }}>
        {/* Header Container */}
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 24px 32px" }}>
          {/* Locked Notice Banner */}
          <div
            style={{
              padding: "16px 20px",
              borderRadius: "16px",
              border: "1px solid rgba(234, 179, 8, 0.3)",
              backgroundColor: "rgba(234, 179, 8, 0.06)",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                backgroundColor: "rgba(234, 179, 8, 0.15)",
                border: "1px solid rgba(234, 179, 8, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#facc15",
                flexShrink: 0,
              }}
            >
              <Lock size={20} />
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#facc15", fontFamily: "monospace" }}>
                🔒 CERTIFICATION ENGINE CURRENTLY LOCKED
              </div>
              <p style={{ fontSize: "12px", color: "var(--hp-text-muted)", marginTop: "2px", lineHeight: 1.5 }}>
                Official HpLabs Certification exams unlock upon reaching 15,000 XP and completing all 5 severity tiers of your target domain. Practice labs remain available.
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "48px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <Award size={13} style={{ color: "var(--hp-primary)" }} />
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "11px",
                  color: "var(--hp-primary)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Certifications & Credentials
              </span>
            </div>
            <h1
              style={{
                fontSize: "clamp(26px, 5vw, 44px)",
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: "12px",
                background: "linear-gradient(135deg, var(--hp-text) 0%, #bf5fff 55%, #00e5ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Your Credentials
            </h1>
            <p style={{ color: "var(--hp-text-muted)", fontSize: "14px", maxWidth: "560px", lineHeight: 1.7 }}>
              Track your HpLabs certifications, verify external credentials, and stay ahead of
              upcoming integrations that will auto-verify industry certifications.
            </p>
          </div>

          {/* ─── Section 1: HpLabs Internal ─────────────────── */}
          <div style={{ marginBottom: "56px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "24px",
              }}
            >
              <Shield size={16} style={{ color: "var(--hp-primary)" }} />
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--hp-text)",
                }}
              >
                HpLabs Internal Certifications
              </h2>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "linear-gradient(to right, var(--hp-primary), transparent)",
                  marginLeft: "8px",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {INTERNAL_CERTS.map((cert) => {
                const overallProgress = Math.round(
                  (cert.completedLabs / cert.totalLabs) * 100
                );
                const isLocked = cert.status === "locked";

                return (
                  <div
                    key={cert.id}
                    style={{
                      padding: "24px",
                      borderRadius: "14px",
                      border: `1px solid ${isLocked ? "var(--hp-border)" : cert.color + "33"}`,
                      backgroundColor: isLocked
                        ? "var(--hp-card-bg)"
                        : `${cert.color}06`,
                      position: "relative",
                      overflow: "hidden",
                      opacity: isLocked ? 0.65 : 1,
                    }}
                  >
                    {/* Glow accent */}
                    {!isLocked && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          width: "200px",
                          height: "200px",
                          borderRadius: "50%",
                          backgroundColor: cert.color,
                          opacity: 0.03,
                          transform: "translate(50%, -50%)",
                          pointerEvents: "none",
                        }}
                      />
                    )}

                    <div
                      style={{
                        display: "flex",
                        gap: "16px",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                      }}
                    >
                      {/* Icon + title */}
                      <div style={{ display: "flex", gap: "14px", flex: "1 1 300px" }}>
                        <div
                          style={{
                            width: "52px",
                            height: "52px",
                            borderRadius: "12px",
                            border: `1px solid ${cert.color}44`,
                            backgroundColor: `${cert.color}11`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "22px",
                            flexShrink: 0,
                          }}
                        >
                          {cert.icon}
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <h3
                              style={{
                                fontFamily: "monospace",
                                fontSize: "16px",
                                fontWeight: 800,
                                color: cert.color,
                              }}
                            >
                              {cert.name}
                            </h3>
                            {isLocked ? (
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  fontSize: "10px",
                                  color: "var(--hp-text-muted)",
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  border: "1px solid var(--hp-border)",
                                }}
                              >
                                <Lock size={9} />
                                Locked
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontSize: "10px",
                                  color: "var(--hp-primary)",
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  border: "1px solid var(--hp-primary)",
                                  backgroundColor: "var(--hp-primary)",
                                }}
                              >
                                In Progress
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--hp-text-muted)", marginTop: "2px" }}>
                            {cert.fullName}
                          </div>
                          <p
                            style={{
                              fontSize: "13px",
                              color: "var(--hp-text-muted)",
                              marginTop: "8px",
                              lineHeight: 1.6,
                              maxWidth: "500px",
                            }}
                          >
                            {cert.description}
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div style={{ flex: "0 0 160px", textAlign: "right" }}>
                        <div
                          style={{
                            fontFamily: "monospace",
                            fontSize: "28px",
                            fontWeight: 800,
                            color: isLocked ? "var(--hp-text-muted)" : cert.color,
                            lineHeight: 1,
                          }}
                        >
                          {overallProgress}%
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--hp-text-muted)", marginTop: "4px" }}>
                          {cert.completedLabs} / {cert.totalLabs} labs
                        </div>
                        {!isLocked && (
                          <div
                            style={{
                              marginTop: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              gap: "4px",
                            }}
                          >
                            <Zap size={11} style={{ color: "var(--hp-primary)" }} />
                            <span
                              style={{
                                fontFamily: "monospace",
                                fontSize: "11px",
                                color: "var(--hp-primary)",
                              }}
                            >
                              {cert.currentXP.toLocaleString()} XP
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Domain progress bars */}
                    <div style={{ marginTop: "20px" }}>
                      {cert.domains.map((domain) => {
                        const val = cert.progress[domain as keyof typeof cert.progress] ?? 0;
                        return (
                          <div
                            key={domain}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              marginBottom: "8px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "11px",
                                color: "var(--hp-text-muted)",
                                width: "150px",
                                flexShrink: 0,
                                fontFamily: "monospace",
                              }}
                            >
                              {domain}
                            </div>
                            <ProgressBar value={val} color={cert.color} />
                            <div
                              style={{
                                fontFamily: "monospace",
                                fontSize: "11px",
                                color: val === 100 ? cert.color : "var(--hp-text-muted)",
                                width: "36px",
                                textAlign: "right",
                                flexShrink: 0,
                              }}
                            >
                              {val}%
                            </div>
                            {val === 100 && (
                              <CheckCircle size={12} style={{ color: cert.color, flexShrink: 0 }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Section 2: External Certs ───────────────────── */}
          <div style={{ marginBottom: "56px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "24px",
              }}
            >
              <Globe size={16} style={{ color: "var(--hp-cyan)" }} />
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--hp-text)" }}>
                External Certifications
              </h2>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "linear-gradient(to right, rgba(0,229,255,0.2), transparent)",
                  marginLeft: "8px",
                }}
              />
            </div>

            <div
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(0,229,255,0.15)",
                backgroundColor: "rgba(0,229,255,0.04)",
                marginBottom: "20px",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
              }}
            >
              <Info size={14} style={{ color: "var(--hp-cyan)", flexShrink: 0, marginTop: "2px" }} />
              <p style={{ fontSize: "13px", color: "var(--hp-text-muted)", lineHeight: 1.6 }}>
                Manually verify your external certifications by entering your certificate ID below.
                Automatic API verification is coming soon — see Planned Integrations.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {EXTERNAL_CERTS.map((cert) => {
                const result = verifyResults[cert.id];
                return (
                  <div
                    key={cert.id}
                    style={{
                      padding: "20px",
                      borderRadius: "12px",
                      border: `1px solid ${result === "valid" ? cert.color + "44" : "var(--hp-border)"}`,
                      backgroundColor: result === "valid" ? `${cert.color}06` : "var(--hp-card-bg)",
                      transition: "all 0.3s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "14px",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                      }}
                    >
                      {/* Logo */}
                      <div
                        style={{
                          width: "46px",
                          height: "46px",
                          borderRadius: "10px",
                          border: `1px solid ${cert.color}44`,
                          backgroundColor: `${cert.color}11`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "20px",
                          flexShrink: 0,
                        }}
                      >
                        {cert.logo}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: "200px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                          <span
                            style={{
                              fontFamily: "monospace",
                              fontSize: "14px",
                              fontWeight: 800,
                              color: cert.color,
                            }}
                          >
                            {cert.name}
                          </span>
                          <span style={{ fontSize: "11px", color: "var(--hp-text-muted)" }}>— {cert.org}</span>
                          <span
                            style={{
                              fontSize: "10px",
                              color: cert.difficultyColor,
                              padding: "1px 7px",
                              borderRadius: "4px",
                              border: `1px solid ${cert.difficultyColor}44`,
                              backgroundColor: `${cert.difficultyColor}11`,
                            }}
                          >
                            {cert.difficulty}
                          </span>
                          <span style={{ fontSize: "10px", color: "var(--hp-text-muted)", marginLeft: "auto" }}>
                            {cert.cost}
                          </span>
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--hp-text-muted)", marginBottom: "6px" }}>
                          {cert.fullName}
                        </div>
                        <p style={{ fontSize: "12px", color: "var(--hp-text-muted)", lineHeight: 1.6 }}>
                          {cert.description}
                        </p>
                      </div>

                      {/* Verify */}
                      <div style={{ flex: "0 0 260px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "var(--hp-text-muted)",
                            fontFamily: "monospace",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                          }}
                        >
                          Verify Certificate ID
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <input
                            type="text"
                            placeholder={`${cert.id}-XXXXXXXX`}
                            value={verifyInputs[cert.id] ?? ""}
                            onChange={(e) =>
                              setVerifyInputs((prev) => ({ ...prev, [cert.id]: e.target.value }))
                            }
                            style={{
                              flex: 1,
                              padding: "7px 10px",
                              borderRadius: "6px",
                              border: `1px solid ${
                                result === "valid"
                                  ? cert.color
                                  : result === "invalid"
                                  ? "#f87171"
                                  : "var(--hp-border)"
                              }`,
                              backgroundColor: "var(--hp-bg-3)",
                              color: "var(--hp-text)",
                              fontSize: "12px",
                              fontFamily: "monospace",
                              outline: "none",
                            }}
                          />
                          <button
                            onClick={() => handleVerify(cert.id)}
                            style={{
                              padding: "7px 14px",
                              borderRadius: "6px",
                              border: `1px solid ${cert.color}55`,
                              backgroundColor: `${cert.color}11`,
                              color: cert.color,
                              fontSize: "12px",
                              cursor: "pointer",
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                              transition: "all 0.2s",
                            }}
                          >
                            Verify
                          </button>
                        </div>
                        {result === "valid" && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              fontSize: "12px",
                              color: cert.color,
                            }}
                          >
                            <CheckCircle size={12} />
                            Certificate verified successfully!
                          </div>
                        )}
                        {result === "invalid" && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              fontSize: "12px",
                              color: "#f87171",
                            }}
                          >
                            <AlertTriangle size={12} />
                            Invalid certificate ID. Check and retry.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Section 3: Planned Integrations ─────────────── */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "24px",
              }}
            >
              <TrendingUp size={16} style={{ color: "#a78bfa" }} />
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--hp-text)" }}>
                Planned Integrations
              </h2>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "linear-gradient(to right, rgba(167,139,250,0.2), transparent)",
                  marginLeft: "8px",
                }}
              />
              <span
                style={{
                  fontSize: "10px",
                  color: "#a78bfa",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  border: "1px solid rgba(167,139,250,0.3)",
                  backgroundColor: "rgba(167,139,250,0.08)",
                  whiteSpace: "nowrap",
                }}
              >
                Coming Soon
              </span>
            </div>

            <p
              style={{
                fontSize: "13px",
                color: "var(--hp-text-muted)",
                marginBottom: "20px",
                lineHeight: 1.7,
                maxWidth: "600px",
              }}
            >
              These upcoming integrations will automatically verify and display your industry
              certifications — no manual entry required. Connect your accounts once and your
              credentials will always stay up to date.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "16px",
              }}
            >
              {PLANNED_INTEGRATIONS.map((integration) => (
                <div
                  key={integration.name}
                  style={{
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid var(--hp-border)",
                    backgroundColor: "var(--hp-card-bg)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Corner decoration */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "60px",
                      height: "60px",
                      borderBottom: `1px solid ${integration.color}22`,
                      borderLeft: `1px solid ${integration.color}22`,
                      borderBottomLeftRadius: "12px",
                    }}
                  />

                  {/* Coming soon tag */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "10px",
                      color: "#a78bfa",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      border: "1px solid rgba(167,139,250,0.3)",
                      backgroundColor: "rgba(167,139,250,0.08)",
                      marginBottom: "12px",
                    }}
                  >
                    <Star size={9} />
                    ETA {integration.eta}
                  </div>

                  <h3
                    style={{
                      fontFamily: "monospace",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: integration.color,
                      marginBottom: "4px",
                    }}
                  >
                    {integration.name}
                  </h3>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--hp-text-muted)",
                      marginBottom: "10px",
                    }}
                  >
                    {integration.org}
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--hp-text-muted)", lineHeight: 1.6 }}>
                    {integration.description}
                  </p>

                  <div
                    style={{
                      marginTop: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      color: "var(--hp-text-muted)",
                    }}
                  >
                    <BookOpen size={12} />
                    Notify me when available
                    <ChevronRight size={12} style={{ marginLeft: "auto" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
