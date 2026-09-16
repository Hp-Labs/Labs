import re

path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update the Module's image
# Locate the block for MicroSD Card Module (SPI)
module_pattern = r'(name:\s*"MicroSD Card Module \(SPI\)",.*?image:\s*")([^"]+)(")'
content = re.sub(module_pattern, r'\1/hardware/microsd-module.jpg\3', content, flags=re.DOTALL)

# 2. Append the new MicroSD Card (64GB) entry
# We will insert it right before the `];` at the end of the array.
new_entry = """  {
    id: "hw-microsd-card-64gb",
    name: "MicroSD Card (64GB)",
    category: "Storage",
    shortDescription: "High-speed Class 10 storage for OS images, PCAPs, and payload files.",
    fullDescription: "An absolute necessity for any hardware hacker. Whether you're flashing Kali Linux onto a Raspberry Pi, storing gigabytes of wardriving PCAP files, or saving dumped firmware, a reliable Class 10 MicroSD card is mandatory.",
    features: [
      "Class 10 / UHS-I high transfer speeds",
      "64GB capacity (ideal for full OS images)",
      "Resilient to frequent write cycles",
      "Compatible with Raspberry Pi, SDRs, and ESP32 modules"
    ],
    useCases: [
      "Boot drives for Raspberry Pi / SBCs",
      "Storing PCAP files during WiFi packet sniffing",
      "Hosting large payload dictionaries",
      "Logging GPS data during wardriving"
    ],
    difficulty: "Beginner",
    image: "/hardware/microsd-card.jpg",
    links: {
      india: "https://link.amazon/B07LJXV0g",
      global: "https://amzn.to/46iJG54"
    }
  }
"""

end_bracket_idx = content.rfind("];")
if end_bracket_idx != -1:
    # Check if there is a comma before the closing bracket. Usually it's `  }\n];`
    # Let's just insert `, \n` + new_entry
    # Actually, we can just replace `\n];` with `,\n` + new_entry + `];`
    content = content[:end_bracket_idx].rstrip() + ",\n" + new_entry + "];\n"

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Added MicroSD Card and updated Module image.")
