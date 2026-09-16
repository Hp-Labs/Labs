import os

path = 'src/components/Navbar.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('Lock,\n, Menu, X', 'Lock,\n  Menu, X')
c = c.replace('Lock,\r\n, Menu, X', 'Lock,\r\n  Menu, X')
c = c.replace(', Menu, X }', '  Menu, X }')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed Navbar comma!")
