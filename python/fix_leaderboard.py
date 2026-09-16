import os

code = '''"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { XP_TO_RANK, getRank } from "@/lib/data/types";
import { Trophy, Flame, Target } from "lucide-react";
import { useAuth } from "@/lib/auth";

const MEDAL: Record<number, { color: string; bg: string; border: string; label: string }> = {
  1: { color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.3)", label: "🥇" },
  2: { color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.3)", label: "🥈" },
  3: { color: "#fb923c", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.3)", label: "🥉" },
};

function XpBar({ xp }: { xp: number }) {
  const rank = getRank(xp);
  const rankIdx = XP_TO_RANK.findIndex((r) => r.rank === rank.rank);
  const nextRank = XP_TO_RANK[rankIdx + 1];
  const progress = nextRank ? Math.min(100, ((xp - rank.minXP) / (nextRank.minXP - rank.minXP)) * 100) : 100;

  return (
    <div className="flex flex-col gap-1 w-full max-w-[200px]">
      <div className="flex justify-between items-center text-[9px] font-mono">
        <span className="text-[var(--hp-text)]">{rank.rank}</span>
        <span className="text-[var(--hp-text-muted)]">
          {nextRank ? ${nextRank.minXP - xp} to next : "MAX"}
        </span>
      </div>
      <div className="h-1 bg-[var(--hp-bg-3)] rounded-full overflow-hidden">
        <div className="h-full bg-[var(--hp-primary)] rounded-full relative" style={{ width: ${progress}% }}>
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const { user } = useAuth();
  const CURRENT_USER = user?.username;
  const [rankedUsers, setRankedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(d => {
        if(d.success) {
          setRankedUsers(d.data.map((u: any, i: number) => ({
             rank: i + 1, username: u.username, xp: u.xp, labs: u.labs, streak: Math.floor(Math.random() * 10), avatar: "💻"
          })));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const currentUserData = rankedUsers.find((u) => u.username === CURRENT_USER);

  return (
    <div className="min-h-screen bg-[var(--hp-bg)] flex flex-col font-sans selection:bg-[var(--hp-primary)] selection:text-white">
      <Navbar />
      <main className="flex-1 pt-24 pb-20 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--hp-primary)]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--hp-text-muted)] tracking-tight mb-4 flex items-center justify-center gap-3">
              <Trophy className="text-[var(--hp-primary)]" size={36} /> Global Leaderboard
            </h1>
          </div>

          <div className="hidden md:flex justify-center items-end h-48 mb-12 gap-4">
            {loading ? <div className="text-[var(--hp-text-muted)] animate-pulse font-mono text-sm">Loading Global Ranks...</div> : [2, 1, 3].map((pos) => {
              const u = rankedUsers[pos - 1];
              if (!u) return null;
              return (
                <div key={u.username} className={lex flex-col items-center relative group transition-all duration-300 }>
                  <div className={mb-2 font-mono text-2xl font-bold} style={{ color: MEDAL[pos].color }}>{MEDAL[pos].label}</div>
                  <div className="relative mb-3">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-lg border-2 transition-transform group-hover:-translate-y-2 group-hover:scale-110" style={{ backgroundColor: MEDAL[pos].bg, borderColor: MEDAL[pos].border }}>{u.avatar}</div>
                  </div>
                  <div className="text-[var(--hp-text)] font-bold text-sm tracking-tight mb-1">{u.username}</div>
                  <div className="text-[var(--hp-primary)] font-mono text-xs font-bold glow-text">{u.xp.toLocaleString()} XP</div>
                </div>
              );
            })}
          </div>

          <div className="bg-[var(--hp-bg-2)] border border-[var(--hp-border)] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl relative">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-[var(--hp-border-hover)] bg-[var(--hp-bg-3)]/80 text-[10px] font-mono font-bold text-[var(--hp-text-muted)] tracking-wider">
              <div className="col-span-1 text-center">RANK</div>
              <div className="col-span-4">HACKER</div>
              <div className="col-span-3">EXPERIENCE</div>
              <div className="col-span-2 text-center">COMPLETED</div>
              <div className="col-span-2 text-right pr-4">STREAK</div>
            </div>
            <div className="divide-y divide-[var(--hp-border)]/50">
              {loading ? (
                <div className="p-8 text-center text-[var(--hp-text-muted)] font-mono text-sm">Initializing leaderboard data...</div>
              ) : rankedUsers.length === 0 ? (
                <div className="p-8 text-center text-[var(--hp-text-muted)] font-mono text-sm">No hackers found.</div>
              ) : rankedUsers.map((u, i) => {
                const isCurrent = u.username === CURRENT_USER;
                const isHovered = hoveredRow === i;
                const medal = MEDAL[u.rank];
                return (
                  <div key={u.username} onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)} className={grid grid-cols-12 gap-4 p-4 items-center transition-all duration-200 }>
                    <div className="col-span-1 flex justify-center">{medal ? <span className="text-lg" title={Rank }>{medal.label}</span> : <span className="font-mono text-[var(--hp-text-muted)] text-xs font-bold">#{u.rank}</span>}</div>
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--hp-bg-3)] border border-[var(--hp-border)] flex items-center justify-center text-sm shadow-inner overflow-hidden">{u.avatar}</div>
                      <div className="flex flex-col">
                        <span className={ont-bold tracking-tight text-sm }>{u.username}{isCurrent && <span className="ml-2 text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded border border-[var(--hp-primary)]/30 text-[var(--hp-primary)] bg-[var(--hp-primary)]/10 font-mono">You</span>}</span>
                      </div>
                    </div>
                    <div className="col-span-3 flex items-center"><XpBar xp={u.xp} /></div>
                    <div className="col-span-2 flex justify-center">
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-[var(--hp-bg-3)] rounded-md border border-[var(--hp-border)]"><Target size={12} className="text-purple-400" /><span className="font-mono text-xs font-bold text-[var(--hp-text)]">{u.labs}</span></div>
                    </div>
                    <div className="col-span-2 flex justify-end pr-4">
                      <div className="flex items-center gap-1"><Flame size={14} className={u.streak > 10 ? "text-orange-500 animate-pulse" : "text-[var(--hp-text-muted)] opacity-50"} /><span className={ont-mono text-xs font-bold }>{u.streak}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {currentUserData && currentUserData.rank > 20 && (
            <div className="mt-6 p-4 rounded-xl border border-[var(--hp-primary)]/30 bg-[var(--hp-primary)]/5 flex items-center justify-between shadow-[0_0_30px_var(--hp-primary)]/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--hp-primary)]/20 border border-[var(--hp-primary)] flex items-center justify-center text-lg">{currentUserData.avatar}</div>
                <div><div className="text-[10px] font-mono text-[var(--hp-text-muted)] mb-0.5">YOUR RANKING</div><div className="font-bold text-[var(--hp-primary)] glow-text text-sm">#{currentUserData.rank} Global</div></div>
              </div>
              <div className="text-right"><div className="text-[10px] font-mono text-[var(--hp-text-muted)] mb-0.5">CURRENT XP</div><div className="font-bold font-mono text-[var(--hp-text)]">{currentUserData.xp.toLocaleString()}</div></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
'''

with open('src/app/leaderboard/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

