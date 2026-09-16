path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

new_items = """  ,{
    id: "hw-rfid-rdm6300",
    name: "RDM6300 125kHz RFID Reader",
    category: "RFID / NFC",
    shortDescription: "Low-frequency (125kHz) RFID module for reading legacy access control badges.",
    fullDescription: "While the RC522 handles 13.56MHz high-frequency tags, the RDM6300 is essential for interacting with older, low-frequency 125kHz tags (like EM4100). Many building access control systems still rely on this vulnerable standard.",
    features: [
      "125kHz operating frequency",
      "Serial UART output format",
      "External coil antenna for better range",
      "Compatible with EM4100/EM4001 tags"
    ],
    useCases: [
      "Cloning legacy 125kHz office badges",
      "Building multi-frequency RFID skimmers",
      "Physical penetration testing",
      "Legacy access control security audits"
    ],
    difficulty: "Beginner",
    image: "/hardware/rfid-rdm6300.jpg",
    links: {
      india: "https://link.amazon/B09qaUTCm",
      global: "https://amzn.to/4gKU0ZO"
    }
  },
  {
    id: "hw-oled-096",
    name: "0.96\" OLED Display",
    category: "Components",
    shortDescription: "Compact, high-contrast display for portable hacking gadgets (like Pwnagotchi).",
    fullDescription: "A tiny but incredibly crisp I2C OLED screen. It is the go-to display for DIY portable pentesting tools, displaying captured handshakes, deauth status, or IP addresses without needing a full monitor.",
    features: [
      "128x64 pixel resolution",
      "I2C interface (only requires 4 pins)",
      "No backlight required (self-illuminating pixels)",
      "Ultra-low power consumption"
    ],
    useCases: [
      "Building a custom Pwnagotchi",
      "Displaying rogue AP status in real-time",
      "Creating standalone WiFi deauthers",
      "Portable password brute-forcing feedback"
    ],
    difficulty: "Beginner",
    image: "/hardware/oled-small.jpg",
    links: {
      india: "https://link.amazon/B04n16ls9",
      global: "https://amzn.to/4xNeqHF"
    }
  },
  {
    id: "hw-tft-display",
    name: "TFT Color LCD Display",
    category: "Components",
    shortDescription: "Larger color display for complex UIs on custom hardware tools.",
    fullDescription: "When an OLED is too small, SPI TFT displays provide full RGB color and higher resolution. Essential for building tools that require complex menus, graphing signal strength, or reading extended log outputs.",
    features: [
      "Full RGB color matrix",
      "SPI communication protocol",
      "Often includes an integrated SD card reader on the back",
      "Wide compatibility with TFT_eSPI libraries"
    ],
    useCases: [
      "Building pocket-sized spectrum analyzers",
      "Creating rich GUI menus for portable hacking tools",
      "Displaying Wardriving maps",
      "Custom BadUSB payload selectors"
    ],
    difficulty: "Intermediate",
    image: "/hardware/tft-display.jpg",
    links: {
      india: "https://link.amazon/B01gKLs9I",
      global: "https://amzn.to/4ysgqEP"
    }
  },
  {
    id: "hw-microsd-64gb",
    name: "MicroSD Card (64GB)",
    category: "Storage",
    shortDescription: "High-speed storage for Raspberry Pi OS images, payload storage, and log saving.",
    fullDescription: "An absolute necessity for any hardware hacker. Whether you're flashing Kali Linux onto a Raspberry Pi, storing gigabytes of wardriving PCAP files, or saving dumped firmware, a reliable Class 10 MicroSD card is mandatory.",
    features: [
      "Class 10 / UHS-I high transfer speeds",
      "64GB capacity (ideal for full OS images)",
      "Resilient to frequent write cycles",
      "Compatible with SD modules for Arduino/ESP32"
    ],
    useCases: [
      "Boot drives for Raspberry Pi / SBCs",
      "Storing PCAP files during WiFi packet sniffing",
      "Hosting large payload dictionaries (Duckyscript)",
      "Logging GPS data during wardriving"
    ],
    difficulty: "Beginner",
    image: "/hardware/microsd.jpg",
    links: {
      india: "https://link.amazon/B0f7GC0Pg",
      global: "https://amzn.to/4ikavwW"
    }
  },
  {
    id: "hw-lipo-4000mah",
    name: "3.7V 4000mAh Li-Po Battery",
    category: "Power",
    shortDescription: "High-capacity portable power for standalone implants and remote tools.",
    fullDescription: "To make your hacking tools truly portable (or concealable as physical dropboxes), you need reliable offline power. This 4000mAh Lithium-Polymer battery provides days of standby time for an ESP32 or hours of active attacking for a Raspberry Pi.",
    features: [
      "3.7V nominal voltage",
      "High capacity (4000mAh)",
      "Built-in protection circuit (BMS) against overcharge",
      "Compact flat-pack form factor"
    ],
    useCases: [
      "Powering remote network dropboxes",
      "Building portable WiFi deauth watches/tools",
      "Concealed physical implants",
      "Creating autonomous wardriving rigs"
    ],
    difficulty: "Intermediate",
    image: "/hardware/lipo-battery.jpg",
    links: {
      india: "https://link.amazon/B07puiqYC",
      global: "https://amzn.to/4qZzGHk"
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
