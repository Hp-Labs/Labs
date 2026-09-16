import os

path = 'src/app/red-team/pentesting/[domain]/[severity]/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('px-4 max-w-5xl mx-auto', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

