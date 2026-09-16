import os

with open('src/app/profile/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(130, 145):
    print(lines[i].strip())
