path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# We need to insert the new items right before the closing bracket of the array `];`
new_items = """  ,{
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
  }
"""

if "];" in content:
    content = content.replace("];", new_items + "\n];")
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Success")
else:
    print("Failed to find ];")
