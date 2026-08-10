"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  username: string;
  email: string;
  xp: number;
  completedLabs: string[];      // lab IDs completed
  completedLevels: Record<string, number[]>; // "web-information" -> [1,2,3]
  joinedAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  addXP: (amount: number) => void;
  completeLevel: (domain: string, severity: string, level: number, labId: string) => void;
  isLevelCompleted: (domain: string, severity: string, level: number) => boolean;
  isLevelUnlocked: (domain: string, severity: string, level: number) => boolean;
  isSeverityUnlocked: (domain: string, severity: string) => boolean;
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

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  "demo@hplabs.io": {
    password: "demo123",
    user: {
      id: "user-demo",
      username: "v1j4y",
      email: "demo@hplabs.io",
      xp: 2450,
      completedLabs: ["web-info-001", "web-info-002", "web-info-003"],
      completedLevels: { "web-information": [1, 2, 3] },
      joinedAt: "2026-01-15",
    },
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load persisted session
    try {
      const stored = localStorage.getItem("hplabs_user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setIsLoading(false);
  }, []);

  const persistUser = (u: User) => {
    setUser(u);
    localStorage.setItem("hplabs_user", JSON.stringify(u));
  };

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 800)); // simulate network
    const stored = localStorage.getItem(`hplabs_account_${email}`);
    if (stored) {
      const account = JSON.parse(stored);
      if (account.password === password) {
        persistUser(account.user);
        return { success: true };
      }
    }
    // Check mock users
    const mock = MOCK_USERS[email.toLowerCase()];
    if (mock && mock.password === password) {
      persistUser(mock.user);
      return { success: true };
    }
    return { success: false, error: "Invalid email or password" };
  };

  const register = async (username: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      email,
      xp: 0,
      completedLabs: [],
      completedLevels: {},
      joinedAt: new Date().toISOString().split("T")[0],
    };
    localStorage.setItem(`hplabs_account_${email}`, JSON.stringify({ password, user: newUser }));
    persistUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hplabs_user");
  };

  const addXP = (amount: number) => {
    if (!user) return;
    const updated = { ...user, xp: user.xp + amount };
    persistUser(updated);
  };

  const completeLevel = (domain: string, severity: string, level: number, labId: string) => {
    if (!user) return;
    const key = `${domain}-${severity}`;
    const current = user.completedLevels[key] || [];
    if (current.includes(level)) return;
    const updated: User = {
      ...user,
      completedLabs: user.completedLabs.includes(labId)
        ? user.completedLabs
        : [...user.completedLabs, labId],
      completedLevels: {
        ...user.completedLevels,
        [key]: [...current, level].sort((a, b) => a - b),
      },
    };
    persistUser(updated);
  };

  const isLevelCompleted = (domain: string, severity: string, level: number) => {
    if (!user) return false;
    return (user.completedLevels[`${domain}-${severity}`] || []).includes(level);
  };

  const isLevelUnlocked = (domain: string, severity: string, level: number) => {
    if (level === 1) return isSeverityUnlocked(domain, severity);
    return isLevelCompleted(domain, severity, level - 1) && isSeverityUnlocked(domain, severity);
  };

  const isSeverityUnlocked = (domain: string, severity: string) => {
    if (!user) return false;
    const xpReq = SEVERITY_XP_GATES[severity] ?? 0;
    if (user.xp < xpReq) return false;
    const prevIdx = SEVERITY_ORDER.indexOf(severity) - 1;
    if (prevIdx < 0) return true; // information is always unlocked if logged in
    // Previous severity must have at least 1 completed level
    const prevSeverity = SEVERITY_ORDER[prevIdx];
    const prevCompleted = user.completedLevels[`${domain}-${prevSeverity}`] || [];
    return prevCompleted.length > 0;
  };

  const getSeverityXPRequirement = (severity: string) => SEVERITY_XP_GATES[severity] ?? 0;

  const getCompletedCount = (domain: string, severity: string) =>
    (user?.completedLevels[`${domain}-${severity}`] || []).length;

  return (
    <AuthContext.Provider value={{
      user, isLoading, login, register, logout, addXP,
      completeLevel, isLevelCompleted, isLevelUnlocked,
      isSeverityUnlocked, getSeverityXPRequirement, getCompletedCount,
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
