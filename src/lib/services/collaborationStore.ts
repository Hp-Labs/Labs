import { getDb, logSecurityEvent } from "@/lib/db";
import crypto from "crypto";
import { type PlanLevel, grantEntitlement } from "./entitlements";
import { getUserById } from "./userStore";

export type ActivationMethod = 'AUTOMATIC' | 'COUPON' | 'ADMIN_APPROVAL';

export interface CollabBatch {
  id: string;
  organization: string;
  courseName: string;
  courseDurationMonths: number;
  accessDurationMonths: number;
  plan: PlanLevel;
  activationMethod: ActivationMethod;
  importedBy: string;
  createdAt: number;
}

export interface CollabStudent {
  id: string;
  batchId: string;
  name: string;
  email: string;
  college: string | null;
  rollNumber: string | null;
  status: 'PENDING' | 'ACTIVATED' | 'REJECTED';
  couponCode: string | null; // This will hold the MASKED code if applicable
  userId: string | null;
  createdAt: number;
  activatedAt: number | null;
}

export interface GeneratedCoupon {
  studentName: string;
  studentEmail: string;
  plaintextCode: string;
}

function rowToBatch(row: any): CollabBatch {
  return {
    id: row.id,
    organization: row.organization,
    courseName: row.course_name,
    courseDurationMonths: row.course_duration_months,
    accessDurationMonths: row.access_duration_months,
    plan: row.plan as PlanLevel,
    activationMethod: row.activation_method as ActivationMethod,
    importedBy: row.imported_by,
    createdAt: row.created_at,
  };
}

function rowToStudent(row: any): CollabStudent {
  return {
    id: row.id,
    batchId: row.batch_id,
    name: row.name,
    email: row.email,
    college: row.college,
    rollNumber: row.roll_number,
    status: row.status,
    couponCode: row.masked_code || null, // from LEFT JOIN
    userId: row.user_id,
    createdAt: row.created_at,
    activatedAt: row.activated_at,
  };
}

export function createCollaborationBatch(data: Omit<CollabBatch, 'id' | 'createdAt'>): CollabBatch {
  const db = getDb();
  const id = "collab_" + crypto.randomBytes(16).toString("hex");
  const now = Date.now();

  db.prepare(`
    INSERT INTO collaboration_batches (
      id, organization, course_name, course_duration_months, access_duration_months,
      plan, activation_method, imported_by, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, data.organization, data.courseName, data.courseDurationMonths, data.accessDurationMonths,
    data.plan, data.activationMethod, data.importedBy, now
  );

  return getCollaborationBatch(id)!;
}

export function getCollaborationBatch(id: string): CollabBatch | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM collaboration_batches WHERE id = ?").get(id);
  if (!row) return null;
  return rowToBatch(row);
}

export function getCollaborationBatches(): CollabBatch[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM collaboration_batches ORDER BY created_at DESC").all();
  return rows.map(rowToBatch);
}

export function addCollaborationStudents(
  batchId: string, 
  students: Omit<CollabStudent, 'id' | 'batchId' | 'status' | 'createdAt' | 'activatedAt' | 'userId' | 'couponCode'>[]
): GeneratedCoupon[] {
  const db = getDb();
  const batch = getCollaborationBatch(batchId);
  if (!batch) throw new Error("Batch not found");

  const insertStudent = db.prepare(`
    INSERT INTO collaboration_students (
      id, batch_id, name, email, college, roll_number, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, 'PENDING', ?)
  `);

  const insertCoupon = db.prepare(`
    INSERT INTO collaboration_coupons (
      id, coupon_hash, masked_code, student_id, collaboration_id, plan, duration_months, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'UNUSED', ?)
  `);

  const now = Date.now();
  const generated: GeneratedCoupon[] = [];
  
  const tx = db.transaction(() => {
    for (const s of students) {
      const studentId = "stu_" + crypto.randomBytes(16).toString("hex");
      insertStudent.run(studentId, batchId, s.name, s.email.toLowerCase(), s.college, s.rollNumber, now);

      if (batch.activationMethod === 'COUPON') {
        const plaintextCode = "HP-" + crypto.randomBytes(4).toString("hex").toUpperCase() + "-" + crypto.randomBytes(4).toString("hex").toUpperCase();
        const hash = crypto.createHash('sha256').update(plaintextCode).digest('hex');
        const masked = plaintextCode.substring(0, 8) + "****";
        const couponId = "coup_" + crypto.randomBytes(16).toString("hex");

        insertCoupon.run(
          couponId, hash, masked, studentId, batch.id, batch.plan, batch.accessDurationMonths, now
        );

        generated.push({
          studentName: s.name,
          studentEmail: s.email,
          plaintextCode
        });
      }
    }
  });

  tx();
  return generated;
}

export function getStudentsForBatch(batchId: string): CollabStudent[] {
  const db = getDb();
  // We LEFT JOIN to grab the masked code
  const rows = db.prepare(`
    SELECT s.*, c.masked_code 
    FROM collaboration_students s
    LEFT JOIN collaboration_coupons c ON s.id = c.student_id
    WHERE s.batch_id = ? 
    ORDER BY s.created_at DESC
  `).all(batchId);
  return rows.map(rowToStudent);
}

export function checkAndActivateStudent(email: string, userId: string): void {
  const db = getDb();
  const lowerEmail = email.toLowerCase();
  
  // Find pending students with this email matching an AUTOMATIC batch
  const students = db.prepare(`
    SELECT s.* FROM collaboration_students s
    JOIN collaboration_batches b ON s.batch_id = b.id
    WHERE s.email = ? AND s.status = 'PENDING' AND b.activation_method = 'AUTOMATIC'
  `).all(lowerEmail);

  if (students.length === 0) return;

  for (const s of students as any[]) {
    activateStudent(s.id, userId);
  }
}

export function activateStudent(studentId: string, userId: string): void {
  const db = getDb();
  const now = Date.now();

  const tx = db.transaction(() => {
    const student = db.prepare("SELECT * FROM collaboration_students WHERE id = ?").get(studentId) as any;
    if (!student || student.status === 'ACTIVATED') return;

    const batch = getCollaborationBatch(student.batch_id);
    if (!batch) return;

    db.prepare(`
      UPDATE collaboration_students 
      SET status = 'ACTIVATED', user_id = ?, activated_at = ? 
      WHERE id = ?
    `).run(userId, now, studentId);

    grantEntitlement(userId, batch.plan, 'COLLABORATION', batch.accessDurationMonths, {
      collabBatchId: batch.id,
      collabStudentId: studentId,
      organization: batch.organization
    });

    logSecurityEvent({
      eventType: 'collab_student_activated',
      userId,
      details: { studentId, batchId: batch.id, plan: batch.plan }
    });
  });

  tx();
}

export function redeemCollabCoupon(userId: string, code: string): { success: boolean; message: string } {
  const db = getDb();
  const hash = crypto.createHash('sha256').update(code.trim().toUpperCase()).digest('hex');
  const now = Date.now();

  let successMsg = "";
  let success = false;
  let errorMsg = "";

  const tx = db.transaction(() => {
    // 1. Check coupon by hash
    const coupon = db.prepare("SELECT * FROM collaboration_coupons WHERE coupon_hash = ?").get(hash) as any;
    if (!coupon) {
      errorMsg = "Invalid or non-existent coupon code.";
      return;
    }

    if (coupon.status !== 'UNUSED') {
      errorMsg = "This coupon has already been redeemed or is disabled.";
      return;
    }

    if (coupon.expires_at && coupon.expires_at < now) {
      errorMsg = "This coupon has expired.";
      return;
    }

    // 2. Strict matching against student account
    const user = getUserById(userId);
    if (!user) {
      errorMsg = "Invalid user account.";
      return;
    }

    const student = db.prepare("SELECT * FROM collaboration_students WHERE id = ?").get(coupon.student_id) as any;
    if (!student) {
      errorMsg = "Orphaned coupon data. Please contact support.";
      return;
    }

    if (student.email.toLowerCase() !== user.email.toLowerCase()) {
      errorMsg = "Invalid or non-existent coupon code."; // Generic to avoid leakage
      return;
    }

    const PLAN_WEIGHT: Record<string, number> = {
      'FREE': 0,
      'BASIC': 1,
      'INTERMEDIATE': 2,
      'PREMIUM': 3,
      'ADVANCED': 3,
    };
    
    if (user.plan && PLAN_WEIGHT[user.plan] > PLAN_WEIGHT[coupon.plan]) {
      errorMsg = "You already have a higher active subscription plan (" + user.plan + "). This " + coupon.plan + " coupon cannot be applied.";
      return;
    }

    // 3. Atomically mark coupon as REDEEMED (prevents race conditions)
    const result = db.prepare(`
      UPDATE collaboration_coupons 
      SET status = 'REDEEMED', redeemed_at = ?, redeemed_by = ? 
      WHERE id = ? AND status = 'UNUSED'
    `).run(now, userId, coupon.id);

    if (result.changes === 0) {
      errorMsg = "Failed to redeem coupon. It may have been used concurrently.";
      return;
    }

    // 4. Activate student and grant entitlement
    const batch = getCollaborationBatch(coupon.collaboration_id);
    if (!batch) {
      // rollback inherently handled if we throw, but we can just set error
      throw new Error("Batch not found for coupon");
    }

    db.prepare(`
      UPDATE collaboration_students 
      SET status = 'ACTIVATED', user_id = ?, activated_at = ? 
      WHERE id = ?
    `).run(userId, now, student.id);

    grantEntitlement(userId, coupon.plan as PlanLevel, 'COLLABORATION', coupon.duration_months, {
      collabBatchId: batch.id,
      collabStudentId: student.id,
      organization: batch.organization
    });

    logSecurityEvent({
      eventType: 'collab_coupon_redeemed',
      userId,
      details: { couponId: coupon.id, studentId: student.id, batchId: batch.id }
    });

    success = true;
    successMsg = `Successfully redeemed collaboration access for ${batch.organization}`;
  });

  try {
    tx();
  } catch (err) {
    console.error("Collab redemption tx error:", err);
    return { success: false, message: "Internal server error during redemption." };
  }

  if (!success) {
    return { success: false, message: errorMsg };
  }
  return { success: true, message: successMsg };
}

