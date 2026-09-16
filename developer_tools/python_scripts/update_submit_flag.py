path = "src/app/api/labs/submit-flag/route.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
old_check = """  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { labId, flag } = await req.json();
    if (!labId) return NextResponse.json({ error: "Lab ID required" }, { status: 400 });"""

new_check = """  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { labId, flag } = await req.json();
    if (!labId) return NextResponse.json({ error: "Lab ID required" }, { status: 400 });

    // Ensure session isn't already marked completed to avoid duplicate XP
    const activeSessions = getUserLabSessions(auth.userId);
    const existing = activeSessions.find(s => s.labId === labId);
    if (!existing) {
      return NextResponse.json({ error: "No active session found for this lab" }, { status: 400 });
    }
    if (existing.completed) {
      return NextResponse.json({ error: "Lab already completed" }, { status: 400 });
    }
"""

content = content.replace(old_check, new_check)

old_award = """    // Flag is correct!
    // Compute XP using xpEngine
    const baseXP = SERVER_PROGRESSION_CONFIG.xpRewards.labCompletion[lab.severity] || 50;
    const finalXP = computeXP(baseXP);

    // Update user state
    awardUserXPAndLab(auth.userId, finalXP, lab.id);

    // Record session completion
    try {
      const activeSessions = getUserLabSessions(auth.userId);
      const s = activeSessions.find(s => s.labId === lab.id && !s.completed);
      if (s) {
        recordCompletion(s.labSessionId, finalXP);
      }
    } catch(e) {}"""

new_award = """    // Flag is correct!
    // Compute XP using xpEngine
    const baseXP = SERVER_PROGRESSION_CONFIG.xpRewards.labCompletion[lab.severity] || 50;
    const finalXP = computeXP(baseXP);

    // Update user state
    awardUserXPAndLab(auth.userId, finalXP, lab.id);

    // Record session completion explicitly to stop dupes
    recordCompletion(existing.labSessionId, finalXP);"""

content = content.replace(old_award, new_award)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated submit-flag to block double XP")
