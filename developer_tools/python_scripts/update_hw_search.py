path = "src/app/hardware/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add Search import
if "Search," not in content:
    content = content.replace("ExternalLink,", "ExternalLink, Search,")

# 2. Add searchQuery state
old_state = """export default function HardwareToolkitPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(HARDWARE_INVENTORY.map(item => item.category)))];

  const filteredHardware = activeCategory === "All" 
    ? HARDWARE_INVENTORY 
    : HARDWARE_INVENTORY.filter(item => item.category === activeCategory);"""

new_state = """export default function HardwareToolkitPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["All", ...Array.from(new Set(HARDWARE_INVENTORY.map(item => item.category)))];

  const filteredHardware = HARDWARE_INVENTORY.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });"""

if old_state in content:
    content = content.replace(old_state, new_state)
else:
    print("Could not find state block.")

# 3. Add Search UI
search_ui = """        {/* Search Bar */}
        <div className="max-w-2xl mx-auto w-full relative group -mt-4">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500 group-focus-within:text-[var(--hp-primary)] transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search microcontrollers, SDRs, tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#06030c] border border-[rgba(191,95,255,0.2)] rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#bf5fff] focus:ring-1 focus:ring-[#bf5fff] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          />
        </div>
        
        {/* Categories Filter */}"""

content = content.replace("{/* Categories Filter */}", search_ui)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Added Search Bar.")
