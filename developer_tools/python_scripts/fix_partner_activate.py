path = "src/app/api/partner/activate/route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Add updateUser call
if "updateUser(" not in c:
    c = c.replace("import { NextResponse } from \"next/server\";", "import { NextResponse } from \"next/server\";\nimport { updateUser } from \"@/lib/services/userStore\";")
    c = c.replace("const premiumUntilISO = premiumUntil.toISOString();", "const premiumUntilISO = premiumUntil.toISOString();\n    updateUser(userId, { premiumUntil: premiumUntilISO });")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed partner activate DB update.")
