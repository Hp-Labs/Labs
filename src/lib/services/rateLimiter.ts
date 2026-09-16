import { getDb } from "@/lib/db";

// Consume points for a given key. Returns true if allowed, false if rate limited.
export function consumeRateLimit(key: string, limit: number, windowMs: number): boolean {
  try {
    const db = getDb();
    const now = Date.now();
    
    // Clean up expired
    db.prepare("DELETE FROM rate_limits WHERE reset_at < ?").run(now);
    
    const record = db.prepare("SELECT points, reset_at FROM rate_limits WHERE id = ?").get(key) as any;
    
    if (!record) {
      db.prepare("INSERT INTO rate_limits (id, points, reset_at) VALUES (?, 1, ?)").run(key, now + windowMs);
      return true;
    }
    
    if (record.points >= limit) {
      return false; // Rate limited
    }
    
    db.prepare("UPDATE rate_limits SET points = points + 1 WHERE id = ?").run(key);
    return true;
  } catch (err) {
    console.error("Rate limiter error", err);
    return true; // Fail open
  }
}