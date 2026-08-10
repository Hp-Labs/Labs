"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Shield, Terminal, Trophy, Bell, User,
  ChevronRight, Zap, ExternalLink, LogOut, LogIn, Sparkles, Lock,
} from "lucide-react";
import { useAuth, getUserBadgesAndRank } from "@/lib/auth";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Terminal, isLocked: false },
  { href: "/timeline", label: "Timeline", icon: Zap, isLocked: false },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy, isLocked: false },
  { href: "/certifications", label: "Certifications", icon: Lock, isLocked: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, claimDailyBonus } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--hp-border)] bg-[var(--hp-card-bg)] backdrop-blur-2xl" suppressHydrationWarning>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <img
                src="/hplabs-logo.png"
                alt="HpLabs Logo"
                className="w-9 h-9 object-contain drop-shadow-[0_0_12px_var(--hp-primary)] group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[var(--hp-primary)] pulse-ring" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-base font-extrabold text-[var(--hp-primary)] leading-none tracking-tight glow-green-text">HpLabs</span>
              <span className="text-[10px] text-[var(--hp-text-muted)] font-mono leading-none mt-0.5">by HackerPlus</span>
            </div>
          </Link>

          {/* Nav Links — only when logged in */}
          {user && (
            <div className="hidden lg:flex items-center gap-1.5 mx-4">
              {navItems.map(({ href, label, icon: Icon, isLocked }) => {
                const isActive = pathname?.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[var(--hp-border)] text-[var(--hp-primary)] border border-[var(--hp-border-hover)]"
                        : isLocked
                        ? "text-[var(--hp-text-muted)] hover:text-[var(--hp-orange)] hover:bg-[var(--hp-orange)]/5"
                        : "text-[var(--hp-text-muted)] hover:text-[var(--hp-text)] hover:bg-[var(--hp-border)]"
                    }`}
                  >
                    <Icon size={13} className={isLocked ? "text-yellow-400/80" : ""} />
                    <span>{label}</span>
                    {isLocked && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        LOCKED
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right side toggles with ample breathing space */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {user ? (
              <>
                {/* Daily Bonus Claim Button */}
                {(!user.dailyBonusClaimedDate || user.dailyBonusClaimedDate !== new Date().toISOString().split("T")[0]) && (
                  <button
                    onClick={() => {
                      const res = claimDailyBonus();
                      alert(res.message);
                    }}
                    className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-all font-mono text-xs font-bold"
                    title="Claim Daily +100 XP Bonus"
                  >
                    <Sparkles size={12} className="text-yellow-400 animate-pulse" />
                    <span>Daily Login</span>
                  </button>
                )}

                {/* Streak Counter */}
                <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 font-mono text-xs font-bold text-orange-400" title="Daily Login Streak">
                  <span>🔥</span>
                  <span>{user.loginStreak || 1}d</span>
                </div>

                {/* Rank Tag Badge & Total XP */}
                {(() => {
                  const { primaryTag, rankColor } = getUserBadgesAndRank(user);
                  return (
                    <div className={`hidden 2xl:flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono text-[11px] font-bold ${rankColor}`}>
                      <span>{primaryTag} | {user.xp.toLocaleString()} XP</span>
                    </div>
                  );
                })()}



                {/* Profile */}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--hp-border)] hover:border-[var(--hp-border-hover)] bg-[var(--hp-border)] transition-all"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[var(--hp-primary)] to-[var(--hp-cyan)] flex items-center justify-center">
                    <User size={10} className="text-[var(--hp-text)] dark:text-black" />
                  </div>
                  <span className="text-xs font-medium text-[var(--hp-text)] hidden sm:block">{user.username}</span>
                  <ChevronRight size={12} className="text-[var(--hp-text-muted)]" />
                </Link>

                {/* Logout */}
                <div className="flex items-center gap-1">
                  <a
                    href="https://hackerplus.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-[var(--hp-text-muted)] hover:text-[var(--hp-primary)] hover:bg-[var(--hp-primary)]/5 transition-all"
                    title="Visit HackerPlus"
                  >
                    <ExternalLink size={15} />
                  </a>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-[var(--hp-text-muted)] hover:text-[var(--hp-red)] hover:bg-[var(--hp-red)]/5 transition-all"
                    title="Logout"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <a
                  href="https://hackerplus.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 px-3 text-sm font-medium text-[var(--hp-text-muted)] hover:text-[var(--hp-primary)] transition-colors mr-2 border-r border-[var(--hp-border)] pr-5"
                >
                  <ExternalLink size={14} />
                  hackerplus.in
                </a>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-[var(--hp-text-muted)] hover:text-[var(--hp-text)] transition-colors"
                >
                  <LogIn size={14} />
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-[var(--hp-text)] transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, var(--hp-primary-dim), var(--hp-primary))", boxShadow: "0 0 20px var(--hp-border)" }}
                >
                  <Sparkles size={14} />
                  Start Free
                </Link>
              </>
            )}
            
            {/* Add Theme Toggle at the end */}
            <div className="border-l border-[var(--hp-border)] pl-2 ml-1">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
