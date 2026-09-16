path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

new_items = """  ,{
    id: "hw-hdmi-cable",
    name: "HDMI Cable",
    category: "Cables & Wiring",
    shortDescription: "Standard High-Speed HDMI cable for connecting lab gear.",
    fullDescription: "A reliable HDMI cable is essential for setting up Raspberry Pi dropboxes, configuring headless servers, or debugging hardware that outputs video. While many tools are accessed via SSH, having physical video out is a lifesaver during boot failures.",
    features: [
      "High-speed data transfer",
      "Durable braided shielding",
      "Gold-plated connectors",
      "Universal compatibility"
    ],
    useCases: [
      "Debugging Raspberry Pi boot issues",
      "Connecting SDR waterfall displays",
      "Setting up field hacking laptops",
      "OS installations on target hardware"
    ],
    difficulty: "Beginner",
    image: "/hardware/hdmi-cable.jpg",
    links: {
      india: "https://link.amazon/B09p6dXeG",
      global: "https://amzn.to/4xORbNg"
    }
  },
  {
    id: "hw-components-kit",
    name: "Electronic Components Kit",
    category: "Components",
    shortDescription: "A massive assortment of resistors, capacitors, LEDs, and diodes.",
    fullDescription: "When building custom circuits to interface with target hardware, you will inevitably need pull-up resistors, decoupling capacitors to stabilize power, or diodes to prevent reverse voltage. This kit provides all the basic passive components you need in one box.",
    features: [
      "Assorted 1/4W resistors (10Ω to 1MΩ)",
      "Ceramic and electrolytic capacitors",
      "Standard 5mm LEDs (various colors)",
      "Rectifier and signal diodes"
    ],
    useCases: [
      "Building pull-up/pull-down logic circuits",
      "Stabilizing power to unstable microcontrollers",
      "Creating voltage dividers for sensor inputs",
      "Visual status indicators (LEDs)"
    ],
    difficulty: "Beginner",
    image: "/hardware/components-kit.jpg",
    links: {
      india: "https://link.amazon/B03IuC2SA",
      global: "https://amzn.to/4r2Gu7f"
    }
  },
  {
    id: "hw-m5stack",
    name: "M5Stack ESP32 Platform",
    category: "Microcontrollers",
    shortDescription: "All-in-one ESP32 dev device with a screen, battery, and case.",
    fullDescription: "The M5Stack (like the Core or StickC) is a massive time-saver. Instead of wiring an ESP32, an OLED, and a battery on a messy breadboard, M5Stack puts it all in a sleek case. Hackers use these to run tools like 'Nemo' or 'Marauder' for Wi-Fi and Bluetooth pentesting out-of-the-box.",
    features: [
      "Built-in ESP32 (Wi-Fi & Bluetooth)",
      "Integrated color IPS display",
      "Internal battery and power management",
      "Grove connectors for instant expansion"
    ],
    useCases: [
      "Running ESP32 Marauder portably",
      "Building custom evil-twin Wi-Fi access points",
      "Portable Bluetooth LE spammers",
      "Rapid prototyping of hacking tools"
    ],
    difficulty: "Intermediate",
    image: "/hardware/m5stack.jpg",
    links: {
      india: "https://link.amazon/B005keOhz",
      global: "https://amzn.to/4yrgpkA"
    }
  },
  {
    id: "hw-flipper-zero",
    name: "Flipper Zero",
    category: "All-in-One Tools",
    shortDescription: "The ultimate portable multi-tool for pentesters and geeks.",
    fullDescription: "The Flipper Zero is a legendary pocket-sized hacking multi-tool. It combines an RFID reader/emulator, a Sub-1 GHz transceiver (for garage doors/gates), an NFC cloner, an IR blaster, and BadUSB capabilities into one device with a Tamagotchi-like interface.",
    features: [
      "Sub-1 GHz Transceiver (CC1101)",
      "125kHz RFID and 13.56MHz NFC",
      "Infrared Transmitter/Receiver",
      "GPIO pins for hardware expansion"
    ],
    useCases: [
      "Cloning office access cards (RFID/NFC)",
      "Capturing and replaying Sub-1 GHz gate remotes",
      "Keystroke injection (BadUSB)",
      "Controlling TVs and projectors via IR"
    ],
    difficulty: "Intermediate",
    image: "/hardware/flipper-zero.jpg",
    links: {
      india: "https://link.amazon/B0igGRlVr",
      global: "https://amzn.to/4qYS9nq"
    }
  },
  {
    id: "hw-flipper-wifi-board",
    name: "Flipper Zero Wi-Fi Dev Board",
    category: "All-in-One Tools",
    shortDescription: "Official ESP32-S2 expansion board adding Wi-Fi capabilities to the Flipper Zero.",
    fullDescription: "The base Flipper Zero lacks Wi-Fi. This official development board plugs directly into the Flipper's GPIO pins, adding an ESP32-S2 chip. It's most famously flashed with the 'Marauder' firmware to perform Wi-Fi deauthentication, packet sniffing, and evil-twin attacks.",
    features: [
      "ESP32-S2 microcontroller",
      "Plugs directly into Flipper Zero GPIO headers",
      "On-board USB-C for independent flashing",
      "Supports external antennas"
    ],
    useCases: [
      "Running Marauder for Wi-Fi pentesting",
      "Capturing PCAP files for WPA2 handshakes",
      "Targeted Wi-Fi deauthentication attacks",
      "Advanced network reconnaissance"
    ],
    difficulty: "Intermediate",
    image: "/hardware/flipper-wifi-board.jpg",
    links: {
      india: "https://link.amazon/B0fnbXXFY",
      global: "https://amzn.to/4A7INtW"
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
