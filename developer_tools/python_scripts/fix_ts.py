# Fix pricing/page.tsx
path1 = "src/app/pricing/page.tsx"
with open(path1, "r", encoding="utf-8") as f:
    content1 = f.read()
content1 = content1.replace('row.f === "true"', 'row.f === true')
content1 = content1.replace('row.b === "true"', 'row.b === true')
content1 = content1.replace('row.i === "true"', 'row.i === true')
content1 = content1.replace('row.a === "true"', 'row.a === true')
content1 = content1.replace('f: "true"', 'f: true')
content1 = content1.replace('b: "true"', 'b: true')
content1 = content1.replace('i: "true"', 'i: true')
content1 = content1.replace('a: "true"', 'a: true')
with open(path1, "w", encoding="utf-8") as f:
    f.write(content1)

# Fix userStore.ts
path2 = "src/lib/services/userStore.ts"
with open(path2, "r", encoding="utf-8") as f:
    content2 = f.read()
# In `createUser`, add `plan: 'FREE'`
import re
content2 = re.sub(r'(premiumUntil: null,\n\s*)(completedLabs: \[\],)', r"\1plan: 'FREE',\n      \2", content2)
with open(path2, "w", encoding="utf-8") as f:
    f.write(content2)

# Fix auth.tsx
path3 = "src/lib/auth.tsx"
with open(path3, "r", encoding="utf-8") as f:
    content3 = f.read()
content3 = content3.replace(
    "const isPremiumValid = user.premiumUntil ? user.premiumUntil > Date.now() : false;",
    "const isPremiumValid = user.premiumUntil ? Number(user.premiumUntil) > Date.now() : false;"
)
with open(path3, "w", encoding="utf-8") as f:
    f.write(content3)

print("Fixed TS errors")
