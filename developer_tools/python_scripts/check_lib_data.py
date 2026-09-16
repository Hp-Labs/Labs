import os
for root, _, files in os.walk("src/lib/data"):
    for file in files:
        if not file.endswith(".ts"): continue
        path = os.path.join(root, file)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        if "Γ" in content:
            print(f"Found Gamma in {path}")
            content = content.replace("ΓÇó", "•")
            content = content.replace("ΓÇÖ", "'")
            content = content.replace("ΓÇ£", '"')
            content = content.replace("ΓÇ¥", '"')
            content = content.replace("ΓÇô", "-")
            content = content.replace("ΓÇö", "—")
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
print("Checked lib/data!")
