import os

def fix_mojibake_in_text(text):
    i = 0
    res = []
    while i < len(text):
        c = text[i]
        if c in ('\u00C2', '\u00C3', '\u00E2', '\u00F0'):
            matched = False
            for length in [4, 3, 2]:
                if i + length <= len(text):
                    chunk = text[i:i+length]
                    try:
                        raw_bytes = chunk.encode('cp1252')
                        fixed_chunk = raw_bytes.decode('utf-8')
                        if fixed_chunk != chunk and len(fixed_chunk) < len(chunk):
                            res.append(fixed_chunk)
                            i += length
                            matched = True
                            break
                    except:
                        pass
            if not matched:
                res.append(c)
                i += 1
        else:
            res.append(c)
            i += 1
    return ''.join(res)

fixed = fix_mojibake_in_text('Web \u00E2\u20AC\u201D Information')
print('Test 1:', fixed.encode('unicode_escape').decode('ascii'))
