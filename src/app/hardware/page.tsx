"use client";

import Navbar from "@/components/Navbar";
import { HARDWARE_INVENTORY } from "@/lib/data/hardware";
import { ExternalLink, Search, ChevronDown, Cpu, Shield,  Zap, Wifi, Target, Settings, ShoppingCart, Globe, MapPin } from "lucide-react";
import { useState } from "react";

export default function HardwareToolkitPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["All", ...Array.from(new Set(HARDWARE_INVENTORY.map(item => item.category)))];

  const filteredHardware = HARDWARE_INVENTORY.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--hp-bg)] flex flex-col text-[var(--hp-text)]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--hp-primary)]/10 border border-[var(--hp-primary)]/30 text-[var(--hp-primary)] text-sm mb-4">
            <Cpu className="w-4 h-4" />
            <span>Hardware Hacking Toolkit</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Recommended <span className="text-[var(--hp-primary)]">Lab Gear</span>
          </h1>
          <p className="text-[var(--hp-text-muted)] text-lg leading-relaxed">
            Curated physical hardware and IoT pentesting equipment. Whether you are building your own hardware hacking lab or preparing for future IoT modules, these are the industry-standard tools we recommend.
          </p>
        </div>

                {/* Search Bar */}
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
        
        {/* Categories Filter */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
                activeCategory === category
                  ? "bg-[var(--hp-primary)]/20 border-[var(--hp-primary)]/50 text-white shadow-[0_0_15px_rgba(191,95,255,0.15)]"
                  : "bg-[var(--hp-bg-surface)] border-[var(--hp-border)] text-[var(--hp-text-muted)] hover:border-[var(--hp-border-hover)] hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Hardware Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-4">
          {filteredHardware.map((item) => (
            <div 
              key={item.id} 
              className="group relative flex flex-col h-full bg-[var(--hp-bg-surface)] border border-[var(--hp-border)] rounded-2xl overflow-hidden hover:border-[var(--hp-primary)]/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(191,95,255,0.1)]"
            >
              {/* Product Layout: Image on Top/Left depending on screen, let's do a top image for rich visuals */}
              <div className="h-48 w-full relative bg-[#0a0514] border-b border-[var(--hp-border)] overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-contain p-4 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-full shadow-sm">
                    {item.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold backdrop-blur-md border rounded-full shadow-sm ${
                    item.difficulty === 'Beginner' ? 'bg-green-500/20 border-green-500/30 text-green-400' :
                    item.difficulty === 'Intermediate' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' :
                    'bg-red-500/20 border-red-500/30 text-red-400'
                  }`}>
                    {item.difficulty}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">{item.name}</h3>
                

                {/* Features & Use Cases Grid */}
                
                <details className="group/details mb-4">
                  <summary className="text-sm font-semibold text-[var(--hp-primary)] cursor-pointer select-none outline-none hover:underline flex items-center justify-between gap-2 list-none [&::-webkit-details-marker]:hidden">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Technical Details & Use Cases
                    </div>
                    <ChevronDown className="w-4 h-4 transition-transform duration-300 group-open/details:rotate-180" />
                  </summary>
                  <div className="flex flex-col gap-4 mt-4 mb-2">

                    <p className="text-[var(--hp-primary)] text-sm font-medium mb-4">{item.shortDescription}</p>

                    <p className="text-[var(--hp-text)] text-sm leading-relaxed bg-[var(--hp-bg-surface)] p-3 rounded-lg border border-[var(--hp-border)]">
                      {item.fullDescription}
                    </p>

                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-[var(--hp-text-muted)] font-semibold mb-3 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-yellow-400" />
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {item.features.map((feature, i) => (
                        <li key={i} className="text-xs text-[var(--hp-text)] flex items-start gap-2 leading-relaxed">
                          <span className="text-[var(--hp-primary)] mt-1"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-[var(--hp-text-muted)] font-semibold mb-3 flex items-center gap-2">
                      <Target className="w-3.5 h-3.5 text-red-400" />
                      Lab Use Cases
                    </h4>
                    <ul className="space-y-2">
                      {item.useCases.map((useCase, i) => (
                        <li key={i} className="text-xs text-[var(--hp-text)] flex items-start gap-2 leading-relaxed">
                          <span className="text-[var(--hp-primary)] mt-1"></span>
                          {useCase}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                </details>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-6 border-t border-[var(--hp-border)]">
                  {item.links.india && (
                    <a 
                          href={item.links.india} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="relative group overflow-hidden flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-b from-red-400 to-rose-600 hover:from-red-300 hover:to-rose-500 shadow-[0_4px_15px_rgba(244,63,94,0.4)] border-t border-white/40 text-sm font-bold text-white transition-all transform hover:-translate-y-0.5"
                        >
                          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
                          <MapPin className="w-4 h-4 text-white drop-shadow-md relative z-10" />
                          <span className="relative z-10 drop-shadow-md tracking-wide">INDIA</span>
                        </a>
                  )}
                  {item.links.global && (
                    <a 
                          href={item.links.global} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="relative group overflow-hidden flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-b from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 shadow-[0_4px_15px_rgba(59,130,246,0.4)] border-t border-white/40 text-sm font-bold text-white transition-all transform hover:-translate-y-0.5"
                        >
                          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
                          <Globe className="w-4 h-4 text-white drop-shadow-md relative z-10" />
                          <span className="relative z-10 drop-shadow-md tracking-wide">GLOBAL</span>
                        </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
