import os

with open('src/app/partner-activate/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('maxLength={6}', 'maxLength={8}')
c = c.replace("replace(/\\D/g, '')", "replace(/[^a-zA-Z0-9]/g, '')")
c = c.replace('inputMode="numeric"', 'inputMode="text"')
c = c.replace('placeholder="------"', 'placeholder="--------"')

with open('src/app/partner-activate/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
