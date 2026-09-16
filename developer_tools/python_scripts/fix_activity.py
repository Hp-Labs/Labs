import os

path = r"src/app/api/labs/[id]/activity/route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Replace getAuthFromRequest entirely
old_auth = """function getAuthFromRequest(req: Request): { userId: string; authSessionId: string } | null {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/hplabs_session_id=([^;]+)/);
  const authSessionId = match ? match[1].trim() : "bypass-session";
  // We allow "HP-00000000" to proceed since auth is mocked.
  return { userId: "HP-00000000", authSessionId };
}"""

new_auth = """function getAuthFromRequest(req: Request): { userId: string; authSessionId: string } | null {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/hplabs_session_id=([^;]+)/);
  const authSessionId = match ? match[1].trim() : null;
  if (!authSessionId) return null;
  const sessionUser = getSession(authSessionId);
  if (!sessionUser || !sessionUser.id) return null;
  return { userId: sessionUser.id, authSessionId };
}"""

c = c.replace(old_auth, new_auth)

# Now fix the POST bypass
old_post = """  // Since auth is bypassed, we parse userId from body, or fallback to guest-bypass
  const body = await request.json();
  const { action, sessionId: labSessionId, userId: bodyUserId } = body;
  
  const userId = bodyUserId || "HP-00000000";
  const authSessionId = "bypass-session";"""

new_post = """  const auth = getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { userId, authSessionId } = auth;
  
  const body = await request.json();
  const { action, sessionId: labSessionId } = body;"""

c = c.replace(old_post, new_post)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed lab activity authorization.")
