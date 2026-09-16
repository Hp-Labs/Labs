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
        return match.group(1).strip()
    return ""

master_list = [
    "Flipper Zero",
    "Flipper Zero Wi-Fi Dev Board",
    "USB Rubber Ducky",
    "HackyPi",
    "HackRF One",
    "Proxmark3 Easy",
    "Chameleon Mini (RevG)",
    "Ubertooth One",
    "Bus Pirate",
    "Beetle BadUSB (ATmega32U4)",
    "Digispark ATtiny85 (BadUSB)",
    "M5Stack ESP32 Platform",
    "RTL-SDR Blog V3",
    "Wio Tracker (Meshtastic)",
    "Raspberry Pi",
    "USB Logic Analyzer (24MHz 8CH)",
    "ESP32 Development Board",
    "ESP8266 NodeMCU",
    "Arduino Uno R3",
    "STM32 BLE/RF Evaluation Board",
    "TP-Link High Gain Wi-Fi Adapter",
    "0.96 inch OLED Display",
    "TFT Color LCD Display",
    "RFID RC522 Module (Blue)",
    "RFID/NFC Module (Red Edition)",
    "RDM6300 125kHz RFID Reader",
    "NRF24L01+PA+LNA",
    "Sub-1GHz & 2.4GHz RF Modules",
    "IR Transmitter LEDs",
    "IR Receiver Module (3-Pin)",
    "WS2812 RGB LED Breakout",
    "ESP32-WROOM-32D Module",
    "MicroSD Card Module (SPI)",
    "iButton / Dallas Key Probe",
    "NRF24L01 3.3V Adapter Board",
    "3.7V 4000mAh Li-Po Battery",
    "TP4056 Battery Charging & Protection",
    "MT3608 DC-DC Boost Converter",
    "MicroSD Card (64GB)",
    "MB102 Breadboard Power Supply",
    "USB-C Power Meter Tester",
    "Portronics Mport 30 Plus",
    "Portronics Mport 8 Plus USB Hub",
    "EDC Cable & Adapter Snap Case",
    "HDMI Cable",
    "Mini HDMI to HDMI Adapter",
    "Power Cable with Inline Switch",
    "Digital Multimeter",
    "Soldering Iron (25W)",
    "Soldering Iron Stand",
    "Fine-Point Soldering Tip",
    "Soldering Flux Paste",
    "Rosin Core Soldering Wire",
    "Desoldering Wick (Braid)",
    "Hot Glue Gun",
    "Hot Glue Sticks (Refills)",
    "Wire Cutter & Stripper",
    "Precision Hobby Knife",
    "Electronic Components Kit",
    "Solderless Breadboard",
    "Male-to-Male Jumper Wires",
    "Male-to-Female Jumper Wires",
    "Female-to-Female Jumper Wires",
    "Solid Core Jumper Wire Kit",
    "M-F Jumper Wires (Extended)",
    "Large Prototype PCB (15x20 cm)",
    "Medium Prototype PCB (9x15 cm)",
    "Small Prototype PCB (6x8 cm)",
    "Prototype PCB Board (7x5 cm)",
    "Ultra-Micro Prototype PCB (4x6 cm)",
    "Narrow PCB Board (3x7 cm)",
    "Strip PCB Board (2x8 cm)",
    "Raspberry Pi Case",
    "Tactile Push Buttons Set",
    "Latching Push Button",
    "4-Position DIP Switch",
    "PCB Screw Terminal Block",
    "Male Header Strip",
    "Female Header Strip",
    "90-Degree Male Headers",
    "Male-to-Female Header Pins"
]

def get_score(name):
    for idx, item in enumerate(master_list):
        if name.strip().lower() == item.strip().lower():
            return 1000 - idx
    return 0

items_with_scores = [(item, get_score(get_name(item)), get_name(item)) for item in items]
items_with_scores.sort(key=lambda x: (-x[1], x[2]))

sorted_items_str = ",\n  ".join([x[0] for x in items_with_scores])
new_content = pre_content + "  " + sorted_items_str + "\n" + post_content

with open(path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Exact array sort completed.")
