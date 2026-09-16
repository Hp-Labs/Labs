path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

new_items = """  ,{
    id: "hw-jumper-mf-2",
    name: "M-F Jumper Wires (Extended)",
    category: "Cables & Wiring",
    shortDescription: "Additional Male-to-Female dupont cables for module interconnection.",
    fullDescription: "You can never have enough M-F jumpers. These are the primary cables used to connect standard male header pins on dev boards (like ESP32/Raspberry Pi) directly into sensor modules, displays, and logic analyzers.",
    features: [
      "Standard 2.54mm pitch",
      "Flexible ribbon wire",
      "Easy to tear into custom bundles"
    ],
    useCases: [
      "Prototyping on breadboards",
      "Wiring logic analyzers",
      "Connecting RF modules to microcontrollers"
    ],
    difficulty: "Beginner",
    image: "/hardware/jumper-mf-2.jpg",
    links: {
      india: "https://link.amazon/B00ULo5Gb",
      global: "https://amzn.to/4yluWhI"
    }
  },
  {
    id: "hw-solderless-breadboard",
    name: "Solderless Breadboard",
    category: "Components",
    shortDescription: "Essential base for prototyping circuits without soldering.",
    fullDescription: "A large solderless breadboard (often with power rails and binding posts) is the foundation of hardware hacking. It allows you to rapidly build, test, and tear down circuits, memory dumping setups, or custom logic bypassing rigs without needing a soldering iron.",
    features: [
      "Standard 2.54mm hole pitch",
      "Integrated power and ground rails",
      "Reusable spring clips",
      "Binding posts for external power supply"
    ],
    useCases: [
      "Prototyping EEPROM read/write circuits",
      "Building logic-level shifters",
      "Testing microcontroller payloads",
      "Creating temporary hardware bypasses"
    ],
    difficulty: "Beginner",
    image: "/hardware/breadboard.jpg",
    links: {
      india: "https://link.amazon/B0c9xDwPa",
      global: "https://amzn.to/4cCHVmV"
    }
  },
  {
    id: "hw-stackable-header",
    name: "Male-to-Female Header Pins",
    category: "Components",
    shortDescription: "Stackable headers for Arduino shields and raising module height.",
    fullDescription: "These headers feature female sockets on top and extended male pins on the bottom. They are primarily used to stack shields on top of an Arduino, but hardware hackers use them to elevate modules off a breadboard or create custom intercept/sniffing shims.",
    features: [
      "Extended male pins",
      "Standard 2.54mm female receptacle",
      "Stackable design",
      "Easily cut to custom lengths"
    ],
    useCases: [
      "Building custom 'Man-in-the-Middle' hardware shims",
      "Stacking Arduino hacking shields",
      "Extending Logic Analyzer test points",
      "Elevating RF modules for better antenna clearance"
    ],
    difficulty: "Beginner",
    image: "/hardware/stackable-header.jpg",
    links: {
      india: "https://link.amazon/B0dWkkuHO",
      global: "https://amzn.to/4hiuFX6"
    }
  },
  {
    id: "hw-male-header",
    name: "Male Header Strip",
    category: "Components",
    shortDescription: "Breakaway 2.54mm male header pins for soldering onto bare PCBs.",
    fullDescription: "When you extract a router motherboard or buy a bare sensor module, the debug ports (UART/JTAG) are usually just unpopulated holes. You must solder these male header pins into those holes to connect your USB-to-TTL adapters or JTAG debuggers.",
    features: [
      "Standard 0.1\" (2.54mm) pitch",
      "Breakaway design (snap to required length)",
      "Gold or tin plated contacts",
      "Essential for populated UART/JTAG pads"
    ],
    useCases: [
      "Soldering onto router UART/JTAG debug pads",
      "Populating bare ESP32/STM32 modules",
      "Creating breadboard-compatible custom PCBs",
      "Making custom jumper wire adapters"
    ],
    difficulty: "Intermediate",
    image: "/hardware/male-header.jpg",
    links: {
      india: "https://link.amazon/B00b3AXQR",
      global: "https://amzn.to/4ysdmbY"
    }
  },
  {
    id: "hw-female-header",
    name: "Female Header Strip",
    category: "Components",
    shortDescription: "Standard 2.54mm female sockets for creating modular PCB connections.",
    fullDescription: "Female headers are soldered onto custom PCBs or prototyping boards so that microcontrollers (like an ESP32 or Arduino Nano) can be plugged in and removed easily, rather than being permanently soldered down.",
    features: [
      "Standard 0.1\" (2.54mm) pitch",
      "Can be carefully cut to size",
      "Secure friction fit for male pins",
      "Low profile"
    ],
    useCases: [
      "Building modular hardware hacking tools",
      "Creating socketed mounts for expensive microcontrollers",
      "Custom EEPROM reader sockets",
      "Clean PCB layout design"
    ],
    difficulty: "Intermediate",
    image: "/hardware/female-header.jpg",
    links: {
      india: "https://link.amazon/B06dxMv17",
      global: "https://amzn.to/4gHil2x"
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
