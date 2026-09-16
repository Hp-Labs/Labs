path = "src/lib/auth.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("export interface User {", "export interface User {\n  isAdmin?: boolean;")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Added isAdmin to User.")
