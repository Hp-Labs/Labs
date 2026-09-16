import os

print("Running Security Regression Tests in Python...")

middlewareStr = open("src/middleware.ts", "r").read()
assert "// Auth disabled temporarily" not in middlewareStr, "Admin UI bypass is still present in middleware"
print("1. Admin Bypass Test: PASS")

activityRoute = open("src/app/api/labs/[id]/activity/route.ts", "r").read()
assert 'userId: "HP-00000000"' not in activityRoute, "Lab activity bypass HP-00000000 is still present"
assert 'const sessionUser = getSession(authSessionId)' in activityRoute, "Lab activity does not validate session"
print("2. Activity Session Bypass Test: PASS")

sessionRoute = open("src/app/api/auth/session/route.ts", "r").read()
assert 'isPremium: true' not in sessionRoute, "Session endpoint still leaks premium mock user"
assert 'status: 401' in sessionRoute, "Session endpoint does not return 401 for unauthenticated users"
print("3. Mock Fallback Session Test: PASS")

dailyBonusRoute = open("src/app/api/users/daily-bonus/route.ts", "r").read()
assert 'req.json()' not in dailyBonusRoute, "Daily bonus still takes userId from body instead of session"
assert 'getSession(sessionId)' in dailyBonusRoute, "Daily bonus does not validate session"
print("4. Daily Bonus Auth Test: PASS")

escalateRoute = open("src/app/api/support/escalate/route.ts", "r").read()
assert 'userId === "HP-00000000"' not in escalateRoute, "Support ticket API still allows HP-00000000 bypass"
print("5. Support Ticket Escalation Test: PASS")

print("All security regression tests PASSED.")
