import os
import re

mojibake_patterns = [
    '\u00C3',       # Ã
    '\u00E2',       # â
    '\uFFFD',       # 
    'dY"',
    "dY'",
    'dYs\?',
    'dY",'
]

found = []
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.css')):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                matches = []
                for p in mojibake_patterns:
                    if p in content:
                        matches.append(p)
                if matches:
                    found.append((path, matches))
            except Exception as e:
                pass

for f, p in found:
    print(f"{f}: {len(p)} patterns")
