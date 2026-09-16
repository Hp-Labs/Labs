path = "src/app/dashboard/page.tsx"
import os
if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        print(f"DASHBOARD:\n{f.read()[:500]}")
else:
    print("Dashboard not found")
