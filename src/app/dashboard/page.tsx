"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Target, Lock, ChevronRight, Zap, Trophy, Flame, TrendingUp,
  Terminal, ArrowRight, Bell,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import { getRank, getNextRank } from "@/lib/data/types";
import { ALL_WEB_LABS, ALL_API_LABS } from "@/lib/data/redteam";

const DOMAIN_CATEGORIES = [
  { id: "red-team", name: "Red Team", icon: "🎯", description: "Pentesting, Exploit Dev, Red Team Ops, Reverse Engineering, Social Engineering", status: "available" as const, href: "/red-team", subCount: "15+ domains", labCount: `${ALL_WEB_LABS.length + ALL_API_LABS.length}+ labs`, color: "var(--hp-primary)", glow: "rgba(191,95,255,0.06)", border: "rgba(191,95,255,0.25)" },
  { id: "blue-team", name: "Blue Team", icon: "🛡️", description: "SOC Analysis, Threat Hunting, Incident Response, SIEM, Log Analysis", status: "coming_soon" as const, href: "#", subCount: "10+ domains", labCount: "200+ labs", color: "#60a5fa", glow: "rgba(96,165,250,0.06)", border: "rgba(96,165,250,0.2)" },
  { id: "forensics", name: "Forensics & DFIR", icon: "🔬", description: "Digital Forensics, Malware Analysis, Memory Forensics, Network Forensics", status: "coming_soon" as const, href: "#", subCount: "8+ domains", labCount: "150+ labs", color: "#34d399", glow: "rgba(52,211,153,0.06)", border: "rgba(52,211,153,0.2)" },
  { id: "grc", name: "GRC & Compliance", icon: "📋", description: "ISO 27001, NIST CSF, SOC 2, GDPR, PCI-DSS", status: "coming_soon" as const, href: "#", subCount: "6+ domains", labCount: "100+ labs", color: "#fbbf24", glow: "rgba(251,191,36,0.06)", border: "rgba(251,191,36,0.2)" },
  { id: "threat-intel", name: "Threat Intelligence", icon: "🕵️", description: "OSINT, CTI, Dark Web Monitoring, Threat Actor Profiling", status: "coming_soon" as const, href: "#", subCount: "5+ domains", labCount: "80+ labs", color: "#f97316", glow: "rgba(249,115,22,0.06)", border: "rgba(249,115,22,0.2)" },
  { id: "cloud-security", name: "Cloud Security", icon: "☁️", description: "AWS, GCP, Azure misconfigurations, IAM, S3, Serverless", status: "coming_soon" as const, href: "#", subCount: "3 platforms", labCount: "120+ labs", color: "#a78bfa", glow: "rgba(167,139,250,0.06)", border: "rgba(167,139,250,0.2)" },
];

const RECENT_NOTIFICATIONS = [
  { id: 1, text: "New lab added: Log4Shell (CVE-2021-44228) — Critical", time: "2h ago" },
  { id: 2, text: "Web Pentesting — Medium tier unlocks at 2,000 XP", time: "1d ago" },
  { id: 3, text: "Blue Team module launching Q2 2026", time: "3d ago" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[var(--hp-bg)] flex items-center justify-center">
        <div className="text-[var(--hp-primary)] font-mono text-sm animate-pulse">Initializing...</div>
      </div>
    );
  }

  const rank = getRank(user.xp);
  const nextRank = getNextRank(user.xp);
  const xpToNext = nextRank.minXP - user.xp;
  const rankProgress = Math.min(((user.xp - rank.minXP) / (nextRank.minXP - rank.minXP)) * 100, 100);

  return (
    <div className="min-h-screen bg-[var(--hp-bg)]" suppressHydrationWarning>
      <Navbar />
      <div className="pt-24 pb-20 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="mb-8 relative overflow-hidden rounded-2xl border border-[var(--hp-primary)] bg-[var(--hp-card-bg)]">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 80% at 100% 50%, rgba(191,95,255,0.08), transparent)" }} />
          <div className="p-6 relative">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs font-mono text-[var(--hp-text-muted)] mb-1">Welcome back, Hacker</p>
                <h1 className="text-2xl font-bold text-[var(--hp-text)]">
                  <span className="text-[var(--hp-primary)]">{user.username}</span>
                  <span className="text-[var(--hp-text-muted)] text-lg ml-2">#{user.id.slice(-4)}</span>
                </h1>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className={`text-sm font-semibold ${rank.color}`}>{rank.icon} {rank.rank}</span>
                  <span className="text-[var(--hp-text-muted)] opacity-50 text-xs">•</span>
                  <span className="text-xs text-[var(--hp-text-muted)] font-mono">{user.xp.toLocaleString()} XP</span>
                </div>
                <div className="mt-3 w-64 max-w-full">
                  <div className="flex justify-between text-[10px] font-mono text-[var(--hp-text-muted)] mb-1">
                    <span>{rank.rank}</span>
                    <span>{xpToNext > 0 ? `${xpToNext.toLocaleString()} XP to ${nextRank.rank}` : "Max Rank"}</span>
                  </div>
                  <div className="h-1.5 bg-[var(--hp-border)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${rankProgress}%`, background: "linear-gradient(90deg, var(--hp-primary-dim), var(--hp-primary), var(--hp-secondary))" }} />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                {[
                  { label: "XP", value: user.xp.toLocaleString(), icon: Zap, color: "var(--hp-primary)" },
                  { label: "Labs Done", value: user.completedLabs.length, icon: Trophy, color: "var(--hp-secondary)" },
                  { label: "Streak", value: `${user.loginStreak || 1}d`, icon: Flame, color: "#f97316" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="text-center px-4 py-3 rounded-xl border border-[var(--hp-border)] bg-[var(--hp-bg-3)]">
                    <Icon size={14} style={{ color }} className="mx-auto mb-1" />
                    <div className="text-base font-black text-[var(--hp-text)]">{value}</div>
                    <div className="text-[10px] font-mono" style={{ color }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[var(--hp-text)] flex items-center gap-2">
                <Target size={14} className="text-[var(--hp-primary)]" />
                Security Domains
              </h2>
              <span className="text-[10px] font-mono text-[var(--hp-text-muted)]">
                {DOMAIN_CATEGORIES.filter(d => d.status === "available").length} available · {DOMAIN_CATEGORIES.filter(d => d.status === "coming_soon").length} coming soon
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DOMAIN_CATEGORIES.map((cat) => (
                <DomainCard key={cat.id} cat={cat} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="lab-card rounded-2xl p-4">
              <h2 className="text-sm font-semibold text-[var(--hp-text)] flex items-center gap-2 mb-3">
                <Bell size={13} className="text-[#00e5ff]" />
                Notifications
              </h2>
              <div className="space-y-2.5">
                {RECENT_NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-[var(--hp-primary)]" />
                    <div>
                      <div className="text-[11px] text-[var(--hp-text)] leading-snug">{n.text}</div>
                      <div className="text-[9px] text-[var(--hp-text-muted)] mt-0.5">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lab-card rounded-2xl p-4">
              <h2 className="text-sm font-semibold text-[var(--hp-text)] flex items-center gap-2 mb-3">
                <Terminal size={13} className="text-[var(--hp-primary)]" />
                Quick Access
              </h2>
              <div className="space-y-1.5">
                {[
                  { label: "Web Pentesting", href: "/red-team/pentesting/web", emoji: "🌐" },
                  { label: "API Pentesting", href: "/red-team/pentesting/api", emoji: "🔌" },
                  { label: "Timeline 1947–Present", href: "/timeline", emoji: "📅" },
                  { label: "Leaderboard", href: "/leaderboard", emoji: "🏆" },
                  { label: "Certifications", href: "/certifications", emoji: "🎓" },
                ].map(({ label, href, emoji }) => (
                  <Link key={href} href={href} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--hp-border)] hover:border-[var(--hp-border-hover)] hover:bg-[var(--hp-primary)]/5 transition-all group">
                    <span className="text-sm">{emoji}</span>
                    <span className="text-xs text-[var(--hp-text-muted)] group-hover:text-[var(--hp-text)] transition-colors flex-1">{label}</span>
                    <ChevronRight size={11} className="text-[var(--hp-text-muted)] group-hover:text-[var(--hp-primary)] transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="lab-card rounded-2xl p-4">
              <h2 className="text-sm font-semibold text-[var(--hp-text)] flex items-center gap-2 mb-3">
                <TrendingUp size={13} className="text-purple-400" />
                Your Progress
              </h2>
              <div className="space-y-2">
                {[
                  { label: "Web — Information", key: "web-information", total: ALL_WEB_LABS.filter(l => l.severity === "information").length },
                  { label: "Web — Low", key: "web-low", total: ALL_WEB_LABS.filter(l => l.severity === "low").length },
                  { label: "Web — Medium", key: "web-medium", total: ALL_WEB_LABS.filter(l => l.severity === "medium").length },
                  { label: "API — Information", key: "api-information", total: ALL_API_LABS.filter(l => l.severity === "information").length },
                ].map(({ label, key, total }) => {
                  const done = (user.completedLevels[key] || []).length;
                  const pct = total > 0 ? (done / total) * 100 : 0;
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-[10px] font-mono mb-0.5">
                        <span className="text-[var(--hp-text-muted)]">{label}</span>
                        <span className="text-[var(--hp-text)]">{done}/{total}</span>
                      </div>
                      <div className="h-1 bg-[var(--hp-border)] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: "linear-gradient(90deg, var(--hp-primary-dim), var(--hp-primary))" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DomainCard({ cat }: { cat: typeof DOMAIN_CATEGORIES[0] }) {
  const isAvailable = cat.status === "available";
  const inner = (
    <div
      className={`h-full p-4 rounded-xl border transition-all duration-200 ${isAvailable ? "cursor-pointer hover:-translate-y-0.5 group" : "cursor-not-allowed opacity-60"}`}
      style={{ borderColor: cat.border, background: `linear-gradient(135deg, ${cat.glow}, var(--hp-card-bg))` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{cat.icon}</span>
          <div>
            <div className="text-sm font-semibold text-[var(--hp-text)]">{cat.name}</div>
            <div className="text-[10px] font-mono" style={{ color: cat.color }}>{cat.subCount}</div>
          </div>
        </div>
        {isAvailable ? (
          <ArrowRight size={14} className="text-[var(--hp-text-muted)] group-hover:text-[var(--hp-primary)] transition-colors mt-0.5" />
        ) : (
          <Lock size={12} className="text-[var(--hp-text-muted)] opacity-50 mt-0.5" />
        )}
      </div>
      <p className="text-[11px] text-[var(--hp-text-muted)] leading-relaxed mb-3">{cat.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-[var(--hp-text-muted)]">{cat.labCount}</span>
        {isAvailable ? (
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border" style={{ color: cat.color, borderColor: cat.border, background: cat.glow }}>AVAILABLE</span>
        ) : (
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-[var(--hp-border)] text-[var(--hp-text-muted)] bg-[var(--hp-bg-3)]">COMING SOON</span>
        )}
      </div>
    </div>
  );
  return isAvailable ? <Link href={cat.href} className="block h-full">{inner}</Link> : <div className="h-full">{inner}</div>;
}
