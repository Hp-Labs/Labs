import os

path = r"src/app/api/auth/session/route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Replace the fallback block
import re
new_block = """if (!sessionId) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }"""
c = re.sub(r'if \(!sessionId\) \{[\s\S]*?isPremium: true\n\s*\}\n\s*\}\);\n\s*\}', new_block, c)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed auth session mock fallback.")
