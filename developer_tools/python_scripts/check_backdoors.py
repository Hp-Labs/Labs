import os
for root, dirs, files in os.walk("src"):
    for f in files:
        if f.endswith(".ts") or f.endswith(".js"):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8") as file:
                c = file.read()
                if "password" in c and "1234" in c:
                    print(f"Password hardcoded in {path}")
                if "dev-admin" in c or "HP-0000" in c:
                    print(f"Backdoor in {path}")
