path = "src/lib/services/labSessionStore.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Update LabSession interface
content = re.sub(
    r'resetCount:\s*number;',
    'resetCount: number;\n  targetIp?: string;\n  targetDomain?: string;',
    content
)

# Update rowToLabSession
content = re.sub(
    r'resetCount:\s*row\.reset_count,',
    'resetCount: row.reset_count,\n    targetIp: row.target_ip,\n    targetDomain: row.target_domain,',
    content
)

# Update createLabSession signature and implementation
content = re.sub(
    r'export function createLabSession\(userId: string, labId: string, authSessionId: string, ttlMs: number = 4 \* 60 \* 60 \* 1000\): string \{',
    'export function createLabSession(userId: string, labId: string, authSessionId: string, ttlMs: number = 4 * 60 * 60 * 1000, targetIp?: string, targetDomain?: string): string {',
    content
)

content = re.sub(
    r'INSERT INTO lab_sessions \([\s\S]*?\) VALUES \([\s\S]*?\)\`\)\.run\(labSessionId, userId, labId, authSessionId, now, expiresAt, now, now\);',
    """INSERT INTO lab_sessions (
      lab_session_id, user_id, lab_id, auth_session_id,
      created_at, expires_at, start_time, activity_score,
      last_activity, completed, completed_at, hints_used, reset_count,
      target_ip, target_domain
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, 0, NULL, '[]', 0, ?, ?)
  `).run(labSessionId, userId, labId, authSessionId, now, expiresAt, now, now, targetIp || null, targetDomain || null);""",
    content
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated labSessionStore.ts")
