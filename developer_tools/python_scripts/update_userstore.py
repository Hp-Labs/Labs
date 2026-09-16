path = "src/lib/services/userStore.ts"
with open(path, "r", encoding="utf-8-sig") as f:
    content = f.read()

content = content.replace(
    "premiumUntil?: number | null;\n}",
    "premiumUntil?: number | null;\n  plan: 'FREE' | 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';\n}"
)

# Update getUserById mapper
content = content.replace(
    "completedLabs: dbUser.completed_labs ? JSON.parse(dbUser.completed_labs) : [],",
    "completedLabs: dbUser.completed_labs ? JSON.parse(dbUser.completed_labs) : [],\n      plan: dbUser.plan || 'FREE',"
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated userStore.ts")
