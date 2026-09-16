import os

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in [161, 164, 186, 189, 223, 427]:
    print(f"Lines around {i}:")
    for j in range(i-1, i+3):
        if j < len(lines):
            print(lines[j].strip())
    print("---")
