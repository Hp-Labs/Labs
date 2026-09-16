import os

with open('src/lib/auth.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('register: (username: string, email: string, phone: string, password: string) =>', 'register: (username: string, email: string, phone: string, password: string, emailOTP: string, phoneOTP: string) =>')
c = c.replace('register = async (username: string, email: string, phone: string, password: string, emailOTP = "000000", phoneOTP = "000000") =>', 'register = async (username: string, email: string, phone: string, password: string, emailOTP: string, phoneOTP: string) =>')
with open('src/lib/auth.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
