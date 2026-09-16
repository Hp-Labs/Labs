const fs = require('fs');
const p = "C:/Users/VIJAY/.gemini/antigravity/brain/1c2b0c70-bd06-461b-b6cf-9cf481e0a2cc/scratch/lab_regression.mjs";
let text = fs.readFileSync(p, 'utf8');

text = text.replace(/const regRes = await api\("POST", "\/api\/auth\/register", \{[\s\S]*?console\.log\("Register result:", regRes\.status, regRes\.text\);/, 
  // 1a. Request OTP
  await api("POST", "/api/auth/otp/send", { email: userId + "@test.com", phone: "1234567890" });
  
  // 1b. Read OTP from file
  const otpPath = require('path').join(process.cwd(), "data", "otp_store.json");
  const otpStore = JSON.parse(fs.readFileSync(otpPath, 'utf8'));
  const record = otpStore[userId + "@test.com"];
  const emailOTP = record ? record.emailOTP : "000000";
  const phoneOTP = record ? record.phoneOTP : "000000";

  // 1c. Register
  const regRes = await api("POST", "/api/auth/register", {
    username: userId,
    email: userId + "@test.com",
    password: "Password123",
    phone: "1234567890",
    emailOTP,
    phoneOTP
  });
  console.log("Register result:", regRes.status, regRes.text);
);

fs.writeFileSync(p, text);
