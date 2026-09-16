import os
for root, dirs, files in os.walk("src"):
    for f in files:
        if f.endswith(".ts") or f.endswith(".tsx"):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8") as file:
                c = file.read()
                if "use client" in c and "process.env" in c:
                    print(f"Secret exposed in client component {path}")
