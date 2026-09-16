import os

with open('src/app/profile/page.tsx', 'r', encoding='utf-8') as f:
    for line in f:
        if 'xpProgress' in line and 'width' in line:
            print(repr(line))
