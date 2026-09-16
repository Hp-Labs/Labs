// ============================================================
// HpLabs  Lab Session Store (server-side only)
// Backed by SQLite
// ============================================================

import { getDb } from "@/lib/db";
import crypto from "crypto";

export interface LabSession {
  labSessionId: string;
  userId: string;
  labId: string;
  authSessionId: string;
  createdAt: number;
  expiresAt: number;
  startTime: number;
  activityScore: number;
  lastActivity: number;
  completed: boolean;
  completedAt: number | null;
  hintsUsed: number[];
  resetCount: number;
  targetIp?: string;
  targetDomain?: string;
}

const LAB_SESSION_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours

function pruneExpiredLabSessions() {
  try {
    const db = getDb();
    db.prepare("DELETE FROM lab_sessions WHERE expires_at < ?").run(Date.now());
  } catch {}
}

function rowToLabSession(row: any): LabSession {
  return {
    labSessionId: row.lab_session_id,
    userId: row.user_id,
    labId: row.lab_id,
    authSessionId: row.auth_session_id,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    startTime: row.start_time,
    activityScore: row.activity_score,
    lastActivity: row.last_activity,
    completed: row.completed === 1,
    completedAt: row.completed_at,
    hintsUsed: JSON.parse(row.hints_used),
    resetCount: row.reset_count,
    targetIp: row.target_ip,
    targetDomain: row.target_domain,
  };
}

export function createLabSession(userId: string, labId: string, authSessionId: string, ttlMs: number = 4 * 60 * 60 * 1000, targetIp?: string, targetDomain?: string): string {
  pruneExpiredLabSessions();
  const db = getDb();
  const labSessionId = crypto.randomBytes(32).toString("hex");
  const now = Date.now();
  const expiresAt = now + ttlMs;

  db.prepare(`
    INSERT INTO lab_sessions (
      lab_session_id, user_id, lab_id, auth_session_id,
      created_at, expires_at, start_time, activity_score,
      last_activity, completed, completed_at, hints_used, reset_count,
      target_ip, target_domain
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, 0, NULL, '[]', 0, ?, ?)
  `).run(labSessionId, userId, labId, authSessionId, now, expiresAt, now, now, targetIp ?? null, targetDomain ?? null);

  return labSessionId;
}

export function getLabSession(labSessionId: string): LabSession | null {
  if (!labSessionId) return null;
  pruneExpiredLabSessions();
  const db = getDb();
  const row = db.prepare("SELECT * FROM lab_sessions WHERE lab_session_id = ?").get(labSessionId);
  if (!row) return null;
  return rowToLabSession(row);
}

export function verifyLabSessionOwnership(labSessionId: string, userId: string, labId?: string): LabSession {
  const session = getLabSession(labSessionId);
  if (!session) {
    const err: any = new Error("Lab session not found or expired.");
    err.status = 401;
    throw err;
  }
  if (session.userId !== userId) {
    const err: any = new Error("Lab session does not belong to this user.");
    err.status = 403;
    throw err;
  }
  if (labId && session.labId !== labId) {
    const err: any = new Error("Lab session is for a different lab.");
    err.status = 403;
    throw err;
  }
  return session;
}

export function recordActivity(labSessionId: string, userId: string): LabSession {
  const session = verifyLabSessionOwnership(labSessionId, userId);
  const db = getDb();
  db.prepare(`
    UPDATE lab_sessions 
    SET activity_score = activity_score + 1, last_activity = ?
    WHERE lab_session_id = ?
  `).run(Date.now(), labSessionId);
  return getLabSession(labSessionId)!;
}

export function recordCompletion(labSessionId: string, userId: string): void {
  const session = verifyLabSessionOwnership(labSessionId, userId);
  if (session.completed) return;
  const db = getDb();
  db.prepare("UPDATE lab_sessions SET completed = 1, completed_at = ? WHERE lab_session_id = ?")
    .run(Date.now(), labSessionId);
}

export function resetLabSession(labSessionId: string, userId: string): LabSession {
  const session = verifyLabSessionOwnership(labSessionId, userId);
  const db = getDb();
  const now = Date.now();
  db.prepare(`
    UPDATE lab_sessions 
    SET start_time = ?, activity_score = 0, last_activity = ?, hints_used = '[]', reset_count = reset_count + 1
    WHERE lab_session_id = ?
  `).run(now, now, labSessionId);
  return getLabSession(labSessionId)!;
}

export function recordHintUsed(labSessionId: string, userId: string, level: number): void {
  const session = verifyLabSessionOwnership(labSessionId, userId);
  if (session.hintsUsed.includes(level)) return;
  
  session.hintsUsed.push(level);
  const db = getDb();
  db.prepare("UPDATE lab_sessions SET hints_used = ? WHERE lab_session_id = ?")
    .run(JSON.stringify(session.hintsUsed), labSessionId);
}

export function destroyLabSession(labSessionId: string): void {
  if (!labSessionId) return;
  const db = getDb();
  db.prepare("DELETE FROM lab_sessions WHERE lab_session_id = ?").run(labSessionId);
}

export function revokeAllUserLabSessions(userId: string): void {
  const db = getDb();
  db.prepare("DELETE FROM lab_sessions WHERE user_id = ?").run(userId);
}

export function getUserLabSessions(userId: string): LabSession[] {
  pruneExpiredLabSessions();
  const db = getDb();
  const rows = db.prepare("SELECT * FROM lab_sessions WHERE user_id = ? ORDER BY created_at DESC").all(userId) as any[];
  return rows.map(rowToLabSession);
}