import os

files = [
    "src/lib/auth.ts",
    "src/lib/services/userStore.ts",
    "src/lib/services/labSessionStore.ts",
    "src/lib/data/types.ts",
    "src/app/api/labs/[id]/activity/route.ts"
]

for path in files:
    if os.path.exists(path):
        print(f"--- {path} ---")
        with open(path, "r", encoding="utf-8") as f:
            print(f.read()[:500] + "\n...[truncated]\n")
    else:
        print(f"Not found: {path}")

# Check if there are any payment/subscription APIs
api_dir = "src/app/api"
if os.path.exists(api_dir):
    for root, _, fs in os.walk(api_dir):
        for f in fs:
            if "subscribe" in f or "payment" in f or "billing" in f:
                print(f"Found billing related API: {os.path.join(root, f)}")
