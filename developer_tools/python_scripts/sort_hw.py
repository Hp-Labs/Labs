import re

path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# The array starts at `export const HARDWARE_INVENTORY: HardwareItem[] = [`
start_marker = "export const HARDWARE_INVENTORY: HardwareItem[] = ["
end_marker = "];"
start_idx = content.find(start_marker)
end_idx = content.rfind(end_marker)

pre_content = content[:start_idx + len(start_marker) + 1]
post_content = content[end_idx:]
array_content = content[start_idx + len(start_marker):end_idx].strip()

# Safely split by `  {` or similar. Actually, since each item has `id: "`, let's split by `id: "`
# To preserve the exact string of each object:
# We know each object looks like:
#   {
#     id: "hw-...",
#     name: "...",
#     ...
#   },
# Let's use a brace-matching parser.
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

def get_name(obj_str):
    match = re.search(r'name:\s*"([^"]+)"', obj_str)
    if match:
        return match.group(1).lower()
    return ""

def get_score(name):
    tier1 = ["flipper", "hackrf", "proxmark", "rubber ducky", "chameleon", "ubertooth", "hackpi", "bus pirate", "badusb"]
    tier2 = ["m5stack", "rtl-sdr", "sdr", "raspberry pi", "wio tracker", "logic analyzer", "usb analyzer", "wi-fi adapter", "wifi adapter"]
    tier3 = ["esp32", "nodemcu", "digispark", "arduino"]
    tier4 = ["oled", "sensor", "relay", "rfid", "camera", "module", "display", "receiver", "transmitter", "push button"]
    tier5 = ["multimeter", "soldering", "cutter", "tester", "meter"]
    
    for t in tier1:
        if t in name: return 100
    for t in tier2:
        if t in name: return 80
    for t in tier3:
        if t in name: return 60
    for t in tier4:
        if t in name: return 40
    for t in tier5:
        if t in name: return 20
    return 10 # tier 6 (accessories/breadboards/etc)

# Sort items by score descending
items_with_scores = [(item, get_score(get_name(item)), get_name(item)) for item in items]
items_with_scores.sort(key=lambda x: (x[1], x[2]), reverse=True) # Sort by score DESC, then name DESC (wait, name ASC is better)

items_with_scores.sort(key=lambda x: (-x[1], x[2]))

sorted_items_str = ",\n  ".join([x[0] for x in items_with_scores])

new_content = pre_content + "  " + sorted_items_str + "\n" + post_content

with open(path, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Sorted {len(items)} items successfully.")
