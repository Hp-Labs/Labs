import os

with open('src/app/profile/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('width: %', 'width: ${xpProgress}%')

with open('src/app/profile/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("done")
