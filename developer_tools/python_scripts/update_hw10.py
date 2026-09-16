path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

new_items = """  ,{
    id: "hw-pcb-7x5",
    name: "Prototype PCB Board (7x5 cm)",
    category: "Components",
    shortDescription: "Standard size perfboard for moving circuits off the breadboard.",
    fullDescription: "Once you've successfully prototyped a hardware exploit on a breadboard, it's time to make it permanent. This 7x5 cm board is the standard 'Goldilocks' size—big enough to fit an ESP32 and some modules, but small enough to fit inside a pocket enclosure.",
    features: [
      "Standard 2.54mm hole pitch",
      "Double-sided plated through-holes (PTH)",
      "Fiberglass FR4 material",
      "Pre-tinned holes for easy soldering"
    ],
    useCases: [
      "Building permanent hardware hacking tools",
      "Creating custom ESP32/Arduino shields",
      "Soldering robust RF interceptors",
      "Replacing fragile breadboard setups"
    ],
    difficulty: "Intermediate",
    image: "/hardware/pcb-7x5.png",
    links: {
      india: "https://link.amazon/B01qNrdEp",
      global: "https://amzn.to/4A2oqhp"
    }
  },
  {
    id: "hw-pcb-15x20",
    name: "Large Prototype PCB (15x20 cm)",
    category: "Components",
    shortDescription: "Massive perfboard for building comprehensive hardware testing rigs.",
    fullDescription: "Sometimes you need to build a 'Frankenstein' rig. This massive 15x20 cm board allows you to mount a Raspberry Pi, multiple SDRs, logic-level converters, and target chips all on a single rigid platform for complex firmware analysis.",
    features: [
      "Huge 15x20 cm surface area",
      "Standard 2.54mm hole pitch",
      "Can be scored and snapped to custom sizes",
      "Durable FR4 construction"
    ],
    useCases: [
      "Building multi-chip firmware dumping rigs",
      "Creating permanent lab testing platforms",
      "Mounting heavy RF equipment securely",
      "Complex logic analyzer breakout boards"
    ],
    difficulty: "Intermediate",
    image: "/hardware/pcb-15x20.jpg",
    links: {
      india: "https://link.amazon/B00LsetYj",
      global: "https://amzn.to/4ysvjau"
    }
  },
  {
    id: "hw-pcb-9x15",
    name: "Medium Prototype PCB (9x15 cm)",
    category: "Components",
    shortDescription: "Spacious perfboard for projects involving screens and multiple modules.",
    fullDescription: "When building a standalone hacking gadget (like a custom RFID cloner or a portable Wi-Fi analyzer), you need space for the microcontroller, an OLED screen, battery management, and push buttons. The 9x15 cm size provides the perfect canvas.",
    features: [
      "9x15 cm dimensions",
      "Double-sided copper plating",
      "Grid matrix labeling for easy component mapping",
      "Supports through-hole and SMD components"
    ],
    useCases: [
      "Building DIY Flipper Zero alternatives",
      "Portable SDR enclosures",
      "Custom RFID reader/writer tools",
      "Multi-sensor environmental sniffers"
    ],
    difficulty: "Intermediate",
    image: "/hardware/pcb-9x15.jpg",
    links: {
      india: "https://link.amazon/B03sw2oaf",
      global: "https://amzn.to/46OTVhC"
    }
  },
  {
    id: "hw-pcb-6x8",
    name: "Small Prototype PCB (6x8 cm)",
    category: "Components",
    shortDescription: "Compact perfboard for single-function hacking payloads.",
    fullDescription: "Ideal for creating 'throwaway' or single-function devices. A 6x8 cm board is the perfect footprint for a tiny ESP8266 Deauther or a dedicated Bluetooth LE spammer that you can hide behind a desk or inside a server rack.",
    features: [
      "Compact 6x8 cm size",
      "Standard 2.54mm hole pitch",
      "High-quality fiberglass base",
      "Easy to mount inside standard project boxes"
    ],
    useCases: [
      "Dedicated Wi-Fi deauthers",
      "Standalone Bluetooth LE spammers",
      "Custom USB keystroke injectors",
      "Small inline wire-tapping devices"
    ],
    difficulty: "Intermediate",
    image: "/hardware/pcb-6x8.jpg",
    links: {
      india: "https://link.amazon/B0iDR8iEI",
      global: "https://amzn.to/3UGjJKk"
    }
  },
  {
    id: "hw-pcb-4x6",
    name: "Ultra-Micro Prototype PCB (4x6 cm)",
    category: "Components",
    shortDescription: "Tiny perfboards designed for highly covert hardware implants.",
    fullDescription: "When physical stealth is the priority, every millimeter counts. These tiny 4x6 cm boards are used to build microscopic implants that can be physically hidden inside computer mice, keyboards, or hollowed-out USB cables.",
    features: [
      "Ultra-compact 4x6 cm footprint",
      "Can be easily trimmed smaller",
      "Double-sided soldering pads",
      "Fits into extremely tight enclosures"
    ],
    useCases: [
      "Hardware keyloggers hidden inside keyboards",
      "Malicious mouse implants",
      "Covert network taps hidden in wall jacks",
      "Microscopic payload delivery systems"
    ],
    difficulty: "Advanced",
    image: "/hardware/pcb-4x6.jpg",
    links: {
      india: "https://link.amazon/B06WVocVS",
      global: "https://amzn.to/4d59wgA"
    }
  }
"""

if "];" in content:
    content = content.replace("];", new_items + "\n];")
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Success")
else:
    print("Failed to find ];")
