import os

with open('src/app/register/page.tsx', 'rb') as f:
    b = f.read(1000)

print(b.find(b'dYs'))
print(b.find(b'dY"'))

# search for dY in any encoding
print([hex(x) for x in b'dYs'])
import re
match = re.search(b'd.Y.s', b)
if match:
    print("Found UTF-16 dYs:", match.group())

