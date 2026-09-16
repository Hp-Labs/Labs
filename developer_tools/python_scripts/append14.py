path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

new_items = """  ,{
    id: "hw-proxmark3",
    name: "Proxmark3 Easy",
    category: "RFID / NFC",
    shortDescription: "The absolute industry standard tool for RFID/NFC hacking and cloning.",
    fullDescription: "If you are doing physical penetration testing, the Proxmark3 is mandatory. It can read, clone, crack, and emulate almost every RFID tag in existence, from low-frequency 125kHz office badges to highly encrypted high-frequency 13.56MHz smart cards.",
    features: [
      "Dual antenna (125kHz LF & 13.56MHz HF)",
      "Cracks MIFARE Classic keys (Nested/Hardnested attacks)",
      "Emulates multiple card formats",
      "Massive open-source community support (Iceman Fork)"
    ],
    useCases: [
      "Red Team physical access bypasses",
      "Cloning highly secure HID Prox/iClass cards",
      "Analyzing proprietary RFID protocols",
      "Brute-forcing access control keys"
    ],
    difficulty: "Advanced",
    image: "/hardware/proxmark3.jpg",
    links: {
      india: "https://link.amazon/B0cmi0ikU",
      global: "https://amzn.to/4ifiT0L"
    }
  },
  {
    id: "hw-ubertooth",
    name: "Ubertooth One",
    category: "Wireless & RF",
    shortDescription: "An open-source 2.4 GHz wireless development platform for Bluetooth hacking.",
    fullDescription: "Standard Wi-Fi adapters can't sniff Bluetooth traffic. The Ubertooth One is specifically designed to intercept, log, and inject packets into Bluetooth Classic and Bluetooth Low Energy (BLE) networks, exposing the invisible devices all around us.",
    features: [
      "2.4 GHz transmit and receive",
      "Designed specifically for Bluetooth packet sniffing",
      "Compatible with Kismet and Wireshark",
      "Open-source hardware and software"
    ],
    useCases: [
      "Sniffing Bluetooth Classic and BLE traffic",
      "Tracking MAC addresses of passing devices",
      "Analyzing vulnerabilities in smart home IoT",
      "Wireless reconnaissance"
    ],
    difficulty: "Advanced",
    image: "/hardware/ubertooth.jpg",
    links: {
      india: "https://link.amazon/B0iURdSMj",
      global: "https://amzn.to/46P5TI6"
    }
  },
  {
    id: "hw-chameleon-mini",
    name: "Chameleon Mini (RevG)",
    category: "RFID / NFC",
    shortDescription: "A stealthy, portable hardware emulator for contactless smart cards.",
    fullDescription: "While the Proxmark3 is great for cracking, the Chameleon Mini is perfect for field operations. You load it up with several cloned RFID card dumps, and use the physical buttons to seamlessly switch between which 'card' you are emulating at the target reader.",
    features: [
      "Emulates multiple 13.56MHz NFC tags",
      "Stores up to 8 different card dumps",
      "Logs reader communications for cracking",
      "Standalone battery operation"
    ],
    useCases: [
      "Covert field emulation of cloned badges",
      "Sniffing reader keys (mfkey32 attacks)",
      "Bypassing hotel and office security gates",
      "Rapid switching between targeted identities"
    ],
    difficulty: "Intermediate",
    image: "/hardware/chameleon.jpg",
    links: {
      india: "https://link.amazon/B0fy6lsQr",
      global: "https://amzn.to/4xKKpYZ"
    }
  },
  {
    id: "hw-hackypi",
    name: "HackyPi",
    category: "Implants & Keyloggers",
    shortDescription: "A modern, educational BadUSB alternative powered by the RP2040.",
    fullDescription: "HackyPi is a next-generation keystroke injection tool. Unlike traditional hidden BadUSBs, it features a built-in TFT display to show the status of payloads or custom animations. It uses the powerful RP2040 chip, making it highly programmable via MicroPython or C/C++.",
    features: [
      "Powered by Raspberry Pi RP2040",
      "Integrated 1.14-inch TFT color display",
      "MicroSD card slot for payload storage",
      "Supports multiple operating systems"
    ],
    useCases: [
      "Interactive BadUSB demonstrations",
      "Executing dynamic multi-stage payloads",
      "Educational penetration testing",
      "Portable system configuration tool"
    ],
    difficulty: "Intermediate",
    image: "/hardware/hackpi.png",
    links: {
      india: "https://link.amazon/B01c17q3I",
      global: "https://amzn.to/4gJzQPR"
    }
  },
  {
    id: "hw-bus-pirate",
    name: "Bus Pirate",
    category: "Hardware Analysis",
    shortDescription: "A universal bus interface that talks to electronics from a PC terminal.",
    fullDescription: "When you open a router and find a diagnostic port, you don't always know what protocol it speaks. The Bus Pirate is a multi-tool that lets your PC talk I2C, SPI, UART, JTAG, and more directly to the target motherboard to dump firmware or gain a root shell.",
    features: [
      "Supports 1-Wire, I2C, SPI, JTAG, UART, etc.",
      "0-5.5V tolerant pins",
      "Built-in voltage regulators (3.3V and 5V)",
      "Accessible via a simple terminal interface"
    ],
    useCases: [
      "Dumping SPI flash memory chips",
      "Connecting to root UART consoles on routers",
      "Interfacing with unknown IoT sensors",
      "Hardware reverse engineering"
    ],
    difficulty: "Advanced",
    image: "/hardware/bus-pirate.jpg",
    links: {
      india: "https://link.amazon/B0dFJNsON",
      global: "https://amzn.to/46iYfFM"
    }
  }
"""

content = content.replace("\n];\n", new_items + "\n];\n")
with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Added 14th batch successfully")
