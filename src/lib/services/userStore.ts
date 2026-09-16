// ============================================================
// HpLabs  User Store (server-side only)
// Backed by SQLite (better-sqlite3)
// ============================================================

import { getDb, logSecurityEvent } from "@/lib/db";
import crypto from "crypto";

export interface ServerUser {
  id: string;
  username: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  passwordSalt?: string;
  role?: string;
  isAdmin?: boolean;
  suspended?: boolean;
  emailVerified?: boolean;
  mfaEnabled?: boolean;
  xp: number;
  completedLabs: string[];
  premiumUntil?: number | null;
  plan: 'FREE' | 'BASIC' | 'INTERMEDIATE' | 'PREMIUM' | 'ADVANCED';
}

function rowToUser(row: any, completedLabs: string[]): ServerUser {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    phone: row.phone || undefined,
    passwordHash: row.password_hash || undefined,
    passwordSalt: row.password_salt || undefined,
    role: row.role,
    isAdmin: row.email === 'info@hackerplus.in',
    suspended: row.suspended === 1,
    emailVerified: row.email_verified === 1,
    mfaEnabled: row.email === 'info@hackerplus.in' || row.mfa_enabled === 1, // Enforce for superadmin
    xp: row.xp,
    premiumUntil: row.premium_until || null,
    plan: row.email === 'info@hackerplus.in' ? 'ADVANCED' : (row.plan || 'FREE'),
    completedLabs,
  };
}

function getCompletedLabsForUser(userId: string): string[] {
  const db = getDb();
  const rows = db.prepare("SELECT lab_id FROM lab_completions WHERE user_id = ?").all(userId) as any[];
  return rows.map(r => r.lab_id);
}

//  Password Hashing 

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  if (!password || !hash || !salt) return false;
  try {
    const computed = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
  } catch (err) {
    return false;
  }
}

//  Public API 

export function createUser(
  data: { id: string; username: string; email: string; xp: number; completedLabs: string[]; phone?: string },
  password?: string
): ServerUser {
  const db = getDb();
  const now = Date.now();
  let hash = "", salt = "";

  if (password) {
    const res = hashPassword(password);
    hash = res.hash;
    salt = res.salt;
  }

  const insertUser = db.prepare(`
    INSERT INTO users (id, username, email, phone, password_hash, password_salt, xp, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(
    data.id,
    data.username,
    data.email.toLowerCase(),
    data.phone || null,
    hash,
    salt,
    data.xp,
    now,
    now
  );

  if (data.completedLabs && data.completedLabs.length > 0) {
    const insertComp = db.prepare("INSERT OR IGNORE INTO lab_completions (user_id, lab_id, completed_at) VALUES (?, ?, ?)");
    const runMany = db.transaction(() => {
      for (const labId of data.completedLabs) {
        insertComp.run(data.id, labId, now);
      }
    });
    runMany();
  }
  
  // Auto-activate any pending AUTOMATIC collaboration imports for this email
  const { checkAndActivateStudent } = require('./collaborationStore');
  checkAndActivateStudent(data.email, data.id);

  return getUserById(data.id)!;
}

export function getUserById(id: string): ServerUser | undefined {
  const db = getDb();
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  if (!row) return undefined;
  return rowToUser(row, getCompletedLabsForUser(id));
}

export function getUserByEmail(email: string): ServerUser | undefined {
  if (!email) return undefined;
  const db = getDb();
  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase());
  if (!row) return undefined;
  return rowToUser(row, getCompletedLabsForUser((row as any).id));
}

export function getUserState(userId: string): { xp: number; completedLabs: string[], isAdmin?: boolean } | undefined {
  const db = getDb();
  const row = db.prepare("SELECT xp, is_admin FROM users WHERE id = ?").get(userId) as any;
  if (!row) return undefined;
  return { xp: row.xp, completedLabs: getCompletedLabsForUser(userId), isAdmin: !!row.is_admin };
}

export function updateUser(userId: string, updates: Partial<ServerUser>) {
  const db = getDb();
  const setClauses: string[] = [];
  const values: any[] = [];

  if (updates.username !== undefined) { setClauses.push("username = ?"); values.push(updates.username); }
  if (updates.email !== undefined) { setClauses.push("email = ?"); values.push(updates.email.toLowerCase()); }
  if (updates.phone !== undefined) { setClauses.push("phone = ?"); values.push(updates.phone); }
  if (updates.xp !== undefined) { setClauses.push("xp = ?"); values.push(updates.xp); }
  if (updates.passwordHash !== undefined) { setClauses.push("password_hash = ?"); values.push(updates.passwordHash); }
  if (updates.passwordSalt !== undefined) { setClauses.push("password_salt = ?"); values.push(updates.passwordSalt); }
  if (updates.premiumUntil !== undefined) { setClauses.push("premium_until = ?"); values.push(updates.premiumUntil); }
  if (updates.suspended !== undefined) { setClauses.push("suspended = ?"); values.push(updates.suspended ? 1 : 0); }
  if (updates.plan !== undefined) { setClauses.push("plan = ?"); values.push(updates.plan); }
  if (updates.emailVerified !== undefined) { setClauses.push("email_verified = ?"); values.push(updates.emailVerified ? 1 : 0); }
  if (updates.mfaEnabled !== undefined) { setClauses.push("mfa_enabled = ?"); values.push(updates.mfaEnabled ? 1 : 0); }
  if ((updates as any).mfaSecret !== undefined) { setClauses.push("mfa_secret = ?"); values.push((updates as any).mfaSecret); }

  if (setClauses.length > 0) {
    setClauses.push("updated_at = ?");
    values.push(Date.now());
    values.push(userId);
    db.prepare(`UPDATE users SET ${setClauses.join(", ")} WHERE id = ?`).run(...values);
  }
}

export function awardUserXPAndLab(userId: string, xp: number, labId: string) {
  const db = getDb();
  const now = Date.now();

  const awardTx = db.transaction(() => {
    // Insert completion if it doesn't exist
    const res = db.prepare(`
      INSERT OR IGNORE INTO lab_completions (user_id, lab_id, completed_at, xp_awarded)
      VALUES (?, ?, ?, ?)
    `).run(userId, labId, now, xp);

    // Only award XP if the lab was newly completed
    if (res.changes > 0) {
      db.prepare("UPDATE users SET xp = xp + ?, updated_at = ? WHERE id = ?").run(xp, now, userId);
    }
  });

  awardTx();
}

export function getAllUsers(): ServerUser[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM users").all() as any[];
  return rows.map(r => rowToUser(r, getCompletedLabsForUser(r.id)));
}

export function awardDailyBonus(userId: string): { success: boolean, xpAdded: number, message: string } {
  const db = getDb();
  const today = new Date().toISOString().split("T")[0];
  const bonusXP = 100;
  
  try {
    const claimTx = db.transaction(() => {
      // Attempt to insert claim
      const res = db.prepare(`
        INSERT INTO daily_claims (user_id, claim_date)
        VALUES (?, ?)
      `).run(userId, today);
      
      // If user exists, award XP
      if (res.changes > 0) {
        db.prepare("UPDATE users SET xp = xp + ?, updated_at = ? WHERE id = ?").run(bonusXP, Date.now(), userId);
      }
    });
    
    claimTx();
    return { success: true, xpAdded: bonusXP, message: "Daily Login Bonus Claimed! +100 XP Added!" };
  } catch (error: any) {
    // Unique constraint violation -> already claimed
    if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
      return { success: false, xpAdded: 0, message: "Today's daily bonus already claimed!" };
    }
    console.error("Error awarding daily bonus:", error);
    return { success: false, xpAdded: 0, message: "Server error claiming bonus" };
  }
}


export function checkDailyBonusAvailable(userId: string): boolean {
  const db = getDb();
  const today = new Date().toISOString().split("T")[0];
  const row = db.prepare("SELECT 1 FROM daily_claims WHERE user_id = ? AND claim_date = ?").get(userId, today);
  return !row;
}


export function deductUserXP(userId: string, amount: number) {
  const db = getDb();
  const now = Date.now();
  db.prepare("UPDATE users SET xp = MAX(0, xp - ?), updated_at = ? WHERE id = ?").run(amount, now, userId);
}


export function updateUserPlan(userId: string, plan: 'FREE' | 'BASIC' | 'INTERMEDIATE' | 'PREMIUM' | 'ADVANCED', durationMs: number = 0) {
  const db = getDb();
  const now = Date.now();
  let premiumUntil = null;
  if (plan !== 'FREE') {
    const user = db.prepare("SELECT premium_until FROM users WHERE id = ?").get(userId) as any;
    const currentExpiry = user?.premium_until || now;
    premiumUntil = (currentExpiry > now ? currentExpiry : now) + durationMs;
  }
  db.prepare("UPDATE users SET plan = ?, premium_until = ?, updated_at = ? WHERE id = ?").run(plan, premiumUntil, now, userId);
}
