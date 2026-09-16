import os
import re

# Fix Navbar.tsx
path = 'src/components/Navbar.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# find the broken className
# it has form feed \x0c
c = c.replace('className={\x0clex items-center', 'className={`flex items-center')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

# Fix profile page
path = 'src/app/profile/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('? ${NEXT_RANK', '? `${NEXT_RANK')
c = c.replace('() XP :', '()} XP` :')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed syntax.")
