import assert from 'assert';
import { getSession } from './src/lib/services/sessionStore.ts';
import { checkDailyBonusAvailable } from './src/lib/services/userStore.ts';

// Test suite for verified security controls
console.log("Running Security Regression Tests...");

// 1. Admin Bypass Test
const middlewareStr = require('fs').readFileSync('src/middleware.ts', 'utf8');
assert.ok(!middlewareStr.includes('// Auth disabled temporarily'), "Admin UI bypass is still present in middleware");

// 2. Activity Session Bypass Test
const activityRoute = require('fs').readFileSync('src/app/api/labs/[id]/activity/route.ts', 'utf8');
assert.ok(!activityRoute.includes('userId: "HP-00000000"'), "Lab activity bypass HP-00000000 is still present");
assert.ok(activityRoute.includes('const sessionUser = getSession(authSessionId)'), "Lab activity does not validate session");

// 3. Mock Fallback Session Test
const sessionRoute = require('fs').readFileSync('src/app/api/auth/session/route.ts', 'utf8');
assert.ok(!sessionRoute.includes('isPremium: true'), "Session endpoint still leaks premium mock user");
assert.ok(sessionRoute.includes('status: 401'), "Session endpoint does not return 401 for unauthenticated users");

// 4. Daily Bonus Auth Test
const dailyBonusRoute = require('fs').readFileSync('src/app/api/users/daily-bonus/route.ts', 'utf8');
assert.ok(!dailyBonusRoute.includes('req.json()'), "Daily bonus still takes userId from body instead of session");
assert.ok(dailyBonusRoute.includes('getSession(sessionId)'), "Daily bonus does not validate session");

// 5. Support Ticket Escalation Test
const escalateRoute = require('fs').readFileSync('src/app/api/support/escalate/route.ts', 'utf8');
assert.ok(!escalateRoute.includes('userId === "HP-00000000"'), "Support ticket API still allows HP-00000000 bypass");

console.log("All security regression tests PASSED.");
