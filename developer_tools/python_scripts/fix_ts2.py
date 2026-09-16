path = "src/lib/services/userStore.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
matches = re.finditer(r'return \{[\s\S]*?\} as ServerUser;', content)
for m in matches:
    print(f"Match at {m.start()}:\n" + m.group(0))

# Fix it globally where `ServerUser` is instantiated
content = re.sub(r'(premiumUntil: [^,]*,)', r"\1\n      plan: 'FREE',", content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed userStore")
