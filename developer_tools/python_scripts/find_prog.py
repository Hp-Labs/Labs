import os
import re

for root, dirs, files in os.walk("src"):
    for f in files:
        if f.endswith(".ts") or f.endswith(".tsx"):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8") as file:
                c = file.read()
                if "SEVERITY_UNLOCK_REQUIREMENTS" in c:
                    print(f"SEVERITY_UNLOCK_REQUIREMENTS found in {path}")
                if "SERVER_PROGRESSION_CONFIG" in c:
                    print(f"SERVER_PROGRESSION_CONFIG found in {path}")
