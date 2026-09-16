path = "src/app/api/support/route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Add getSession import if missing
if "getSession" not in c:
    c = c.replace("import { NextRequest, NextResponse } from \"next/server\";", "import { NextRequest, NextResponse } from \"next/server\";\nimport { getSession } from \"@/lib/services/sessionStore\";")

auth_check = """
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/hplabs_session_id=([^;]+)/);
    const authSessionId = match ? match[1].trim() : null;
    let authUserId = userId; // fallback for backwards compatibility? NO.
    if (authSessionId) {
      const sessionUser = getSession(authSessionId);
      if (sessionUser && sessionUser.id) {
        authUserId = sessionUser.id;
      } else {
        authUserId = undefined;
      }
    } else {
      authUserId = undefined;
    }
"""

c = c.replace("const { message, userId, sessionId } = body;", "const { message, sessionId } = body;\n" + auth_check)
c = c.replace("executeRemediation(diagnosis.action, userId, sessionId);", "executeRemediation(diagnosis.action, authUserId, sessionId);")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed IDOR in support route.")
