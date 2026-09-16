import os

with open('src/lib/auth.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('Math.floor(Math.random().toString(36).substring(2, 10).toUpperCase()).toString()', 'Math.random().toString(36).substring(2, 10).toUpperCase()')

with open('src/lib/auth.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
