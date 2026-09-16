import re

path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

start_marker = "export const HARDWARE_INVENTORY: HardwareItem[] = ["
end_marker = "];"
start_idx = content.find(start_marker)
end_idx = content.rfind(end_marker)

pre_content = content[:start_idx + len(start_marker) + 1]
post_content = content[end_idx:]
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

def get_name(obj_str):
    match = re.search(r'name:\s*"([^"]+)"', obj_str)
    if match:
        return match.group(1).lower()
    return ""

def get_score(name):
    exact_matches = {
        "flipper zero": 10000,
        "usb rubber ducky": 9000,
        "hackrf one": 8000,
        "proxmark3 easy": 7000,
        "m5stack esp32": 6500,
        "rtl-sdr": 6000,
        "chameleon mini": 5500,
        "ubertooth one": 5000,
        "bus pirate": 4500,
        "flipper zero wi-fi dev board": 4000,
        "beetle badusb": 3500,
        "digispark attiny85 (badusb)": 3000,
    }
    
    for k, v in exact_matches.items():
        if k in name: return v
        
    tier2 = ["raspberry pi", "wio tracker", "logic analyzer", "wi-fi adapter"]
    tier3 = ["esp32", "nodemcu", "arduino"]
    tier4 = ["oled", "sensor", "relay", "rfid", "camera", "module", "display", "receiver", "transmitter"]
    tier5 = ["multimeter", "soldering", "cutter", "tester", "meter"]
    
    for t in tier2:
        if t in name: return 800
    for t in tier3:
        if t in name: return 600
    for t in tier4:
        if t in name: return 400
    for t in tier5:
        if t in name: return 200
    return 100

items_with_scores = [(item, get_score(get_name(item)), get_name(item)) for item in items]
items_with_scores.sort(key=lambda x: (-x[1], x[2]))

sorted_items_str = ",\n  ".join([x[0] for x in items_with_scores])
new_content = pre_content + "  " + sorted_items_str + "\n" + post_content

with open(path, "w", encoding="utf-8") as f:
    f.write(new_content)
    
print("Sorted with extreme precision.")
