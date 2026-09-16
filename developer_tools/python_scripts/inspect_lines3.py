path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
# We know where the return starts.
# We just want to see the last 20 lines to understand the error.
lines = content.split("\n")
for i, l in enumerate(lines):
    if "return (" in l and "bg-[var(--hp-bg)]" in lines[i+1]:
        print("Starts at line:", i)
print("\n--- Last 30 lines ---")
for i, l in enumerate(lines[-30:]):
    print(len(lines)-30+i, l)
