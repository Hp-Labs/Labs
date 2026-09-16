path = "src/app/api/support/route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("let authUserId = userId; // fallback for backwards compatibility? NO.", "let authUserId: string | undefined = undefined;")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
print("Fixed support route type.")
