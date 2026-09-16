import os

path = "src/app/api/support/escalate/route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()
c = c.replace('"guest-bypass"', '"HP-00000000"')
with open(path, "w", encoding="utf-8") as f:
    f.write(c)

path = "src/components/AIChatWidget.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()
c = c.replace('"guest-bypass"', '"HP-00000000"')
with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Updated guest-bypass references")
