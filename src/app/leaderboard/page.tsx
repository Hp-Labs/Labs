"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { XP_TO_RANK, getRank } from "@/lib/data/types";
import {
  Trophy,
  Zap,
  Flame,
  Star,
  TrendingUp,
  User,
  Shield,
  Target,
} from "lucide-react";

// ─── Mock users ───────────────────────────────────────────────
const MOCK_USERS = [
  { username: "0xShadow",   xp: 31200, labs: 89, streak: 47, avatar: "🐉" },
  { username: "c4psul3",    xp: 28750, labs: 82, streak: 61, avatar: "⚡" },
  { username: "null_ptr",   xp: 25300, labs: 74, streak: 33, avatar: "💀" },
  { username: "r00tkit",    xp: 22800, labs: 71, streak: 29, avatar: "🦅" },
  { username: "v1j4y",      xp: 18450, labs: 58, streak: 14, avatar: "🎯" },  // current user
  { username: "pwn3d_u",    xp: 16200, labs: 53, streak: 22, avatar: "🔥" },
  { username: "h4ck3r_x",   xp: 14900, labs: 49, streak: 8,  avatar: "👾" },
  { username: "b3ta_byt3",  xp: 13400, labs: 44, streak: 18, avatar: "🤖" },
  { username: "xploit99",   xp: 11750, labs: 41, streak: 5,  avatar: "🕷️" },
  { username: "vulnhnt3r",  xp: 10200, labs: 38, streak: 12, avatar: "🦠" },
  { username: "dedsec_7",   xp:  9100, labs: 35, streak: 7,  avatar: "🧬" },
  { username: "cr4ck3r",    xp:  7800, labs: 31, streak: 3,  avatar: "🔓" },
  { username: "infilt3x",   xp:  6500, labs: 28, streak: 9,  avatar: "🛸" },
  { username: "0day_x",     xp:  5400, labs: 24, streak: 2,  avatar: "☢️" },
  { username: "w0rm_fx",    xp:  4200, labs: 19, streak: 11, avatar: "🐍" },
  { username: "m4lw4re",    xp:  3100, labs: 15, streak: 4,  avatar: "🕶️" },
  { username: "bl4ckhat",   xp:  2200, labs: 11, streak: 1,  avatar: "🧢" },
  { username: "skript_k",   xp:  1500, labs:  8, streak: 6,  avatar: "📡" },
  { username: "n3wb13",     xp:   800, labs:  4, streak: 2,  avatar: "🐣" },
  { username: "byte_baby",  xp:   300, labs:  1, streak: 1,  avatar: "🍼" },
];

// Assign rank index for sort stability — already sorted
const RANKED_USERS = MOCK_USERS.map((u, i) => ({ ...u, rank: i + 1 }));

const CURRENT_USER = "v1j4y";

// Medal colours
const MEDAL: Record<number, { color: string; bg: string; border: string; label: string }> = {
  1: { color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.3)", label: "🥇" },
  2: { color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.3)", label: "🥈" },
  3: { color: "#fb923c", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.3)", label: "🥉" },
};

function XpBar({ xp }: { xp: number }) {
  const rank = getRank(xp);
  const rankIdx = XP_TO_RANK.findIndex((r) => r.rank === rank.rank);
  const nextRank = XP_TO_RANK[rankIdx + 1];
  const progress = nextRank
    ? Math.min(100, ((xp - rank.minXP) / (nextRank.minXP - rank.minXP)) * 100)
    : 100;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          flex: 1,
          height: "4px",
          borderRadius: "99px",
          backgroundColor: "rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            borderRadius: "99px",
            background: "linear-gradient(90deg, #bf5fff, #00e5ff)",
          }}
        />
      </div>
      <span style={{ fontSize: "10px", color: "#4b5563", fontFamily: "monospace", whiteSpace: "nowrap" }}>
        {nextRank ? `${xp.toLocaleString()} / ${nextRank.minXP.toLocaleString()}` : "MAX"}
      </span>
    </div>
  );
}

export default function LeaderboardPage() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const currentUserData = RANKED_USERS.find((u) => u.username === CURRENT_USER);

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

      {/* Ambient */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 60% 30% at 50% 0%, rgba(191, 95, 255,0.05) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      <main style={{ position: "relative", zIndex: 1, paddingTop: "96px", paddingBottom: "80px" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 24px" }}>
          {/* Header */}
          <div style={{ marginBottom: "40px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <Trophy size={13} style={{ color: "#bf5fff" }} />
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "11px",
                  color: "#bf5fff",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Global Rankings
              </span>
            </div>
            <h1
              style={{
                fontSize: "clamp(26px, 5vw, 44px)",
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: "12px",
                background: "linear-gradient(135deg, #ffffff 0%, #bf5fff 55%, #fbbf24 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Leaderboard
            </h1>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              Top hackers ranked by XP earned across all labs. Updated in real-time.
            </p>
          </div>

          {/* Top 3 podium */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "40px",
              flexWrap: "wrap",
            }}
          >
            {RANKED_USERS.slice(0, 3).map((user) => {
              const medal = MEDAL[user.rank];
              const rankInfo = getRank(user.xp);
              return (
                <div
                  key={user.username}
                  style={{
                    flex: "1 1 200px",
                    padding: "20px",
                    borderRadius: "12px",
                    border: `1px solid ${medal.border}`,
                    backgroundColor: medal.bg,
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-20px",
                      right: "-20px",
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      backgroundColor: medal.color,
                      opacity: 0.05,
                    }}
                  />
                  <div style={{ fontSize: "32px", marginBottom: "4px" }}>{medal.label}</div>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>{user.avatar}</div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: medal.color,
                      marginBottom: "4px",
                    }}
                  >
                    {user.username}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#6b7280",
                      marginBottom: "10px",
                    }}
                  >
                    {rankInfo.icon} {rankInfo.rank}
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "18px",
                      fontWeight: 800,
                      color: medal.color,
                    }}
                  >
                    {user.xp.toLocaleString()}
                    <span style={{ fontSize: "11px", fontWeight: 400, marginLeft: "4px", color: "#6b7280" }}>
                      XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current user highlight */}
          {currentUserData && (
            <div
              style={{
                padding: "16px 20px",
                borderRadius: "10px",
                border: "1px solid rgba(191, 95, 255,0.3)",
                backgroundColor: "rgba(191, 95, 255,0.05)",
                marginBottom: "32px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "11px",
                  color: "#bf5fff",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  border: "1px solid rgba(191, 95, 255,0.3)",
                  backgroundColor: "rgba(191, 95, 255,0.1)",
                  whiteSpace: "nowrap",
                }}
              >
                YOUR RANK
              </div>
              <div style={{ fontSize: "24px" }}>{currentUserData.avatar}</div>
              <div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#bf5fff",
                  }}
                >
                  {currentUserData.username}
                </div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>
                  {getRank(currentUserData.xp).icon} {getRank(currentUserData.xp).rank}
                </div>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#bf5fff",
                  }}
                >
                  #{currentUserData.rank}
                </div>
                <div style={{ fontSize: "11px", color: "#4b5563" }}>Global Rank</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#e2e8f0",
                  }}
                >
                  {currentUserData.xp.toLocaleString()}
                </div>
                <div style={{ fontSize: "11px", color: "#4b5563" }}>XP Earned</div>
              </div>
            </div>
          )}

          {/* Table */}
          <div
            style={{
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr 120px 80px 90px 90px",
                gap: "0",
                padding: "12px 20px",
                backgroundColor: "rgba(255,255,255,0.03)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {["#", "Hacker", "Rank Title", "Labs", "Streak", "XP"].map((col, i) => (
                <div
                  key={col}
                  style={{
                    fontSize: "10px",
                    fontFamily: "monospace",
                    color: "#4b5563",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    textAlign: i >= 2 ? "right" : "left",
                  }}
                >
                  {col}
                </div>
              ))}
            </div>

            {/* Rows */}
            {RANKED_USERS.map((user) => {
              const isCurrentUser = user.username === CURRENT_USER;
              const medal = MEDAL[user.rank];
              const rankInfo = getRank(user.xp);
              const isHovered = hoveredRow === user.rank;

              return (
                <div
                  key={user.username}
                  onMouseEnter={() => setHoveredRow(user.rank)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "48px 1fr 120px 80px 90px 90px",
                    gap: "0",
                    padding: "14px 20px",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    backgroundColor: isCurrentUser
                      ? "rgba(191, 95, 255,0.04)"
                      : isHovered
                      ? "rgba(255,255,255,0.025)"
                      : "transparent",
                    transition: "background-color 0.15s",
                    cursor: "default",
                    borderLeft: isCurrentUser ? "2px solid rgba(191, 95, 255,0.5)" : "2px solid transparent",
                  }}
                >
                  {/* Rank # */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontFamily: "monospace",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: medal ? medal.color : "#4b5563",
                    }}
                  >
                    {medal ? medal.label : `#${user.rank}`}
                  </div>

                  {/* User info */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                    <div
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "8px",
                        border: `1px solid ${isCurrentUser ? "rgba(191, 95, 255,0.3)" : "rgba(255,255,255,0.08)"}`,
                        backgroundColor: isCurrentUser
                          ? "rgba(191, 95, 255,0.08)"
                          : "rgba(255,255,255,0.03)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                        flexShrink: 0,
                      }}
                    >
                      {user.avatar}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "monospace",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: isCurrentUser ? "#bf5fff" : "#cbd5e1",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        {user.username}
                        {isCurrentUser && (
                          <span
                            style={{
                              fontSize: "9px",
                              color: "#bf5fff",
                              padding: "1px 6px",
                              borderRadius: "3px",
                              border: "1px solid rgba(191, 95, 255,0.3)",
                              backgroundColor: "rgba(191, 95, 255,0.1)",
                              letterSpacing: "0.06em",
                            }}
                          >
                            YOU
                          </span>
                        )}
                      </div>
                      <div style={{ marginTop: "4px" }}>
                        <XpBar xp={user.xp} />
                      </div>
                    </div>
                  </div>

                  {/* Rank title */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: "5px",
                    }}
                  >
                    <span style={{ fontSize: "13px" }}>{rankInfo.icon}</span>
                    <span style={{ fontSize: "11px", color: "#6b7280" }}>{rankInfo.rank}</span>
                  </div>

                  {/* Labs */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: "5px",
                    }}
                  >
                    <Target size={12} style={{ color: "#4b5563" }} />
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "13px",
                        color: "#94a3b8",
                        fontWeight: 600,
                      }}
                    >
                      {user.labs}
                    </span>
                  </div>

                  {/* Streak */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: "5px",
                    }}
                  >
                    <Flame
                      size={12}
                      style={{ color: user.streak >= 30 ? "#f87171" : user.streak >= 7 ? "#fb923c" : "#4b5563" }}
                    />
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "13px",
                        color: user.streak >= 30 ? "#f87171" : user.streak >= 7 ? "#fb923c" : "#6b7280",
                        fontWeight: 600,
                      }}
                    >
                      {user.streak}d
                    </span>
                  </div>

                  {/* XP */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px" }}>
                    <Zap size={11} style={{ color: "#bf5fff", flexShrink: 0 }} />
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: medal ? medal.color : isCurrentUser ? "#bf5fff" : "#94a3b8",
                      }}
                    >
                      {user.xp.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div
            style={{
              marginTop: "32px",
              padding: "16px 20px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.05)",
              backgroundColor: "rgba(255,255,255,0.015)",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "#4b5563",
                fontFamily: "monospace",
                marginBottom: "12px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Rank Progression
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {XP_TO_RANK.map((r) => (
                <div
                  key={r.rank}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    backgroundColor: "rgba(255,255,255,0.02)",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{r.icon}</span>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8" }}>
                      {r.rank}
                    </div>
                    <div style={{ fontSize: "10px", color: "#374151", fontFamily: "monospace" }}>
                      {r.minXP.toLocaleString()}+ XP
                    </div>
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
