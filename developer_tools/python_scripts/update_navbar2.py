import os

with open('src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('max-w-[1440px] mx-auto px-6 lg:px-12', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')

with open('src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
print("Navbar max-w updated.")
