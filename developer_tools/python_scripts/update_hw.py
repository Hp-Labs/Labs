code = """export interface HardwareItem {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  useCases: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  links: {
    india?: string;
    global?: string;
  };
}

export const HARDWARE_INVENTORY: HardwareItem[] = [
  {
    id: "hw-esp32",
    name: "ESP32 Development Board",
    category: "IoT / Wireless",
    shortDescription: "The fundamental board for Wi-Fi/Bluetooth security research and custom implants.",
    fullDescription: "A powerful, low-cost microcontroller with integrated Wi-Fi and dual-mode Bluetooth. Essential for understanding IoT communication protocols, firmware extraction, and basic hardware interfacing in penetration testing.",
    features: [
      "Dual-core Xtensa 32-bit LX6 microprocessor",
      "Integrated 802.11 b/g/n Wi-Fi & Bluetooth v4.2 BR/EDR and BLE",
      "Rich peripheral interfaces (SPI, I2C, UART)",
      "Native support for MicroPython and C++"
    ],
    useCases: [
      "Deauth attacks and Wi-Fi reconnaissance",
      "BLE spoofing and analysis",
      "Firmware dumping practice",
      "Creating rogue access points"
    ],
    difficulty: "Beginner",
    image: "/hardware/esp32.jpg",
    links: {
      india: "https://link.amazon/B0dvJmllX",
      global: "https://amzn.to/4cuwU7a"
    }
  },
  {
    id: "hw-esp8266",
    name: "ESP8266 NodeMCU",
    category: "IoT / Wireless",
    shortDescription: "Highly popular, cost-effective Wi-Fi module for quick IoT prototyping and network attacks.",
    fullDescription: "The ESP8266 is the predecessor to the ESP32. While less powerful, it is universally used in cheap IoT devices, making it a crucial component to study for real-world IoT vulnerability research.",
    features: [
      "Tensilica L106 32-bit RISC microprocessor",
      "Built-in TCP/IP protocol stack",
      "802.11 b/g/n Wi-Fi connectivity",
      "Extremely low cost for mass deployment"
    ],
    useCases: [
      "Deauthentication tools (e.g., Spacehuhn's Deauther)",
      "Captive portal cloning",
      "IoT credential harvesting",
      "Basic wireless traffic sniffing"
    ],
    difficulty: "Beginner",
    image: "/hardware/esp8266.jpg",
    links: {
      india: "https://amzn.to/4cuwU7a",
      global: "https://amzn.to/4zXwwYJ"
    }
  },
  {
    id: "hw-esp32-wroom",
    name: "ESP32-WROOM-32D Module",
    category: "Components",
    shortDescription: "Bare ESP32 module for advanced PCB integration and hardware reverse engineering.",
    fullDescription: "Unlike the dev-board version, this is the bare SMD module. Security researchers use this to practice soldering, PCB design, and understanding how chips are integrated into commercial smart home devices.",
    features: [
      "Integrated antenna layout",
      "Requires external FTDI for programming",
      "Surface-mount footprint",
      "Identical silicon to standard ESP32"
    ],
    useCases: [
      "Advanced PCB reverse engineering",
      "Custom hardware badge creation",
      "Soldering and desoldering practice",
      "Direct pin probing"
    ],
    difficulty: "Intermediate",
    image: "/hardware/esp32-wroom.jpg",
    links: {
      india: "https://link.amazon/B016ZOyvE",
      global: "https://amzn.to/4ijlrLp"
    }
  },
  {
    id: "hw-raspberry-pi",
    name: "Raspberry Pi",
    category: "SBC / Pocket Hacking",
    shortDescription: "A full Linux computer in a pocket-sized form factor, perfect for dropboxes.",
    fullDescription: "The Raspberry Pi is the ultimate portable hacking platform. With a full Linux OS, it can run Kali, host command-and-control servers, act as a network tap, or be left behind as a stealthy hardware implant.",
    features: [
      "Full Linux OS support (Kali, Ubuntu, Debian)",
      "40-pin GPIO header for hardware interfacing",
      "Built-in Wi-Fi and Bluetooth (on supported models)",
      "USB OTG support (on Zero models) for BadUSB attacks"
    ],
    useCases: [
      "Physical network dropboxes (Rogue Pi)",
      "Portable wardriving setups",
      "Running automated vulnerability scanners",
      "BadUSB / HID emulation attacks"
    ],
    difficulty: "Intermediate",
    image: "/hardware/raspberry-pi.jpg",
    links: {
      india: "https://link.amazon/B02LxsPKT",
      global: "https://amzn.to/4h47i2u"
    }
  },
  {
    id: "hw-arduino-uno",
    name: "Arduino Uno R3",
    category: "Microcontrollers",
    shortDescription: "The classic starting point for learning embedded systems and hardware programming.",
    fullDescription: "While not a native Wi-Fi/Bluetooth device, the Arduino Uno is the gold standard for learning how embedded hardware works. It's essential for understanding low-level serial communication, logic levels, and interacting with sensors.",
    features: [
      "ATmega328P microcontroller",
      "5V logic level operations",
      "14 Digital I/O pins, 6 Analog inputs",
      "Massive community and library support"
    ],
    useCases: [
      "Understanding serial communications (UART)",
      "Interfacing with RFID/NFC readers",
      "Basic electronics and logic analyzer practice",
      "Building custom hardware attack tools"
    ],
    difficulty: "Beginner",
    image: "/hardware/arduino-uno.jpg",
    links: {
      india: "https://link.amazon/B0eokJawG",
      global: "https://amzn.to/46fHAmx"
    }
  }
];
"""
with open("src/lib/data/hardware.ts", "w", encoding="utf-8") as f:
    f.write(code)
