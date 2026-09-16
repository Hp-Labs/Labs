import os
import re

path = "src/app/profile/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Fix getUserBadgesAndRank argument
c = c.replace("getUserBadgesAndRank(user);", "getUserBadgesAndRank(user || { xp: 0 } as any);")

# Fix user?.name to just username or remove it if I wanted actual name
c = c.replace("{user?.name || username}", "{username}")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed profile type errors")
