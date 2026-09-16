import re

path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Current block has name: "MicroSD Card (64GB)"
# Let's replace the fields for the Module
old_name = 'name: "MicroSD Card (64GB)"'
new_name = 'name: "MicroSD Card Module (SPI)"'

old_short = 'shortDescription: "High-speed storage for Raspberry Pi OS images, payload storage, and log saving."'
new_short = 'shortDescription: "SPI interface module for reading and writing to MicroSD cards from microcontrollers."'

old_full = '''fullDescription: "An absolute necessity for any hardware hacker. Whether you're flashing Kali Linux onto a Raspberry Pi, storing gigabytes of wardriving PCAP files, or saving dumped firmware, a reliable Class 10 MicroSD card is mandatory."'''
new_full = '''fullDescription: "When building custom implants, keyloggers, or wardriving rigs with ESP32 or Arduino, you often need local storage to save PCAP files, keystrokes, or logs. This module provides a simple SPI interface to read and write to standard MicroSD cards."'''

old_feat = '''features: [
        "Class 10 / UHS-I high transfer speeds",
        "64GB capacity (ideal for full OS images)",
        "Resilient to frequent write cycles",
        "Compatible with SD modules for Arduino/ESP32"
      ]'''
new_feat = '''features: [
        "Standard SPI interface",
        "Supports MicroSD and SDHC cards",
        "Built-in 3.3V voltage regulator",
        "Compatible with Arduino, ESP32, and Raspberry Pi"
      ]'''

old_use = '''useCases: [
        "Boot drives for Raspberry Pi / SBCs",
        "Storing PCAP files during WiFi packet sniffing",
        "Hosting large payload dictionaries (Duckyscript)",
        "Logging GPS data during wardriving"
      ]'''
new_use = '''useCases: [
        "Hardware keyloggers",
        "Saving PCAP data in custom wardriving rigs",
        "Storing payloads for BadUSB devices",
        "Offline data exfiltration"
      ]'''

content = content.replace(old_name, new_name)
content = content.replace(old_short, new_short)
content = content.replace(old_full, new_full)
content = content.replace(old_feat, new_feat)
content = content.replace(old_use, new_use)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated MicroSD Card to MicroSD Module.")
