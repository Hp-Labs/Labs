path = "src/app/api/labs/submit-flag/route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("const { labId, flag, isRepeat = false, labSessionId } = body;", "const { labId, flag, labSessionId } = body;")
c = c.replace("const userState = getUserState(userId);", "const userState = getUserState(userId);\n    const isRepeat = userState?.completedLabs.includes(labId) || false;")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed isRepeat trust defect.")
