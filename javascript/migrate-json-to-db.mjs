/**
 * migrate-json-to-db.mjs — HPLabs Data Migration Script
 * Migrates all legacy JSON data stores to the new SQLite database.
 */

import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "hplabs.db");

if (!fs.existsSync(DATA_DIR)) {
  console.error("Data directory not found.");
  process.exit(1);
}

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL"); db.pragma("foreign_keys = OFF");

console.log(`[Migration] Connected to SQLite database at ${DB_PATH}`);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, email TEXT UNIQUE NOT NULL, phone TEXT,
    password_hash TEXT NOT NULL DEFAULT '', password_salt TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT 'user', is_admin INTEGER NOT NULL DEFAULT 0,
    xp INTEGER NOT NULL DEFAULT 0, premium_until INTEGER, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS lab_completions (
    id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lab_id TEXT NOT NULL, completed_at INTEGER NOT NULL, xp_awarded INTEGER NOT NULL DEFAULT 0,
    UNIQUE(user_id, lab_id)
  );
  CREATE TABLE IF NOT EXISTS auth_sessions (
    session_id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_json TEXT NOT NULL, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS lab_sessions (
    lab_session_id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lab_id TEXT NOT NULL, auth_session_id TEXT NOT NULL, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL,
    start_time INTEGER NOT NULL, activity_score INTEGER NOT NULL DEFAULT 0, last_activity INTEGER NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0, completed_at INTEGER, hints_used TEXT NOT NULL DEFAULT '[]', reset_count INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS otp_store (
    identifier TEXT PRIMARY KEY, email_otp TEXT NOT NULL, phone_otp TEXT NOT NULL, phone TEXT NOT NULL DEFAULT '',
    created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, lockout_until INTEGER
  );
  CREATE TABLE IF NOT EXISTS support_tickets (
    ticket_id TEXT PRIMARY KEY, user_id TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
    issue_description TEXT NOT NULL, lab_id TEXT, session_id TEXT, error_code TEXT,
    system_diagnostics TEXT NOT NULL DEFAULT '{}', remediation_attempts TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'open', created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS partner_students (
    id TEXT PRIMARY KEY, student_id TEXT NOT NULL, email TEXT UNIQUE NOT NULL, course TEXT NOT NULL,
    duration TEXT NOT NULL, parsed_course_duration_months INTEGER NOT NULL, entitled_premium_months INTEGER NOT NULL,
    matched_rule_id TEXT, matched_rule_label TEXT, imported_at INTEGER NOT NULL, batch TEXT NOT NULL,
    redeemed INTEGER NOT NULL DEFAULT 0, redeemed_at INTEGER
  );
  CREATE TABLE IF NOT EXISTS vuln_pipeline (
    id TEXT PRIMARY KEY, stage TEXT NOT NULL, cve_id TEXT, title TEXT NOT NULL, description TEXT,
    severity TEXT, domain TEXT, is_duplicate INTEGER NOT NULL DEFAULT 0, lab_spec TEXT,
    metadata TEXT NOT NULL DEFAULT '{}', created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
  );
`);

function readJsonSafe(filename) {
  const p = path.join(DATA_DIR, filename);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch (e) {
    return null;
  }
}

const stats = { users: 0, completions: 0, authSessions: 0, labSessions: 0, otps: 0, tickets: 0, partnerStudents: 0, pipeline: 0 };

const runMigration = db.transaction(() => {
  const now = Date.now();

  const usersJson = readJsonSafe("user_data.json");
  if (usersJson) {
    const insertUser = db.prepare(`INSERT OR IGNORE INTO users (id, username, email, phone, password_hash, password_salt, role, is_admin, xp, premium_until, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    const insertComp = db.prepare(`INSERT OR IGNORE INTO lab_completions (user_id, lab_id, completed_at, xp_awarded) VALUES (?, ?, ?, ?)`);
    for (const [id, u] of Object.entries(usersJson)) {
      if (!u.username || !u.email) continue;
      const res = insertUser.run(id, u.username, u.email.toLowerCase(), u.phone || null, u.passwordHash || '', u.passwordSalt || '', u.role || 'user', u.isAdmin ? 1 : 0, u.xp || 0, typeof u.premiumUntil === 'string' ? new Date(u.premiumUntil).getTime() : u.premiumUntil || null, now, now);
      if (res.changes > 0) stats.users++;
      if (Array.isArray(u.completedLabs)) {
        for (const labId of u.completedLabs) {
          if (insertComp.run(id, labId, now, 0).changes > 0) stats.completions++;
        }
      }
    }
  }

  const authSessJson = readJsonSafe("sessions.json");
  if (authSessJson) {
    const insertAuthSess = db.prepare(`INSERT OR IGNORE INTO auth_sessions (session_id, user_id, user_json, created_at, expires_at) VALUES (?, ?, ?, ?, ?)`);
    for (const [sid, sess] of Object.entries(authSessJson)) {
      if (!sess.user?.id) continue;
      if (insertAuthSess.run(sid, sess.user.id, JSON.stringify(sess.user), sess.createdAt || now, sess.expiresAt || (now + 900000)).changes > 0) stats.authSessions++;
    }
  }

  const labSessJson = readJsonSafe("lab_sessions.json");
  if (labSessJson) {
    const insertLabSess = db.prepare(`INSERT OR IGNORE INTO lab_sessions (lab_session_id, user_id, lab_id, auth_session_id, created_at, expires_at, start_time, activity_score, last_activity, completed, completed_at, hints_used, reset_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    for (const [lsid, ls] of Object.entries(labSessJson)) {
      if (!ls.userId) continue;
      if (insertLabSess.run(lsid, ls.userId, ls.labId || 'unknown', ls.authSessionId || 'unknown', ls.createdAt || now, ls.expiresAt || now + 14400000, ls.startTime || now, ls.activityScore || 0, ls.lastActivity || now, ls.completed ? 1 : 0, ls.completedAt || null, JSON.stringify(ls.hintsUsed || []), ls.resetCount || 0).changes > 0) stats.labSessions++;
    }
  }

  const otpJson = readJsonSafe("otp_data.json");
  if (otpJson) {
    const insertOtp = db.prepare(`INSERT OR IGNORE INTO otp_store (identifier, email_otp, phone_otp, phone, created_at, expires_at, attempts, lockout_until) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    for (const [email, otp] of Object.entries(otpJson)) {
      if (insertOtp.run(email.toLowerCase(), otp.emailOTP || '', otp.phoneOTP || '', otp.phone || '', now, otp.expiresAt || now + 600000, otp.attempts || 0, otp.lockoutUntil || null).changes > 0) stats.otps++;
    }
  }

  const ticketsJson = readJsonSafe("support_tickets.json");
  if (ticketsJson) {
    const insertTicket = db.prepare(`INSERT OR IGNORE INTO support_tickets (ticket_id, user_id, name, email, phone, issue_description, lab_id, session_id, error_code, system_diagnostics, remediation_attempts, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    for (const [tid, t] of Object.entries(ticketsJson)) {
      if (insertTicket.run(tid, t.userId || 'unknown', t.name || '', t.email || '', t.phone || '', t.issueDescription || '', t.labId || null, t.sessionId || null, t.errorCode || null, JSON.stringify(t.systemDiagnostics || {}), JSON.stringify(t.remediationAttempts || []), t.status || 'open', new Date(t.createdAt || now).getTime(), new Date(t.updatedAt || now).getTime()).changes > 0) stats.tickets++;
    }
  }

  const psJson = readJsonSafe("partner_students.json");
  if (psJson && Array.isArray(psJson.students)) {
    const insertPs = db.prepare(`INSERT OR IGNORE INTO partner_students (id, student_id, email, course, duration, parsed_course_duration_months, entitled_premium_months, matched_rule_id, matched_rule_label, imported_at, batch, redeemed, redeemed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    for (const p of psJson.students) {
      if (insertPs.run(p.id, p.studentId || '', p.email.toLowerCase(), p.course || '', p.duration || '', p.parsedCourseDurationMonths || 0, p.entitledPremiumMonths || 0, p.matchedRuleId || null, p.matchedRuleLabel || null, new Date(p.importedAt || now).getTime(), p.batch || 'legacy', p.redeemed ? 1 : 0, p.redeemedAt ? new Date(p.redeemedAt).getTime() : null).changes > 0) stats.partnerStudents++;
    }
  }
  
  const vulnJson = readJsonSafe("vuln_pipeline.json");
  if (vulnJson) {
    const insertVuln = db.prepare(`INSERT OR IGNORE INTO vuln_pipeline (id, stage, cve_id, title, description, severity, domain, is_duplicate, lab_spec, metadata, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    for (const [id, item] of Object.entries(vulnJson)) {
      if (insertVuln.run(id, item.stage || 'Detected', item.sourceData?.cveId || null, item.sourceData?.title || 'Unknown', item.sourceData?.description || null, item.sourceData?.severity || null, item.sourceData?.domain || null, item.isDuplicate ? 1 : 0, JSON.stringify(item.labSpec || null), JSON.stringify(item), new Date(item.detectedAt || now).getTime(), new Date(item.updatedAt || now).getTime()).changes > 0) stats.pipeline++;
    }
  }
});

try {
  runMigration();
  console.log(JSON.stringify(stats, null, 2));
} finally {
  db.close();
}