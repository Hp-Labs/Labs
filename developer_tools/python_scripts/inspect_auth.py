import os

with open('src/lib/auth.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'localStorage.getItem("hplabs_user")' in line:
        print(f"Lines around {i}:")
        for j in range(i-2, i+15):
            if j < len(lines):
                print(lines[j].strip())
        break
