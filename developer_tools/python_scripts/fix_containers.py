import os

path = "src/app/leaderboard/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()
c = c.replace("max-w-4xl", "max-w-7xl")
with open(path, "w", encoding="utf-8") as f:
    f.write(c)
print("Fixed leaderboard container")

path = "src/app/notifications/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()
c = c.replace("max-w-4xl", "max-w-7xl")
with open(path, "w", encoding="utf-8") as f:
    f.write(c)

path = "src/app/support/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()
c = c.replace("max-w-3xl", "max-w-7xl").replace("max-w-4xl", "max-w-7xl")
with open(path, "w", encoding="utf-8") as f:
    f.write(c)

