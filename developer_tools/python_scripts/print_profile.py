import os

with open('src/app/profile/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'Header Profile Card' in line:
        for j in range(i, i+70):
            if j < len(lines):
                print(lines[j].rstrip('\n'))
        break
