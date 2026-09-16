import json
import os

paths = [
    "src/app/api/premium/create-checkout-session/route.ts",
    "src/app/api/premium/options/route.ts",
    "src/app/api/premium/status/route.ts",
    "src/lib/services/userStore.ts",
    "src/lib/data/types.ts"
]

for p in paths:
    print(f"\n--- {p} ---")
    if os.path.exists(p):
        with open(p, "r", encoding="utf-8-sig") as f:
            content = f.read()
            # print first 1000 chars and search for specific terms
            print(content[:500].encode("ascii", "replace").decode())
            print(f"... Length: {len(content)}")
    else:
        print("NOT FOUND")
