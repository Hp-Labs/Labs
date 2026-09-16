import os

def find_corrupted_chars(directory):
    corrupted_patterns = ["ΓÇó", "â€¢", "â€™", "â€œ", "â€", "â€”", "â€“", "ΓÇÖ", "ΓÇ£", "ΓÇ¥", "ΓÇô", "ΓÇö"]
    for root, _, files in os.walk(directory):
        for file in files:
            if not file.endswith((".tsx", ".ts", ".js", ".jsx", ".json", ".md")):
                continue
            path = os.path.join(root, file)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                    for pattern in corrupted_patterns:
                        if pattern in content:
                            print(f"Found '{pattern}' in {path}")
            except Exception as e:
                pass

find_corrupted_chars("src")
