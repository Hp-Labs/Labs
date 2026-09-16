import { getDb } from "../src/lib/db";
import { createUser, getUserById } from "../src/lib/services/userStore";
import { grantEntitlement, recalculateUserAccess, processCollaborationExpiries } from "../src/lib/services/entitlements";

async function testExpiries() {
  const db = getDb();
  
  const user = createUser({
    id: "test_" + Date.now(),
    username: "test_collab_" + Date.now(),
    email: "testcollab_" + Date.now() + "@hplabs.io",
    phone: "+10000000000",
    xp: 0,
    completedLabs: []
  }, "password");
  console.log("User created:", user.id);

  // 2. Grant 6-month Collaboration
  const collab = grantEntitlement(user.id, "PREMIUM", "COLLABORATION", 6);
  console.log("Collab granted:", collab.id, "Expires:", new Date(collab.expiresAt!).toISOString());

  // 3. Grant 12-month Paid Subscription
  const paid = grantEntitlement(user.id, "PREMIUM", "PAYMENT", 12);
  console.log("Paid granted:", paid.id, "Expires:", new Date(paid.expiresAt!).toISOString());

  // Verify Priority (Should pick Paid because same plan but longer expiry)
  const effective = recalculateUserAccess(user.id);
  console.log("Effective Access (Overlap):", effective);

  if (effective.expiry !== paid.expiresAt) {
    console.error("FAILED OVERLAP PRIORITY!");
    process.exit(1);
  }

  // 4. Time travel Collab to 7 days before expiry
  const now = Date.now();
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  db.prepare("UPDATE entitlements SET expires_at = ? WHERE id = ?").run(now + (7.5 * MS_PER_DAY), collab.id);

  // Run Cron
  console.log("Running Expiry Cron (7 Days)...");
  let notified = await processCollaborationExpiries();
  console.log("Notified Count:", notified);

  // Run Cron again (should be 0 due to idempotency)
  let notifiedAgain = await processCollaborationExpiries();
  console.log("Notified Count (Duplicate check):", notifiedAgain);

  // 5. Time travel to 1 day before expiry
  db.prepare("UPDATE entitlements SET expires_at = ? WHERE id = ?").run(now + (1.5 * MS_PER_DAY), collab.id);
  
  console.log("Running Expiry Cron (1 Day)...");
  notified = await processCollaborationExpiries();
  console.log("Notified Count:", notified);

  // 6. Time travel to PAST expiry
  db.prepare("UPDATE entitlements SET expires_at = ? WHERE id = ?").run(now - (1 * MS_PER_DAY), collab.id);
  
  // Wait! recalculateUserAccess should now mark it as EXPIRED!
  const afterCollabExpiry = recalculateUserAccess(user.id);
  console.log("After Collab Expiry Effective Access:", afterCollabExpiry);
  
  if (afterCollabExpiry.expiry !== paid.expiresAt) {
    console.error("FAILED FALLBACK TO PAID!");
    process.exit(1);
  }

  // Cron should detect it's expired and send the EXPIRED email
  console.log("Running Expiry Cron (Expired)...");
  notified = await processCollaborationExpiries();
  console.log("Notified Count:", notified);

  // 7. Expire the PAID subscription too
  db.prepare("UPDATE entitlements SET expires_at = ? WHERE id = ?").run(now - (1 * MS_PER_DAY), paid.id);
  const afterPaidExpiry = recalculateUserAccess(user.id);
  console.log("After Paid Expiry Effective Access:", afterPaidExpiry);

  if (afterPaidExpiry.effectivePlan !== 'FREE') {
    console.error("FAILED FALLBACK TO FREE!");
    process.exit(1);
  }

  console.log("All tests passed successfully!");
}

testExpiries().catch(console.error);
