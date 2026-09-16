import { getDb } from "@/lib/db";

import { grantEntitlement, recalculateUserAccess, type PlanLevel } from "./entitlements";

export function isEventProcessed(eventId: string): boolean {
  const db = getDb();
  const row = db.prepare("SELECT event_id FROM webhook_idempotency WHERE event_id = ?").get(eventId);
  return !!row;
}

export function markEventProcessed(eventId: string) {
  const db = getDb();
  db.prepare("INSERT INTO webhook_idempotency (event_id, processed_at) VALUES (?, ?)").run(eventId, Date.now());
}

export function recordPayment(paymentId: string, userId: string, amount: number, currency: string, status: string, planId: string) {
  const db = getDb();
  db.prepare("INSERT INTO payments (id, user_id, amount, currency, status, plan_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    paymentId, userId, amount, currency, status, planId, Date.now()
  );
}

export function extendSubscription(userId: string, plan: PlanLevel, durationMonths: number, source: 'PAYMENT' | 'COLLABORATION' = 'PAYMENT') {
  grantEntitlement(userId, plan, source, durationMonths);
}

export function revokeSubscription(userId: string) {
  // This just forces a recalculation which drops anything strictly EXPIRED.
  // We don't delete historical records. To actually revoke active, admin must use admin API.
  recalculateUserAccess(userId);
}

export function grantPartnerEntitlement(userId: string, partnerId: string, durationMonths: number = 1) {
  grantEntitlement(userId, 'PREMIUM', 'COLLABORATION', durationMonths, { partnerId });
}
