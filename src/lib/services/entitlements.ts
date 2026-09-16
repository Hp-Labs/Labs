import { getDb, logSecurityEvent } from "@/lib/db";
import crypto from "crypto";
import { updateUser } from "./userStore";

export type PlanLevel = 'FREE' | 'BASIC' | 'INTERMEDIATE' | 'PREMIUM' | 'ADVANCED';
export type EntitlementSource = 'PAYMENT' | 'COLLABORATION' | 'ADMIN_TEST' | 'FREE';

export interface Entitlement {
  id: string;
  userId: string;
  plan: PlanLevel;
  source: EntitlementSource;
  durationMonths: number;
  activatedAt: number | null;
  expiresAt: number | null;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  metadata: any;
  createdAt: number;
  updatedAt: number;
}

const PLAN_WEIGHT: Record<PlanLevel, number> = {
  'FREE': 0,
  'BASIC': 1,
  'INTERMEDIATE': 2,
  'PREMIUM': 3,
  'ADVANCED': 3,
};

const SOURCE_WEIGHT: Record<EntitlementSource, number> = {
  'FREE': 0,
  'COLLABORATION': 1,
  'ADMIN_TEST': 2,
  'PAYMENT': 3,
};

function rowToEntitlement(row: any): Entitlement {
  return {
    id: row.id,
    userId: row.user_id,
    plan: row.plan as PlanLevel,
    source: row.source as EntitlementSource,
    durationMonths: row.duration_months,
    activatedAt: row.activated_at,
    expiresAt: row.expires_at,
    status: row.status as 'ACTIVE' | 'EXPIRED' | 'REVOKED',
    metadata: JSON.parse(row.metadata),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Adds months to a timestamp accurately based on calendar months.
 * Example: 11 Sep + 6 months = 11 Mar
 */
export function addCalendarMonths(startDateMs: number, months: number): number {
  const d = new Date(startDateMs);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.getTime();
}

/**
 * Core function to grant a new entitlement to a user.
 * It creates the record and then forces a recalculation.
 */
export function grantEntitlement(
  userId: string,
  plan: PlanLevel,
  source: EntitlementSource,
  durationMonths: number,
  metadata: any = {}
): Entitlement {
  const db = getDb();
  const id = "ent_" + crypto.randomBytes(16).toString("hex");
  const now = Date.now();
  
  // Expiry calculation
  const expiresAt = durationMonths > 0 ? addCalendarMonths(now, durationMonths) : null;

  db.prepare(`
    INSERT INTO entitlements (
      id, user_id, plan, source, duration_months, activated_at, expires_at, status, metadata, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?, ?, ?)
  `).run(id, userId, plan, source, durationMonths, now, expiresAt, JSON.stringify(metadata), now, now);

  logSecurityEvent({
    eventType: 'entitlement_granted',
    userId,
    details: { entitlementId: id, plan, source, durationMonths, expiresAt }
  });

  const entitlement = getEntitlement(id)!;
  
  // Re-evaluate user access immediately
  recalculateUserAccess(userId);

  return entitlement;
}

export function getEntitlement(id: string): Entitlement | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM entitlements WHERE id = ?").get(id);
  if (!row) return null;
  return rowToEntitlement(row);
}

export function getUserEntitlements(userId: string): Entitlement[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM entitlements WHERE user_id = ? ORDER BY created_at DESC").all(userId) as any[];
  return rows.map(rowToEntitlement);
}

/**
 * Core server-side function to determine effective access.
 * Marks expired entitlements, then finds the highest priority active entitlement.
 * Falls back to FREE if nothing is active.
 * Never overwrites paid data improperly.
 */
export function recalculateUserAccess(userId: string): { effectivePlan: PlanLevel, expiry: number | null } {
  const db = getDb();
  const now = Date.now();

  // 1. Expire any ACTIVE entitlements that have passed their expiresAt
  db.prepare(`
    UPDATE entitlements 
    SET status = 'EXPIRED', updated_at = ? 
    WHERE user_id = ? AND status = 'ACTIVE' AND expires_at IS NOT NULL AND expires_at <= ?
  `).run(now, userId, now);

  // 2. Fetch all currently ACTIVE entitlements
  const activeRows = db.prepare(`
    SELECT * FROM entitlements 
    WHERE user_id = ? AND status = 'ACTIVE'
  `).all(userId) as any[];

  const active = activeRows.map(rowToEntitlement);

  if (active.length === 0) {
    // Fallback to FREE
    updateUser(userId, { plan: 'FREE', premiumUntil: null });
    return { effectivePlan: 'FREE', expiry: null };
  }

  // 3. Calculate effective entitlement
  // Priority: ACTIVE PAID ENTITLEMENT -> ACTIVE COLLABORATION ENTITLEMENT -> FREE
  // If sources are equal, pick higher plan. If plans are equal, pick later expiry.
  let best: Entitlement = active[0];

  for (let i = 1; i < active.length; i++) {
    const curr = active[i];
    
    const currPlanW = PLAN_WEIGHT[curr.plan];
    const bestPlanW = PLAN_WEIGHT[best.plan];
    
    if (currPlanW > bestPlanW) {
      best = curr;
    } else if (currPlanW === bestPlanW) {
      const currSourceW = SOURCE_WEIGHT[curr.source];
      const bestSourceW = SOURCE_WEIGHT[best.source];
      
      if (currSourceW > bestSourceW) {
        best = curr;
      } else if (currSourceW === bestSourceW) {
        // If plan and source are equal, compare expiry to show longest access
        const currExpiryBetter = curr.expiresAt === null || (best.expiresAt !== null && curr.expiresAt > best.expiresAt);
        const bestExpiryBetter = best.expiresAt === null || (curr.expiresAt !== null && best.expiresAt > curr.expiresAt);
        
        if (currExpiryBetter && !bestExpiryBetter) {
          best = curr;
        }
      }
    }
  }

  // 4. Update the user's cache/denormalized fields
  updateUser(userId, { plan: best.plan, premiumUntil: best.expiresAt });

  return { effectivePlan: best.plan, expiry: best.expiresAt };
}

/**
 * Super Admin Reconciliation Actions
 */
export function repairSubscription(userId: string, entitlementId: string): void {
  const db = getDb();
  const now = Date.now();
  db.prepare("UPDATE entitlements SET status = 'ACTIVE', updated_at = ? WHERE id = ? AND user_id = ?")
    .run(now, entitlementId, userId);
  recalculateUserAccess(userId);
  logSecurityEvent({ eventType: 'admin_repair_subscription', userId, details: { entitlementId } });
}

export function revokeEntitlement(userId: string, entitlementId: string): void {
  const db = getDb();
  const now = Date.now();
  db.prepare("UPDATE entitlements SET status = 'REVOKED', updated_at = ? WHERE id = ? AND user_id = ?")
    .run(now, entitlementId, userId);
  recalculateUserAccess(userId);
  logSecurityEvent({ eventType: 'admin_revoke_entitlement', userId, details: { entitlementId } });
}

export function extendEntitlement(userId: string, entitlementId: string, extraMonths: number): void {
  const ent = getEntitlement(entitlementId);
  if (!ent || ent.userId !== userId) return;

  const now = Date.now();
  const baseDate = (ent.expiresAt && ent.expiresAt > now) ? ent.expiresAt : now;
  const newExpiry = addCalendarMonths(baseDate, extraMonths);
  const newDuration = ent.durationMonths + extraMonths;

  const db = getDb();
  db.prepare("UPDATE entitlements SET expires_at = ?, duration_months = ?, status = 'ACTIVE', updated_at = ? WHERE id = ?")
    .run(newExpiry, newDuration, now, entitlementId);
  
  recalculateUserAccess(userId);
  logSecurityEvent({ eventType: 'admin_extend_entitlement', userId, details: { entitlementId, extraMonths, newExpiry } });
}

export async function processCollaborationExpiries(): Promise<number> {
  const db = getDb();
  const now = Date.now();
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  
  const {
    sendEmail,
    getCollaborationExpiryReminderEmail,
    getCollaborationExpiredEmail,
    getSubscriptionExpiryReminderEmail,
    getSubscriptionExpiredEmail
  } = await import("@/lib/services/emailService");
  const { getUserById } = await import("@/lib/services/userStore");

  // Fetch ACTIVE or EXPIRED collaborations
  const collabRows = db.prepare(`
    SELECT e.*, cb.organization FROM entitlements e
    LEFT JOIN collaboration_coupons cc ON cc.redeemed_by = e.user_id
    LEFT JOIN collaboration_batches cb ON cc.collaboration_id = cb.id
    WHERE e.source = 'COLLABORATION' AND e.expires_at IS NOT NULL
  `).all() as any[];

  let notifiedCount = 0;

  for (const row of collabRows) {
    const expiresAt = row.expires_at;
    const daysLeft = Math.floor((expiresAt - now) / MS_PER_DAY);
    const user = getUserById(row.user_id);
    if (!user) continue;

    const entId = row.id;
    const orgName = row.organization || 'your sponsor';
    const expiryDate = new Date(expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    if (row.status === 'EXPIRED' || daysLeft < 0) {
      const key = `collab_expired_${entId}`;
      const sent = await sendEmail({
        to: user.email,
        subject: "Your HPLabs Collaboration Access Has Expired",
        html: getCollaborationExpiredEmail(user.username, orgName),
        idempotencyKey: key,
        userId: user.id,
        eventType: 'collab_expired'
      });
      if (sent) notifiedCount++;
    } else if (daysLeft <= 1) {
      const key = `collab_exp1_${entId}`;
      const sent = await sendEmail({
        to: user.email,
        subject: "Action Required: HPLabs Access Expires Tomorrow",
        html: getCollaborationExpiryReminderEmail(user.username, orgName, 1, expiryDate),
        idempotencyKey: key,
        userId: user.id,
        eventType: 'collab_expiry_1d'
      });
      if (sent) notifiedCount++;
    } else if (daysLeft <= 3) {
      const key = `collab_exp3_${entId}`;
      const sent = await sendEmail({
        to: user.email,
        subject: "Reminder: HPLabs Access Expires in 3 Days",
        html: getCollaborationExpiryReminderEmail(user.username, orgName, 3, expiryDate),
        idempotencyKey: key,
        userId: user.id,
        eventType: 'collab_expiry_3d'
      });
      if (sent) notifiedCount++;
    } else if (daysLeft <= 7) {
      const key = `collab_exp7_${entId}`;
      const sent = await sendEmail({
        to: user.email,
        subject: "Notice: HPLabs Access Expires in 7 Days",
        html: getCollaborationExpiryReminderEmail(user.username, orgName, 7, expiryDate),
        idempotencyKey: key,
        userId: user.id,
        eventType: 'collab_expiry_7d'
      });
      if (sent) notifiedCount++;
    }
  }

  // Also process paid subscription expiries
  const paidRows = db.prepare(`
    SELECT * FROM entitlements 
    WHERE source = 'PAYMENT' AND status = 'ACTIVE' AND expires_at IS NOT NULL
  `).all() as any[];

  for (const row of paidRows) {
    const expiresAt = row.expires_at;
    const daysLeft = Math.floor((expiresAt - now) / MS_PER_DAY);
    const user = getUserById(row.user_id);
    if (!user) continue;

    const entId = row.id;
    const expiryDate = new Date(expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    if (daysLeft < 0) {
      const key = `paid_expired_${entId}`;
      const sent = await sendEmail({
        to: user.email,
        subject: "Your HPLabs Subscription Has Expired",
        html: getSubscriptionExpiredEmail(user.username, row.plan),
        idempotencyKey: key,
        userId: user.id,
        eventType: 'subscription_expired'
      });
      if (sent) notifiedCount++;
    } else if (daysLeft <= 1) {
      const key = `paid_exp1_${entId}`;
      const sent = await sendEmail({
        to: user.email,
        subject: "Action Required: HPLabs Subscription Expires Tomorrow",
        html: getSubscriptionExpiryReminderEmail(user.username, row.plan, 1, expiryDate),
        idempotencyKey: key,
        userId: user.id,
        eventType: 'subscription_expiry_1d'
      });
      if (sent) notifiedCount++;
    } else if (daysLeft <= 3) {
      const key = `paid_exp3_${entId}`;
      const sent = await sendEmail({
        to: user.email,
        subject: "Reminder: HPLabs Subscription Expires in 3 Days",
        html: getSubscriptionExpiryReminderEmail(user.username, row.plan, 3, expiryDate),
        idempotencyKey: key,
        userId: user.id,
        eventType: 'subscription_expiry_3d'
      });
      if (sent) notifiedCount++;
    } else if (daysLeft <= 7) {
      const key = `paid_exp7_${entId}`;
      const sent = await sendEmail({
        to: user.email,
        subject: "Notice: HPLabs Subscription Expires in 7 Days",
        html: getSubscriptionExpiryReminderEmail(user.username, row.plan, 7, expiryDate),
        idempotencyKey: key,
        userId: user.id,
        eventType: 'subscription_expiry_7d'
      });
      if (sent) notifiedCount++;
    }
  }

  return notifiedCount;
}
