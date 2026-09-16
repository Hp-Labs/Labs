import os

login_file = 'src/app/login/page.tsx'
with open(login_file, 'r', encoding='utf-8') as f:
    c = f.read()

c = "'use client';\n" + c
with open(login_file, 'w', encoding='utf-8') as f:
    f.write(c)

register_file = 'src/app/register/page.tsx'
with open(register_file, 'r', encoding='utf-8') as f:
    c = f.read()
c = "'use client';\n" + c
with open(register_file, 'w', encoding='utf-8') as f:
    f.write(c)

