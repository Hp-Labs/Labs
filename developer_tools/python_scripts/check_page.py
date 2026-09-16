import os

with open('src/app/red-team/pentesting/[domain]/[severity]/page.tsx', 'r', encoding='utf-8') as f:
    for line in f:
        if 'max-w' in line:
            print(line.strip())
