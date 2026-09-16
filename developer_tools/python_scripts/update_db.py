path = "src/lib/db.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Add target_ip and target_domain to lab_sessions schema in db.ts
import re
new_schema = """
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
"""

# We need to replace the old CREATE TABLE IF NOT EXISTS lab_sessions
content = re.sub(r'CREATE TABLE IF NOT EXISTS lab_sessions \([\s\S]*?\);', new_schema.strip(), content)

# We also need a migration snippet for existing DB
migration = """
  // Migration: add target_ip and target_domain to lab_sessions if not exists
  try {
    const cols = _db.prepare("PRAGMA table_info(lab_sessions)").all() as any[];
    if (!cols.find(c => c.name === 'target_ip')) {
      _db.prepare("ALTER TABLE lab_sessions ADD COLUMN target_ip TEXT").run();
    }
    if (!cols.find(c => c.name === 'target_domain')) {
      _db.prepare("ALTER TABLE lab_sessions ADD COLUMN target_domain TEXT").run();
    }
  } catch (e) {
    console.error("Migration error on lab_sessions IP/Domain:", e);
  }
"""

# Insert migration after the lab_sessions creation block
content = content.replace("CREATE INDEX IF NOT EXISTS idx_lab_sessions_expires_at ON lab_sessions(expires_at);", 
                          "CREATE INDEX IF NOT EXISTS idx_lab_sessions_expires_at ON lab_sessions(expires_at);\n" + migration)


with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated db.ts")
