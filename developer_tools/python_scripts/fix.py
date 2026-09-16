import re
import json

path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# The file is messed up. Let's find all instances of id: "hw-...", name: "..." and reconstruct the array.
pattern = re.compile(r'\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*shortDescription:\s*"([^"]+)",\s*fullDescription:\s*"([^"]+)",\s*features:\s*\[([\s\S]*?)\],\s*useCases:\s*\[([\s\S]*?)\],\s*difficulty:\s*"([^"]+)",\s*image:\s*"([^"]+)",\s*links:\s*\{\s*(india:\s*"[^"]+",?)?\s*(global:\s*"[^"]+")?\s*\}\s*\}')

matches = pattern.finditer(content)
items = []

for m in matches:
    item_str = m.group(0)
    if item_str not in items:
        items.append(item_str)

# Some descriptions might have had quotes escaped or something, but let's just use a simpler parsing.
# Actually, the file is valid TS right up until `features: string[` ?
