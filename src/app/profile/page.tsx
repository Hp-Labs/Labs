'use client';

import Link from "next/link";
import { 
  Trophy, Shield, Target, Zap, Clock,
  Star, ChevronRight, BarChart2, CheckCircle, Flame
} from "lucide-react";
import { VULNERABILITIES, XP_TO_RANK } from "@/lib/data/vulnerabilities";
import Navbar from "@/components/Navbar";
import { useAuth, getUserBadgesAndRank } from "@/lib/auth";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { user } = useAuth();
  const username = user?.username ?? "Hacker";
  const xp = user?.xp ?? 0;
  const completedLabs = user?.completedLabs ?? [];
  const rankBadge = getUserBadgesAndRank(user || { xp: 0 } as any);
  
  const [activity, setActivity] = useState<{day: number, count: number}[]>(
    Array(28).fill(0).map((_, i) => ({day: i, count: 0}))
  );

  useEffect(() => {
    if (user) {
      fetch("/api/users/activity")
        .then(r => r.json())
        .then(d => { if(d.success) setActivity(d.activity); })
        .catch(() => {});
    }
  }, [user]);

  const completedVulns = VULNERABILITIES.filter((v) => completedLabs.includes(v.id));

  // Domain XP calculations
  const domains = [
    { name: "Web Pentesting", total: 5000, color: "var(--hp-primary)", locked: false, xp: completedVulns.reduce((sum, v) => sum + v.xpReward, 0) },
    { name: "Network Pentesting", total: 4000, color: "var(--hp-cyan)", locked: true, xp: 0 },
    { name: "API Security", total: 3000, color: "#7c3aed", locked: true, xp: 0 },
    { name: "Cloud Security", total: 3500, color: "#ff6b00", locked: true, xp: 0 },
    { name: "SOC & Blue Team", total: 4500, color: "#ff2d2d", locked: true, xp: 0 },
  ];

  return (
    <div className="min-h-screen bg-[var(--hp-bg)] flex flex-col font-sans text-[var(--hp-text)]">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Main profile card */}
            <div className="md:col-span-1 space-y-6">
              <div className="lab-card rounded-3xl p-6 relative overflow-hidden group border border-[var(--hp-border)] bg-[var(--hp-bg-2)]">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-2xl bg-[var(--hp-bg-3)] border-2 border-[var(--hp-border-hover)] flex items-center justify-center text-3xl overflow-hidden group-hover:border-[var(--hp-primary)] transition-colors">
                      <div className="font-mono font-bold text-[var(--hp-text-muted)]">
                        {username.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="text-center w-full">
                    <h1 className="text-xl font-bold text-[var(--hp-text)]">{username}</h1>
                    <p className="text-[var(--hp-primary)] font-mono text-sm mb-4">@{username}</p>

                    <div className="space-y-2 text-left bg-[var(--hp-bg-3)] p-4 rounded-xl border border-[var(--hp-border-hover)] mb-4 w-full">
                      <div className="flex justify-between items-center text-xs border-b border-[var(--hp-border)] pb-2 mb-2">
                        <span className="text-[var(--hp-text-muted)]">User ID</span>
                        <span className="font-mono text-white">{user?.id || "HP-00000000"}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs border-b border-[var(--hp-border)] pb-2 mb-2">
                        <span className="text-[var(--hp-text-muted)]">Email</span>
                        <span className="font-mono text-white">{user?.email || "Not Provided"}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs border-b border-[var(--hp-border)] pb-2 mb-2">
                        <span className="text-[var(--hp-text-muted)]">Phone</span>
                        <span className="font-mono text-white">{user?.phone || "Not Verified"}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[var(--hp-text-muted)]">Current Plan</span>
                        {user?.isPremium ? (
                          <div className="text-right">
                            <span className="font-mono text-[var(--hp-primary)] font-bold">PREMIUM</span>
                            {user?.premiumUntil && (
                              <div className="text-[9px] text-[var(--hp-text-muted)] mt-0.5">
                                Expires: {new Date(user.premiumUntil).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="font-mono text-[var(--hp-text-muted)] font-bold">FREE PLAN</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full">
                      <div className="bg-[var(--hp-bg-3)] p-3 rounded-xl border border-[var(--hp-border)] text-center">
                        <div className="text-[10px] text-[var(--hp-text-muted)] uppercase mb-1">Rank</div>
                        <div className="text-xs font-bold text-[var(--hp-primary)] truncate">{rankBadge.primaryTag}</div>
                      </div>
                      <div className="bg-[var(--hp-bg-3)] p-3 rounded-xl border border-[var(--hp-border)] text-center">
                        <div className="text-[10px] text-[var(--hp-text-muted)] uppercase mb-1">Experience</div>
                        <div className="text-xs font-bold font-mono text-white">{xp.toLocaleString()} XP</div>
                      </div>
                      <div className="bg-[var(--hp-bg-3)] p-3 rounded-xl border border-[var(--hp-border)] text-center">
                        <div className="text-[10px] text-[var(--hp-text-muted)] uppercase mb-1">Labs Done</div>
                        <div className="text-xs font-bold font-mono text-white">{completedLabs.length}</div>
                      </div>
                      <div className="bg-[var(--hp-bg-3)] p-3 rounded-xl border border-[var(--hp-border)] text-center">
                        <div className="text-[10px] text-[var(--hp-text-muted)] uppercase mb-1">Day Streak</div>
                        <div className="text-xs font-bold font-mono text-orange-400 flex items-center justify-center gap-1">
                          <Flame size={12} /> {user?.loginStreak || 1}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Stats Column */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Domain XP breakdown */}
              <div className="lab-card rounded-2xl p-6 border border-[var(--hp-border)] bg-[var(--hp-bg-2)]">
                <h2 className="font-semibold text-[var(--hp-text)] text-sm mb-5 flex items-center gap-2">
                  <Star size={14} className="text-yellow-400" />
                  Domain XP Breakdown
                </h2>
                <div className="space-y-3">
                  {domains.map(({ name, xp: domainXp, total, color, locked }) => (
                    <div key={name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[var(--hp-text-muted)]">{name}</span>
                          {locked && (
                            <span className="badge-upcoming text-[8px] font-mono px-1.5 py-0.5 rounded-full border border-[var(--hp-border)] bg-[var(--hp-bg-3)] text-[var(--hp-text-muted)]">FUTURE</span>
                          )}
                        </div>
                        <span className="font-mono text-[11px]" style={{ color: locked ? "rgba(255,255,255,0.2)" : color }}>
                          {domainXp} XP
                        </span>
                      </div>
                      <div className="h-1.5 bg-[var(--hp-bg-3)] rounded-full overflow-hidden border border-[var(--hp-border)]">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (domainXp / total) * 100)}%`,
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
              <div className="lab-card rounded-2xl p-6 border border-[var(--hp-border)] bg-[var(--hp-bg-2)]">
                <h2 className="font-semibold text-[var(--hp-text)] text-sm mb-5 flex items-center gap-2">
                  <BarChart2 size={14} className="text-[#00e5ff]" />
                  Lab Activity (Last 28 Days)
                </h2>
                <div className="flex items-end gap-1 flex-wrap">
                  {activity.map(({ day, count }) => (
                    <div
                      key={day}
                      title={`Day ${28 - day}: ${count} lab${count !== 1 ? "s" : ""}`}
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
                        opacity: count > 0 ? Math.min(1, 0.4 + count * 0.2) : 1
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Completed Labs */}
              <div className="lab-card rounded-2xl p-6 border border-[var(--hp-border)] bg-[var(--hp-bg-2)]">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold text-[var(--hp-text)] text-sm flex items-center gap-2">
                    <CheckCircle size={14} className="text-[var(--hp-primary)]" />
                    Completed Labs
                  </h2>
                  <span className="font-mono text-xs text-[var(--hp-text-muted)]">
                    {completedLabs.length} / {VULNERABILITIES.filter((v) => v.status !== "upcoming").length}
                  </span>
                </div>

                {completedVulns.length === 0 ? (
                  <div className="text-center py-8">
                    <Target size={28} className="text-[var(--hp-text-muted)] opacity-70 mx-auto mb-2" />
                    <p className="text-xs text-[var(--hp-text-muted)] mb-3">No labs completed yet</p>
                    <Link href="/red-team/pentesting" className="text-xs text-[var(--hp-primary)] hover:opacity-80">
                      Start hacking 
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {completedVulns.map((vuln) => (
                      <Link
                        key={vuln.id}
                        href={`/red-team/pentesting/web/information/${vuln.level}`}
                        className="flex items-center gap-4 p-3.5 rounded-xl border border-[var(--hp-border)] bg-[var(--hp-bg-3)] hover:border-[var(--hp-primary)] transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[var(--hp-primary)]/10 border border-[var(--hp-primary)]/30 flex items-center justify-center shrink-0">
                          <CheckCircle size={14} className="text-[var(--hp-primary)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[var(--hp-text)] group-hover:text-[var(--hp-primary)] transition-colors">
                            {vuln.shortName}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[10px] text-[#00e5ff]">{vuln.year}</span>
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
      </main>

      <footer className="py-8 border-t border-[var(--hp-border)] mt-auto bg-[var(--hp-bg)]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tight text-[var(--hp-text)] font-mono">HpLabs</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <a 
              href="https://buymeacoffee.com/manivarma3p" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center transition-transform hover:scale-105 opacity-90 hover:opacity-100"
              title="Support HpLabs - Buy Me a Coffee"
            >
              <img 
                src="https://cdn.brandfetch.io/idlFAkJfur/w/192/h/192/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1690821080412" 
                alt="Buy Me A Coffee" 
                className="h-10 w-auto rounded-lg"
              />
            </a>
            <div className="text-[var(--hp-text-muted)] text-sm">
              &copy; {new Date().getFullYear()} HpLabs. From <a href="https://hackerplus.in" target="_blank" rel="noopener noreferrer" className="text-[var(--hp-primary)] hover:underline">HackerPlus</a>.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
