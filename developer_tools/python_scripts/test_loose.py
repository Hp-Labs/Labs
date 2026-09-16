import os

def reverse_loose_cp1252(text):
    # Mapping of unicode characters back to bytes
    res = bytearray()
    for c in text:
        # standard cp1252 mapping
        try:
            b = c.encode('cp1252')
            res.extend(b)
        except UnicodeEncodeError:
            # Maybe it was mapped 1:1 like U+0081 -> 0x81
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
        # Any suspicious start byte
        if c in ('\u00C2', '\u00C3', '\u00E2', '\u00F0'):
            matched = False
            for length in [6, 5, 4, 3, 2]: # emojis can be 4 bytes UTF-8 (so 4 chars), with FE0F it's 6 bytes
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

chunk = '\u00E2\u02DC\u0081\u00EF\u00B8\u008F'
print('Test cloud:', fix_mojibake_in_text(chunk).encode('unicode_escape').decode('ascii'))
