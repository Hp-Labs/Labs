import os

found = False
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.css')):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                if "Developed by hackerplus.in" in content:
                    print(f"Found in {path}")
                    found = True
            except:
                pass
if not found:
    print("Not found anywhere.")
