import os
for root, dirs, files in os.walk("src"):
    for f in files:
        if f.endswith(".ts") or f.endswith(".tsx") or f.endswith(".js"):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8") as file:
                c = file.read()
                if "bypass" in c.lower() or "backdoor" in c.lower():
                    print(f"Bypass/Backdoor string in {path}")
