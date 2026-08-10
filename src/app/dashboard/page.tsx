"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Target, Shield, Search, BookOpen, Cloud, Globe,
  Lock, ChevronRight, Zap, Trophy, Flame, TrendingUp,
  Terminal, Star, ArrowRight, Bell,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import { getRank, getNextRank } from "@/lib/data/types";
import { ALL_WEB_LABS, ALL_API_LABS } from "@/lib/data/redteam";

const DOMAIN_CATEGORIES = [
  {
    id: "red-team",
    name: "Red Team",
    icon: "🎯",
    description: "Pentesting, Exploit Dev, Red Team Ops, Reverse Engineering, Social Engineering",
    status: "available" as const,
    href: "/red-team",
    subCount: "15+ domains",
    labCount: `${ALL_WEB_LABS.length + ALL_API_LABS.length}+ labs`,
    color: "#bf5fff",
    glow: "rgba(191,95,255,0.12)",
    border: "rgba(191,95,255,0.25)",
  },
  {
    id: "blue-team",
    name: "Blue Team",
    icon: "🛡️",
    description: "SOC Analysis, Threat Hunting, Incident Response, SIEM, Log Analysis",
    status: "coming_soon" as const,
    href: "#",
    subCount: "10+ domains",
    labCount: "200+ labs",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.15)",
  },
  {
    id: "forensics",
    name: "Forensics & DFIR",
    icon: "🔬",
    description: "Digital Forensics, Malware Analysis, Memory Forensics, Network Forensics",
    status: "coming_soon" as const,
    href: "#",
    subCount: "8+ domains",
    labCount: "150+ labs",
    color: "#34d399",
    glow: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.15)",
  },
  {
    id: "grc",
    name: "GRC & Compliance",
    icon: "📋",
    description: "ISO 27001, NIST CSF, SOC 2, GDPR, PCI-DSS, Risk Management",
    status: "coming_soon" as const,
    href: "#",
    subCount: "6+ domains",
    labCount: "100+ labs",
    color: "#fbbf24",
    glow: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.15)",
  },
  {
    id: "threat-intel",
    name: "Threat Intelligence",
    icon: "🕵️",
    description: "OSINT, CTI, Dark Web Monitoring, Threat Actor Profiling, IOC Analysis",
    status: "coming_soon" as const,
    href: "#",
    subCount: "5+ domains",
    labCount: "80+ labs",
    color: "#f97316",
    glow: "rgba(249,115,22,0.08)",
    border: "rgba(249,115,22,0.15)",
  },
  {
    id: "cloud-security",
    name: "Cloud Security",
    icon: "☁️",
    description: "AWS, GCP, Azure misconfigurations, IAM, S3, Serverless, Container security",
    status: "coming_soon" as const,
    href: "#",
    subCount: "3 platforms",
    labCount: "120+ labs",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.15)",
  },
  {
    id: "architecture",
    name: "Security Architecture",
    icon: "🏗️",
    description: "Zero Trust, Security Design Patterns, Threat Modeling, Defense in Depth",
    status: "coming_soon" as const,
    href: "#",
    subCount: "4+ domains",
    labCount: "60+ labs",
    color: "#e040fb",
    glow: "rgba(224,64,251,0.08)",
    border: "rgba(224,64,251,0.15)",
  },
  {
    id: "privacy",
    name: "Privacy Engineering",
    icon: "🔐",
    description: "GDPR Compliance, Privacy by Design, Data Protection, Anonymization Techniques",
    status: "coming_soon" as const,
    href: "#",
    subCount: "3+ domains",
    labCount: "50+ labs",
    color: "#fb7185",
    glow: "rgba(251,113,133,0.08)",
    border: "rgba(251,113,133,0.15)",
  },
];

const RECENT_NOTIFICATIONS = [
  { id: 1, text: "New lab added: Log4Shell (CVE-2021-44228) — Critical", time: "2h ago", type: "new" },
  { id: 2, text: "Web Pentesting — Medium tier unlocks at 2,000 XP", time: "1d ago", type: "info" },
  { id: 3, text: "Blue Team module launching Q2 2026", time: "3d ago", type: "announce" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#06030c] flex items-center justify-center">
        <div className="text-[#bf5fff] font-mono text-sm animate-pulse">Initializing...</div>
      </div>
    );
  }

  const rank = getRank(user.xp);
  const nextRank = getNextRank(user.xp);
  const xpToNext = nextRank.minXP - user.xp;
  const rankProgress = Math.min(
    ((user.xp - rank.minXP) / (nextRank.minXP - rank.minXP)) * 100,
    100
  );

  return (
    <div className="min-h-screen bg-[#06030c]">
      <Navbar />
      <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">

        {/* Welcome banner */}
        <div className="mb-8 relative overflow-hidden rounded-2xl border border-[rgba(191,95,255,0.15)] bg-[rgba(17,8,32,0.6)]">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 80% at 100% 50%, rgba(191,95,255,0.06), transparent)" }} />
          <div className="p-6 relative">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs font-mono text-gray-500 mb-1">Welcome back, Hacker</p>
                <h1 className="text-2xl font-bold text-white">
                  <span className="text-[#bf5fff]">{user.username}</span>
                  <span className="text-gray-500 text-lg ml-2">#{user.id.slice(-4)}</span>
                </h1>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className={`text-sm font-semibold ${rank.color}`}>{rank.icon} {rank.rank}</span>
                  <span className="text-gray-600 text-xs">•</span>
                  <span className="text-xs text-gray-500 font-mono">{user.xp.toLocaleString()} XP</span>
                  <span className="text-gray-600 text-xs">•</span>
                  <span className="text-xs text-gray-500">Joined {user.joinedAt}</span>
                </div>
                {/* XP Progress bar */}
                <div className="mt-3 w-64 max-w-full">
                  <div className="flex justify-between text-[10px] font-mono text-gray-600 mb-1">
                    <span>{rank.rank}</span>
                    <span>{xpToNext > 0 ? `${xpToNext.toLocaleString()} XP to ${nextRank.rank}` : "Max Rank"}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${rankProgress}%`, background: "linear-gradient(90deg, #7c3aed, #bf5fff, #e040fb)" }} />
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex gap-3 flex-wrap">
                {[
                  { label: "XP", value: user.xp.toLocaleString(), icon: Zap, color: "#bf5fff" },
                  { label: "Labs Done", value: user.completedLabs.length, icon: Trophy, color: "#e040fb" },
                  { label: "Streak", value: "7d", icon: Flame, color: "#f97316" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="text-center px-4 py-3 rounded-xl border border-[rgba(255,255,255,0.05)] bg-white/[0.02]">
                    <Icon size={14} style={{ color }} className="mx-auto mb-1" />
                    <div className="text-base font-black text-white">{value}</div>
                    <div className="text-[10px] font-mono" style={{ color }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main: Domain cards */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Target size={14} className="text-[#bf5fff]" />
                Security Domains
              </h2>
              <span className="text-[10px] font-mono text-gray-600">{DOMAIN_CATEGORIES.filter(d => d.status === "available").length} available · {DOMAIN_CATEGORIES.filter(d => d.status === "coming_soon").length} coming soon</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DOMAIN_CATEGORIES.map((cat) => (
                <DomainCard key={cat.id} cat={cat} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Notifications */}
            <div className="lab-card rounded-2xl p-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                <Bell size={13} className="text-[#00e5ff]" />
                Notifications
              </h2>
              <div className="space-y-2.5">
                {RECENT_NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-[#bf5fff]" />
                    <div>
                      <div className="text-[11px] text-gray-300 leading-snug">{n.text}</div>
                      <div className="text-[9px] text-gray-700 mt-0.5">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Access */}
            <div className="lab-card rounded-2xl p-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                <Terminal size={13} className="text-[#bf5fff]" />
                Quick Access
              </h2>
              <div className="space-y-1.5">
                {[
                  { label: "Web Pentesting", href: "/red-team/pentesting/web", emoji: "🌐" },
                  { label: "API Pentesting", href: "/red-team/pentesting/api", emoji: "🔌" },
                  { label: "Timeline 1970–2026", href: "/timeline", emoji: "📅" },
                  { label: "Leaderboard", href: "/leaderboard", emoji: "🏆" },
                  { label: "Certifications", href: "/certifications", emoji: "🎓" },
                ].map(({ label, href, emoji }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/5 hover:border-[rgba(191,95,255,0.2)] hover:bg-[rgba(191,95,255,0.03)] transition-all group"
                  >
                    <span className="text-sm">{emoji}</span>
                    <span className="text-xs text-gray-400 group-hover:text-[#bf5fff] transition-colors flex-1">{label}</span>
                    <ChevronRight size={11} className="text-gray-700 group-hover:text-[#bf5fff] transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Progress overview */}
            <div className="lab-card rounded-2xl p-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                <TrendingUp size={13} className="text-purple-400" />
                Your Progress
              </h2>
              <div className="space-y-2">
                {[
                  { label: "Web — Information", key: "web-information", total: ALL_WEB_LABS.filter(l => l.severity === "information").length },
                  { label: "Web — Low", key: "web-low", total: ALL_WEB_LABS.filter(l => l.severity === "low").length },
                  { label: "Web — Medium", key: "web-medium", total: ALL_WEB_LABS.filter(l => l.severity === "medium").length },
                  { label: "API — Information", key: "api-information", total: 5 },
                ].map(({ label, key, total }) => {
                  const done = (user.completedLevels[key] || []).length;
                  const pct = total > 0 ? (done / total) * 100 : 0;
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-[10px] font-mono mb-0.5">
                        <span className="text-gray-500">{label}</span>
                        <span className="text-gray-600">{done}/{total}</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #7c3aed, #bf5fff)" }} />
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
      className={`h-full p-4 rounded-xl border transition-all duration-200 ${
        isAvailable
          ? "cursor-pointer hover:-translate-y-0.5 group"
          : "cursor-not-allowed opacity-60"
      }`}
      style={{
        borderColor: cat.border,
        background: `linear-gradient(135deg, ${cat.glow}, rgba(12,6,20,0.8))`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{cat.icon}</span>
          <div>
            <div className="text-sm font-semibold text-white">{cat.name}</div>
            <div className="text-[10px] font-mono" style={{ color: cat.color }}>{cat.subCount}</div>
          </div>
        </div>
        {isAvailable ? (
          <ArrowRight size={14} className="text-gray-600 group-hover:text-[#bf5fff] transition-colors mt-0.5" />
        ) : (
          <Lock size={12} className="text-gray-700 mt-0.5" />
        )}
      </div>

      <p className="text-[11px] text-gray-500 leading-relaxed mb-3">{cat.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-gray-600">{cat.labCount}</span>
        {isAvailable ? (
          <span
            className="text-[9px] font-mono px-2 py-0.5 rounded-full border"
            style={{ color: cat.color, borderColor: cat.border, background: cat.glow }}
          >
            AVAILABLE
          </span>
        ) : (
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-white/10 text-gray-600 bg-white/5">
            COMING SOON
          </span>
        )}
      </div>
    </div>
  );

  return isAvailable ? (
    <Link href={cat.href} className="block h-full">{inner}</Link>
  ) : (
    <div className="h-full">{inner}</div>
  );
}
