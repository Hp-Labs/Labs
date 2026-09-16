path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

hardware_section = """
      {/* Hardware Toolkit Section */}
      <section id="hardware" className="relative py-24 bg-[#050508] border-t border-[rgba(0,255,65,0.1)]">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-[0_0_15px_rgba(0,255,65,0.5)]">
              Hardware Hacking <span className="text-[#00ff41]">Toolkit</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              We teach advanced IoT Hacking and Hardware Penetration Testing. These are the exact components, microcontrollers, and SDRs used in our classes. Explore our recommended gear to build your ultimate hardware hacking lab.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { name: "Flipper Zero", img: "/hardware/flipper-zero.jpg", desc: "Ultimate multi-tool for RFID, Sub-GHz, and BadUSB." },
              { name: "HackRF One", img: "/hardware/hackrf.jpg", desc: "Advanced SDR capable of 1MHz to 6GHz transmit/receive." },
              { name: "Proxmark3 Easy", img: "/hardware/proxmark3.jpg", desc: "The industry standard for RFID/NFC cloning and cracking." },
              { name: "M5Stack ESP32", img: "/hardware/m5stack.jpg", desc: "Portable ESP32 platform perfect for Wi-Fi/Bluetooth attacks." }
            ].map((item, i) => (
              <div key={i} className="group relative bg-[rgba(10,10,15,0.8)] border border-[rgba(0,255,65,0.2)] rounded-xl overflow-hidden hover:border-[#00ff41] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,65,0.15)] flex flex-col">
                <div className="h-48 w-full relative bg-[#020202] flex items-center justify-center p-4">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(0,255,65,0.4)_0%,transparent_70%)]"></div>
                  <img src={item.img} alt={item.name} className="max-h-full max-w-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-400 flex-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/hardware" className="inline-flex items-center gap-2 px-8 py-4 bg-[rgba(0,255,65,0.1)] border border-[#00ff41] text-[#00ff41] rounded-lg font-mono font-bold hover:bg-[#00ff41] hover:text-black transition-all shadow-[0_0_20px_rgba(0,255,65,0.2)] hover:shadow-[0_0_40px_rgba(0,255,65,0.4)]">
              <Cpu className="w-5 h-5" />
              Browse Full Store
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
"""

# Inject before the CTA or Pricing section. Let's find </section>\n\n      {/* Pricing Section */}
target = "{/* Pricing Section */}"
if target in content:
    content = content.replace(target, hardware_section + "\n      " + target)
else:
    print("Could not find Pricing Section.")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated page.tsx with Hardware Toolkit section")
