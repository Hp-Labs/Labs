import os

path = "src/app/api/auth/register/route.ts"
if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        c = f.read()
    c = c.replace('crypto.randomUUID()', '"HP-" + crypto.randomBytes(4).toString("hex").toUpperCase()')
    with open(path, "w", encoding="utf-8") as f:
        f.write(c)
    print("Updated register route")

path = "src/app/api/auth/register-otp/verify/route.ts"
if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        c = f.read()
    c = c.replace('crypto.randomUUID()', '"HP-" + crypto.randomBytes(4).toString("hex").toUpperCase()')
    with open(path, "w", encoding="utf-8") as f:
        f.write(c)
    print("Updated verify route")
