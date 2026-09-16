/**
 * db.ts  Production-grade SQLite database layer for HPLabs
 *
 * Uses better-sqlite3 for:
 *  - Synchronous, serialized writes (no TOCTOU race conditions)
 *  - WAL mode for concurrent reads with a single writer
 *  - Foreign key enforcement
 *  - Atomic transactions
 *
 * All tables are created idempotently on first import.
 * Data file: data/hplabs.db
 */

import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = process.env.VERCEL ? "/tmp/hplabs.db" : path.join(process.cwd(), "data", "hplabs.db");

// Ensure the data directory exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

// Singleton database instance
let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  _db = new Database(DB_PATH);

  // Performance + safety pragmas
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");
  _db.pragma("synchronous = NORMAL");
  _db.pragma("cache_size = -16000"); // 16MB cache

  runMigrations(_db);
  return _db;
}

// Export a convenience accessor
export const db = new Proxy({} as Database.Database, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  },
});

//  Schema migrations 

function runMigrations(db: Database.Database) {
  db.exec(`
    --  Users 
    CREATE TABLE IF NOT EXISTS users (
      id              TEXT PRIMARY KEY,
      username        TEXT UNIQUE NOT NULL,
      email           TEXT UNIQUE NOT NULL,
      phone           TEXT,
      password_hash   TEXT NOT NULL DEFAULT '',
      password_salt   TEXT NOT NULL DEFAULT '',
      role            TEXT NOT NULL DEFAULT 'user',
      is_admin        INTEGER NOT NULL DEFAULT 0,
      xp              INTEGER NOT NULL DEFAULT 0,
      premium_until   INTEGER,
      plan            TEXT NOT NULL DEFAULT 'FREE',
      email_verified  INTEGER NOT NULL DEFAULT 0,
      suspended       INTEGER NOT NULL DEFAULT 0,
      mfa_enabled     INTEGER NOT NULL DEFAULT 0,
      mfa_secret      TEXT,
      created_at      INTEGER NOT NULL,
      updated_at      INTEGER NOT NULL
    );

    --  Payments 
    CREATE TABLE IF NOT EXISTS payments (
      id              TEXT PRIMARY KEY,
      user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      amount          INTEGER NOT NULL,
      currency        TEXT NOT NULL,
      status          TEXT NOT NULL,
      plan_id         TEXT NOT NULL,
      created_at      INTEGER NOT NULL
    );

    --  Webhook Idempotency 
        --  Notifications
    CREATE TABLE IF NOT EXISTS notifications (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title           TEXT NOT NULL,
      message         TEXT NOT NULL,
      read            INTEGER NOT NULL DEFAULT 0,
      created_at      INTEGER NOT NULL
    );

      --  Webhook Idempotency 
      CREATE TABLE IF NOT EXISTS webhook_idempotency (
        event_id        TEXT PRIMARY KEY,
        processed_at    INTEGER NOT NULL
      );

      -- OTP Store
      CREATE TABLE IF NOT EXISTS otp_store (
        identifier      TEXT PRIMARY KEY,
        email_otp       TEXT NOT NULL,
        phone_otp       TEXT NOT NULL,
        phone           TEXT NOT NULL,
        created_at      INTEGER NOT NULL,
        expires_at      INTEGER NOT NULL,
        attempts        INTEGER NOT NULL DEFAULT 0,
        lockout_until   INTEGER
      );

      -- Rate Limits
      CREATE TABLE IF NOT EXISTS rate_limits (
        id              TEXT PRIMARY KEY,
        points          INTEGER NOT NULL DEFAULT 0,
        reset_at        INTEGER NOT NULL
      );

    --  Lab completions 
    CREATE TABLE IF NOT EXISTS lab_completions (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      lab_id          TEXT NOT NULL,
      completed_at    INTEGER NOT NULL,
      xp_awarded      INTEGER NOT NULL DEFAULT 0,
      UNIQUE(user_id, lab_id)
    );
    CREATE INDEX IF NOT EXISTS idx_lab_completions_user ON lab_completions(user_id);

    --  Auth sessions 
    CREATE TABLE IF NOT EXISTS auth_sessions (
      session_id    TEXT PRIMARY KEY,
      user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      user_json     TEXT NOT NULL,
      created_at    INTEGER NOT NULL,
      expires_at    INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires ON auth_sessions(expires_at);
    CREATE INDEX IF NOT EXISTS idx_auth_sessions_user ON auth_sessions(user_id);

    --  Lab sessions 
    CREATE TABLE IF NOT EXISTS lab_sessions (
      lab_session_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      lab_id TEXT NOT NULL,
      auth_session_id TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      start_time INTEGER NOT NULL,
      activity_score INTEGER NOT NULL DEFAULT 0,
      last_activity INTEGER NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      completed_at INTEGER,
      hints_used TEXT NOT NULL DEFAULT '[]',
      reset_count INTEGER NOT NULL DEFAULT 0,
      target_ip TEXT,
      target_domain TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_lab_sessions_user ON lab_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_lab_sessions_expires ON lab_sessions(expires_at);

    --  OTP store 
    CREATE TABLE IF NOT EXISTS otp_store (
      identifier      TEXT PRIMARY KEY,
      email_otp       TEXT NOT NULL,
      phone_otp       TEXT NOT NULL,
      phone           TEXT NOT NULL DEFAULT '',
      created_at      INTEGER NOT NULL,
      expires_at      INTEGER NOT NULL,
      attempts        INTEGER NOT NULL DEFAULT 0,
      lockout_until   INTEGER
    );

    --  Support tickets 
    CREATE TABLE IF NOT EXISTS support_tickets (
      ticket_id             TEXT PRIMARY KEY,
      user_id               TEXT NOT NULL,
      name                  TEXT NOT NULL,
      email                 TEXT NOT NULL,
      phone                 TEXT NOT NULL,
      issue_description     TEXT NOT NULL,
      lab_id                TEXT,
      session_id            TEXT,
      error_code            TEXT,
      system_diagnostics    TEXT NOT NULL DEFAULT '{}',
      remediation_attempts  TEXT NOT NULL DEFAULT '[]',
      status                TEXT NOT NULL DEFAULT 'open',
      created_at            INTEGER NOT NULL,
      updated_at            INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_tickets_user ON support_tickets(user_id);
    CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);

    --  Collaboration Batches 
    CREATE TABLE IF NOT EXISTS collaboration_batches (
      id                        TEXT PRIMARY KEY,
      organization              TEXT NOT NULL,
      course_name               TEXT NOT NULL,
      course_duration_months    INTEGER NOT NULL,
      access_duration_months    INTEGER NOT NULL,
      plan                      TEXT NOT NULL,
      activation_method         TEXT NOT NULL,
      imported_by               TEXT NOT NULL,
      created_at                INTEGER NOT NULL
    );

    --  Collaboration Students 
    CREATE TABLE IF NOT EXISTS collaboration_students (
      id                TEXT PRIMARY KEY,
      batch_id          TEXT NOT NULL REFERENCES collaboration_batches(id) ON DELETE CASCADE,
      name              TEXT NOT NULL,
      email             TEXT NOT NULL,
      college           TEXT,
      roll_number       TEXT,
      status            TEXT NOT NULL DEFAULT 'PENDING',
      user_id           TEXT REFERENCES users(id) ON DELETE SET NULL,
      created_at        INTEGER NOT NULL,
      activated_at      INTEGER
    );
    CREATE INDEX IF NOT EXISTS idx_collab_students_email ON collaboration_students(email);
    CREATE INDEX IF NOT EXISTS idx_collab_students_batch ON collaboration_students(batch_id);

    -- Collaboration Coupons
    CREATE TABLE IF NOT EXISTS collaboration_coupons (
      id                TEXT PRIMARY KEY,
      coupon_hash       TEXT UNIQUE NOT NULL,
      masked_code       TEXT NOT NULL,
      student_id        TEXT NOT NULL REFERENCES collaboration_students(id) ON DELETE CASCADE,
      collaboration_id  TEXT NOT NULL REFERENCES collaboration_batches(id) ON DELETE CASCADE,
      plan              TEXT NOT NULL,
      duration_months   INTEGER NOT NULL,
      status            TEXT NOT NULL DEFAULT 'UNUSED',
      created_at        INTEGER NOT NULL,
      expires_at        INTEGER,
      redeemed_at       INTEGER,
      redeemed_by       TEXT REFERENCES users(id) ON DELETE SET NULL
    );
    CREATE INDEX IF NOT EXISTS idx_coupon_hash ON collaboration_coupons(coupon_hash);

    -- Partner Students (B2B Bulk Import)
    CREATE TABLE IF NOT EXISTS partner_students (
      id TEXT PRIMARY KEY,
      student_id TEXT,
      email TEXT NOT NULL UNIQUE,
      course TEXT,
      duration TEXT,
      parsed_course_duration_months INTEGER NOT NULL,
      entitled_premium_months INTEGER NOT NULL,
      matched_rule_id TEXT,
      matched_rule_label TEXT,
      imported_at INTEGER NOT NULL,
      batch TEXT,
      redeemed INTEGER NOT NULL DEFAULT 0,
      redeemed_at INTEGER
    );
    CREATE INDEX IF NOT EXISTS idx_partner_students_email ON partner_students(email);

    --  Security events / audit log 
    CREATE TABLE IF NOT EXISTS security_events (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type  TEXT NOT NULL,
      user_id     TEXT,
      ip          TEXT,
      details     TEXT NOT NULL DEFAULT '{}',
      severity    TEXT NOT NULL DEFAULT 'info',
      created_at  INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(event_type);
    CREATE INDEX IF NOT EXISTS idx_security_events_user ON security_events(user_id);
    CREATE INDEX IF NOT EXISTS idx_security_events_created ON security_events(created_at);

    --  Vuln pipeline 
    CREATE TABLE IF NOT EXISTS vuln_pipeline (
      id          TEXT PRIMARY KEY,
      stage       TEXT NOT NULL,
      cve_id      TEXT,
      title       TEXT NOT NULL,
      description TEXT,
      severity    TEXT,
      domain      TEXT,
      is_duplicate INTEGER NOT NULL DEFAULT 0,
      lab_spec    TEXT,
      metadata    TEXT NOT NULL DEFAULT '{}',
      created_at  INTEGER NOT NULL,
      updated_at  INTEGER NOT NULL
    );

    --  Entitlements 
    CREATE TABLE IF NOT EXISTS entitlements (
      id              TEXT PRIMARY KEY,
      user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      plan            TEXT NOT NULL,
      source          TEXT NOT NULL,
      duration_months INTEGER NOT NULL DEFAULT 0,
      activated_at    INTEGER,
      expires_at      INTEGER,
      status          TEXT NOT NULL DEFAULT 'ACTIVE',
      metadata        TEXT NOT NULL DEFAULT '{}',
      created_at      INTEGER NOT NULL,
      updated_at      INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_entitlements_user ON entitlements(user_id);
    CREATE INDEX IF NOT EXISTS idx_entitlements_status ON entitlements(status);
  `);

  // ── Safe column additions (idempotent ALTER TABLE migrations) ──────────
  // These run on every startup but are safe to repeat — errors are caught.
    // 2. Safe schema updates (adding missing columns to existing tables)
    const safeAlter = (table: string, column: string, def: string) => {
      try {
        db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${def}`);
      } catch (e: any) {
        // Ignore if column already exists
      }
    };
    
    safeAlter('lab_sessions', 'target_ip', 'TEXT');
    safeAlter('lab_sessions', 'target_domain', 'TEXT');
    safeAlter('users', 'suspended', 'INTEGER NOT NULL DEFAULT 0');
    safeAlter('users', 'plan', "TEXT NOT NULL DEFAULT 'FREE'");
    safeAlter('users', 'email_verified', "INTEGER NOT NULL DEFAULT 0");
    safeAlter('users', 'mfa_enabled', "INTEGER NOT NULL DEFAULT 0");
    safeAlter('users', 'mfa_secret', "TEXT");
    
    // Check if info@hackerplus.in exists, and if so, force mfa_enabled to 1
    // if mfa_secret is set. Or better yet, we enforce MFA during bootstrap.

  // ── Missing table bootstraps (idempotent) ─────────────────────────────
  db.exec(`
    CREATE TABLE IF NOT EXISTS rate_limits (
      id        TEXT PRIMARY KEY,
      points    INTEGER NOT NULL DEFAULT 0,
      reset_at  INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS daily_claims (
      user_id     TEXT NOT NULL,
      claim_date  TEXT NOT NULL,
      PRIMARY KEY (user_id, claim_date)
    );

    CREATE TABLE IF NOT EXISTS email_events (
      id            TEXT PRIMARY KEY,
      user_id       TEXT,
      event_type    TEXT NOT NULL,
      recipient     TEXT NOT NULL,
      subject       TEXT NOT NULL,
      status        TEXT NOT NULL DEFAULT 'sent',
      error_message TEXT,
      created_at    INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_email_events_user ON email_events(user_id);
    CREATE INDEX IF NOT EXISTS idx_email_events_type ON email_events(event_type);
  `);
}

//  Security event logger (used by multiple services) 

export function logSecurityEvent(opts: {
  eventType: string;
  userId?: string | null;
  ip?: string | null;
  details?: Record<string, unknown>;
  severity?: "info" | "warn" | "error" | "critical";
}): void {
  try {
    const db = getDb();
    db.prepare(`
      INSERT INTO security_events (event_type, user_id, ip, details, severity, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      opts.eventType,
      opts.userId ?? null,
      opts.ip ?? null,
      JSON.stringify(opts.details ?? {}),
      opts.severity ?? "info",
      Date.now()
    );
  } catch {
    // Never let audit logging crash the app
  }
}

