import os
import glob

files = glob.glob("src/app/**/*.tsx", recursive=True)
for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
        if "placeholder=\"FLAG" in content or "Submit Flag" in content or "flagInput" in content:
            print(f"Found in: {file}")
