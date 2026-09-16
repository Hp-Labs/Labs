import os

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '\u00C3' in line or '\u00E2' in line or '\uFFFD' in line or 'dY"' in line or "dY'" in line or 'dYs' in line:
        print(f"Line {i+1}: {repr(line.strip())}")

