import os

with open('src/app/profile/page.tsx', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if 'dY' in line or '\uFFFD' in line:
            print(f"Line {i+1}: {repr(line)}")
