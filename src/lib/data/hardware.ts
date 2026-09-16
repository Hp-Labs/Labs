export interface HardwareItem {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  useCases: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  image: string;
  links: {
    india?: string;
    global?: string;
  };
}

export const HARDWARE_INVENTORY: HardwareItem[] = [
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
  },
  {
    id: "hw-rubber-ducky",
    name: "USB Rubber Ducky",
    category: "Implants & Keyloggers",
    shortDescription: "The original keystroke injection tool disguised as a standard flash drive.",
    fullDescription: "To a computer, it's a standard keyboard. To a hacker, it's a way to inject thousands of malicious keystrokes in seconds. This is the legendary Hak5-style tool that popularized 'BadUSB' attacks, capable of bypassing most endpoint security by acting as a trusted HID device.",
    features: [
      "Appears as a generic USB Flash Drive",
      "Executes DuckyScript payloads",
      "Injects keystrokes at superhuman speeds",
      "Bypasses standard antivirus software"
    ],
    useCases: [
      "Rapid reverse shell execution",
      "Exfiltrating saved passwords in seconds",
      "Automating complex system configurations",
      "Physical penetration testing"
    ],
    difficulty: "Beginner",
    image: "/hardware/rubber-ducky.jpg",
    links: {
      india: "https://link.amazon/B05J9hNWk"
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
    id: "hw-hackrf",
    name: "HackRF One",
    category: "Radio & SDR",
    shortDescription: "Advanced SDR capable of transmitting and receiving from 1 MHz to 6 GHz.",
    fullDescription: "The gold standard for RF hacking. Unlike cheaper SDRs that only listen, the HackRF One is half-duplex, meaning it can both receive and transmit signals. This covers everything from AM radio to Wi-Fi, Bluetooth, and cellular frequencies.",
    features: [
      "1 MHz to 6 GHz operating frequency",
      "Half-duplex transceiver",
      "Up to 20 million samples per second",
      "Compatible with GNU Radio, SDR#, and more"
    ],
    useCases: [
      "Replaying key fob signals (cars/gates)",
      "GPS spoofing attacks",
      "Analyzing obscure wireless protocols",
      "Jamming and RF interference research"
    ],
    difficulty: "Advanced",
    image: "/hardware/hackrf.jpg",
    links: {
      india: "https://link.amazon/B004LYhPG",
      global: "https://amzn.to/4xOtxAy"
    }
  },
  {
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
  },
  {
    id: "hw-beetle-badusb",
    name: "Beetle BadUSB (ATmega32U4)",
    category: "Implants & Keyloggers",
    shortDescription: "A stealthy BadUSB microcontroller hidden inside a metallic keychain.",
    fullDescription: "A standard Arduino Leonardo or Digispark looks suspicious if left plugged into a target machine. This Beetle BadUSB is encased in a premium metallic shell, making it look exactly like an expensive, innocuous USB keychain drive.",
    features: [
      "ATmega32U4 Microcontroller",
      "Arduino IDE compatible",
      "High-quality metallic disguise",
      "Native USB interface"
    ],
    useCases: [
      "Social engineering 'USB Drop' attacks",
      "Covert keystroke injection",
      "Leaving permanent malicious implants",
      "Bypassing physical security checks"
    ],
    difficulty: "Intermediate",
    image: "/hardware/beetle-badusb.png",
    links: {
      india: "https://link.amazon/B0giHTUiX",
      global: "https://amzn.to/4ymJYnl"
    }
  },
  {
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
    id: "hw-rtl-sdr",
    name: "RTL-SDR Blog V3",
    category: "Radio & SDR",
    shortDescription: "The most popular, budget-friendly Software Defined Radio receiver.",
    fullDescription: "Before dropping hundreds of dollars on a transmit-capable SDR, start here. The RTL-SDR is a heavily modified TV tuner that allows you to listen to almost any unencrypted radio signal in the air, from police dispatches to aircraft transponders.",
    features: [
      "500 kHz to 1.7 GHz frequency range",
      "RTL2832U ADC chip",
      "SMA antenna connector",
      "Incredible community software support"
    ],
    useCases: [
      "Tracking aircraft via ADS-B",
      "Listening to unencrypted police/fire radios",
      "Intercepting unencrypted pager traffic",
      "Learning GNU Radio and DSP basics"
    ],
    difficulty: "Beginner",
    image: "/hardware/rtl-sdr.jpg",
    links: {
      india: "https://link.amazon/B09PfIYNg",
      global: "https://amzn.to/4gJIXA0"
    }
  },
  {
    id: "hw-wio-tracker",
    name: "Wio Tracker (Meshtastic)",
    category: "Radio & SDR",
    shortDescription: "LoRa development board ideal for building off-grid communication networks.",
    fullDescription: "When cell networks go down or you need untraceable, encrypted team comms during a Red Team engagement, Meshtastic is the answer. The Wio Tracker provides the perfect LoRa hardware base with GPS to build your own decentralized, off-grid chat network.",
    features: [
      "LoRa (Long Range) radio transceiver",
      "Integrated GPS module",
      "Compatible with the Meshtastic project",
      "Low power consumption for solar setups"
    ],
    useCases: [
      "Encrypted off-grid Red Team communications",
      "Building decentralized LoRa meshes",
      "GPS tracking for field assets",
      "Bypassing cellular network monitoring"
    ],
    difficulty: "Intermediate",
    image: "/hardware/wio-tracker.png",
    links: {
      india: "https://link.amazon/B0hOSNzJX",
      global: "https://amzn.to/4xjrTFU"
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
    id: "hw-oled-096",
    name: "0.96 inch OLED Display",
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
    id: "hw-rfid-rc522-blue",
    name: "RFID RC522 Module (Blue)",
    category: "RFID / NFC",
    shortDescription: "13.56MHz RFID reader/writer for card cloning and access control hacking.",
    fullDescription: "The RC522 is the standard starter module for playing with high-frequency (13.56MHz) RFID tags like MIFARE Classic. It's an essential tool for physical penetration testers learning how to clone badges and bypass access controls.",
    features: [
      "Operating frequency: 13.56MHz",
      "Supports MIFARE1 S50, S70, Pro, DESFire",
      "SPI communication interface",
      "Includes blank card and key fob"
    ],
    useCases: [
      "Cloning hotel and office keycards",
      "Dumping MIFARE Classic memory blocks",
      "Building custom access control bypass tools",
      "NFC tag reading and writing"
    ],
    difficulty: "Beginner",
    image: "/hardware/rfid-blue.jpg",
    links: {
      india: "https://link.amazon/B0gng0cYG",
      global: "https://amzn.to/4xWgqwY"
    }
  },
  {
    id: "hw-rfid-module-red",
    name: "RFID/NFC Module (Red Edition)",
    category: "RFID / NFC",
    shortDescription: "Alternative RFID reader module with varied form-factor and tag compatibility.",
    fullDescription: "Similar to the classic blue RC522, this red variant often features an improved antenna trace or alternate IC layout. Great for embedded implants or building pocket-sized RFID cloners.",
    features: [
      "Compact red PCB design",
      "13.56MHz frequency support",
      "Integrated PCB antenna",
      "Standard pinout for easy microcontroller integration"
    ],
    useCases: [
      "Concealed physical pentest tools",
      "Building standalone RFID cloners",
      "Extracting keys from weak RFID tags",
      "Smart-lock vulnerability research"
    ],
    difficulty: "Beginner",
    image: "/hardware/rfid-red.jpg",
    links: {
      india: "https://link.amazon/B08bteaUl",
      global: "https://amzn.to/4gHDeuv"
    }
  },
  {
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
    id: "hw-nrf24-pa-lna",
    name: "NRF24L01+PA+LNA",
    category: "Radio & SDR",
    shortDescription: "Extended range 2.4GHz transceiver with Power Amplifier and Low Noise Amplifier.",
    fullDescription: "This upgraded version of the NRF24L01 includes an SMA antenna and amplifying circuitry. It massively extends the range of your 2.4GHz attacks, making it perfect for wardriving or long-range MouseJack injections.",
    features: [
      "2.4GHz ISM band operation",
      "Includes SMA Antenna",
      "Up to 1000 meters range with line-of-sight",
      "Drop-in replacement for standard NRF24 in code"
    ],
    useCases: [
      "Long-range drone hijacking (unencrypted 2.4GHz)",
      "Extended range wireless sniffing",
      "Building remote hardware implants",
      "Mesh network testing"
    ],
    difficulty: "Intermediate",
    image: "/hardware/nrf24-pa-lna.jpg",
    links: {
      india: "https://link.amazon/B0cMoKGy2",
      global: "https://amzn.to/4A2c5dj"
    }
  },
  {
    id: "hw-nrf24-cc1101",
    name: "Sub-1GHz & 2.4GHz RF Modules",
    category: "Radio & SDR",
    shortDescription: "Essential radio transceivers for intercepting and transmitting RF signals.",
    fullDescription: "Radio frequency modules like the CC1101 (433MHz) or NRF24L01 (2.4GHz) allow you to interact with a vast array of wireless devices, from car key fobs to smart home sensors and wireless keyboards.",
    features: [
      "Supports FSK, GFSK, ASK, OOK, and MSK modulation",
      "Low power consumption",
      "SPI interface for microcontrollers",
      "Excellent for MouseJack attacks (NRF24)"
    ],
    useCases: [
      "Replay attacks on garage doors (433MHz)",
      "Wireless keyboard sniffing (MouseJack)",
      "Custom radio protocols reverse engineering",
      "IoT sensor spoofing"
    ],
    difficulty: "Intermediate",
    image: "/hardware/cc1101-nrf24.jpg",
    links: {
      india: "https://link.amazon/B0gaFHSGu",
      global: "https://amzn.to/4drvWJ3"
    }
  },
  {
    id: "hw-ir-transmitter",
    name: "IR Transmitter LEDs",
    category: "Sensors & IR",
    shortDescription: "Infrared emitting diodes for blasting captured IR payloads.",
    fullDescription: "Once you've captured an IR signal, you need these LEDs to transmit it back out. Essential for building devices like the 'TV-B-Gone' or automating the shutdown of projectors and AC units in a target environment.",
    features: [
      "940nm infrared wavelength",
      "Requires current-limiting resistor",
      "Can be overdriven in pulses for extreme range",
      "Standard 5mm LED form factor"
    ],
    useCases: [
      "Building a custom TV-B-Gone (turn off any TV)",
      "Replaying captured AC remote payloads",
      "Creating invisible tripwires (paired with receiver)",
      "Automated infrastructure disruption"
    ],
    difficulty: "Beginner",
    image: "/hardware/ir-transmitter.jpg",
    links: {
      india: "https://link.amazon/B07xPaSIB",
      global: "https://amzn.to/3ULN9qe"
    }
  },
  {
    id: "hw-ir-receiver",
    name: "IR Receiver Module (3-Pin)",
    category: "Sensors & IR",
    shortDescription: "Infrared receiver for capturing and decoding remote control signals.",
    fullDescription: "A specialized 38kHz IR receiver (like the VS1838B). This is the exact component you need to intercept signals from TVs, AC units, and projectors, allowing you to decode the raw HEX payloads of infrared remotes.",
    features: [
      "38kHz carrier frequency detection",
      "Built-in ambient light filter",
      "Simple 3-pin interface (VCC, GND, OUT)",
      "Compatible with standard IRremote libraries"
    ],
    useCases: [
      "Capturing and decoding TV/AC remote signals",
      "Building an IR signal sniffer",
      "Reverse engineering proprietary IR protocols",
      "Creating universal remote clones"
    ],
    difficulty: "Beginner",
    image: "/hardware/ir-receiver.jpg",
    links: {
      india: "https://link.amazon/B0hWYQLvu",
      global: "https://amzn.to/4xKG4F5"
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
    id: "hw-microsd-64gb",
    name: "MicroSD Card Module (SPI)",
    category: "Storage",
    shortDescription: "SPI interface module for reading and writing to MicroSD cards from microcontrollers.",
    fullDescription: "When building custom implants, keyloggers, or wardriving rigs with ESP32 or Arduino, you often need local storage to save PCAP files, keystrokes, or logs. This module provides a simple SPI interface to read and write to standard MicroSD cards.",
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
    image: "/hardware/microsd-module.jpg",
    links: {
      india: "https://link.amazon/B0f7GC0Pg",
      global: "https://amzn.to/4ikavwW"
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
    id: "hw-nrf24-adapter",
    name: "NRF24L01 3.3V Adapter Board",
    category: "Components",
    shortDescription: "Voltage regulation adapter to stabilize power for NRF24 modules.",
    fullDescription: "NRF24 modules are extremely sensitive to voltage drops and noise. This adapter board takes 5V from an Arduino or Raspberry Pi and converts it to a clean 3.3V, preventing weird bugs and connection drops during attacks.",
    features: [
      "On-board AMS1117 3.3V regulator",
      "Standard 8-pin socket for NRF24",
      "Bypass capacitors for noise filtering",
      "Easy breadboard integration"
    ],
    useCases: [
      "Stabilizing NRF24 transmissions",
      "Connecting 3.3V radio modules to 5V Arduinos",
      "Preventing packet loss in RF attacks",
      "Rapid prototyping"
    ],
    difficulty: "Beginner",
    image: "/hardware/nrf24-adapter.jpg",
    links: {
      india: "https://link.amazon/B0aMN2Eem",
      global: "https://amzn.to/4xOeozc"
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
  },
  {
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
    id: "hw-microsd-card-64gb",
    name: "MicroSD Card (64GB)",
    category: "Storage",
    shortDescription: "High-speed Class 10 storage for OS images, PCAPs, and payload files.",
    fullDescription: "An absolute necessity for any hardware hacker. Whether you're flashing Kali Linux onto a Raspberry Pi, storing gigabytes of wardriving PCAP files, or saving dumped firmware, a reliable Class 10 MicroSD card is mandatory.",
    features: [
      "Class 10 / UHS-I high transfer speeds",
      "64GB capacity (ideal for full OS images)",
      "Resilient to frequent write cycles",
      "Compatible with Raspberry Pi, SDRs, and ESP32 modules"
    ],
    useCases: [
      "Boot drives for Raspberry Pi / SBCs",
      "Storing PCAP files during WiFi packet sniffing",
      "Hosting large payload dictionaries",
      "Logging GPS data during wardriving"
    ],
    difficulty: "Beginner",
    image: "/hardware/microsd-card.jpg",
    links: {
      india: "https://link.amazon/B07LJXV0g",
      global: "https://amzn.to/46iJG54"
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
    id: "hw-mport-30-plus",
    name: "Portronics Mport 30 Plus",
    category: "Accessories",
    shortDescription: "Foldable USB-C hub and multi-card reader.",
    fullDescription: "A highly portable USB-C hub that specializes in card reading. When dealing with multiple Raspberry Pi setups or extracting footage/data from target SD cards, a fast and reliable card reader is essential.",
    features: [
      "USB-C interface",
      "SD and MicroSD card slots",
      "Foldable, compact design",
      "Plug-and-play compatibility"
    ],
    useCases: [
      "Flashing OS images to MicroSD cards",
      "Extracting data from seized SD cards",
      "Expanding laptop I/O on the go",
      "Organizing storage media"
    ],
    difficulty: "Beginner",
    image: "/hardware/mport-30.jpg",
    links: {
      india: "https://link.amazon/B03um7hC1",
      global: "https://amzn.to/4qZPDNI"
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
    id: "hw-multimeter",
    name: "Digital Multimeter",
    category: "Tools",
    shortDescription: "The most fundamental tool for any hardware hacker.",
    fullDescription: "Before you connect a UART adapter or logic analyzer to a target board, you must identify the Ground (GND) and Voltage (VCC) pins. A digital multimeter is mandatory for tracing circuits, checking voltages, and ensuring you don't blow up your equipment.",
    features: [
      "Measures AC/DC Voltage and Current",
      "Continuity testing with audible beep",
      "Resistance and diode testing",
      "Essential for safety and diagnostics"
    ],
    useCases: [
      "Identifying UART / JTAG pinouts (finding GND and VCC)",
      "Testing for short circuits (Continuity)",
      "Verifying power supply outputs",
      "Reverse engineering PCB traces"
    ],
    difficulty: "Beginner",
    image: "/hardware/multimeter.jpg",
    links: {
      india: "https://link.amazon/B03BOCyll",
      global: "https://amzn.to/4gJD6L5"
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
    id: "hw-soldering-stand",
    name: "Soldering Iron Stand",
    category: "Tools",
    shortDescription: "Heavy base stand with spring holder to safely rest a hot soldering iron.",
    fullDescription: "A hot soldering iron rolling off your desk will ruin your workspace or burn you. This stand securely holds the iron during hardware hacking sessions and includes a space for a cleaning sponge to keep the tip oxidized and ready.",
    features: [
      "Spring-style iron holder",
      "Heavy metal base for stability",
      "Sponge tray for tip cleaning",
      "Prevents accidental workbench fires"
    ],
    useCases: [
      "Safe storage of hot iron during complex teardowns",
      "Tip cleaning and maintenance",
      "Organizing the hardware hacking workbench"
    ],
    difficulty: "Beginner",
    image: "/hardware/soldering-stand.jpg",
    links: {
      india: "https://link.amazon/B08qtINvT",
      global: "https://amzn.to/4A0Fq7M"
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
    id: "hw-flux-paste",
    name: "Soldering Flux Paste",
    category: "Tools",
    shortDescription: "Chemical paste that helps solder flow seamlessly onto tiny PCB pads.",
    fullDescription: "If you try to solder a wire to a tiny test point on a router motherboard without flux, the solder will just ball up and fall off. Flux cleans the oxidation off the metal in real-time, allowing solder to instantly bond to microscopic SMD components.",
    features: [
      "Removes oxidation from copper pads",
      "Improves solder flow and wetting",
      "Prevents 'cold' solder joints",
      "Essential for SMD rework"
    ],
    useCases: [
      "Soldering tiny 30AWG wires to PCB traces",
      "Reflowing flash memory chip pins",
      "Desoldering stubborn through-hole components",
      "Pre-tinning wires for implants"
    ],
    difficulty: "Intermediate",
    image: "/hardware/flux.jpg",
    links: {
      india: "https://link.amazon/B01MYiu1F",
      global: "https://amzn.to/4A4d24O"
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
  },
  {
    id: "hw-desoldering-wick",
    name: "Desoldering Wick (Braid)",
    category: "Tools",
    shortDescription: "Copper braid used to soak up and remove old solder from a circuit board.",
    fullDescription: "When you want to completely remove a flash memory chip (EEPROM/SPI) from a target board to dump its firmware, you use this copper braid. Heated with the iron, it acts like a sponge, sucking all the solder out of the joints so the chip lifts off cleanly.",
    features: [
      "Braided copper wire construction",
      "Often pre-coated with flux",
      "Varying widths (1.5mm to 3.0mm)",
      "Leaves PCB pads clean and flat"
    ],
    useCases: [
      "Removing EEPROM / SPI Flash chips for dumping",
      "Cleaning UART header holes before soldering pins",
      "Fixing accidental solder bridges (shorts)",
      "Salvaging components from scrap boards"
    ],
    difficulty: "Intermediate",
    image: "/hardware/desoldering-wick.jpg",
    links: {
      india: "https://link.amazon/B0c6KjPuH",
      global: "https://amzn.to/4gTYfkn"
    }
  },
  {
    id: "hw-glue-gun",
    name: "Hot Glue Gun",
    category: "Tools",
    shortDescription: "Essential tool for securing fragile wires and insulating custom circuits.",
    fullDescription: "The hardware hacker's secret weapon. When you solder microscopic wires to a target board, any physical movement will rip the copper pads right off the PCB. A blob of hot glue secures the wires permanently and electrically insulates exposed joints.",
    features: [
      "Fast heating element",
      "Trigger feed mechanism",
      "Uses standard 7mm or 11mm glue sticks",
      "Non-conductive electrical insulation"
    ],
    useCases: [
      "Strain-relief for microscopic soldered wires",
      "Securing rogue implants inside device cases",
      "Insulating exposed circuits to prevent shorts",
      "Potting custom USB hacking tools"
    ],
    difficulty: "Beginner",
    image: "/hardware/glue-gun.jpg",
    links: {
      india: "https://link.amazon/B0b1wqhl0",
      global: "https://amzn.to/4gUR4bz"
    }
  },
  {
    id: "hw-glue-sticks",
    name: "Hot Glue Sticks (Refills)",
    category: "Tools",
    shortDescription: "Clear thermoplastic adhesive sticks for the hot glue gun.",
    fullDescription: "Refills for your hot glue gun. Since hot glue is non-conductive, it acts as a perfect, instantly-drying 'potting' material for your custom hacking tools and wire taps.",
    features: [
      "Standard sizes (7mm or 11mm)",
      "Clear transparent finish",
      "Melt temperature ~120C",
      "Easily removed with isopropyl alcohol if a mistake is made"
    ],
    useCases: [
      "Securing UART tap wires",
      "Mounting ESP8266 implants",
      "Insulating breadboard components",
      "General hardware tool assembly"
    ],
    difficulty: "Beginner",
    image: "/hardware/glue-sticks.png",
    links: {
      india: "https://link.amazon/B0fE5ugE2",
      global: "https://amzn.to/3VjJlwA"
    }
  },
  {
    id: "hw-wire-cutter",
    name: "Wire Cutter & Stripper",
    category: "Tools",
    shortDescription: "Precision hand tool for cutting and stripping jumper wires.",
    fullDescription: "When building custom circuits or modifying hardware, you'll constantly need to cut wires to length and strip the insulation. A good pair of wire strippers ensures you don't accidentally cut the inner copper strands, maintaining signal integrity.",
    features: [
      "Hardened steel cutting edges",
      "Spring-loaded handle",
      "Built-in stripping holes for various wire gauges",
      "Ergonomic grips"
    ],
    useCases: [
      "Preparing wires for soldering",
      "Trimming through-hole component legs",
      "Stripping insulation for breadboard jumpers",
      "General hardware modification"
    ],
    difficulty: "Beginner",
    image: "/hardware/wire-cutter.jpg",
    links: {
      india: "https://link.amazon/B00d8WHqa",
      global: "https://amzn.to/4xd7nH2"
    }
  },
  {
    id: "hw-precision-cutter",
    name: "Precision Hobby Knife",
    category: "Tools",
    shortDescription: "Scalpel-like blade for delicate hardware modifications.",
    fullDescription: "Hardware hacking often involves destructive entry. An X-Acto style precision knife is perfect for carefully prying open glued plastic enclosures, scraping away conformal coating on PCBs, or physically severing copper traces to disable security features.",
    features: [
      "Surgical-grade steel blades",
      "Aluminum knurled handle for grip",
      "Easily replaceable blades",
      "Extremely sharp fine point"
    ],
    useCases: [
      "Cutting PCB traces to bypass anti-tamper circuits",
      "Scraping solder mask to expose copper pads",
      "Slicing open glued IoT enclosures",
      "Trimming plastic for custom ports"
    ],
    difficulty: "Beginner",
    image: "/hardware/precision-cutter.jpg",
    links: {
      india: "https://link.amazon/B07200Z4r",
      global: "https://amzn.to/3SSdN0a"
    }
  },
  {
    id: "hw-components-kit",
    name: "Electronic Components Kit",
    category: "Components",
    shortDescription: "A massive assortment of resistors, capacitors, LEDs, and diodes.",
    fullDescription: "When building custom circuits to interface with target hardware, you will inevitably need pull-up resistors, decoupling capacitors to stabilize power, or diodes to prevent reverse voltage. This kit provides all the basic passive components you need in one box.",
    features: [
      "Assorted 1/4W resistors (10 to 1M)",
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
    id: "hw-jumper-ff",
    name: "Female-to-Female Jumper Wires",
    category: "Cables & Wiring",
    shortDescription: "Dupont cables for connecting modules directly to each other without a breadboard.",
    fullDescription: "Female-to-Female jumpers are used when dealing with devices that only have male pins. They are commonly used to connect a USB-to-TTL serial adapter directly to the male UART pins on a router's motherboard to get a root shell.",
    features: [
      "Female sockets on both ends",
      "Fits standard 0.1 inch (2.54mm) headers",
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
    id: "hw-pcb-15x20",
    name: "Large Prototype PCB (15x20 cm)",
    category: "Components",
    shortDescription: "Massive perfboard for building comprehensive hardware testing rigs.",
    fullDescription: "Sometimes you need to build a 'Frankenstein' rig. This massive 15x20 cm board allows you to mount a Raspberry Pi, multiple SDRs, logic-level converters, and target chips all on a single rigid platform for complex firmware analysis.",
    features: [
      "Huge 15x20 cm surface area",
      "Standard 2.54mm hole pitch",
      "Can be scored and snapped to custom sizes",
      "Durable FR4 construction"
    ],
    useCases: [
      "Building multi-chip firmware dumping rigs",
      "Creating permanent lab testing platforms",
      "Mounting heavy RF equipment securely",
      "Complex logic analyzer breakout boards"
    ],
    difficulty: "Intermediate",
    image: "/hardware/pcb-15x20.jpg",
    links: {
      india: "https://link.amazon/B00LsetYj",
      global: "https://amzn.to/4ysvjau"
    }
  },
  {
    id: "hw-pcb-9x15",
    name: "Medium Prototype PCB (9x15 cm)",
    category: "Components",
    shortDescription: "Spacious perfboard for projects involving screens and multiple modules.",
    fullDescription: "When building a standalone hacking gadget (like a custom RFID cloner or a portable Wi-Fi analyzer), you need space for the microcontroller, an OLED screen, battery management, and push buttons. The 9x15 cm size provides the perfect canvas.",
    features: [
      "9x15 cm dimensions",
      "Double-sided copper plating",
      "Grid matrix labeling for easy component mapping",
      "Supports through-hole and SMD components"
    ],
    useCases: [
      "Building DIY Flipper Zero alternatives",
      "Portable SDR enclosures",
      "Custom RFID reader/writer tools",
      "Multi-sensor environmental sniffers"
    ],
    difficulty: "Intermediate",
    image: "/hardware/pcb-9x15.jpg",
    links: {
      india: "https://link.amazon/B03sw2oaf",
      global: "https://amzn.to/46OTVhC"
    }
  },
  {
    id: "hw-pcb-6x8",
    name: "Small Prototype PCB (6x8 cm)",
    category: "Components",
    shortDescription: "Compact perfboard for single-function hacking payloads.",
    fullDescription: "Ideal for creating 'throwaway' or single-function devices. A 6x8 cm board is the perfect footprint for a tiny ESP8266 Deauther or a dedicated Bluetooth LE spammer that you can hide behind a desk or inside a server rack.",
    features: [
      "Compact 6x8 cm size",
      "Standard 2.54mm hole pitch",
      "High-quality fiberglass base",
      "Easy to mount inside standard project boxes"
    ],
    useCases: [
      "Dedicated Wi-Fi deauthers",
      "Standalone Bluetooth LE spammers",
      "Custom USB keystroke injectors",
      "Small inline wire-tapping devices"
    ],
    difficulty: "Intermediate",
    image: "/hardware/pcb-6x8.jpg",
    links: {
      india: "https://link.amazon/B0iDR8iEI",
      global: "https://amzn.to/3UGjJKk"
    }
  },
  {
    id: "hw-pcb-7x5",
    name: "Prototype PCB Board (7x5 cm)",
    category: "Components",
    shortDescription: "Standard size perfboard for moving circuits off the breadboard.",
    fullDescription: "Once you've successfully prototyped a hardware exploit on a breadboard, it's time to make it permanent. This 7x5 cm board is the standard 'Goldilocks' sizebig enough to fit an ESP32 and some modules, but small enough to fit inside a pocket enclosure.",
    features: [
      "Standard 2.54mm hole pitch",
      "Double-sided plated through-holes (PTH)",
      "Fiberglass FR4 material",
      "Pre-tinned holes for easy soldering"
    ],
    useCases: [
      "Building permanent hardware hacking tools",
      "Creating custom ESP32/Arduino shields",
      "Soldering robust RF interceptors",
      "Replacing fragile breadboard setups"
    ],
    difficulty: "Intermediate",
    image: "/hardware/pcb-7x5.png",
    links: {
      india: "https://link.amazon/B01qNrdEp",
      global: "https://amzn.to/4A2oqhp"
    }
  },
  {
    id: "hw-pcb-4x6",
    name: "Ultra-Micro Prototype PCB (4x6 cm)",
    category: "Components",
    shortDescription: "Tiny perfboards designed for highly covert hardware implants.",
    fullDescription: "When physical stealth is the priority, every millimeter counts. These tiny 4x6 cm boards are used to build microscopic implants that can be physically hidden inside computer mice, keyboards, or hollowed-out USB cables.",
    features: [
      "Ultra-compact 4x6 cm footprint",
      "Can be easily trimmed smaller",
      "Double-sided soldering pads",
      "Fits into extremely tight enclosures"
    ],
    useCases: [
      "Hardware keyloggers hidden inside keyboards",
      "Malicious mouse implants",
      "Covert network taps hidden in wall jacks",
      "Microscopic payload delivery systems"
    ],
    difficulty: "Advanced",
    image: "/hardware/pcb-4x6.jpg",
    links: {
      india: "https://link.amazon/B06WVocVS",
      global: "https://amzn.to/4d59wgA"
    }
  },
  {
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
    id: "hw-rpi-case",
    name: "Raspberry Pi Case",
    category: "Accessories",
    shortDescription: "Standard protective enclosure for the Raspberry Pi.",
    fullDescription: "A bare Raspberry Pi PCB is fragile and highly susceptible to static shock or shorting out on metal surfaces. If you are deploying a Pi as a rogue network dropbox, a solid plastic case prevents accidental damage during covert placements.",
    features: [
      "Snap-together plastic construction",
      "Access to all ports and GPIO pins",
      "Protects against ESD (Electrostatic Discharge)",
      "Ventilation for passive cooling"
    ],
    useCases: [
      "Protecting network dropboxes",
      "Preventing short circuits on metal desks",
      "Concealing the bare PCB",
      "Mounting standard Pi setups"
    ],
    difficulty: "Beginner",
    image: "/hardware/rpi-case.jpg",
    links: {
      india: "https://link.amazon/B0cOdicgW",
      global: "https://amzn.to/4qZCILX"
    }
  },
  {
    id: "hw-tactile-buttons",
    name: "Tactile Push Buttons Set",
    category: "Components",
    shortDescription: "Standard 4-pin momentary push buttons for breadboards and PCBs.",
    fullDescription: "The absolute standard for adding physical input to your hacks. Used to trigger payloads, reset microcontrollers, or navigate custom OLED menus on a portable hacking gadget.",
    features: [
      "Momentary action (SPST)",
      "Breadboard compatible spacing",
      "Noticeable tactile 'click' feedback",
      "Varying stem heights"
    ],
    useCases: [
      "Triggering BadUSB scripts manually",
      "Resetting ESP32/Raspberry Pi boards",
      "Menu navigation for portable SDRs",
      "Physical interrupt generation"
    ],
    difficulty: "Beginner",
    image: "/hardware/tactile-buttons.jpg",
    links: {
      india: "https://link.amazon/B05RxYCGz",
      global: "https://amzn.to/4xafxjj"
    }
  },
  {
    id: "hw-push-button",
    name: "Latching Push Button",
    category: "Components",
    shortDescription: "Robust push button switch for power toggling and mode locking.",
    fullDescription: "Unlike momentary tactile switches, these larger buttons often feature latching mechanisms (press to stay on, press to turn off). Perfect for acting as a main power switch for a battery-powered implant or locking a tool into 'attack' mode.",
    features: [
      "Latching or momentary options",
      "Through-hole PCB mounting",
      "Clear visual state (depressed vs raised)",
      "Higher current rating than tactile switches"
    ],
    useCases: [
      "Main power switch for portable tools",
      "Hardware kill-switch for rogue APs",
      "Toggling between 'Passive' and 'Aggressive' sniffers",
      "Robust breadboard inputs"
    ],
    difficulty: "Beginner",
    image: "/hardware/push-button.jpg",
    links: {
      india: "https://link.amazon/B02DSpOks",
      global: "https://amzn.to/4iRVClE"
    }
  },
  {
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
    id: "hw-male-header",
    name: "Male Header Strip",
    category: "Components",
    shortDescription: "Breakaway 2.54mm male header pins for soldering onto bare PCBs.",
    fullDescription: "When you extract a router motherboard or buy a bare sensor module, the debug ports (UART/JTAG) are usually just unpopulated holes. You must solder these male header pins into those holes to connect your USB-to-TTL adapters or JTAG debuggers.",
    features: [
      "Standard 0.1 inch (2.54mm) pitch",
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
      "Standard 0.1 inch (2.54mm) pitch",
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
  },
  {
    id: "hw-header-90deg",
    name: "90-Degree Male Headers",
    category: "Components",
    shortDescription: "Right-angle breakaway headers for low-profile PCB connections.",
    fullDescription: "When hacking embedded devices, standard straight headers often prevent you from putting the case back on. These 90-degree right-angle headers allow you to solder onto a router's UART pads and route the wires sideways, maintaining a stealthy low profile.",
    features: [
      "90-degree right-angle bend",
      "Standard 2.54mm (0.1 inch) pitch",
      "Breakaway design",
      "Gold-plated or tin-plated brass"
    ],
    useCases: [
      "Stealthy UART/JTAG soldering on routers",
      "Low-profile sensor mounts",
      "Creating side-plugging breadboard modules",
      "Fitting implants into tight enclosures"
    ],
    difficulty: "Intermediate",
    image: "/hardware/header-90deg.jpg",
    links: {
      india: "https://link.amazon/B0aKt1145",
      global: "https://amzn.to/4xGtiaB"
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
  }
];
