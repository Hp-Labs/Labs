
import fs from "fs";
import path from "path";

const BASE = "http://localhost:3000";

async function runPartnerTests() {
  console.log("=== Testing Partner OTP ===");

  const email = "alex.williams@cyber.uni.edu"; // Exists in partnerStudentStore.ts

  // 1. Request OTP
  const reqRes = await fetch(BASE + "/api/partner/request-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  console.log("Request Partner OTP:", reqRes.status, await reqRes.text());

  await new Promise(r => setTimeout(r, 500));
  const mailboxFile = path.join(process.cwd(), "scratch", "mock-mailbox.json");
  const mailbox = JSON.parse(fs.readFileSync(mailboxFile, 'utf8'));
  const otps = mailbox[email];
  console.log("Found Partner OTP in mailbox:", otps);

  if (!otps || !otps.partnerOTP) {
    console.error("No Partner OTP found in mailbox!");
    process.exit(1);
  }

  const code = otps.partnerOTP;

  // 2. Test Invalid OTP
  const invalidRes = await fetch(BASE + "/api/partner/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code: "INVALID1" })
  });
  console.log("Invalid Partner OTP:", invalidRes.status, await invalidRes.text());

  // 3. Test Valid OTP
  const validRes = await fetch(BASE + "/api/partner/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code })
  });
  console.log("Valid Partner OTP:", validRes.status, await validRes.text());

  // 4. Test Reused OTP
  const reusedRes = await fetch(BASE + "/api/partner/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code })
  });
  console.log("Reused Partner OTP:", reusedRes.status, await reusedRes.text());
}

runPartnerTests().catch(console.error);
