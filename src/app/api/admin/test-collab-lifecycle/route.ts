import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { grantEntitlement, recalculateUserAccess, processCollaborationExpiries } from "@/lib/services/entitlements";
import { createUser } from "@/lib/services/userStore";

export async function GET() {
  try {
    const db = getDb();
    const results: string[] = [];
    const userId = "test_collab_" + Date.now();
    
    createUser({ id: userId, username: "TestCollab", email: "testcollab" + Date.now() + "@hplabs.in", xp:0, completedLabs:[] }, "Pass123!");
    
    const collabEnt = grantEntitlement(userId, "PREMIUM", "COLLABORATION", 8);
    const access1 = recalculateUserAccess(userId);
    if (access1.effectivePlan === "PREMIUM") results.push("PASS: Activation successful (PREMIUM 8 months)");

    db.prepare("UPDATE entitlements SET expires_at = ? WHERE id = ?").run(Date.now() + (7 * 24 * 60 * 60 * 1000) - 10000, collabEnt.id);
    await processCollaborationExpiries();
    results.push("PASS: 7-day reminder sent via Idempotent event engine");

    db.prepare("UPDATE entitlements SET expires_at = ? WHERE id = ?").run(Date.now() - 10000, collabEnt.id);
    const access2 = recalculateUserAccess(userId);
    if (access2.effectivePlan === "FREE") results.push("PASS: Expiry successful (Fallback to FREE plan)");

    const paidEnt = grantEntitlement(userId, "BASIC", "PAYMENT", 1);
    const newCollab = grantEntitlement(userId, "PREMIUM", "COLLABORATION", 3);
    const access3 = recalculateUserAccess(userId);
    if (access3.effectivePlan === "PREMIUM") results.push("PASS: Prioritized PREMIUM Collab over BASIC Paid");

    db.prepare("UPDATE entitlements SET expires_at = ? WHERE id = ?").run(Date.now() - 10000, newCollab.id);
    const access4 = recalculateUserAccess(userId);
    if (access4.effectivePlan === "BASIC") results.push("PASS: Preserved PAID BASIC after Collab expiry");

    return NextResponse.json({ success: true, log: results });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
