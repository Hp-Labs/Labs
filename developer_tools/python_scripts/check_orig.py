import re

with open("original_page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

print("=== ORIGINAL FILE ===")
print("Total chars:", len(content))
print("Has Stop Lab:", "Stop Lab" in content)
print("Has Terminate:", "Terminate" in content)
print("Has useEffect:", "useEffect" in content)
print("Has if (!unlocked):", "if (!unlocked)" in content)

# Find where if (!unlocked) is
idx = content.find("if (!unlocked)")
if idx != -1:
    # Find if there are hooks after this early return
    hooks_after = content.find("useState", idx)
    if hooks_after != -1:
        print("PROBLEM: useState found AFTER if (!unlocked) at", hooks_after)
    else:
        print("Good: No useState after if (!unlocked)")
