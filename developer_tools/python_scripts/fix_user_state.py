path = "src/lib/services/userStore.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("export function getUserState(userId: string): { xp: number; completedLabs: string[] } | undefined {", "export function getUserState(userId: string): { xp: number; completedLabs: string[], isAdmin?: boolean } | undefined {")
c = c.replace("const row = db.prepare(\"SELECT xp FROM users WHERE id = ?\").get(userId) as any;", "const row = db.prepare(\"SELECT xp, is_admin FROM users WHERE id = ?\").get(userId) as any;")
c = c.replace("return { xp: row.xp, completedLabs: getCompletedLabsForUser(userId) };", "return { xp: row.xp, completedLabs: getCompletedLabsForUser(userId), isAdmin: !!row.is_admin };")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed getUserState to return isAdmin.")
