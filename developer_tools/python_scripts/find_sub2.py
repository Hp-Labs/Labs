import os
for root, _, files in os.walk("src"):
    for file in files:
        if file.endswith(".tsx"):
            path = os.path.join(root, file)
            try:
                with open(path, "r", encoding="utf-8-sig") as f:
                    content = f.read()
                    if "Account and Support" in content or "Subscription" in content:
                        print(f"Found in {path}")
            except:
                pass
