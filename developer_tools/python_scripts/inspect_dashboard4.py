import os

with open('src/app/dashboard/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    for c in line:
        if c == '\u00E2' or c == '\u00C3':
            print(f"Line {i+1}: contains character {hex(ord(c))}")
