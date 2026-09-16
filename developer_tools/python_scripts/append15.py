path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

new_items = """  ,{
    id: "hw-wifi-adapter",
    name: "TP-Link High Gain Wi-Fi Adapter",
    category: "Wireless & RF",
    shortDescription: "External USB Wi-Fi card capable of monitor mode and packet injection.",
    fullDescription: "Most built-in laptop Wi-Fi cards cannot be put into 'Monitor Mode'. To capture WPA2 handshakes or perform deauthentication attacks using tools like Aircrack-ng, you need an external adapter with a chipset that supports packet injection and a high-gain antenna for range.",
    features: [
      "High-gain external antenna for long range",
      "Supports Monitor Mode",
      "Supports Packet Injection",
      "Compatible with Kali Linux & Parrot OS"
    ],
    useCases: [
      "Capturing WPA/WPA2 Handshakes",
      "Wi-Fi Deauthentication attacks",
      "Evil Twin access point creation",
      "Rogue AP detection"
    ],
    difficulty: "Beginner",
    image: "/hardware/wifi-adapter.jpg",
    links: {
      india: "https://link.amazon/B0fVI162g",
      global: "https://amzn.to/46P7626"
    }
  },
  {
    id: "hw-logic-analyzer",
    name: "USB Logic Analyzer (24MHz 8CH)",
    category: "Hardware Analysis",
    shortDescription: "8-channel signal sniffer to read raw data from I2C, SPI, and UART chips.",
    fullDescription: "When you want to see exactly what a microcontroller is saying to a flash memory chip, you hook up a logic analyzer. It captures the raw digital high/low signals on up to 8 pins simultaneously and decodes the 1s and 0s into readable text on your PC.",
    features: [
      "24MHz sampling rate",
      "8 simultaneous channels",
      "Compatible with Sigrok and PulseView",
      "Decodes I2C, SPI, UART, CAN, etc."
    ],
    useCases: [
      "Sniffing passwords sent from an MCU to an EEPROM",
      "Reverse engineering unknown hardware protocols",
      "Debugging custom hardware exploits",
      "Reading raw serial communications"
    ],
    difficulty: "Advanced",
    image: "/hardware/logic-analyzer.jpg",
    links: {
      india: "https://link.amazon/B0jkoPkjP",
      global: "https://amzn.to/4gYxlIe"
    }
  },
  {
    id: "hw-usb-power-meter",
    name: "USB-C Power Meter Tester",
    category: "Tools",
    shortDescription: "Inline multimeter to check voltage, current, and power draw safely.",
    fullDescription: "Before plugging an unknown 'found' USB device or a potentially malicious target board into your expensive laptop, you use a power meter. It tells you instantly if the device is attempting to draw too much current or acting like a 'USB Killer'.",
    features: [
      "Real-time Voltage (V) and Current (A) monitoring",
      "Color LCD display",
      "Measures total power capacity over time",
      "Bi-directional USB-C support"
    ],
    useCases: [
      "Detecting USB Killers before they fry your PC",
      "Profiling the power draw of hidden implants",
      "Diagnosing faulty Raspberry Pi power supplies",
      "Testing USB cable integrity"
    ],
    difficulty: "Beginner",
    image: "/hardware/usb-power-meter.jpg",
    links: {
      india: "https://link.amazon/B0034kREH",
      global: "https://amzn.to/4gV2goB"
    }
  },
  {
    id: "hw-snap-case",
    name: "EDC Cable & Adapter Snap Case",
    category: "Accessories",
    shortDescription: "Compact hard case to organize MicroSD cards, SIMs, and USB adapters.",
    fullDescription: "A hardware hacker's bag is usually a mess of tiny adapters, MicroSD cards with different Linux distros, and fragile connectors. This EDC (Everyday Carry) snap case keeps everything perfectly organized and protected so you don't lose your payloads.",
    features: [
      "Holds MicroSD cards, SIMs, and USB adapters",
      "Includes SIM ejector tool",
      "Hard protective shell",
      "Pocket-sized for field ops"
    ],
    useCases: [
      "Organizing multiple payload MicroSD cards",
      "Storing USB A-to-C and C-to-A adapters",
      "Keeping SIM cards for cellular IoT testing safe",
      "Field-ready quick deployment"
    ],
    difficulty: "Beginner",
    image: "/hardware/snap-case.jpg",
    links: {
      india: "https://link.amazon/B0iGl538j",
      global: "https://amzn.to/4yxfKOS"
    }
  },
  {
    id: "hw-mport-hub",
    name: "Portronics Mport 8 Plus USB Hub",
    category: "Accessories",
    shortDescription: "Multi-port expansion hub for slim laptops during heavy hardware ops.",
    fullDescription: "Modern laptops only have one or two USB-C ports. When you need to plug in a Wi-Fi adapter for Monitor Mode, a HackRF SDR, a logic analyzer, and a Rubber Ducky all at the same time, a reliable multi-port hub is absolutely critical.",
    features: [
      "Multiple USB-A 3.0 ports",
      "SD and MicroSD card readers built-in",
      "USB-C Power Delivery (PD) pass-through",
      "Aluminum casing for heat dissipation"
    ],
    useCases: [
      "Running multiple SDRs and Wi-Fi adapters simultaneously",
      "Quickly flashing multiple MicroSD cards with Kali/Parrot",
      "Expanding port-limited ultrabooks",
      "Consolidating connections for a clean workspace"
    ],
    difficulty: "Beginner",
    image: "/hardware/mport-hub.jpg",
    links: {
      india: "https://link.amazon/B00Zzakyx",
      global: "https://amzn.to/4ykmxv4"
    }
  }
"""

content = content.replace("\n];\n", new_items + "\n];\n")
with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Added 15th batch successfully")
