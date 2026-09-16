import os

with open('src/app/register/page.tsx', 'rb') as f:
    lines = f.readlines()

for line in lines:
    if b'setOtpNotification' in line:
        print(line)

