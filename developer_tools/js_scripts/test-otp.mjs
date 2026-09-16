
import fs from "fs";
import path from "path";

const BASE = "http://localhost:3000";

async function runTests() {
  console.log("=== Testing OTP ===");

  const email = "test-otp-" + Date.now() + "@hackerplus.in";
  const phone = "1234567890";

  // 1. Request OTP
  const reqRes = await fetch(BASE + "/api/auth/register-otp/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, phone })
  });
  console.log("Request OTP:", reqRes.status, await reqRes.text());

  // Wait a bit to ensure it writes to mock-mailbox.json
  await new Promise(r => setTimeout(r, 500));

  // Read mock mailbox
  const mailboxFile = path.join(process.cwd(), "scratch", "mock-mailbox.json");
  const mailbox = JSON.parse(fs.readFileSync(mailboxFile, 'utf8'));
  const otps = mailbox[email];
  console.log("Found OTPs in mailbox:", otps);

  if (!otps) {
    console.error("No OTPs found in mailbox. Make sure dispatchMockOTP is writing correctly!");
    process.exit(1);
  }

  const { emailOTP, phoneOTP } = otps;

  // 2. Test Invalid OTP
  const invalidRes = await fetch(BASE + "/api/auth/register-otp/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, emailOTP: "INVALID1", phoneOTP: "INVALID2" })
  });
  console.log("Invalid OTP:", invalidRes.status, await invalidRes.text());

  // 3. Test Valid OTP
  const validRes = await fetch(BASE + "/api/auth/register-otp/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, emailOTP, phoneOTP })
  });
  console.log("Valid OTP:", validRes.status, await validRes.text());

  // 4. Test Reused OTP
  const reusedRes = await fetch(BASE + "/api/auth/register-otp/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, emailOTP, phoneOTP })
  });
  console.log("Reused OTP:", reusedRes.status, await reusedRes.text());

  // 5. Test Register with no OTPs (should fail now that OTP is required)
  const regRes = await fetch(BASE + "/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "test_user123", email: "new" + email, phone, password: "Password123!", emailOTP: "00000000", phoneOTP: "00000000" })
  });
  console.log("Register with bad OTP:", regRes.status, await regRes.text());
}

runTests().catch(console.error);
