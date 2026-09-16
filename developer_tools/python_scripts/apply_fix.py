import os

def reverse_loose_cp1252(text):
    res = bytearray()
    for c in text:
        try:
            b = c.encode('cp1252')
            res.extend(b)
        except UnicodeEncodeError:
            if ord(c) < 256:
                res.append(ord(c))
            else:
                return None
    try:
        return res.decode('utf-8')
    except:
        return None

def fix_mojibake_in_text(text):
    i = 0
    res = []
    while i < len(text):
        c = text[i]
        if c in ('\u00C2', '\u00C3', '\u00E2', '\u00F0'):
            matched = False
            for length in [6, 5, 4, 3, 2]:
                if i + length <= len(text):
                    chunk = text[i:i+length]
                    fixed_chunk = reverse_loose_cp1252(chunk)
                    if fixed_chunk is not None and fixed_chunk != chunk and len(fixed_chunk) < len(chunk):
                        res.append(fixed_chunk)
                        i += length
                        matched = True
                        break
            if not matched:
                res.append(c)
                i += 1
        else:
            res.append(c)
            i += 1
    return ''.join(res)

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    original = f.read()

fixed = fix_mojibake_in_text(original)

if original != fixed:
    print("Fixed page.tsx!")
    # count differences
    print("Length difference:", len(original) - len(fixed))
    with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
        f.write(fixed)
else:
    print("No changes in page.tsx")
