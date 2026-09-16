path = "src/app/api/labs/submit-flag/route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Replace body.usedHints with session.hintsUsed.length
c = c.replace("const { labId, flag, usedHints = 0, isRepeat = false, labSessionId } = body;", "const { labId, flag, isRepeat = false, labSessionId } = body;")
c = c.replace("computeXP(redTeamLab.severity, redTeamLab.xpReward, isRepeat, usedHints);", "computeXP(redTeamLab.severity, redTeamLab.xpReward, isRepeat, session.hintsUsed.length);")
c = c.replace("computeXP(legacyLab.difficulty || \"medium\", legacyLab.xpReward || 50, isRepeat, usedHints);", "computeXP(legacyLab.difficulty || \"medium\", legacyLab.xpReward || 50, isRepeat, session.hintsUsed.length);")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed hintsUsed trust defect.")
