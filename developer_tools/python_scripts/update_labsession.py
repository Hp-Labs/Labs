path = "src/lib/services/labSessionStore.ts"
with open(path, "r", encoding="utf-8-sig") as f:
    content = f.read()

content = content.replace(
    "export function createLabSession(userId: string, labId: string, authSessionId: string): string {",
    "export function createLabSession(userId: string, labId: string, authSessionId: string, ttlMs: number = 4 * 60 * 60 * 1000): string {"
)
content = content.replace(
    "const expiresAt = now + LAB_SESSION_TTL_MS;",
    "const expiresAt = now + ttlMs;"
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("labSessionStore.ts updated.")
