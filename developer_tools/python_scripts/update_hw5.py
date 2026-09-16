path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

new_items = """  ,{
    id: "hw-dip-switch",
    name: "4-Position DIP Switch",
    category: "Components",
    shortDescription: "Compact breadboard-friendly switches for hardware configuration and logic testing.",
    fullDescription: "DIP switches are frequently used in embedded devices to set hardware IDs, modes, or baud rates. In hardware hacking, you'll use these on breadboards to manually toggle logic states (HIGH/LOW) when testing raw microcontrollers or bypassing security locks.",
    features: [
      "4 independent SPST switches",
      "Standard 2.54mm pitch (breadboard compatible)",
      "Gold-plated contacts for reliability",
      "Low profile design"
    ],
    useCases: [
      "Manually injecting logic signals (HIGH/LOW)",
      "Configuring hardware payload modes (e.g. Malduino)",
      "Simulating sensor inputs during reverse engineering",
      "Hardware-based brute force setups"
    ],
    difficulty: "Beginner",
    image: "/hardware/dip-switch.jpg",
    links: {
      india: "https://link.amazon/B03ltkThx",
      global: "https://amzn.to/3ULKZXE"
    }
  },
  {
    id: "hw-jumper-kit",
    name: "Solid Core Jumper Wire Kit",
    category: "Cables & Wiring",
    shortDescription: "Pre-cut, pre-stripped solid core wires for clean breadboard prototyping.",
    fullDescription: "When building complex hardware exploits on a breadboard (like wiring an EEPROM to an Arduino), standard dupont cables become a messy 'rat's nest'. This kit provides precise, flat-laying solid core wires for clean, traceable circuits.",
    features: [
      "Various lengths pre-cut and bent",
      "Solid core wire (22 AWG)",
      "Includes plastic organizer box",
      "Color-coded by length"
    ],
    useCases: [
      "Clean EEPROM dumping circuits",
      "Complex logic analyzer setups",
      "Permanent breadboard implants",
      "Clean signal routing to prevent RF interference"
    ],
    difficulty: "Beginner",
    image: "/hardware/jumper-box.jpg",
    links: {
      india: "https://link.amazon/B0dRGyBni",
      global: "https://amzn.to/4Aa49H5"
    }
  },
  {
    id: "hw-jumper-mf",
    name: "Male-to-Female Jumper Wires",
    category: "Cables & Wiring",
    shortDescription: "Dupont cables for connecting microcontrollers directly to sensor modules.",
    fullDescription: "The absolute lifeline of a hardware hacker. Male-to-Female wires are used to connect the male header pins of a Raspberry Pi or Arduino directly into the female headers of RF modules, displays, or logic analyzers.",
    features: [
      "Standard 2.54mm Dupont connectors",
      "Ribbon cable format (can be torn off individually)",
      "Flexible stranded wire core",
      "Reusable and durable"
    ],
    useCases: [
      "Connecting Logic Analyzers to PCB headers",
      "Tapping into UART debug ports",
      "Wiring modules (RFID/OLED) to an Arduino",
      "JTAG/SWD debugging connections"
    ],
    difficulty: "Beginner",
    image: "/hardware/jumper-mf.jpg",
    links: {
      india: "https://link.amazon/B05oVY4iR",
      global: "https://amzn.to/4r14iIB"
    }
  },
  {
    id: "hw-jumper-mm",
    name: "Male-to-Male Jumper Wires",
    category: "Cables & Wiring",
    shortDescription: "Standard wires for making connections across breadboards.",
    fullDescription: "Male-to-Male jumpers are primarily used for bridging connections on a solderless breadboard. They are essential when prototyping circuits, bypassing cut traces on a PCB, or connecting an Arduino directly to a breadboard rail.",
    features: [
      "Male pins on both ends",
      "2.54mm pitch compatible",
      "Peelable ribbon structure",
      "Varying colors for signal tracking"
    ],
    useCases: [
      "Breadboard prototyping",
      "Bridging broken PCB traces temporarily",
      "Injecting faults via breadboard setups",
      "Connecting Arduino UNO headers to breadboards"
    ],
    difficulty: "Beginner",
    image: "/hardware/jumper-mm.jpg",
    links: {
      india: "https://link.amazon/B03x1x7Tp",
      global: "https://amzn.to/4r2yDGz"
    }
  },
  {
    id: "hw-jumper-ff",
    name: "Female-to-Female Jumper Wires",
    category: "Cables & Wiring",
    shortDescription: "Dupont cables for connecting modules directly to each other without a breadboard.",
    fullDescription: "Female-to-Female jumpers are used when dealing with devices that only have male pins. They are commonly used to connect a USB-to-TTL serial adapter directly to the male UART pins on a router's motherboard to get a root shell.",
    features: [
      "Female sockets on both ends",
      "Fits standard 0.1\" (2.54mm) headers",
      "Easy to tear into custom harnesses",
      "Color-coded"
    ],
    useCases: [
      "Connecting USB-to-TTL adapters to router UART pins",
      "Wiring a Raspberry Pi GPIO directly to a module",
      "Flashing ESP8266/ESP32 modules via FTDI",
      "Making quick custom extension cables"
    ],
    difficulty: "Beginner",
    image: "/hardware/jumper-ff.jpg",
    links: {
      india: "https://link.amazon/B0giduVJV",
      global: "https://amzn.to/3VlifoP"
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
