path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

new_items = """  ,{
    id: "hw-header-90deg",
    name: "90-Degree Male Headers",
    category: "Components",
    shortDescription: "Right-angle breakaway headers for low-profile PCB connections.",
    fullDescription: "When hacking embedded devices, standard straight headers often prevent you from putting the case back on. These 90-degree right-angle headers allow you to solder onto a router's UART pads and route the wires sideways, maintaining a stealthy low profile.",
    features: [
      "90-degree right-angle bend",
      "Standard 2.54mm (0.1\") pitch",
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
  }
"""

if "];" in content:
    content = content.replace("];", new_items + "\n];")
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Success")
else:
    print("Failed to find ];")
