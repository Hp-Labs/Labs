"use client";


import Link from "next/link";
import {
  User,
  Zap,
  Target,
  Trophy,
  Shield,
  Calendar,
  CheckCircle,
  BarChart2,
  Award,
  Globe,
  AtSign,
  Link2,
  Star,
  TrendingUp,
} from "lucide-react";
import { VULNERABILITIES, XP_TO_RANK } from "@/lib/data/vulnerabilities";
import Navbar from "@/components/Navbar";
import { useAuth, getUserBadgesAndRank } from "@/lib/auth";

const USER = {
  username: "h4cker_v1j4y",
  displayName: "Vijay",
  bio: "Red teamer in progress. Learning every vulnerability since 1970. HackerPlus community member.",
  joinedDate: "2026-01-10",
  country: "India 🇮🇳",
  xp: 2450,
  globalRank: 6,
  completedLabs: ["SYS-1971-001", "SYS-1972-001"],
  streakDays: 7,
  totalDays: 28,
  links: {
    website: "https://hackerplus.in",
    twitter: "@vijay_hacks",
    linkedin: "vijay-hacker",
  },
  certs: [
    { name: "CEH v12", provider: "EC-Council", date: "2026-01-15", xp: 1000 },
  ],
};

const completedVulns = VULNERABILITIES.filter((v) =>
  USER.completedLabs.includes(v.id)
);

const CURRENT_RANK = XP_TO_RANK.reduce(
  (acc, r) => (USER.xp >= r.minXP ? r : acc),
  XP_TO_RANK[0]
);
const NEXT_RANK = XP_TO_RANK[XP_TO_RANK.indexOf(CURRENT_RANK) + 1] || CURRENT_RANK;
const xpProgress = Math.min(
  ((USER.xp - CURRENT_RANK.minXP) / (NEXT_RANK.minXP - CURRENT_RANK.minXP)) * 100,
  100
);

// Activity heatmap mock data (last 28 days) — deterministic to avoid hydration mismatch
const ACTIVITY = Array.from({ length: 28 }, (_, i) => {
  const s1 = Math.abs(Math.sin(i * 17.3 + 1) * 10000) % 1;
  const s2 = Math.abs(Math.sin(i * 31.7 + 2) * 10000) % 1;
  return { day: i, count: s1 > 0.6 ? Math.floor(s2 * 3) + 1 : 0 };
});

export default function ProfilePage() {
  const { user, claimDailyBonus, dismissStreakNotice } = useAuth();
  const username = user?.username ?? USER.username;
  const xp = user?.xp ?? USER.xp;
  const streak = user?.loginStreak ?? USER.streakDays;
  const { primaryTag, rankColor, badgeList } = getUserBadgesAndRank(user ?? {
    id: "demo", username, email: "", phone: "", xp, completedLabs: USER.completedLabs, completedLevels: {}, joinedAt: USER.joinedDate, loginStreak: streak, lastLoginDate: "", badges: [], certifications: []
  });

  return (
    <div className="min-h-screen bg-[var(--hp-bg)]" suppressHydrationWarning>
      <Navbar />

      <div className="pt-24 pb-20 px-6 lg:px-12 max-w-[1440px] mx-auto">
        {/* Streak Penalty Warning Notice (if applicable) */}
        {user?.streakPenaltyNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <p className="text-xs text-red-300 font-mono leading-relaxed">{user.streakPenaltyNotice}</p>
            </div>
            <button
              onClick={dismissStreakNotice}
              className="px-3 py-1 text-xs font-mono text-[var(--hp-text)] bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-lg"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Profile card */}
          <div className="space-y-5">

            {/* Avatar + basic info */}
            <div className="lab-card rounded-2xl p-6 text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--hp-primary)] to-[var(--hp-cyan)] flex items-center justify-center mx-auto">
                  <span className="font-mono text-3xl font-black text-black">
                    {username[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[var(--hp-primary)] border-2 border-[#06030c] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-black" />
                </div>
              </div>

              <h1 className="text-xl font-bold text-[var(--hp-text)] mb-0.5">{username}</h1>
              <p className="font-mono text-sm text-[var(--hp-primary)] mb-1">@{username}</p>
              <p className="text-xs text-[var(--hp-text-muted)] mb-3">{USER.country}</p>

              {/* Primary Rank Tag Badge */}
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border font-mono text-xs font-bold ${rankColor} mb-4`}>
                <span>{primaryTag}</span>
              </div>

              {/* Badges List */}
              <div className="mb-4">
                <p className="text-[10px] font-mono text-[var(--hp-text-muted)] uppercase mb-2">Unlocked Badges & Titles</p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {badgeList.map((b: { name: string; icon: string; color: string }) => (
                    <span key={b.name} className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] ${b.color}`}>
                      {b.icon} {b.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Daily Claim Bonus CTA */}
              <button
                onClick={() => {
                  const res = claimDailyBonus();
                  alert(res.message);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-yellow-500/40 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <span>🎁 Claim Daily +100 XP Bonus</span>
              </button>
            </div>

            {/* Stats */}
            <div className="lab-card rounded-2xl p-5">
              <h3 className="text-xs font-mono text-[var(--hp-text-muted)] uppercase mb-4">Stats</h3>
              <div className="space-y-3">
                {[
                  { icon: Zap, label: "Total XP", value: xp.toLocaleString(), color: "text-[var(--hp-primary)]" },
                  { icon: Target, label: "Labs Done", value: `${user?.completedLabs?.length ?? USER.completedLabs.length}`, color: "text-[#00e5ff]" },
                  { icon: Trophy, label: "Global Rank", value: `#${USER.globalRank}`, color: "text-yellow-400" },
                  { icon: BarChart2, label: "Day Streak", value: `🔥 ${streak}d`, color: "text-orange-400" },
                  { icon: Calendar, label: "Member Since", value: user?.joinedAt ?? USER.joinedDate, color: "text-[var(--hp-text-muted)]" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon size={12} className="text-[var(--hp-text-muted)]" />
                      <span className="text-xs text-[var(--hp-text-muted)]">{label}</span>
                    </div>
                    <span className={`font-mono text-xs font-bold ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="lab-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-mono text-[var(--hp-text-muted)] uppercase flex items-center gap-2">
                  <Shield size={11} />
                  Certifications
                </h3>
                <Link href="/certifications" className="text-[10px] text-[var(--hp-primary)] hover:opacity-80">
                  + Add
                </Link>
              </div>
              {USER.certs.length === 0 ? (
                <p className="text-xs text-[var(--hp-text-muted)] text-center py-3">No certs linked yet</p>
              ) : (
                <div className="space-y-2">
                  {USER.certs.map((cert) => (
                    <div key={cert.name}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-[var(--hp-primary)] bg-[var(--hp-primary)]/10">
                      <Award size={14} className="text-[var(--hp-primary)] shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium text-[var(--hp-text)]">{cert.name}</span>
                          <span className="badge-active text-[8px] font-mono px-1 py-0.5 rounded-full">✓</span>
                        </div>
                        <span className="text-[10px] text-[var(--hp-text-muted)]">{cert.provider}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-[var(--hp-primary)]">
                        <Zap size={9} />
                        <span className="font-mono text-[10px]">+{cert.xp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* XP Progress */}
            <div className="lab-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[var(--hp-text)] text-sm flex items-center gap-2">
                  <TrendingUp size={14} className="text-[var(--hp-primary)]" />
                  XP Progression
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{CURRENT_RANK.icon}</span>
                  <div className="text-right">
                    <div className="font-mono text-xs text-[var(--hp-primary)] font-bold">{USER.xp} XP</div>
                    <div className="text-[10px] text-[var(--hp-text-muted)]">
                      {NEXT_RANK.minXP - USER.xp} to {NEXT_RANK.icon} {NEXT_RANK.rank}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bar */}
              <div className="h-2.5 bg-[var(--hp-border)] rounded-full overflow-hidden mb-4">
                <div className="xp-bar h-full rounded-full" style={{ width: `${xpProgress}%` }} />
              </div>

              {/* All ranks */}
              <div className="flex items-center justify-between">
                {XP_TO_RANK.map((r) => (
                  <div key={r.rank} className="flex flex-col items-center gap-1">
                    <span className={`text-base ${USER.xp >= r.minXP ? "opacity-100" : "opacity-20"}`}>
                      {r.icon}
                    </span>
                    <span className={`text-[9px] font-mono ${USER.xp >= r.minXP ? "text-[var(--hp-primary)]" : "text-[var(--hp-text-muted)] opacity-70"}`}>
                      {r.rank.split(" ")[0]}
                    </span>
                    <span className={`text-[8px] font-mono ${USER.xp >= r.minXP ? "text-[var(--hp-text-muted)]" : "text-[var(--hp-text-muted)] opacity-40"}`}>
                      {r.minXP >= 1000 ? `${r.minXP / 1000}k` : r.minXP}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Domain XP breakdown */}
            <div className="lab-card rounded-2xl p-6">
              <h2 className="font-semibold text-[var(--hp-text)] text-sm mb-5 flex items-center gap-2">
                <Star size={14} className="text-yellow-400" />
                Domain XP Breakdown
              </h2>
              <div className="space-y-3">
                {[
                  { domain: "Web Pentesting", xp: 1800, total: 5000, color: "var(--hp-primary)" },
                  { domain: "Network Pentesting", xp: 650, total: 4000, color: "var(--hp-cyan)" },
                  { domain: "API Security", xp: 0, total: 3000, color: "#7c3aed", locked: true },
                  { domain: "Cloud Security", xp: 0, total: 3500, color: "#ff6b00", locked: true },
                  { domain: "SOC & Blue Team", xp: 0, total: 4500, color: "#ff2d2d", locked: true },
                ].map(({ domain, xp, total, color, locked }) => (
                  <div key={domain}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--hp-text-muted)]">{domain}</span>
                        {locked && (
                          <span className="badge-upcoming text-[8px] font-mono px-1.5 py-0.5 rounded-full">SOON</span>
                        )}
                      </div>
                      <span className="font-mono text-[11px]" style={{ color: locked ? "rgba(255,255,255,0.2)" : color }}>
                        {xp} XP
                      </span>
                    </div>
                    <div className="h-1.5 bg-[var(--hp-border)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(xp / total) * 100}%`,
                          background: locked ? "var(--hp-border)" : `linear-gradient(90deg, ${color}, ${color}99)`,
                          boxShadow: locked ? "none" : `0 0 8px ${color}40`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity heatmap */}
            <div className="lab-card rounded-2xl p-6">
              <h2 className="font-semibold text-[var(--hp-text)] text-sm mb-5 flex items-center gap-2">
                <BarChart2 size={14} className="text-[#00e5ff]" />
                Lab Activity (Last 28 Days)
              </h2>
              <div className="flex items-end gap-1 flex-wrap">
                {ACTIVITY.map(({ day, count }) => (
                  <div
                    key={day}
                    title={`Day ${day + 1}: ${count} lab${count !== 1 ? "s" : ""}`}
                    className="w-6 h-6 rounded-sm cursor-pointer transition-all hover:scale-110"
                    style={{
                      backgroundColor:
                        count === 0
                          ? "var(--hp-bg-3)"
                          : "var(--hp-primary)",
                      border:
                        count > 0
                          ? "1px solid var(--hp-primary)"
                          : "1px solid var(--hp-border)",
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-[10px] text-[var(--hp-text-muted)]">Less</span>
                {[0, 1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className="w-3.5 h-3.5 rounded-sm"
                    style={{
                      backgroundColor:
                        level === 0
                          ? "var(--hp-bg-3)"
                          : "var(--hp-primary)",
                    }}
                  />
                ))}
                <span className="text-[10px] text-[var(--hp-text-muted)]">More</span>
              </div>
            </div>

            {/* Completed Labs */}
            <div className="lab-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-[var(--hp-text)] text-sm flex items-center gap-2">
                  <CheckCircle size={14} className="text-[var(--hp-primary)]" />
                  Completed Labs
                </h2>
                <span className="font-mono text-xs text-[var(--hp-text-muted)]">
                  {USER.completedLabs.length} / {VULNERABILITIES.filter((v) => v.status !== "upcoming").length}
                </span>
              </div>

              {completedVulns.length === 0 ? (
                <div className="text-center py-8">
                  <Target size={28} className="text-[var(--hp-text-muted)] opacity-70 mx-auto mb-2" />
                  <p className="text-xs text-[var(--hp-text-muted)] mb-3">No labs completed yet</p>
                  <Link href="/red-team/pentesting" className="text-xs text-[var(--hp-primary)] hover:opacity-80">
                    Start hacking →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {completedVulns.map((vuln) => (
                    <Link
                      key={vuln.id}
                      href={`/red-team/pentesting/web/information/${vuln.level}`}
                      className="flex items-center gap-4 p-3.5 rounded-xl border border-[var(--hp-primary)] bg-[var(--hp-primary)]/10 hover:border-[var(--hp-primary)] transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[var(--hp-primary)]/20 border border-[var(--hp-primary)] flex items-center justify-center shrink-0">
                        <CheckCircle size={14} className="text-[var(--hp-primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[var(--hp-text)] group-hover:text-[var(--hp-primary)] transition-colors">
                          {vuln.shortName}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[10px] text-[#00e5ff]">{vuln.year}</span>
                          <span className="text-[var(--hp-text-muted)] opacity-70">•</span>
                          <span className="text-[10px] text-[var(--hp-text-muted)]">Level {vuln.level}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[var(--hp-primary)] shrink-0">
                        <Zap size={11} />
                        <span className="font-mono text-xs font-bold">+{vuln.xpReward} XP</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
