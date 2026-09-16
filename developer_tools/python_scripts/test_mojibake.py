import os
import re

def fix_mojibake_in_text(text):
    # A simple regex to find typical 2 or 3 character mojibake sequences
    # They start with Ã (\u00C3) or â (\u00E2)
    # followed by 1 or 2 characters that are typical Windows-1252 decodings of UTF-8 continuation bytes.
    # We can just look for any sequence of 2-4 characters that successfully decodes this way.
    
    # Actually, let's just find sequences starting with \u00C3 or \u00E2, and keep adding characters until it decodes cleanly.
    
    # Common sequences:
    # 2 bytes: \u00C2 or \u00C3 followed by a char in \u0080-\u00FF (or mapped in cp1252 like \u20AC)
    # 3 bytes: \u00E2 followed by 2 chars
    # 4 bytes: \u00F0 followed by 3 chars
    
    fixed_text = text
    # We will just replace known fixed substrings.
    # We can extract all substrings of length 2-4 and see if they 'un-mojibake'.
    
    # A better approach: iterate through string, when we see a suspicious start char:
    i = 0
    res = []
    while i < len(text):
        c = text[i]
        if c in ('\u00C2', '\u00C3', '\u00E2', '\u00F0'):
            # try to consume up to 4 chars
            matched = False
            for length in [4, 3, 2]:
                if i + length <= len(text):
                    chunk = text[i:i+length]
                    try:
                        # If chunk encodes to cp1252 without error
                        raw_bytes = chunk.encode('cp1252')
                        # And decodes to utf-8 without error
                        fixed_chunk = raw_bytes.decode('utf-8')
                        # And it's not the same as the original (to avoid replacing things that happen to work)
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

print('Test 1:', fix_mojibake_in_text('Web â€” Information'))
print('Test 2:', fix_mojibake_in_text('ItÃ©s a test'))
