path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

new_items = """  ,{
    id: "hw-pcb-3x7",
    name: "Narrow PCB Board (3x7 cm)",
    category: "Components",
    shortDescription: "Slim perfboard for building custom USB dongles and inline adapters.",
    fullDescription: "Sometimes your hacking tool needs to fit inside a narrow plastic tube or mimic a standard USB flash drive. This 3x7 cm board is the perfect width for soldering a standard USB Type-A connector on one end and an ATtiny or ESP8266 in the middle.",
    features: [
      "Slim 3x7 cm dimensions",
      "Double-sided copper plating",
      "Ideal width for USB Type-A connectors",
      "Easily cut down to 3x5 or 3x4"
    ],
    useCases: [
      "Building DIY BadUSB dongles",
      "Creating inline malicious USB cables",
      "Tiny Wi-Fi deauth dongles",
      "Concealed hardware drops"
    ],
    difficulty: "Intermediate",
    image: "/hardware/pcb-3x7.jpg",
    links: {
      india: "https://link.amazon/B0aJQbPA4",
      global: "https://amzn.to/4cw14Hc"
    }
  },
  {
    id: "hw-pcb-2x8",
    name: "Strip PCB Board (2x8 cm)",
    category: "Components",
    shortDescription: "Ultra-narrow strip perfboard for tight spaces and custom headers.",
    fullDescription: "This long, extremely narrow board is primarily used for creating custom header adapters or mounting tiny sensor arrays. It's so thin it can be slipped between existing components inside a target device's chassis.",
    features: [
      "Ultra-narrow 2x8 cm footprint",
      "Standard 2.54mm pitch",
      "High-quality fiberglass",
      "Perfect for creating custom connector shims"
    ],
    useCases: [
      "Custom UART/JTAG breakout adapters",
      "Shimming between tight PCB layers",
      "Building multi-pin logic analyzer probes",
      "Micro-implants in narrow cable housings"
    ],
    difficulty: "Advanced",
    image: "/hardware/pcb-2x8.jpg",
    links: {
      india: "https://link.amazon/B04X1T5gr",
      global: "https://amzn.to/4gJHf1A"
    }
  },
  {
    id: "hw-screw-terminal",
    name: "PCB Screw Terminal Block",
    category: "Components",
    shortDescription: "2-pin pluggable terminal for securing power or antenna wires to your board.",
    fullDescription: "When deploying a hacking tool into the field, you often need to attach it to an external power source (like a large Li-Po battery or a car's 12V line). Instead of soldering these thick wires permanently, screw terminals allow you to quickly lock and release them.",
    features: [
      "Standard 5.08mm or 2.54mm pitch options",
      "Secure screw-down clamping",
      "Modular interlocking design (snap multiple together)",
      "Handles higher current than dupont cables"
    ],
    useCases: [
      "Connecting external battery packs securely",
      "Attaching custom thick-wire antennas",
      "Modular power inputs for pentest dropboxes",
      "Quick-release connections for field deployment"
    ],
    difficulty: "Beginner",
    image: "/hardware/screw-terminal.jpg",
    links: {
      india: "https://link.amazon/B07QUPvXC",
      global: "https://amzn.to/4A4lC3k"
    }
  },
  {
    id: "hw-pi-power-cable",
    name: "Power Cable with Inline Switch",
    category: "Power",
    shortDescription: "USB power cable featuring a physical ON/OFF switch.",
    fullDescription: "Raspberry Pis and many dev boards do not have a physical power button. When constantly rebooting a Pi during a hacking session or kernel panic, repeatedly yanking the USB cable will eventually snap the port off the board. This inline switch saves your hardware.",
    features: [
      "Physical push-button power toggle",
      "Reduces wear on micro-USB/USB-C ports",
      "Supports sufficient current for Pi 3/4/Zero",
      "Durable wire construction"
    ],
    useCases: [
      "Safe hard-rebooting of Raspberry Pi dropboxes",
      "Powering custom USB hacking gadgets",
      "Preventing USB port mechanical failure",
      "Easy power management for headless setups"
    ],
    difficulty: "Beginner",
    image: "/hardware/pi-power-cable.jpg",
    links: {
      india: "https://link.amazon/B0gkUOSnR",
      global: "https://amzn.to/4gN6PkM"
    }
  },
  {
    id: "hw-mini-hdmi-adapter",
    name: "Mini HDMI to HDMI Adapter",
    category: "Cables & Wiring",
    shortDescription: "Converts a Raspberry Pi Zero's mini-HDMI port to a standard HDMI size.",
    fullDescription: "The Raspberry Pi Zero is a favorite for building 'Pwnagotchi' Wi-Fi sniffers or covert BadUSB implants because of its tiny size. However, it uses a Mini HDMI port. You absolutely need this adapter to plug it into a normal monitor for initial OS setup and debugging.",
    features: [
      "Mini HDMI (Male) to Standard HDMI (Female)",
      "Gold-plated connectors",
      "Supports 1080p / 4K",
      "Compact plug-and-play design"
    ],
    useCases: [
      "Initial headless setup for Raspberry Pi Zero",
      "Debugging Pwnagotchi / Wi-Fi sniffers",
      "Connecting micro-cameras or SDR screens",
      "Essential toolkit adapter for field ops"
    ],
    difficulty: "Beginner",
    image: "/hardware/mini-hdmi-adapter.jpg",
    links: {
      india: "https://link.amazon/B0dw0jpV0",
      global: "https://amzn.to/4iCQPon"
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
