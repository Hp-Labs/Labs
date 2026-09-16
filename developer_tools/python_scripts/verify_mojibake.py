import os

mojibake_patterns = ['\u00C3', '\u00E2', '\uFFFD']
found = 0
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.css')):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                for p in mojibake_patterns:
                    if p in content:
                        print(f"Still found {hex(ord(p))} in {path}")
                        found += 1
            except Exception as e:
                pass
print(f"Total files with remaining patterns: {found}")
