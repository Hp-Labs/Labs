"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Shield, Terminal, Target, Trophy, Bell, User,
  ChevronRight, Zap, ExternalLink, LogOut, LogIn,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Terminal },
  { href: "/red-team", label: "Red Team", icon: Target },
  { href: "/timeline", label: "Timeline", icon: Zap },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/certifications", label: "Certifications", icon: Shield },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[rgba(191,95,255,0.1)] bg-[rgba(6,3,12,0.92)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/hplabs-logo.png"
                alt="HpLabs Logo"
                className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(191,95,255,0.4)] group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#bf5fff] pulse-ring" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-base font-extrabold text-[#bf5fff] leading-none tracking-tight glow-green-text">HpLabs</span>
              <span className="text-[10px] text-gray-400 font-mono leading-none mt-0.5">by HackerPlus</span>
            </div>
          </Link>

          {/* Nav Links — only when logged in */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname?.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[rgba(191,95,255,0.1)] text-[#bf5fff] border border-[rgba(191,95,255,0.2)]"
                        : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                    }`}
                  >
                    <Icon size={14} />
                    {label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            <a
              href="https://hackerplus.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#bf5fff] transition-colors"
            >
              <ExternalLink size={11} />
              hackerplus.in
            </a>

            {user ? (
              <>
                {/* Notification bell */}
                <button className="relative p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all">
                  <Bell size={16} />
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#bf5fff]">
                    <span className="absolute inset-0 rounded-full bg-[#bf5fff] notif-ping" />
                  </span>
                </button>

                {/* XP Pill */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(191,95,255,0.2)] bg-[rgba(191,95,255,0.05)]">
                  <Zap size={12} className="text-[#bf5fff]" />
                  <span className="font-mono text-xs text-[#bf5fff] font-medium">{user.xp.toLocaleString()} XP</span>
                </div>

                {/* Profile */}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-white/5 hover:border-[rgba(191,95,255,0.2)] hover:bg-[rgba(191,95,255,0.05)] transition-all"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#bf5fff] to-[#00e5ff] flex items-center justify-center">
                    <User size={10} className="text-black" />
                  </div>
                  <span className="text-xs font-medium text-gray-300 hidden sm:block">{user.username}</span>
                  <ChevronRight size={12} className="text-gray-500" />
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all"
                  title="Logout"
                >
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-gray-300 border border-[rgba(255,255,255,0.1)] hover:border-[rgba(191,95,255,0.3)] hover:text-[#bf5fff] transition-all"
                >
                  <LogIn size={14} />
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-white transition-all"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #bf5fff)", boxShadow: "0 0 20px rgba(191,95,255,0.25)" }}
                >
                  Start Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
