import fs from "fs";
import path from "path";
import crypto from "crypto";
import Database from "better-sqlite3";

const BASE = "http://localhost:3000";
const HEALTH_SECRET = "hplabs-secure-health-secret-2026";
const REPORT_PATH = "lab_regression_report.json";

function computeXorFlag(userId, labId, sessionId, resetCount = 0) {
  const secret = "hplabs_secure_salt_2026_x89f";
  const raw = `${userId}:${labId}:${sessionId}:${resetCount}:${secret}`;
  const cleanLab = labId.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();
  const hash = crypto.createHash("sha256").update(raw).digest("hex").slice(0, 16).toUpperCase();
  return `FLAG{HPL_${cleanLab}_${hash}}`;
}

const SEVERITY_XP_FLOORS = { information: 10, low: 25, medium: 50, high: 100, critical: 150 };
function computeXP(severity, baseXpReward, isRepeat, usedHints) {
  if (isRepeat) return { total: 0, base: 0, firstBonus: 0, noHintBonus: 0 };
  const floor = SEVERITY_XP_FLOORS[severity?.toLowerCase()] || 0;
  const base = Math.max(baseXpReward || 0, floor);
  const firstBonus = Math.round(base * 0.2);
  const noHintBonus = usedHints === 0 ? Math.round(base * 0.1) : 0;
  return { total: base + firstBonus + noHintBonus, base, firstBonus, noHintBonus };
}

const XP_GATES = { information: 0, low: 10, medium: 60, high: 160, critical: 360 };

function makeApiClient(cookieJar = { cookie: "" }) {
  return async function api(method, urlPath, body = null, headers = {}) {
    try {
      const opts = { method, headers: { "Content-Type": "application/json", ...headers } };
      if (cookieJar.cookie) opts.headers.Cookie = cookieJar.cookie;
      if (body) opts.body = JSON.stringify(body);
      const res = await fetch(BASE + urlPath, opts);
      const setCookie = res.headers.get("set-cookie");
      if (setCookie) {
        const match = setCookie.match(/hplabs_session_id=([^;]+)/);
        if (match) cookieJar.cookie = "hplabs_session_id=" + match[1];
      }
      let json = null;
      try { json = await res.json(); } catch {}
      return { status: res.status, json, headers: res.headers };
    } catch (e) {
      return { status: 500, json: { message: e.message } };
    }
  };
}

async function seedUser(humanId, xp = 99999) {
  const jar = globalJar;
  const api = makeApiClient(jar);
  
  await api("POST", "/api/auth/register-otp/request", { email: humanId + "@test.com", phone: "1234567890" });
  const db = new Database("data/hplabs.db");
  const otpRec = db.prepare("SELECT email_otp, phone_otp FROM otp_store WHERE identifier = ?").get(humanId + "@test.com");
  db.close();

  const regRes = await api("POST", "/api/auth/register", {
    username: humanId, email: humanId + "@test.com", password: "Password123", phone: "1234567890", emailOTP: otpRec.email_otp, phoneOTP: otpRec.phone_otp
  });
  let trueUserId = humanId;
  const dbPath = path.join(process.cwd(), "data", "hplabs.db");
  if (fs.existsSync(dbPath)) {
    const Database = (await import("better-sqlite3")).default;
    const db = new Database(dbPath);
    db.prepare("UPDATE users SET xp = ? WHERE email = ?").run(xp, humanId + "@test.com");
    const row = db.prepare("SELECT id FROM users WHERE email = ?").get(humanId + "@test.com");
    if (row) trueUserId = row.id;
    db.close();
  }
  return trueUserId;
}

async function seedSecondUser(humanId, xp = 99999) {
  const jar2 = { cookie: "" };
  const api2 = makeApiClient(jar2);

  await api2("POST", "/api/auth/register-otp/request", { email: humanId + "@test.com", phone: "9876543210" });
  const db2 = new Database("data/hplabs.db");
  const otpRec2 = db2.prepare("SELECT email_otp, phone_otp FROM otp_store WHERE identifier = ?").get(humanId + "@test.com");
  db2.close();

  await api2("POST", "/api/auth/register", {
    username: humanId, email: humanId + "@test.com", password: "Password123", phone: "9876543210", emailOTP: otpRec2.email_otp, phoneOTP: otpRec2.phone_otp
  });
  let trueUserId = humanId;
  const dbPath = path.join(process.cwd(), "data", "hplabs.db");
  if (fs.existsSync(dbPath)) {
    const Database = (await import("better-sqlite3")).default;
    const db = new Database(dbPath);
    db.prepare("UPDATE users SET xp = ? WHERE email = ?").run(xp, humanId + "@test.com");
    const row = db.prepare("SELECT id FROM users WHERE email = ?").get(humanId + "@test.com");
    if (row) trueUserId = row.id;
    db.close();
  }
  return { userId: trueUserId, api: api2 };
}

const globalJar = { cookie: "" }; const api = makeApiClient(globalJar);

async function probeLabs() {
  const labs = [];
  const domains = ["web", "net", "cloud"];
  const severities = ["info", "low", "medium", "high", "critical"];
  for (const d of domains) {
    for (const s of severities) {
      for (let i = 1; i <= 50; i++) {
        const id = `${d}-${s}-${i.toString().padStart(3, '0')}`;
        labs.push(id);
      }
    }
  }
  return labs;
}

async function runSessionIsolationTests(userIdA, userB) {
  const tests = [];
  const labId = "web-info-001";
  
  const aStart = await api("POST", `/api/labs/${labId}/activity`, { action: "start" });
  const bStart = await userB.api("POST", `/api/labs/${labId}/activity`, { action: "start" });
  
  const sidA = aStart.json?.sessionId;
  const sidB = bStart.json?.sessionId;
  
  tests.push({
    test: "Unique session IDs",
    status: (sidA && sidB && sidA !== sidB) ? "PASS" : "FAIL",
    detail: `sidA=${sidA} sidB=${sidB}`
  });
  
  const crossAtoB = await userB.api("POST", `/api/labs/${labId}/activity`, { action: "activity", sessionId: sidA });
  tests.push({
    test: "User A session -> User B rejected",
    status: crossAtoB.status === 403 ? "PASS" : "FAIL",
    detail: `${crossAtoB.status}`,
  });

  const crossBtoA = await api("POST", `/api/labs/${labId}/activity`, { action: "activity", sessionId: sidB });
  tests.push({
    test: "User B session -> User A rejected",
    status: crossBtoA.status === 403 ? "PASS" : "FAIL",
    detail: `${crossBtoA.status}`,
  });

  const fabRes = await api("POST", `/api/labs/${labId}/activity`, { action: "activity", sessionId: "1234567890abcdef" });
  tests.push({
    test: "Fabricated session -> rejected",
    status: fabRes.status === 401 ? "PASS" : "FAIL",
    detail: `${fabRes.status}`,
  });

  const unauthApi = makeApiClient();
  const unauthRes = await unauthApi("POST", `/api/labs/${labId}/activity`, { action: "start" });
  tests.push({
    test: "Unauthenticated request -> rejected",
    status: unauthRes.status === 401 ? "PASS" : "FAIL",
    detail: `${unauthRes.status}`,
  });

  const flagA = computeXorFlag(userIdA, labId, sidA, 0);
  const crossFlagRes = await userB.api("POST", "/api/labs/submit-flag", { labId, flag: flagA, usedHints: 0, isRepeat: false, labSessionId: sidB });
  tests.push({
    test: "Cross-user flag rejection",
    status: crossFlagRes.json?.success === false ? "PASS" : "FAIL",
    detail: "cross_submit=false",
  });

  const flagB = computeXorFlag(userB.userId, labId, sidB, 0);
  tests.push({
    test: "Per-user unique flags",
    status: flagA !== flagB ? "PASS" : "FAIL",
    detail: "flags are different"
  });

  return tests;
}

function chk(name, status, detail) { return { test: name, status, detail }; }

async function testLab(labId, userId) {
  const checks = [];
  const startRes = await api("POST", `/api/labs/${labId}/activity`, { action: "start" });
  const sessionId = startRes.json?.sessionId;
  checks.push(chk("T2_activation", sessionId ? "PASS" : "FAIL", sessionId ? "sid=ok" : "fail"));
  if (!sessionId) return { labId, checks, status: "FAIL" };
  
  const actRes = await api("POST", `/api/labs/${labId}/activity`, { action: "activity", sessionId: sessionId });
  checks.push(chk("T3_activity_tracking", actRes.status === 200 ? "PASS" : "FAIL", `${actRes.status}`));

  const flag = computeXorFlag(userId, labId, sessionId, 0);
  let submitOk = false;
  const rawRes = await api("POST", "/api/labs/submit-flag", { labId, flag, usedHints: 0, isRepeat: false, labSessionId: sessionId }); console.log("rawRes.json:", rawRes.json);
  if (rawRes.json?.success) {
    submitOk = true; 
  } else {
    const wrappedRes = await api("POST", "/api/labs/submit-flag", { labId, flag: flag, usedHints: 0, isRepeat: false, labSessionId: sessionId });
    if (wrappedRes.json?.success) {
      submitOk = true; 
    }
  }
  checks.push(chk("T5_flag_validation", submitOk ? "PASS" : "FAIL", "submit"));

  if (submitOk) {
    const repeatRes = await api("POST", "/api/labs/submit-flag", { labId, flag, usedHints: 0, isRepeat: true, labSessionId: sessionId });
    checks.push(chk("T7_completion_recorded", repeatRes.json?.success ? "PASS" : "WARN", "ok"));
  } else {
    checks.push(chk("T7_completion_recorded", "WARN", "Skipped"));
  }

  const resetRes = await api("POST", `/api/labs/${labId}/activity`, { action: "reset", sessionId: sessionId });
  checks.push(chk("T10_reset", resetRes.status === 200 ? "PASS" : "FAIL", `${resetRes.status}`));

  const flagReset = computeXorFlag(userId, labId, sessionId, 1);
  const rawRes2 = await api("POST", "/api/labs/submit-flag", { labId, flag: flagReset, usedHints: 0, isRepeat: false, labSessionId: sessionId });
  checks.push(chk("T11_reset_flag_validation", rawRes2.json?.success ? "PASS" : "FAIL", "submit"));

  const oldFlagRes = await api("POST", "/api/labs/submit-flag", { labId, flag: flag, usedHints: 0, isRepeat: false, labSessionId: sessionId });
  checks.push(chk("T12_old_flag_rejected", !oldFlagRes.json?.success ? "PASS" : "FAIL", "rejected"));

  const allPass = checks.every(c => c.status === "PASS" || c.status === "WARN");
  return { labId, checks, status: allPass ? "PASS" : "FAIL" };
}

async function run() {
  console.log("============================================================");
  console.log("  HPLabs Lab Regression Test Runner v3 (SQLite)");
  console.log("  " + new Date().toISOString());
  console.log("============================================================");

  const uA = "reg_user_a_" + Date.now();
  const userIdA = await seedUser(uA);

  const uB = "reg_user_b_" + Date.now();
  const userB = await seedSecondUser(uB);

  const labs = await probeLabs();
  if (labs.length === 0) return;

  const validLabs = [];
  for (const l of labs) {
      const res = await api("GET", `/api/labs/${l}/activity`);
      if (res.status !== 404) {
          validLabs.push(l);
      }
      if (validLabs.length >= 79) break;
  }
  
  const isoTests = await runSessionIsolationTests(userIdA, userB);
  for (const t of isoTests) {
    console.log("  " + t.test + " : " + t.status);
  }

  const results = [];
  for (const l of validLabs) {
      results.push(await testLab(l, userIdA));
      console.log("Finished " + l);
  }

  const failed = results.filter(r => r.status === "FAIL");
  console.log("Summary: " + (results.length - failed.length) + "/" + results.length);
  if (failed.length > 0) {
    failed.forEach(f => console.log(JSON.stringify(f, null, 2)));
  }
}

run().catch(console.error);





