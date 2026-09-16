import os

path = "src/app/api/support/escalate/route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('plan: serverUser?.isPremium ? "Premium" : "Free"', 'plan: (serverUser as any)?.isPremium || (serverUser as any)?.premiumUntil ? "Premium" : "Free"')

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
print("Fixed escalate TS error")
