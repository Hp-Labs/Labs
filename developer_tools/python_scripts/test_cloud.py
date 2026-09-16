import os

b = bytes([0xE2, 0x98, 0x81, 0xEF, 0xB8, 0x8F])
print("Decoded:", b.decode('utf-8'))
print("Unicode escape:", b.decode('utf-8').encode('unicode_escape').decode('ascii'))
