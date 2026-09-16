path = "src/app/api/labs/[id]/activity/route.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

old_timeout = """    if (action === "timeout") {
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
    }"""

new_timeout = """    if (action === "timeout") {
      if (!labSessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });
      try {
        const session = getLabSession(labSessionId);
        if (session && session.userId === userId && !session.completed) {
            // Dynamically calculate 50% penalty based on lab reward
            const { getLabById } = await import("@/lib/data/redteam");
            const { VULNERABILITIES } = await import("@/lib/data/vulnerabilities");
            const lab = getLabById(labId) || VULNERABILITIES.find(v => v.id === labId);
            const reward = lab?.xpReward || 50;
            const penalty = Math.max(1, Math.floor(reward / 2)); // 50% of the reward
            
            deductUserXP(userId, penalty);
            destroyLabSession(labSessionId);
            return NextResponse.json({ success: true, penalty });
        }
        return NextResponse.json({ error: "Session invalid or already completed" }, { status: 400 });
      } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: err.status || 403 });
      }
    }"""

content = content.replace(old_timeout, new_timeout)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated timeout penalty logic to be 50% of lab reward.")
