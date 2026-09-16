import os

with open('src/app/labs/[id]/page.tsx', 'r', encoding='utf-8') as f:
    for line in f.readlines()[:50]:
        if 'className' in line:
            print(line.strip())
