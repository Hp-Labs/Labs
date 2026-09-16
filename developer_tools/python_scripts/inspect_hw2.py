path = "src/app/hardware/page.tsx"
import os
if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
        if "useAuth" in content or "router.push" in content or "redirect" in content:
            print("Auth guard exists in hardware")
        else:
            print("No auth guard found in hardware page")
