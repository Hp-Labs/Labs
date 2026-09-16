import { getDb } from "../lib/db";
import { createUser, updateUser } from "../lib/services/userStore";
import crypto from "crypto";
import { generateSecret, generateURI } from "otplib";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const EMAIL = "info@hackerplus.in";

async function promptPassword(): Promise<string> {
  if (process.env.BOOTSTRAP_PASSWORD) return process.env.BOOTSTRAP_PASSWORD;
  return new Promise((resolve) => {
    rl.question("Enter secure password for Super Admin: ", (pass) => {
      resolve(pass);
    });
  });
}

async function run() {
  console.log("=========================================");
  console.log("   HPLabs Super Admin Bootstrap");
  console.log("=========================================\n");

  const db = getDb();
  let user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(EMAIL);

  let newPassword = "";

  if (!user) {
    console.log(`[+] Account ${EMAIL} does not exist. Creating...`);
    newPassword = await promptPassword();
    if (newPassword.length < 12) {
      console.log("[-] Password must be at least 12 characters.");
      process.exit(1);
    }

    const userId = "admin_" + crypto.randomBytes(8).toString("hex");
    createUser({
      id: userId,
      username: "superadmin",
      email: EMAIL,
      xp: 0,
      completedLabs: []
    }, newPassword);

    updateUser(userId, {
      plan: "ADVANCED",
      emailVerified: true,
      role: "SUPER_ADMIN"
    });

    user = db.prepare("SELECT * FROM users WHERE email = ?").get(EMAIL);
    console.log(`[+] Account created successfully.`);
  } else {
    console.log(`[+] Account ${EMAIL} already exists.`);
    
    if (!user.password_hash || user.password_hash === "'" || user.password_hash === "") {
      console.log(`[!] No usable password found for ${EMAIL}.`);
      newPassword = await promptPassword();
      if (newPassword.length < 12) {
        console.log("[-] Password must be at least 12 characters.");
        process.exit(1);
      }
      
      const salt = crypto.randomBytes(32).toString("hex");
      const hash = crypto.pbkdf2Sync(newPassword, salt, 100000, 64, "sha512").toString("hex");
      
      db.prepare("UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?").run(hash, salt, user.id);
      console.log(`[+] Password set successfully.`);
    }
  }

  // Ensure role is SUPER_ADMIN
  db.prepare("UPDATE users SET role = ?, is_admin = 1 WHERE id = ?").run("SUPER_ADMIN", user.id);

  // Handle MFA
  if (!user.mfa_secret) {
    console.log(`\n[!] MFA is not configured. Generating TOTP secret...`);
    const secret = generateSecret();
    const otpauth = generateURI({ issuer: "HPLabs", label: EMAIL, secret });
    
    db.prepare("UPDATE users SET mfa_secret = ?, mfa_enabled = 1 WHERE id = ?").run(secret, user.id);
    
    console.log(`\n=========================================`);
    console.log(`         MFA SETUP REQUIRED`);
    console.log(`=========================================`);
    console.log(`Please add the following secret to your Authenticator app:`);
    console.log(`\nSecret Key: ${secret}\n`);
    console.log(`Or use this URI to generate a QR code:`);
    console.log(otpauth);
    console.log(`=========================================\n`);
    console.log(`[+] MFA configured successfully. Login now requires MFA.`);
  } else {
    console.log(`[+] MFA is already configured.`);
    console.log(`[!] To reset MFA, delete mfa_secret from the database and re-run.`);
  }

  console.log(`\n[+] Bootstrap complete.`);
  process.exit(0);
}

run().catch(console.error);
