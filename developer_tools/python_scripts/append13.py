path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

new_items = """  ,{
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
  }
"""

content = content.replace("\n];\n", new_items + "\n];\n")
with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Added 13th batch successfully")
