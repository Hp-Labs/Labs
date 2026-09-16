import re

path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Find the battery block
battery_match = re.search(r'name: "3.7V 4000mAh Li-Po Battery",.*?image: "(.*?)",', content, re.DOTALL)
if battery_match:
    battery_image = battery_match.group(1)
    print(f"Battery Image: {battery_image}")

# Find the MicroSD block
sd_match = re.search(r'name: "MicroSD Card \(64GB\)",.*?image: "(.*?)",', content, re.DOTALL)
if sd_match:
    sd_image = sd_match.group(1)
    print(f"SD Image: {sd_image}")
