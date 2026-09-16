path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

new_items = """  ,{
    id: "hw-tp4056",
    name: "TP4056 Battery Charging & Protection",
    category: "Power",
    shortDescription: "Essential module for safely charging Li-Po batteries in portable hacking tools.",
    fullDescription: "When building custom portable tools (like a WiFi deauther or a remote dropbox), you need a way to recharge the battery without removing it. The TP4056 provides USB-C charging and prevents battery explosion via over-discharge/over-charge protection circuits.",
    features: [
      "USB-C input for modern charging",
      "1A adjustable charge current",
      "Over-charge / Over-discharge protection",
      "Status indicator LEDs (Red: Charging, Blue/Green: Full)"
    ],
    useCases: [
      "Making standalone implants rechargeable",
      "Safe Li-Po battery management",
      "Powering custom ESP32/Raspberry Pi Zero builds",
      "Concealed hardware drops"
    ],
    difficulty: "Beginner",
    image: "/hardware/tp4056.jpg",
    links: {
      india: "https://link.amazon/B0gSFOoNv",
      global: "https://amzn.to/4dui151"
    }
  },
  {
    id: "hw-stm32-eval",
    name: "STM32 BLE/RF Evaluation Board",
    category: "Microcontrollers",
    shortDescription: "Advanced ARM Cortex-M4 microcontroller board for Bluetooth and RF security research.",
    fullDescription: "While ESP32 is great for beginners, STM32 evaluation boards (like the STM32WB55) offer deep, low-level access to Bluetooth LE and 802.15.4 protocols. Ideal for serious reverse engineering, firmware analysis, and developing custom RF exploits.",
    features: [
      "High-performance ARM Cortex-M4/M0+ dual-core architecture",
      "Hardware cryptography accelerators",
      "Native support for BLE 5.2, Zigbee, and Thread",
      "Extensive debug capabilities (SWD/JTAG)"
    ],
    useCases: [
      "Low-level Bluetooth LE reverse engineering",
      "Developing Zigbee/Thread attacks",
      "Advanced firmware dumping and glitching",
      "Custom exploit payload development"
    ],
    difficulty: "Advanced",
    image: "/hardware/eval-board.jpg",
    links: {
      india: "https://link.amazon/B08yyInUN",
      global: "https://amzn.to/46MKoHX"
    }
  },
  {
    id: "hw-ibutton-probe",
    name: "iButton / Dallas Key Probe",
    category: "RFID / NFC",
    shortDescription: "Physical contact probe for reading and cloning 1-Wire iButton access keys.",
    fullDescription: "iButtons (Dallas Keys) are rugged, coin-sized access control tokens used in cash registers, security patrols, and electronic locks. This probe allows you to read, emulate, and clone these keys using tools like the Flipper Zero or custom Arduino setups.",
    features: [
      "Standard 1-Wire protocol interface",
      "Durable metallic contact points",
      "Compatible with DS1990A and similar iButtons",
      "Easy 2-wire (Data/GND) connection"
    ],
    useCases: [
      "Cloning Point-of-Sale (POS) login keys",
      "Bypassing legacy physical security patrols (Guard Tour)",
      "Building a custom Flipper Zero add-on",
      "1-Wire protocol sniffing"
    ],
    difficulty: "Intermediate",
    image: "/hardware/ibutton.jpg",
    links: {
      india: "https://link.amazon/B0bGZ78g1",
      global: "https://amzn.to/4hgbVYd"
    }
  },
  {
    id: "hw-mt3608-boost",
    name: "MT3608 DC-DC Boost Converter",
    category: "Power",
    shortDescription: "Step-up voltage regulator to power 5V/9V/12V components from a 3.7V battery.",
    fullDescription: "Many hacking modules (like standard USB rubber duckies, Raspberry Pis, or certain SDRs) strictly require 5V to operate. This tiny module boosts a single 3.7V Li-Po battery up to 28V, ensuring your portable tools get the exact voltage they need.",
    features: [
      "Up to 2A maximum output current",
      "Adjustable output voltage (2V to 28V)",
      "High efficiency (up to 93%)",
      "Tiny footprint for covert implants"
    ],
    useCases: [
      "Powering 5V Raspberry Pi from a 3.7V Li-Po cell",
      "Running 12V antennas/amplifiers portably",
      "Building compact USB power injectors",
      "Custom portable hacking gadgets"
    ],
    difficulty: "Intermediate",
    image: "/hardware/mt3608.jpg",
    links: {
      india: "https://link.amazon/B0ceNPq1C",
      global: "https://amzn.to/4cAP3jG"
    }
  },
  {
    id: "hw-breadboard-psu",
    name: "MB102 Breadboard Power Supply",
    category: "Components",
    shortDescription: "Pluggable power supply module providing clean 5V and 3.3V for prototyping.",
    fullDescription: "When building a new hardware exploit or wiring up a raw EEPROM chip to dump firmware, stable power is critical. This module snaps directly onto a standard breadboard and lets you toggle between 3.3V and 5V independently on each rail.",
    features: [
      "Fits standard MB102 breadboards",
      "Independent 3.3V / 5V rail switches",
      "Accepts 6.5V-12V barrel jack or USB power input",
      "Maximum output current ~700mA"
    ],
    useCases: [
      "Prototyping new hardware hacking circuits",
      "Providing stable power during firmware extraction",
      "Safely powering 3.3V and 5V logic simultaneously",
      "Testing raw SPI/I2C chips before soldering"
    ],
    difficulty: "Beginner",
    image: "/hardware/breadboard-psu.jpg",
    links: {
      india: "https://link.amazon/B0j07HAcr",
      global: "https://amzn.to/4idXAg2"
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
