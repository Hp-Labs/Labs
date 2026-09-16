path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

hardware_section = """
      {/* Hardware Hacking Toolkit Section */}
      <section id="hardware" className="relative py-24 bg-[var(--hp-bg)] border-t border-[var(--hp-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--hp-text)]">
              Hardware Hacking <span className="text-[var(--hp-primary)]">Toolkit</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-4">
              Our advanced training covers IoT Hacking and Hardware Penetration Testing. To support our classes, we have curated a professional collection of the exact microcontrollers, SDRs, and tools used in real-world engagements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { name: "Flipper Zero", img: "/hardware/flipper-zero.jpg", desc: "Ultimate multi-tool for RFID, Sub-GHz, and BadUSB." },
              { name: "HackRF One", img: "/hardware/hackrf.jpg", desc: "Advanced SDR capable of 1MHz to 6GHz transmit/receive." },
              { name: "Proxmark3 Easy", img: "/hardware/proxmark3.jpg", desc: "The industry standard for RFID/NFC cloning and cracking." },
              { name: "M5Stack ESP32", img: "/hardware/m5stack.jpg", desc: "Portable ESP32 platform perfect for Wi-Fi/Bluetooth attacks." }
            ].map((item, i) => (
              <div key={i} className="group relative bg-[rgba(20,10,35,0.4)] border border-[rgba(191,95,255,0.2)] rounded-xl overflow-hidden hover:border-[#bf5fff] transition-all duration-300 hover:shadow-[0_0_20px_rgba(191,95,255,0.15)] flex flex-col h-full">
                <div className="h-48 w-full relative bg-[#06030c] flex items-center justify-center p-4 border-b border-[rgba(191,95,255,0.1)]">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(191,95,255,0.3)_0%,transparent_70%)]"></div>
                  <img src={item.img} alt={item.name} className="h-full w-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                  <p className="text-sm text-slate-400 flex-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/hardware" className="inline-flex items-center gap-2 px-8 py-4 bg-[rgba(191,95,255,0.1)] border border-[#bf5fff] text-[#bf5fff] rounded-lg font-mono font-bold hover:bg-[#bf5fff] hover:text-white transition-all shadow-[0_0_15px_rgba(191,95,255,0.2)] hover:shadow-[0_0_30px_rgba(191,95,255,0.4)]">
              <Cpu className="w-5 h-5" />
              Explore Hardware Shop
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
"""

# Inject before Security Monitor
target = "{/* Security Monitor */}"
if target in content:
    content = content.replace(target, hardware_section + "\n\n      " + target)
else:
    print("Could not find Security Monitor.")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated landing page with Hardware section.")
