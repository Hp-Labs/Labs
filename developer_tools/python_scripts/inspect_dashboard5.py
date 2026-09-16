import os

with open('src/app/dashboard/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

line = lines[181] # Line 182
print("Line 182 chars:")
for c in line.strip():
    print(f"{c}: {hex(ord(c))}")
