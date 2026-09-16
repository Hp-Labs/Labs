import os

with open('src/app/profile/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
    
idx = c.find('Account Active')
print(c[idx-200:idx+300])
