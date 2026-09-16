import os
for root, dirs, files in os.walk("src/app/api/admin"):
    for f in files:
        if f.endswith(".ts"):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8") as file:
                c = file.read()
                if "isAdmin" not in c:
                    print(f"Missing admin check in {path}")
