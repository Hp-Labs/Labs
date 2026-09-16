import os
import re

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                c = f.read()
            
            original = c
            
            c = re.sub(r'text-9xl', 'text-6xl', c)
            c = re.sub(r'text-8xl', 'text-6xl', c)
            c = re.sub(r'text-7xl', 'text-5xl', c)
            c = re.sub(r'text-6xl', 'text-5xl', c) # Maybe 6xl is too big as well? 5xl is standard large
            
            if original != c:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(c)
                print(f"Reduced large text in {path}")
