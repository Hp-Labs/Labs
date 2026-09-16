path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

new_items = """  ,{
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
  }
"""

content = content.replace("\n];\n", new_items + "\n];\n")
with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Added 16th batch successfully")
