// ============================================================
// HpLabs  Partner Student Store (server-side only)
// Backed by SQLite
// ============================================================

import { getDb } from "@/lib/db";

export interface PartnerStudent {
  id: string;
  studentId: string;
  email: string;
  course: string;
  duration: string;
  parsedCourseDurationMonths: number;
  entitledPremiumMonths: number;
  matchedRuleId: string | null;
  matchedRuleLabel: string | null;
  importedAt: string;
  batch: string;
  redeemed: boolean;
  redeemedAt?: string;
}

function rowToStudent(row: any): PartnerStudent {
  return {
    id: row.id,
    studentId: row.student_id,
    email: row.email,
    course: row.course,
    duration: row.duration,
    parsedCourseDurationMonths: row.parsed_course_duration_months,
    entitledPremiumMonths: row.entitled_premium_months,
    matchedRuleId: row.matched_rule_id,
    matchedRuleLabel: row.matched_rule_label,
    importedAt: new Date(row.imported_at).toISOString(),
    batch: row.batch,
    redeemed: row.redeemed === 1,
    redeemedAt: row.redeemed_at ? new Date(row.redeemed_at).toISOString() : undefined,
  };
}

export function importPartnerStudents(
  rows: Omit<PartnerStudent, "id" | "importedAt" | "redeemed" | "redeemedAt">[],
  batch: string
): { imported: number; skipped: number; duplicates: string[] } {
  const db = getDb();
  let imported = 0;
  let skipped = 0;
  const duplicates: string[] = [];

  const insert = db.prepare(`
    INSERT OR IGNORE INTO partner_students (
      id, student_id, email, course, duration, parsed_course_duration_months,
      entitled_premium_months, matched_rule_id, matched_rule_label, imported_at, batch
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const runMany = db.transaction(() => {
    for (const row of rows) {
      const email = row.email.toLowerCase();
      // Check if exists first just so we can accurately record skipped/duplicates
      // (Though INSERT OR IGNORE does the actual safety check)
      const existing = db.prepare("SELECT 1 FROM partner_students WHERE email = ?").get(email);
      if (existing) {
        skipped++;
        duplicates.push(row.email);
        continue;
      }

      const id = `PS-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
      insert.run(
        id, row.studentId, email, row.course, row.duration, row.parsedCourseDurationMonths,
        row.entitledPremiumMonths, row.matchedRuleId, row.matchedRuleLabel, Date.now(), batch
      );
      imported++;
    }
  });

  runMany();
  return { imported, skipped, duplicates };
}

export function checkPartnerEligibility(email: string): PartnerStudent | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM partner_students WHERE email = ? AND redeemed = 0").get(email.toLowerCase());
  if (!row) return null;
  return rowToStudent(row);
}

export function redeemPartnerEligibility(email: string): boolean {
  const db = getDb();
  const res = db.prepare("UPDATE partner_students SET redeemed = 1, redeemed_at = ? WHERE email = ? AND redeemed = 0")
    .run(Date.now(), email.toLowerCase());
  return res.changes > 0;
}

export function listPartnerStudents(page = 1, pageSize = 50) {
  const db = getDb();
  const total = (db.prepare("SELECT COUNT(*) as c FROM partner_students").get() as any).c;
  const offset = (page - 1) * pageSize;
  const rows = db.prepare("SELECT * FROM partner_students ORDER BY imported_at DESC LIMIT ? OFFSET ?").all(pageSize, offset) as any[];
  return { items: rows.map(rowToStudent), total, page, pageSize };
}

export function deletePartnerStudent(id: string): boolean {
  const db = getDb();
  const res = db.prepare("DELETE FROM partner_students WHERE id = ?").run(id);
  return res.changes > 0;
}