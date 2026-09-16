path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

new_items = """  ,{
    id: "hw-digispark",
    name: "Digispark ATtiny85 (BadUSB)",
    category: "Microcontrollers",
    shortDescription: "Ultra-compact, low-cost microcontroller famous for Keystroke Injection attacks.",
    fullDescription: "The Digispark is the ultimate budget alternative to the Hak5 USB Rubber Ducky. Because it can emulate a standard USB keyboard, hackers use it to inject rapid-fire malicious keystrokes the second it is plugged into a target machine.",
    features: [
      "ATtiny85 microcontroller",
      "Native USB interface (plugs directly into ports)",
      "Supports Micronucleus bootloader",
      "Compatible with Arduino IDE and Duckyscript converters"
    ],
    useCases: [
      "Building a DIY USB Rubber Ducky",
      "Keystroke injection (BadUSB) attacks",
      "Automating repetitive system configurations",
      "Ultra-concealable hardware implants"
    ],
    difficulty: "Beginner",
    image: "/hardware/digispark.jpg",
    links: {
      india: "https://link.amazon/B0eaUKXFd",
      global: "https://amzn.to/4xNi6ZZ"
    }
  },
  {
    id: "hw-ws2812",
    name: "WS2812 RGB LED Breakout",
    category: "Components",
    shortDescription: "Addressable RGB LED for providing stealthy visual feedback on headless tools.",
    fullDescription: "When your hacking implant is hidden inside a wall or a generic plastic case, you don't have a screen. A single WS2812 'NeoPixel' LED can blink different colors to silently tell you if an attack succeeded, failed, or is currently running.",
    features: [
      "Individually addressable RGB LED",
      "Only requires 1 data pin",
      "Chainable design (Data OUT to Data IN)",
      "Extremely bright but dimmable via software"
    ],
    useCases: [
      "Status indicator for headless Raspberry Pi dropboxes",
      "Visual feedback for successful RFID clones",
      "Deauth attack active indicators",
      "Custom portable pentest tool UI"
    ],
    difficulty: "Beginner",
    image: "/hardware/ws2812.jpg",
    links: {
      india: "https://link.amazon/B0gD8NJsO",
      global: "https://amzn.to/4gY63BC"
    }
  },
  {
    id: "hw-soldering-iron",
    name: "Soldering Iron (25W)",
    category: "Tools",
    shortDescription: "Standard soldering iron for attaching headers and modifying circuits.",
    fullDescription: "Hardware hacking is impossible without a soldering iron. You will need it to attach debug pins to bare router motherboards, fix broken traces, or desolder EEPROM chips to read their firmware in an external programmer.",
    features: [
      "Constant temperature heating element",
      "Ergonomic handle",
      "Replaceable tips",
      "Essential for any hardware lab"
    ],
    useCases: [
      "Populating UART/JTAG debug headers",
      "Desoldering flash memory chips (TSOP/SOIC)",
      "Building permanent custom attack modules",
      "Splicing wires for Man-in-the-Middle attacks"
    ],
    difficulty: "Intermediate",
    image: "/hardware/soldering-iron.jpg",
    links: {
      india: "https://link.amazon/B08HfeBPU",
      global: "https://amzn.to/4yp3DmF"
    }
  },
  {
    id: "hw-soldering-tip",
    name: "Fine-Point Soldering Tip",
    category: "Tools",
    shortDescription: "Precision replacement tip for working on tiny surface-mount (SMD) components.",
    fullDescription: "Modern IoT devices use microscopic Surface Mount Devices (SMD). A standard chunky soldering iron tip will bridge pins and ruin the board. A precision fine-point tip is mandatory for soldering tiny jumper wires to microscopic debug pads.",
    features: [
      "Ultra-fine conical point",
      "Compatible with standard generic irons",
      "Copper core for heat transfer",
      "Ideal for SMD rework"
    ],
    useCases: [
      "Soldering tiny 30AWG wire to PCB test points",
      "Precision EEPROM leg desoldering",
      "Fixing damaged microscopic PCB traces",
      "Attaching wires to bare microcontrollers"
    ],
    difficulty: "Advanced",
    image: "/hardware/soldering-tip.jpg",
    links: {
      india: "https://link.amazon/B0i6TBZPO",
      global: "https://amzn.to/4hftzeK"
    }
  },
  {
    id: "hw-soldering-wire",
    name: "Rosin Core Soldering Wire",
    category: "Tools",
    shortDescription: "High-quality solder alloy with integrated flux for clean, strong joints.",
    fullDescription: "Cheap solder creates 'cold joints' that break when you move your hacking device. A good Rosin Core solder melts smoothly and ensures your debug wires stay permanently attached to the target's motherboard.",
    features: [
      "Integrated rosin flux core",
      "Low melting point",
      "High conductivity",
      "Reduces oxidation during soldering"
    ],
    useCases: [
      "Securing UART header pins",
      "Joining spliced wires in physical bypasses",
      "Tinning wires before breadboarding",
      "General PCB modification"
    ],
    difficulty: "Beginner",
    image: "/hardware/soldering-wire.jpg",
    links: {
      india: "https://link.amazon/B0fXCiWZi",
      global: "https://amzn.to/3V3C0RH"
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
