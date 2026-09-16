import os
import glob

files = glob.glob('src/app/api/labs/**/activity/route.ts', recursive=True)
if files:
    with open(files[0], 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('"guest-bypass"', '"HP-00000000"')
    with open(files[0], 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated labs activity route references")
