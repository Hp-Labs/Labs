path = "src/app/public/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Add to state type
content = content.replace(
    "useState<'news' | 'cve' | 'cwe' | 'updates'>('news')",
    "useState<'news' | 'cve' | 'cwe' | 'updates' | 'hardware'>('news')"
)

# Add to tabs array
old_tabs = """          {[
            { id: 'news', label: 'Cybersecurity News', icon: Globe },
            { id: 'cve', label: 'CVE Checker', icon: Shield },
            { id: 'cwe', label: 'CWE Checker', icon: BookOpen },
            { id: 'updates', label: 'Security Updates', icon: Zap },
          ].map((tab) => ("""

new_tabs = """          {[
            { id: 'news', label: 'Cybersecurity News', icon: Globe },
            { id: 'cve', label: 'CVE Checker', icon: Shield },
            { id: 'cwe', label: 'CWE Checker', icon: BookOpen },
            { id: 'updates', label: 'Security Updates', icon: Zap },
            { id: 'hardware', label: 'Hardware Toolkit', icon: Zap },
          ].map((tab) => ("""

content = content.replace(old_tabs, new_tabs)

# Add the Tab content at the end of the tabs area
hardware_tab = """
          {/* TAB: HARDWARE TOOLKIT */}
          {activeTab === 'hardware' && (
            <div className="space-y-6 text-center py-12">
              <div className="inline-flex items-center justify-center p-6 bg-[rgba(191,95,255,0.05)] border border-[rgba(191,95,255,0.2)] rounded-2xl mb-6 shadow-[0_0_30px_rgba(191,95,255,0.1)]">
                <Zap size={60} className="text-[#bf5fff]" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">IoT & Hardware Hacking Toolkit</h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg">
                Explore our curated collection of industry-standard microcontrollers, SDRs, and physical pentesting tools used in our advanced hardware hacking modules.
              </p>
              <a href="/hardware" className="inline-flex items-center gap-3 px-8 py-4 bg-[#bf5fff] text-white rounded-xl font-bold hover:bg-[#a855f7] transition-all shadow-[0_0_20px_rgba(191,95,255,0.4)]">
                <Globe size={20} />
                Enter Hardware Shop
                <ArrowRight size={20} />
              </a>
            </div>
          )}
"""

content = content.replace("        </div>\n      </main>", hardware_tab + "\n        </div>\n      </main>")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Added hardware tab to public page.")
