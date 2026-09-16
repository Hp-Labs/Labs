import { getDb } from "../src/lib/db";
import { createUser, getUserByEmail, getUserById, updateUser } from "../src/lib/services/userStore";
import { generateAndStoreRegistrationOTPs, verifyRegistrationOTPs } from "../src/lib/services/otpStore";
import { grantEntitlement, recalculateUserAccess, processCollaborationExpiries, repairSubscription, revokeEntitlement, extendEntitlement } from "../src/lib/services/entitlements";
import { createCollaborationBatch, addCollaborationStudents, getStudentsForBatch, redeemCollabCoupon, checkAndActivateStudent } from "../src/lib/services/collaborationStore";
import * as emailService from "../src/lib/services/emailService";
import crypto from "crypto";
import { runSmartEngineIteration } from "../src/lib/services/smartEngine";

const results: Record<string, "PASS" | "FAIL" | "BLOCKED"> = {};

function assert(condition: boolean, section: string, msg: string) {
  if (!condition) {
    console.error(`[FAIL] ${section}: ${msg}`);
    results[section] = "FAIL";
    throw new Error(`${section}: ${msg}`);
  }
}

function markPass(section: string) {
  if (results[section] !== "FAIL") {
    results[section] = "PASS";
  }
}

async function runE2E() {
  const db = getDb();
  console.log("Starting End-to-End Test Suite...");

  try {
    // ==================================================
    // AUTH & SECURITY
    // ==================================================
    const sectionAuth = "AUTH";
    const testEmail = `test_auth_${Date.now()}@hplabs.io`;
    const user = createUser({
      id: "usr_" + Date.now(),
      username: "testauth" + Date.now(),
      email: testEmail,
      xp: 0,
      completedLabs: []
    }, "password123");

    assert(!!user, sectionAuth, "User creation failed");
    // Mark as verified (simulating OTP completion)
    updateUser(user.id, { emailVerified: true });
    
    // OTP logic — phone is optional now
    const otps = generateAndStoreRegistrationOTPs(testEmail);
    const dbInst = getDb();
    const storedOtp = dbInst.prepare("SELECT * FROM otp_store WHERE identifier = ?").get(testEmail) as any;
    assert(!!storedOtp, sectionAuth, "Failed to generate OTP");
    
    // Invalid OTP
    assert(!verifyRegistrationOTPs(testEmail, "000000"), sectionAuth, "Accepted invalid OTP");
    
    // Valid OTP (no phone OTP needed)
    assert(verifyRegistrationOTPs(testEmail, otps.emailOTP), sectionAuth, "Rejected valid OTP");
    
    // OTP Replay
    assert(!verifyRegistrationOTPs(testEmail, otps.emailOTP), sectionAuth, "Allowed OTP replay");
    
    markPass(sectionAuth);

    // ==================================================
    // SUPER ADMIN
    // ==================================================
    const sectionAdmin = "SUPER ADMIN";
    let superAdmin = getUserByEmail("info@hackerplus.in");
    if (!superAdmin) {
      superAdmin = createUser({
        id: "superadmin_test",
        username: "superadmin",
        email: "info@hackerplus.in",
        xp: 0,
        completedLabs: []
      }, "adminpassword");
      // manually elevate role
      db.prepare("UPDATE users SET role = 'SUPER_ADMIN' WHERE email = 'info@hackerplus.in'").run();
      superAdmin = getUserByEmail("info@hackerplus.in")!;
    }
    
    assert(!!superAdmin && superAdmin.role === 'SUPER_ADMIN', sectionAdmin, "Super Admin info@hackerplus.in is missing or wrong role");
    
    // Tamper test (creating user with admin role should fail, but since createUser doesn't accept role, it's safe)
    const tamperUser = createUser({
      id: "usr_tamper" + Date.now(),
      username: "tamper" + Date.now(),
      email: "tamper" + Date.now() + "@hplabs.io",
      xp: 0,
      completedLabs: []
      // @ts-ignore
    }, "pass", "SUPER_ADMIN"); // Even if passed, it's ignored.
    const fetchedTamper = getUserById(tamperUser.id);
    assert(fetchedTamper?.role === 'user', sectionAdmin, "Role tampering succeeded");
    
    markPass(sectionAdmin);

    // ==================================================
    // COLLABORATION & COUPONS
    // ==================================================
    const sectionCollab = "COLLABORATION & COUPONS";
    const batch = createCollaborationBatch({
      organization: "Fruzentrix Test",
      courseName: "6-month testing",
      courseDurationMonths: 6,
      accessDurationMonths: 8,
      plan: "PREMIUM",
      activationMethod: "COUPON",
      importedBy: superAdmin!.email
    });
    
    const studentEmail1 = `collab_stu1_${Date.now()}@test.com`;
    const studentEmail2 = `collab_stu2_${Date.now()}@test.com`;
    
    const coupons = addCollaborationStudents(batch.id, [
      { name: "Rahul", email: studentEmail1, college: "FC", rollNumber: "1" },
      { name: "Anjali", email: studentEmail2, college: "FC", rollNumber: "2" }
    ]);
    
    assert(coupons.length === 2, sectionCollab, "Failed to generate bulk coupons");
    assert(coupons[0].plaintextCode.startsWith("HP-"), sectionCollab, "Coupon format invalid");
    
    // Create actual users for these students
    const u1 = createUser({ id: "stu1_" + Date.now(), username: "rahul" + Date.now(), email: studentEmail1, xp: 0, completedLabs: [] });
    const u2 = createUser({ id: "stu2_" + Date.now(), username: "anjali" + Date.now(), email: studentEmail2, xp: 0, completedLabs: [] });
    updateUser(u1.id, { emailVerified: true });
    updateUser(u2.id, { emailVerified: true });
    
    // Wrong student tries to redeem Anjali's coupon
    const redeemWrong = redeemCollabCoupon(u1.id, coupons[1].plaintextCode);
    assert(!redeemWrong.success, sectionCollab, "Wrong student was able to redeem coupon");
    
    // Correct student redemptions
    const redeemRight1 = redeemCollabCoupon(u1.id, coupons[0].plaintextCode);
    assert(redeemRight1.success, sectionCollab, "Correct student failed to redeem coupon");
    
    // Second redemption (Replay)
    const redeemAgain = redeemCollabCoupon(u1.id, coupons[0].plaintextCode);
    assert(!redeemAgain.success, sectionCollab, "Second redemption succeeded (replay vulnerability)");
    
    markPass(sectionCollab);

    // ==================================================
    // ENTITLEMENT (Expiry & Overlap)
    // ==================================================
    const sectionEntitlement = "ENTITLEMENT";
    // Grant paid subscription to u1
    const paidEnt = grantEntitlement(u1.id, "PREMIUM", "PAYMENT", 12);
    
    const effective = recalculateUserAccess(u1.id);
    assert(effective.effectivePlan === 'PREMIUM', sectionEntitlement, "Effective plan incorrect");
    assert(effective.expiry === paidEnt.expiresAt, sectionEntitlement, "Did not prioritize 12-month paid over 8-month collab");
    
    // Expire the collab manually
    db.prepare("UPDATE entitlements SET expires_at = ? WHERE source = 'COLLABORATION' AND user_id = ?").run(Date.now() - 100000, u1.id);
    const postCollabExpiry = recalculateUserAccess(u1.id);
    assert(postCollabExpiry.effectivePlan === 'PREMIUM', sectionEntitlement, "Paid subscription was lost after collab expiry");
    
    // Expire Paid manually
    db.prepare("UPDATE entitlements SET expires_at = ? WHERE id = ?").run(Date.now() - 100000, paidEnt.id);
    const postPaidExpiry = recalculateUserAccess(u1.id);
    assert(postPaidExpiry.effectivePlan === 'FREE', sectionEntitlement, "Did not fallback to FREE");

    markPass(sectionEntitlement);

    // ==================================================
    // ADMIN RECOVERY
    // ==================================================
    const sectionRecovery = "ADMIN RECOVERY";
    // Fix expiry first so it doesn't auto-expire
    db.prepare("UPDATE entitlements SET expires_at = ? WHERE id = ?").run(Date.now() + 10000000, paidEnt.id);
    repairSubscription(u1.id, paidEnt.id);
    const repairedAccess = recalculateUserAccess(u1.id);
    assert(repairedAccess.effectivePlan === 'PREMIUM', sectionRecovery, "Admin repair failed to restore subscription");
    
    revokeEntitlement(u1.id, paidEnt.id);
    const revokedAccess = recalculateUserAccess(u1.id);
    assert(revokedAccess.effectivePlan === 'FREE', sectionRecovery, "Admin revoke failed");
    
    extendEntitlement(u1.id, paidEnt.id, 1);
    const extendedAccess = recalculateUserAccess(u1.id);
    assert(extendedAccess.effectivePlan === 'PREMIUM', sectionRecovery, "Admin extend failed");

    markPass(sectionRecovery);

    // ==================================================
    // EMAIL
    // ==================================================
    const sectionEmail = "EMAIL";
    // Verify all key templates render correctly
    const welcomeHtml = emailService.getWelcomeEmail("test");
    assert(welcomeHtml.includes("HackerPlus"), sectionEmail, "Welcome template broken");
    assert(welcomeHtml.includes("test"), sectionEmail, "Welcome template missing username");

    const otpHtml = emailService.getOTPVerificationEmail("A1B2C3D4");
    assert(otpHtml.includes("A1B2C3D4"), sectionEmail, "OTP template missing OTP code");
    assert(otpHtml.toLowerCase().includes("expir"), sectionEmail, "OTP template missing expiry notice");

    const resetHtml = emailService.getPasswordResetEmail("RESET1234TOKEN");
    assert(resetHtml.includes("RESET1234TOKEN"), sectionEmail, "Password reset template broken");

    const paymentHtml = emailService.getPaymentSuccessEmail("test", "PREMIUM", 59900, "INR", "12 March 2027");
    assert(paymentHtml.includes("PREMIUM"), sectionEmail, "Payment success template broken");

    const expiryHtml = emailService.getCollaborationExpiryReminderEmail("test", "Fruzentrix", 7, "12 March 2027");
    assert(expiryHtml.includes("7 day"), sectionEmail, "Collaboration expiry reminder broken");
    assert(expiryHtml.includes("Fruzentrix"), sectionEmail, "Expiry reminder missing org name");

    const expiredHtml = emailService.getCollaborationExpiredEmail("test", "Fruzentrix");
    assert(expiredHtml.toLowerCase().includes("expired"), sectionEmail, "Collaboration expired template broken");

    const subExpiryHtml = emailService.getSubscriptionExpiryReminderEmail("test", "PREMIUM", 3, "12 March 2027");
    assert(subExpiryHtml.includes("3 day"), sectionEmail, "Subscription expiry reminder broken");

    // Backwards-compat aliases
    const aliasExpiryHtml = emailService.getExpiryReminderEmail("test", 7);
    assert(aliasExpiryHtml.includes("7 day"), sectionEmail, "getExpiryReminderEmail alias broken");

    const aliasExpiredHtml = emailService.getExpiredEmail("test");
    assert(aliasExpiredHtml.toLowerCase().includes("expired"), sectionEmail, "getExpiredEmail alias broken");

    markPass(sectionEmail);

  } catch (err: any) {
    console.error("Test execution aborted:", err.stack || err.message);
  }

  console.log("\n==================================================");
  console.log("FINAL REPORT");
  console.log("==================================================");
  for (const [section, status] of Object.entries(results)) {
    console.log(`${section.padEnd(25, ' ')}: ${status}`);
  }
}

runE2E().catch(console.error);
