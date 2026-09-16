import os
import re

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.css'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                c = f.read()
            if 'font-mono' in c:
                # font-mono is fine for code, let's look for custom font families
                pass
            if 'font-serif' in c:
                print(f"Found serif in {path}")
            if 'font-[' in c: # custom arbitrary font family in tailwind
                print(f"Found arbitrary font in {path}")
