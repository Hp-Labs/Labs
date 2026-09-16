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
    # Tier 1: The Absolute Kings (9000 - 10000)
    kings = {
        "flipper zero": 10000,
        "usb rubber ducky": 9900,
        "hackrf one": 9800,
        "proxmark3": 9700,
        "m5stack": 9600,
        "rtl-sdr": 9500,
        "chameleon": 9400,
        "ubertooth": 9300,
        "bus pirate": 9200,
        "flipper zero wi-fi": 9100,
        "badusb": 9000,
        "digispark": 8900
    }
    for k, v in kings.items():
        if k in name: return v
        
    # Tier 2: Major Boards & Analyzers (7000 - 8000)
    major = {
        "raspberry pi": 8000,
        "wio tracker": 7900,
        "logic analyzer": 7800,
        "usb analyzer": 7700,
        "wi-fi adapter": 7600,
        "wifi adapter": 7600,
        "esp32": 7500,
        "nodemcu": 7400,
        "arduino": 7300,
        "stm32": 7200,
        "hackpi": 7100
    }
    for k, v in major.items():
        if k in name: return v
        
    # Tier 3: Important Modules (5000 - 6000)
    modules = ["rfid", "nrf24l01", "gps", "camera", "oled", "display", "e-ink", "relay", "sensor", "module", "transceiver", "receiver", "transmitter"]
    for m in modules:
        if m in name: return 6000
        
    # Tier 4: Supporting Electronics (3000 - 4000)
    support = ["battery", "lipo", "tp4056", "converter", "microsd", "memory card", "hub", "mport", "power meter"]
    for s in support:
        if s in name: return 4000
        
    # Tier 5: Tools (1000 - 2000)
    tools = ["multimeter", "soldering", "flux", "cutter", "knife", "glue gun", "glue sticks", "tester", "pliers", "stripper"]
    for t in tools:
        if t in name: return 2000
        
    # Tier 6: PCBs, Breadboards, Cables, Cases, Components (0 - 500)
    junk = ["pcb", "breadboard", "jumper", "wire", "cable", "case", "adapter", "button", "terminal", "resistor", "capacitor", "led", "ws2812", "header"]
    for j in junk:
        if j in name: return 100
        
    # Default fallback
    return 500

items_with_scores = [(item, get_score(get_name(item)), get_name(item)) for item in items]
# Sort by Score (Desc), then Name (Asc)
items_with_scores.sort(key=lambda x: (-x[1], x[2]))

sorted_items_str = ",\n  ".join([x[0] for x in items_with_scores])
new_content = pre_content + "  " + sorted_items_str + "\n" + post_content

with open(path, "w", encoding="utf-8") as f:
    f.write(new_content)
    
print("Sorted extremely precisely across 6 logical tiers.")
