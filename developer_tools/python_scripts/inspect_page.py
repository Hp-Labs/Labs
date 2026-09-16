import os

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '/login' in line or '/register' in line:
        print(f"Line {i}: {line.strip()}")
