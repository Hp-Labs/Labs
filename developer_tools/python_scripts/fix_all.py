import os

def fix_file(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    replacements = {
        "ΓÇó": "•",
        "ΓÇÖ": "'",
        "ΓÇ£": '"',
        "ΓÇ¥": '"',
        "ΓÇô": "-",
        "ΓÇö": "—",
        "â€¢": "•",
        "â€™": "'",
        "â€œ": '"',
        "â€": '"',
        "â€”": "—",
        "â€“": "–",
        "??? Incorrect": "❌ Incorrect"
    }
    
    modified = False
    for bad, good in replacements.items():
        if bad in content:
            content = content.replace(bad, good)
            modified = True
            
    if modified:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Fixed {path}")

for root, _, files in os.walk("src"):
    for file in files:
        if file.endswith((".tsx", ".ts", ".js", ".jsx", ".json", ".md")):
            fix_file(os.path.join(root, file))
print("Done fixing characters globally!")
