import os

with open('src/app/dashboard/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '\u00E2' in line or '\u00C3' in line:
        print(f"Line {i+1}: {repr(line.strip())}")
