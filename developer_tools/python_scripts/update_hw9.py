path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

new_items = """  ,{
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
      "Melt temperature ~120°C",
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
  }
"""

if "];" in content:
    content = content.replace("];", new_items + "\n];")
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Success")
else:
    print("Failed to find ];")
