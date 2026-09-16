path = "src/app/api/partner/activate/route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Add getSession import if missing
if "getSession" not in c:
    c = c.replace("import { NextResponse } from \"next/server\";", "import { NextResponse } from \"next/server\";\nimport { getSession } from \"@/lib/services/sessionStore\";")

# Extract user from cookie
auth_check = """
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/hplabs_session_id=([^;]+)/);
    const authSessionId = match ? match[1].trim() : null;
    if (!authSessionId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    const sessionUser = getSession(authSessionId);
    if (!sessionUser || !sessionUser.id) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    const verifiedUserId = sessionUser.id;
"""

c = c.replace("const { sessionToken, requestedMonths, userId } = await req.json();", "const { sessionToken, requestedMonths } = await req.json();\n" + auth_check)

c = c.replace("updateUser(userId,", "updateUser(verifiedUserId,")
c = c.replace("userId=${userId}", "userId=${verifiedUserId}")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed IDOR in partner activate.")
