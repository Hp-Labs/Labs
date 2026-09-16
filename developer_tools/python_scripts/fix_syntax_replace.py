import os

for root, dirs, files in os.walk("src/lib/data"):
    for f in files:
        if f.endswith(".ts"):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8") as file:
                c = file.read()
            
            # Use simple replace
            new_c = c.replace('""', '"')
            
            if new_c != c:
                with open(path, "w", encoding="utf-8") as file:
                    file.write(new_c)

print("Fixed syntax errors using replace.")
