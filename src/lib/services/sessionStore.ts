// ============================================================
// HpLabs  Auth Session Store (server-side only)
// Backed by SQLite
// ============================================================

import { getDb } from "@/lib/db";
import crypto from "crypto";

const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function pruneExpiredSessions() {
  try {
    const db = getDb();
    db.prepare("DELETE FROM auth_sessions WHERE expires_at < ?").run(Date.now());
  } catch {}
}

export function createSession(user: any): string {
  const db = getDb();
  pruneExpiredSessions();
  const sessionId = crypto.randomBytes(32).toString("hex");
  const now = Date.now();
  
  db.prepare(`
    INSERT INTO auth_sessions (session_id, user_id, user_json, created_at, expires_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(sessionId, user.id, JSON.stringify(user), now, now + TTL_MS);

  return sessionId;
}

export function refreshSession(sessionId: string): boolean {
  if (!sessionId) return false;
  const db = getDb();
  const now = Date.now();
  const res = db.prepare(`
    UPDATE auth_sessions SET expires_at = ?
    WHERE session_id = ? AND expires_at >= ?
  `).run(now + TTL_MS, sessionId, now);
  return res.changes > 0;
}

export function getSession(sessionId: string): any | null {
  if (!sessionId) return null;
  pruneExpiredSessions();
  const db = getDb();
  const row = db.prepare("SELECT user_json FROM auth_sessions WHERE session_id = ?").get(sessionId) as any;
  if (!row) return null;
  try {
    return JSON.parse(row.user_json);
  } catch {
    return null;
  }
}

export function updateSession(sessionId: string, user: any): void {
  if (!sessionId) return;
  const db = getDb();
  db.prepare("UPDATE auth_sessions SET user_json = ? WHERE session_id = ?")
    .run(JSON.stringify(user), sessionId);
}

export function destroySession(sessionId: string): void {
  if (!sessionId) return;
  const db = getDb();
  db.prepare("DELETE FROM auth_sessions WHERE session_id = ?").run(sessionId);
}

export function revokeAllUserSessions(userId: string): void {
  const db = getDb();
  db.prepare("DELETE FROM auth_sessions WHERE user_id = ?").run(userId);
}

export function getUserSessions(userId: string): any[] {
  const db = getDb();
  return db.prepare("SELECT session_id, created_at, expires_at FROM auth_sessions WHERE user_id = ?").all(userId);
}