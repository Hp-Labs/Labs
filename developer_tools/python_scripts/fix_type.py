path = "src/app/api/partner/activate/route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("const premiumUntilISO = premiumUntil.toISOString();", "const premiumUntilMs = premiumUntil.getTime();")
c = c.replace("{ premiumUntil: premiumUntilISO }", "{ premiumUntil: premiumUntilMs }")
c = c.replace("premiumUntil=${premiumUntilISO}", "premiumUntil=${premiumUntilMs}")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
print("Fixed premiumUntil type.")
