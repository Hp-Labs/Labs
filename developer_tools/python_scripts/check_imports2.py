import os

with open('src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
    
print(c[:500].encode('ascii', 'ignore').decode('ascii'))
