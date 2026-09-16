import os

with open('src/app/labs/[id]/page.tsx', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if 'className' in line and i < 150:
            print(line.strip())
