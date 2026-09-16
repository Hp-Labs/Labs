import re

with open("original_page.tsx", "r", encoding="utf-16") as f:
    content = f.read()

print("Total chars:", len(content))
print("Has Stop Lab:", "Stop Lab" in content)
print("Has Terminate:", "Terminate" in content)
print("Has useEffect:", "useEffect" in content)
print("Has if (!unlocked):", "if (!unlocked)" in content)
