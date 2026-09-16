path = "src/app/api/labs/[id]/activity/route.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

if "import { getUserById, deductUserXP }" not in content:
    content = content.replace(
        "import { NextResponse } from \"next/server\";",
        "import { NextResponse } from \"next/server\";\nimport { getUserById, deductUserXP } from \"@/lib/services/userStore\";"
    )

old_start = """      const newLabSessionId = createLabSession(userId, labId, authSessionId);
      const session = getLabSession(newLabSessionId);"""

new_start = """      const user = getUserById(userId);
      const isPro = user?.premiumUntil ? user.premiumUntil > Date.now() : false;
      const ttlMs = isPro ? 2 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000;
      const newLabSessionId = createLabSession(userId, labId, authSessionId, ttlMs);
      const session = getLabSession(newLabSessionId);"""

content = content.replace(old_start, new_start)

# Add timeout action
timeout_action = """
    if (action === "timeout") {
      if (!labSessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });
      try {
        const session = getLabSession(labSessionId);
        if (session && session.userId === userId && !session.completed) {
            // Deduct 50 XP penalty for timeout (or some standard amount)
            deductUserXP(userId, 50);
            destroyLabSession(labSessionId);
            return NextResponse.json({ success: true, penalty: 50 });
        }
        return NextResponse.json({ error: "Session invalid or already completed" }, { status: 400 });
      } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: err.status || 403 });
      }
    }
"""

if "if (action === \"timeout\")" not in content:
    content = content.replace(
        "if (action === \"reset\") {",
        timeout_action + "\n    if (action === \"reset\") {"
    )

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Activity API updated.")
