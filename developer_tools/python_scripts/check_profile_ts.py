import os

with open('src/app/profile/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(lines[141].strip())
