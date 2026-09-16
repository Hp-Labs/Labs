import re
import json

path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# We know the interface is clean at the top. Let's just find the HARDWARE_INVENTORY array string and parse it properly.
start_idx = content.find("export const HARDWARE_INVENTORY: HardwareItem[] = [")
if start_idx == -1:
    print("Could not find array start")
    exit(1)

array_str = content[start_idx + len("export const HARDWARE_INVENTORY: HardwareItem[] = ["):]
# Now let's extract individual items using regex, but doing it very safely.
# We will match blocks between { id: ... } 
# Actually, since I have standard TS syntax, I can write a python regex to fix these unescaped quotes.

lines = content.split("\n")
for i, line in enumerate(lines):
    if 'name: "' in line and '",' in line:
        # e.g. name: "0.96" OLED Display",
        val = line.split('name: "')[1].rsplit('",', 1)[0]
        # if val contains double quotes, escape them or remove them
        if '"' in val:
            safe_val = val.replace('"', ' inch')
            lines[i] = f'    name: "{safe_val}",'
            
    if 'shortDescription: "' in line and '",' in line:
        val = line.split('shortDescription: "')[1].rsplit('",', 1)[0]
        if '"' in val:
            safe_val = val.replace('"', '\\"')
            lines[i] = f'    shortDescription: "{safe_val}",'

with open(path, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
    
print("Fixed remaining quotes")
