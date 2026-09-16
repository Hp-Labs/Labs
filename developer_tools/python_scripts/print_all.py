import re

path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

start_marker = "export const HARDWARE_INVENTORY: HardwareItem[] = ["
end_marker = "];"
start_idx = content.find(start_marker)
end_idx = content.rfind(end_marker)
array_content = content[start_idx + len(start_marker):end_idx].strip()

def get_objects(text):
    objects = []
    depth = 0
    current_obj = ""
    in_obj = False
    for char in text:
        if char == '{':
            if depth == 0:
                in_obj = True
                current_obj = ""
            depth += 1
        if in_obj:
            current_obj += char
        if char == '}':
            depth -= 1
            if depth == 0 and in_obj:
                in_obj = False
                objects.append(current_obj)
    return objects

items = get_objects(array_content)
for item in items:
    match = re.search(r'name:\s*"([^"]+)"', item)
    if match:
        print(match.group(1))
