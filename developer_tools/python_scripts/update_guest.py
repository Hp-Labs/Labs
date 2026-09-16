import os

path = "src/app/api/auth/session/route.ts"
if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        c = f.read()
    c = c.replace('id: "guest-bypass",', 'id: "HP-00000000",')
    with open(path, "w", encoding="utf-8") as f:
        f.write(c)

path = "src/lib/auth.tsx"
if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        c = f.read()
    c = c.replace('id: "guest-bypass",', 'id: "HP-00000000",')
    with open(path, "w", encoding="utf-8") as f:
        f.write(c)

print("Updated guest-bypass to HP-00000000")
