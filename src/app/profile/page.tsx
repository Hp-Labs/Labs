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
  // const [editing, setEditing] = useState(false);

  return (
    <div className="min-h-screen bg-[#06030c]">
      <Navbar />

      <div className="pt-24 pb-20 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Profile card */}
          <div className="space-y-5">

            {/* Avatar + basic info */}
            <div className="lab-card rounded-2xl p-6 text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#bf5fff] to-[#00e5ff] flex items-center justify-center mx-auto">
                  <span className="font-mono text-3xl font-black text-black">
                    {USER.displayName[0]}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#bf5fff] border-2 border-[#06030c] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-black" />
                </div>
              </div>

              <h1 className="text-xl font-bold text-white mb-0.5">{USER.displayName}</h1>
              <p className="font-mono text-sm text-[#bf5fff] mb-1">@{USER.username}</p>
              <p className="text-xs text-gray-500 mb-3">{USER.country}</p>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">{USER.bio}</p>

              {/* Rank badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[rgba(191, 95, 255,0.2)] bg-[rgba(191, 95, 255,0.05)] mb-4">
                <span className="text-base">{CURRENT_RANK.icon}</span>
                <span className="font-mono text-xs text-[#bf5fff] font-bold">{CURRENT_RANK.rank}</span>
              </div>

              {/* Social links */}
              <div className="flex items-center justify-center gap-3">
                <a href={USER.links.website} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-white/10 bg-white/5 hover:border-[rgba(191, 95, 255,0.2)] transition-all">
                  <Globe size={13} className="text-gray-400" />
                </a>
                <a href={`https://twitter.com/${USER.links.twitter}`} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-white/10 bg-white/5 hover:border-[rgba(0,229,255,0.2)] transition-all">
                  <AtSign size={13} className="text-gray-400" />
                </a>
                <a href={`https://linkedin.com/in/${USER.links.linkedin}`} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-white/10 bg-white/5 hover:border-[rgba(0,229,255,0.2)] transition-all">
                  <Link2 size={13} className="text-gray-400" />
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="lab-card rounded-2xl p-5">
              <h3 className="text-xs font-mono text-gray-400 uppercase mb-4">Stats</h3>
              <div className="space-y-3">
                {[
                  { icon: Zap, label: "Total XP", value: USER.xp.toLocaleString(), color: "text-[#bf5fff]" },
                  { icon: Target, label: "Labs Done", value: `${USER.completedLabs.length}`, color: "text-[#00e5ff]" },
                  { icon: Trophy, label: "Global Rank", value: `#${USER.globalRank}`, color: "text-yellow-400" },
                  { icon: BarChart2, label: "Day Streak", value: `🔥 ${USER.streakDays}d`, color: "text-orange-400" },
                  { icon: Calendar, label: "Member Since", value: USER.joinedDate, color: "text-gray-300" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon size={12} className="text-gray-600" />
                      <span className="text-xs text-gray-500">{label}</span>
                    </div>
                    <span className={`font-mono text-xs font-bold ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="lab-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-mono text-gray-400 uppercase flex items-center gap-2">
                  <Shield size={11} />
                  Certifications
                </h3>
                <Link href="/certifications" className="text-[10px] text-[#bf5fff] hover:opacity-80">
                  + Add
                </Link>
              </div>
              {USER.certs.length === 0 ? (
                <p className="text-xs text-gray-600 text-center py-3">No certs linked yet</p>
              ) : (
                <div className="space-y-2">
                  {USER.certs.map((cert) => (
                    <div key={cert.name}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-[rgba(191, 95, 255,0.1)] bg-[rgba(191, 95, 255,0.03)]">
                      <Award size={14} className="text-[#bf5fff] shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium text-white">{cert.name}</span>
                          <span className="badge-active text-[8px] font-mono px-1 py-0.5 rounded-full">✓</span>
                        </div>
                        <span className="text-[10px] text-gray-500">{cert.provider}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-[#bf5fff]">
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
                <h2 className="font-semibold text-white text-sm flex items-center gap-2">
                  <TrendingUp size={14} className="text-[#bf5fff]" />
                  XP Progression
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{CURRENT_RANK.icon}</span>
                  <div className="text-right">
                    <div className="font-mono text-xs text-[#bf5fff] font-bold">{USER.xp} XP</div>
                    <div className="text-[10px] text-gray-500">
                      {NEXT_RANK.minXP - USER.xp} to {NEXT_RANK.icon} {NEXT_RANK.rank}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bar */}
              <div className="h-2.5 bg-white/5 rounded-full overflow-hidden mb-4">
                <div className="xp-bar h-full rounded-full" style={{ width: `${xpProgress}%` }} />
              </div>

              {/* All ranks */}
              <div className="flex items-center justify-between">
                {XP_TO_RANK.map((r) => (
                  <div key={r.rank} className="flex flex-col items-center gap-1">
                    <span className={`text-base ${USER.xp >= r.minXP ? "opacity-100" : "opacity-20"}`}>
                      {r.icon}
                    </span>
                    <span className={`text-[9px] font-mono ${USER.xp >= r.minXP ? "text-[#bf5fff]" : "text-gray-700"}`}>
                      {r.rank.split(" ")[0]}
                    </span>
                    <span className={`text-[8px] font-mono ${USER.xp >= r.minXP ? "text-gray-500" : "text-gray-800"}`}>
                      {r.minXP >= 1000 ? `${r.minXP / 1000}k` : r.minXP}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Domain XP breakdown */}
            <div className="lab-card rounded-2xl p-6">
              <h2 className="font-semibold text-white text-sm mb-5 flex items-center gap-2">
                <Star size={14} className="text-yellow-400" />
                Domain XP Breakdown
              </h2>
              <div className="space-y-3">
                {[
                  { domain: "Web Pentesting", xp: 1800, total: 5000, color: "#bf5fff" },
                  { domain: "Network Pentesting", xp: 650, total: 4000, color: "#00e5ff" },
                  { domain: "API Security", xp: 0, total: 3000, color: "#7c3aed", locked: true },
                  { domain: "Cloud Security", xp: 0, total: 3500, color: "#ff6b00", locked: true },
                  { domain: "SOC & Blue Team", xp: 0, total: 4500, color: "#ff2d2d", locked: true },
                ].map(({ domain, xp, total, color, locked }) => (
                  <div key={domain}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-300">{domain}</span>
                        {locked && (
                          <span className="badge-upcoming text-[8px] font-mono px-1.5 py-0.5 rounded-full">SOON</span>
                        )}
                      </div>
                      <span className="font-mono text-[11px]" style={{ color: locked ? "rgba(255,255,255,0.2)" : color }}>
                        {xp} XP
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(xp / total) * 100}%`,
                          background: locked ? "rgba(255,255,255,0.05)" : `linear-gradient(90deg, ${color}, ${color}99)`,
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
              <h2 className="font-semibold text-white text-sm mb-5 flex items-center gap-2">
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
                          ? "rgba(255,255,255,0.04)"
                          : count === 1
                          ? "rgba(191, 95, 255,0.15)"
                          : count === 2
                          ? "rgba(191, 95, 255,0.35)"
                          : "rgba(191, 95, 255,0.6)",
                      border:
                        count > 0
                          ? "1px solid rgba(191, 95, 255,0.3)"
                          : "1px solid rgba(255,255,255,0.05)",
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-[10px] text-gray-600">Less</span>
                {[0, 1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className="w-3.5 h-3.5 rounded-sm"
                    style={{
                      backgroundColor:
                        level === 0
                          ? "rgba(255,255,255,0.04)"
                          : level === 1
                          ? "rgba(191, 95, 255,0.15)"
                          : level === 2
                          ? "rgba(191, 95, 255,0.35)"
                          : "rgba(191, 95, 255,0.6)",
                    }}
                  />
                ))}
                <span className="text-[10px] text-gray-600">More</span>
              </div>
            </div>

            {/* Completed Labs */}
            <div className="lab-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-white text-sm flex items-center gap-2">
                  <CheckCircle size={14} className="text-[#bf5fff]" />
                  Completed Labs
                </h2>
                <span className="font-mono text-xs text-gray-500">
                  {USER.completedLabs.length} / {VULNERABILITIES.filter((v) => v.status !== "upcoming").length}
                </span>
              </div>

              {completedVulns.length === 0 ? (
                <div className="text-center py-8">
                  <Target size={28} className="text-gray-700 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-3">No labs completed yet</p>
                  <Link href="/labs" className="text-xs text-[#bf5fff] hover:opacity-80">
                    Start hacking →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {completedVulns.map((vuln) => (
                    <Link
                      key={vuln.id}
                      href={`/labs/${vuln.id}`}
                      className="flex items-center gap-4 p-3.5 rounded-xl border border-[rgba(191, 95, 255,0.1)] bg-[rgba(191, 95, 255,0.02)] hover:border-[rgba(191, 95, 255,0.2)] transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[rgba(191, 95, 255,0.1)] border border-[rgba(191, 95, 255,0.2)] flex items-center justify-center shrink-0">
                        <CheckCircle size={14} className="text-[#bf5fff]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                          {vuln.shortName}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[10px] text-[#00e5ff]">{vuln.year}</span>
                          <span className="text-gray-700">•</span>
                          <span className="text-[10px] text-gray-500">Level {vuln.level}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[#bf5fff] shrink-0">
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
