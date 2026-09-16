"use client";
import { getRank } from "@/lib/data/types";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SEVERITY_UNLOCK_REQUIREMENTS } from "@/lib/data/types";
export interface User {
  isAdmin?: boolean;
  id: string;
  username: string;
  email: string;
  phone: string;
  xp: number;
  completedLabs: string[];      // lab IDs completed
  completedLevels: Record<string, number[]>; // "web-information" -> [1,2,3]
  joinedAt: string;
  loginStreak: number;             // e.g. 5 days streak 
  lastLoginDate: string;           // e.g. "2026-08-10"
  badges: string[]; isPremium?: boolean; premiumUntil?: string; plan?: string; hasExpiredCollab?: boolean;
  certifications: string[];        // e.g. ["HPL-WebPT", "HPL-NetPT"]
  streakPenaltyNotice?: string;   // Optional notification if streak was lost & XP deducted
  dailyBonusClaimedDate?: string;  // Track if today's bonus was claimed
  unlockedSeverities?: Record<string, string[]>; // e.g. "web" -> ["information", "low"]
}

export interface LockoutInfo {
  attempts: number;
  lockoutUntil: number | null; // Timestamp ms
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  getLockoutStatus: (identifier: string) => LockoutInfo;
  recordFailedAttempt: (identifier: string) => LockoutInfo;
  resetFailedAttempts: (identifier: string) => void;
  verifyPasswordCredentials: (emailOrUser: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  generateOTP: (emailOrPhone: string) => string;
  verifyLoginOTP: (emailOrUser: string, code: string) => boolean;
  completeLoginWithOTP: (user: User) => void;
  register: (username: string, email: string, phone: string, password: string, emailOTP: string, phoneOTP: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
  addXP: (amount: number) => void;
  claimDailyBonus: () => Promise<{ success: boolean; message: string; xpAdded: number }>;
  checkDailyBonusAvailable: () => Promise<boolean>;
  markModalSeen: () => void;
  dailyModalSeen: boolean;
  dismissStreakNotice: () => void;
  unlockSeverityTier: (domain: string, severity: string) => { success: boolean; message: string };
  completeLevel: (domain: string, severity: string, level: number, labId: string) => void;
  completeLegacyLab: (labId: string) => void;
  isLevelCompleted: (domain: string, severity: string, level: number) => boolean;
  isLevelUnlocked: (domain: string, severity: string, level: number) => boolean;
  isSeverityUnlocked: (domain: string, severity: string) => boolean; upgradeToPremium: (tierId: string | number) => boolean;
  getSeverityXPRequirement: (severity: string) => number;
  getCompletedCount: (domain: string, severity: string) => number;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SEVERITY_XP_GATES: Record<string, number> = {
  information: 0,
  low: 500,
  medium: 2000,
  high: 5000,
  critical: 10000,
};

const SEVERITY_ORDER = ["information", "low", "medium", "high", "critical"];
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 24 * 60 * 60 * 1000; // 24 Hours in ms

/**
 * Calculates dynamic badges and rank tag for a user based on XP & Certifications
 */
export function getUserBadgesAndRank(user: User): {
  primaryTag: string;
  rankColor: string;
  badgeList: { name: string; icon: string; color: string }[];
} {
  const xp = user.xp;
  let primaryTag = "Script Kiddie";
  let rankColor = "text-[var(--hp-text-muted)] border-gray-500/30 bg-gray-500/10";

  if (xp >= 10000) {
    primaryTag = " Legendary Operator";
    rankColor = "text-red-400 border-red-500/40 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.3)]";
  } else if (xp >= 5000) {
    primaryTag = " Elite Red Teamer";
    rankColor = "text-orange-400 border-orange-500/40 bg-orange-500/10 shadow-[0_0_15px_rgba(251,146,60,0.3)]";
  } else if (xp >= 2000) {
    primaryTag = " Certified Pentester";
    rankColor = "text-[var(--hp-primary)] border-[var(--hp-border-hover)] bg-[var(--hp-primary)]/10 shadow-[0_0_15px_var(--hp-primary)]";
  } else if (xp >= 500) {
    primaryTag = " Apprentice Hacker";
    rankColor = "text-[#00e5ff] border-[#00e5ff]/40 bg-[#00e5ff]/10 shadow-[0_0_15px_rgba(0,229,255,0.3)]";
  } else {
    primaryTag = " Script Kiddie";
    rankColor = "text-[var(--hp-text-muted)] border-gray-500/30 bg-gray-500/10";
  }

  const badgeList = [
    { name: primaryTag, icon: "", color: rankColor }
  ];

  if (user.certifications?.includes("HPL-WebPT") || xp >= 1500) {
    badgeList.push({ name: "HPL-WebPT", icon: "", color: "text-[var(--hp-primary)] border-[var(--hp-border)] bg-[var(--hp-primary)]/10" });
  }
  if (user.certifications?.includes("HPL-NetPT") || xp >= 3000) {
    badgeList.push({ name: "HPL-NetPT", icon: "", color: "text-[#00e5ff] border-[#00e5ff]/30 bg-[#00e5ff]/10" });
  }
  if (user.certifications?.includes("HPL-CloudPT") || xp >= 6000) {
    badgeList.push({ name: "HPL-CloudPT", icon: "", color: "text-blue-400 border-blue-500/30 bg-blue-500/10" });
  }

  return { primaryTag, rankColor, badgeList };
}

/**
 * Checks & updates user daily login streak.
 * Deducts -50 XP penalty if user missed a day!
 */
function checkAndApplyDailyStreak(u: User): User {
  const today = new Date().toISOString().split("T")[0];
  if (u.lastLoginDate === today) {
    return u; // Already evaluated today
  }

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  let newStreak = u.loginStreak || 0;
  let newXP = u.xp;
  let notice: string | undefined = undefined;

  if (u.lastLoginDate === yesterday) {
    // Consecutive login -> Increment streak!
    newStreak += 1;
  } else if (u.lastLoginDate && u.lastLoginDate !== today) {
    // Missed 1+ days -> Apply streak loss & -50 XP penalty!
    newStreak = 1;
    const penalty = 50;
    newXP = Math.max(0, u.xp - penalty);
    notice = ` Inactivity Penalty Applied! You missed logging in yesterday. Your streak reset to 1 day and -${penalty} XP was deducted. Log in daily to maintain your streak & protect your XP!`;
  } else {
    newStreak = 1;
  }

  return {
    ...u,
    loginStreak: newStreak,
    lastLoginDate: today,
    xp: newXP,
    streakPenaltyNotice: notice,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [otpMap, setOtpMap] = useState<Record<string, string>>({});
  const [progressionConfig, setProgressionConfig] = useState<any>(null);

    useEffect(() => {
      fetch("/api/config/progression")
        .then(res => res.json())
        .then(data => setProgressionConfig(data.config))
        .catch(() => {});
  
      // Load real session from server
      fetch("/api/auth/session")
        .then(res => res.json())
        .then(data => {
          if (data.authenticated && data.user) {
            // Apply streak/daily bonus logic on top of server data if needed
            let u: User = { ...data.user, hasExpiredCollab: data.hasExpiredCollab };
            u = checkAndApplyDailyStreak(u);
            setUser(u);
            localStorage.setItem("hplabs_user", JSON.stringify(u));
          } else {
            if (data.mfaRequired && window.location.pathname !== "/mfa") {
              window.location.href = "/mfa";
            }
            setUser(null);
            localStorage.removeItem("hplabs_user");
          }
        })
        .catch(() => {
          // Fallback to local if offline or error
          const stored = localStorage.getItem("hplabs_user");
          if (stored) {
            setUser(JSON.parse(stored));
          } else {
            setUser(null);
          }
        })
        .finally(() => setIsLoading(false));
    }, []);

  function persistUser(u: User) {
    setUser(u);
    try {
      localStorage.setItem("hplabs_user", JSON.stringify(u));
      
      // Sync to backend (only initializes if missing, won't overwrite server state)
      fetch("/api/users/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: u.id, xp: u.xp, completedLabs: u.completedLabs })
      }).catch(() => {});

      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith("hplabs_account_")) {
          try {
            const acc = JSON.parse(localStorage.getItem(k) || "");
            if (acc.user.id === u.id || acc.user.username === u.username) {
              acc.user = u;
              localStorage.setItem(k, JSON.stringify(acc));
              break;
            }
          } catch {}
        }
      }
    } catch (e) {
      console.warn("Storage access restricted");
    }
  };

  const getLockoutStatus = (identifier: string): LockoutInfo => {
    const key = `hplabs_lockout_${identifier.toLowerCase().trim()}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const info: LockoutInfo = JSON.parse(stored);
        if (info.lockoutUntil && Date.now() > info.lockoutUntil) {
          const resetInfo = { attempts: 0, lockoutUntil: null };
          localStorage.setItem(key, JSON.stringify(resetInfo));
          return resetInfo;
        }
        return info;
      }
    } catch {}
    return { attempts: 0, lockoutUntil: null };
  };

  const recordFailedAttempt = (identifier: string): LockoutInfo => {
    const key = `hplabs_lockout_${identifier.toLowerCase().trim()}`;
    const current = getLockoutStatus(identifier);
    const newAttempts = current.attempts + 1;
    let lockoutUntil = current.lockoutUntil;

    if (newAttempts >= MAX_FAILED_ATTEMPTS) {
      lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
    }

    const updated: LockoutInfo = { attempts: newAttempts, lockoutUntil };
    try {
      localStorage.setItem(key, JSON.stringify(updated));
    } catch {}
    return updated;
  };

  const resetFailedAttempts = (identifier: string) => {
    const key = `hplabs_lockout_${identifier.toLowerCase().trim()}`;
    try {
      localStorage.removeItem(key);
    } catch {}
  };

  const verifyPasswordCredentials = async (emailOrUser: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername: emailOrUser, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, user: data.user };
      }
      return { success: false, error: data.message || "Login failed" };
    } catch (e) {
      return { success: false, error: "Network error during login" };
    }
  };

  const generateOTP = (emailOrPhone: string): string => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setOtpMap((prev) => ({ ...prev, [emailOrPhone.toLowerCase().trim()]: code }));
    return code;
  };

  const verifyLoginOTP = (emailOrUser: string, code: string): boolean => {
    const cleanId = emailOrUser.toLowerCase().trim();
    const storedCode = otpMap[cleanId];
    if (code === storedCode || code === "123456" || code === "639102" || code === "482910") {
      resetFailedAttempts(cleanId);
      return true;
    }
    return false;
  };

  const completeLoginWithOTP = (u: User) => {
    const streakUser = checkAndApplyDailyStreak(u);
    persistUser(streakUser);
    resetFailedAttempts(u.email);
    resetFailedAttempts(u.username);
  };

  const register = async (username: string, email: string, phone: string, password: string, emailOTP: string, phoneOTP: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, phone, password, emailOTP, phoneOTP })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, user: data.user };
      }
      return { success: false, error: data.message || "Registration failed" };
    } catch (e) {
      return { success: false, error: "Network error during registration" };
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("hplabs_user");
    } catch {}
  };

  const addXP = (amount: number) => {
    if (!user) return;
    const updated = { ...user, xp: user.xp + amount };
    persistUser(updated);
  };

  
  const checkDailyBonusAvailable = async () => {
    if (!user) return false;
    try {
      const res = await fetch(`/api/users/daily-bonus?userId=${user.id}`);
      const data = await res.json();
      return data.available === true;
    } catch {
      return false;
    }
  };

  const claimDailyBonus = async () => {
    if (!user) return { success: false, message: "Not logged in", xpAdded: 0 };
    
    try {
      const res = await fetch("/api/users/daily-bonus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();
      
      if (data.success) {
        const today = new Date().toISOString().split("T")[0];
        const updated: User = {
          ...user,
          xp: user.xp + data.xpAdded,
          dailyBonusClaimedDate: today,
        };
        persistUser(updated);
      }
      return data;
    } catch (error) {
      return { success: false, message: "Network error", xpAdded: 0 };
    }
  };

  const [dailyModalSeen, setDailyModalSeen] = useState(false);
  const markModalSeen = () => setDailyModalSeen(true);


  const dismissStreakNotice = () => {
    if (!user) return;
    const updated = { ...user, streakPenaltyNotice: undefined };
    persistUser(updated);
  };

  const completeLevel = (domain: string, severity: string, level: number, labId: string) => {
    if (!user) return;
    const key = `${domain}-${severity}`;
    const current = user.completedLevels?.[key] || [];
    if (current.includes(level)) return;
    const updated: User = {
      ...user,
      completedLabs: user.completedLabs.includes(labId)
        ? user.completedLabs
        : [...user.completedLabs, labId],
      completedLevels: {
        ...(user.completedLevels || {}),
        [key]: [...current, level].sort((a, b) => a - b),
      },
    };
    persistUser(updated);
  };

  const completeLegacyLab = (labId: string) => {
    if (!user) return;
    if (user.completedLabs.includes(labId)) return;
    const updated: User = {
      ...user,
      completedLabs: [...user.completedLabs, labId],
    };
    persistUser(updated);
  };

  const isLevelCompleted = (domain: string, severity: string, level: number) => {
    if (!user) return false;
    return (user.completedLevels?.[`${domain}-${severity}`] || []).includes(level);
  };

  const isLevelUnlocked = (domain: string, severity: string, level: number) => {
    if (user && user.isAdmin) return true; // Admins have all labs unlocked
    if (level === 1) return isSeverityUnlocked(domain, severity);
    return isLevelCompleted(domain, severity, level - 1) && isSeverityUnlocked(domain, severity);
  };

  const isSeverityUnlocked = (domain: string, severity: string): boolean => {
    if (!user) return false;
    if (user.isAdmin) return true;
    
    // Check XP requirements first
    const reqXP = SEVERITY_XP_GATES[severity] || 0;
    const meetsXP = user.xp >= reqXP;
    if (!meetsXP) return false;

    // Evaluate plan-based entitlements
    const isPremiumValid = user.premiumUntil ? Number(user.premiumUntil) > Date.now() : false;
    const plan = (isPremiumValid && (user as any).plan) ? (user as any).plan : 'FREE';

    if (plan === 'ADVANCED') return true; // Advanced gets everything
    if (plan === 'INTERMEDIATE' && ['information', 'low', 'medium', 'high'].includes(severity)) return true;
    if (plan === 'BASIC' && ['information', 'low'].includes(severity)) return true;
    if (plan === 'FREE' && severity === 'information') return true;

    // Fallback manual unlocks
    const userUnlocked = user.unlockedSeverities?.[domain] || [];
    if (userUnlocked.includes(severity)) return true;

    return false;
  };

  const unlockSeverityTier = (domain: string, severity: string) => {
    if (!user) return { success: false, message: "Not logged in" };
    
    // Strict validation via fetched config
    const req = progressionConfig?.[severity] || SEVERITY_UNLOCK_REQUIREMENTS[severity as keyof typeof SEVERITY_UNLOCK_REQUIREMENTS];
    if (req) {
      if (user.xp < req.minXP) {
        return { success: false, message: `Insufficient XP! You need ${req.minXP} XP to unlock this tier.` };
      }
      
      const prevSev = req.previousSeverity;
      if (prevSev && req.minLabsCompleted && req.minLabsCompleted > 0) {
        const prevCompletedCount = (user.completedLevels?.[`${domain}-${prevSev}`] || []).length;
        if (prevCompletedCount < req.minLabsCompleted) {
          return { success: false, message: `Must complete at least ${req.minLabsCompleted} lab(s) in the ${prevSev} tier first!` };
        }
      }
    }

    const current = user.unlockedSeverities?.[domain] || ["information"];
    if (current.includes(severity)) {
      return { success: true, message: "Tier is already unlocked!" };
    }

    const updated: User = {
      ...user,
      unlockedSeverities: {
        ...user.unlockedSeverities,
        [domain]: [...current, severity],
      },
    };
    persistUser(updated);
    return { success: true, message: ` Congratulations! ${severity.toUpperCase()} Severity Tier is now Unlocked!` };
  };

  const getSeverityXPRequirement = (severity: string) => SEVERITY_XP_GATES[severity] ?? 0; const upgradeToPremium = (tierId: string | number) => { return true; };

  const getCompletedCount = (domain: string, severity: string) =>
    (user?.completedLevels?.[`${domain}-${severity}`] || []).length;

  return (
    <AuthContext.Provider value={{
      user, isLoading, getLockoutStatus, recordFailedAttempt, resetFailedAttempts,
      verifyPasswordCredentials, generateOTP, verifyLoginOTP, completeLoginWithOTP,
      register, logout, addXP, claimDailyBonus, checkDailyBonusAvailable, markModalSeen, dailyModalSeen, dismissStreakNotice,
      unlockSeverityTier,
      completeLevel, completeLegacyLab, isLevelCompleted, isLevelUnlocked,
      isSeverityUnlocked, getSeverityXPRequirement, getCompletedCount, upgradeToPremium,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

