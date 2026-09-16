import os
import json

files = [
    "src/lib/services/userStore.ts",
    "src/lib/services/labSessionStore.ts",
    "src/lib/data/types.ts",
    "src/app/api/labs/[id]/activity/route.ts"
]

for path in files:
    if os.path.exists(path):
        print(f"--- {path} ---")
        with open(path, "r", encoding="utf-8-sig") as f:
            content = f.read()
            # print snippet
            print(content[:300].encode("ascii", "replace").decode())
            # search for keywords
            for keyword in ["plan", "tier", "subscri", "billing", "payment"]:
                if keyword in content.lower():
                    print(f"  Found '{keyword}'")
    else:
        print(f"Not found: {path}")

# Find any API routes related to billing
print("\n--- API ROUTES ---")
for root, _, fs in os.walk("src/app/api"):
    for f in fs:
        print(os.path.join(root, f))
