path = "src/app/api/labs/[id]/activity/route.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("destroyLabSession(session.id);", "destroyLabSession(session.labSessionId);")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed session.id")
