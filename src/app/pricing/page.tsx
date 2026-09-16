'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Check, Shield, Zap, Terminal, Sparkles, Star, Target, Server, Code, ChevronDown } from "lucide-react";

// --- PRICING DATA ---
type Region = "US" | "IN";
type Duration = "monthly" | "3mo" | "6mo" | "12mo";

const pricingData = {
  FREE: {
    name: "FREE",
    label: "Start Learning",
    priceUsd: { monthly: 0, "3mo": 0, "6mo": 0, "12mo": 0 },
    priceInr: { monthly: 0, "3mo": 0, "6mo": 0, "12mo": 0 },
  },
  BASIC: {
    name: "BASIC",
    label: "Build Fundamentals",
    priceUsd: { monthly: 3.99, "3mo": 11.97, "6mo": 23.94, "12mo": 29.99 },
    priceInr: { monthly: 299, "3mo": 897, "6mo": 1794, "12mo": 2499 },
  },
  INTERMEDIATE: {
    name: "INTERMEDIATE",
    label: "Build Job-Ready Skills",
    priceUsd: { monthly: 5.99, "3mo": 17.97, "6mo": 35.94, "12mo": 44.99 },
    priceInr: { monthly: 399, "3mo": 1197, "6mo": 2394, "12mo": 3499 },
    mostPopular: true
  },
  ADVANCED: {
    name: "ADVANCED",
    label: "Prove Advanced Skills",
    priceUsd: { monthly: 8.99, "3mo": 26.97, "6mo": 53.94, "12mo": 59.99 },
    priceInr: { monthly: 599, "3mo": 1797, "6mo": 3594, "12mo": 4999 },
  }
};

const planFeatures = {
  FREE: {
    topFeatures: ["Curated starter labs (Information)", "45-minute lab sessions", "POC-based validation", "XP & basic leaderboard", "CVE/CWE vulnerability context"],
    color: "var(--hp-text-muted)"
  },
  BASIC: {
    topFeatures: ["Access to Basic labs (Low severity)", "1-hour lab sessions", "Foundation learning paths", "Basic practical challenges", "More lab resets"],
    color: "var(--hp-cyan)"
  },
  INTERMEDIATE: {
    topFeatures: ["Access to Intermediate labs (Medium/High)", "1.5-hour lab sessions", "Multi-step vulnerability scenarios", "Skill-wise progress tracking", "Advanced practical challenges"],
    color: "var(--hp-primary)"
  },
  ADVANCED: {
    topFeatures: ["Full lab library (including Critical)", "2-hour lab sessions", "Complex attack-chain scenarios", "Full Skill Passport", "CPE-eligible tracking support"],
    color: "var(--hp-purple, #bf5fff)"
  }
};

const formatPrice = (amount: number, region: Region) => {
  if (amount === 0) return region === "US" ? "$0" : "0";
  return region === "US" ? `$${amount.toFixed(2)}` : `${amount.toLocaleString('en-IN')}`;
};

export default function PricingPage() {
  const [duration, setDuration] = useState<Duration>("12mo");
  const [region, setRegion] = useState<Region>("US"); // Ideally fetched via IP API

  // Mock geolocation detection
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.country_code === "IN") setRegion("IN");
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[var(--hp-bg)] text-[var(--hp-text)] overflow-hidden">
      <Navbar />
      
      {/* Background Matrix/Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-[var(--hp-primary)]/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-mono">
            Choose your <span className="text-[var(--hp-primary)]">path</span>
          </h1>
          <p className="text-lg text-[var(--hp-text-muted)]">
            Professional cybersecurity practice without the professional price tag.
            Experience realistic POC-based vulnerability validation.
          </p>
        </div>

        {/* Duration Selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 rounded-xl bg-[var(--hp-bg-2)] border border-[var(--hp-border)]">
            {(["monthly", "3mo", "6mo", "12mo"] as Duration[]).map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`relative px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  duration === d 
                    ? "bg-[var(--hp-border)] text-[var(--hp-text)] shadow-sm" 
                    : "text-[var(--hp-text-muted)] hover:text-[var(--hp-text)] hover:bg-[var(--hp-bg-3)]"
                }`}
              >
                {d === "monthly" && "Monthly"}
                {d === "3mo" && "3 Months"}
                {d === "6mo" && "6 Months"}
                {d === "12mo" && (
                  <span className="flex items-center gap-1.5">
                    12 Months <span className="text-[10px] bg-[var(--hp-primary)]/20 text-[var(--hp-primary)] px-1.5 py-0.5 rounded font-mono">BEST VALUE</span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
          {Object.entries(pricingData).map(([key, plan]) => {
            const isFree = key === "FREE";
            const priceObj = region === "US" ? plan.priceUsd : plan.priceInr;
            const price = priceObj[duration];
            const monthlyPrice = priceObj["monthly"];
            const isPopular = (plan as any).mostPopular;
            const featInfo = planFeatures[key as keyof typeof planFeatures];
            
            // Calc savings for annual
            let savingsText = null;
            let monthlyEquiv = null;
            if (!isFree && duration === "12mo") {
              const standardYearly = monthlyPrice * 12;
              const savings = Math.round(((standardYearly - price) / standardYearly) * 100);
              monthlyEquiv = price / 12;
              savingsText = `Save ${savings}% compared to monthly`;
            }

            return (
              <div 
                key={key} 
                className={`relative flex flex-col rounded-3xl p-6 bg-[var(--hp-card-bg)] border transition-all duration-300 ${
                  isPopular 
                    ? "border-[var(--hp-primary)] shadow-[0_0_30px_rgba(0,255,65,0.1)] md:-translate-y-2" 
                    : "border-[var(--hp-border)] hover:border-[var(--hp-border-hover)]"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[var(--hp-primary)] text-[var(--hp-bg)] text-[10px] font-bold font-mono tracking-wider">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1" style={{ color: isPopular ? "var(--hp-primary)" : "var(--hp-text)" }}>{plan.name}</h3>
                  <p className="text-xs text-[var(--hp-text-muted)] font-mono min-h-[32px]">{plan.label}</p>
                  
                  <div className="mt-4 mb-1">
                    <span className="text-3xl font-extrabold">{formatPrice(price, region)}</span>
                    {!isFree && <span className="text-sm text-[var(--hp-text-muted)] font-mono">/{duration === 'monthly' ? 'mo' : duration === '12mo' ? 'yr' : duration}</span>}
                  </div>
                  
                  <div className="min-h-[20px]">
                    {monthlyEquiv && (
                      <div className="text-xs font-mono text-[var(--hp-primary)]">
                         {formatPrice(monthlyEquiv, region)}/mo
                      </div>
                    )}
                  </div>
                  <div className="min-h-[16px] mb-4">
                    {savingsText && (
                      <div className="text-[10px] text-[var(--hp-text-muted)]">{savingsText}</div>
                    )}
                  </div>
                  
                  <button 
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isPopular 
                        ? "bg-[var(--hp-primary)] text-[var(--hp-bg)] hover:bg-[var(--hp-primary-dim)] shadow-[0_0_15px_var(--hp-primary)]" 
                        : isFree
                        ? "bg-[var(--hp-border)] text-[var(--hp-text)] hover:bg-[var(--hp-bg-3)]"
                        : "bg-[var(--hp-bg-2)] text-[var(--hp-text)] border border-[var(--hp-border)] hover:bg-[var(--hp-border)]"
                    }`}
                  >
                    {isFree ? "Current Plan" : "Upgrade to " + plan.name}
                  </button>
                </div>

                <div className="flex-1 space-y-3 pt-4 border-t border-[var(--hp-border)]">
                  {featInfo.topFeatures.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5">
                      <Check size={14} className="shrink-0 mt-0.5" style={{ color: featInfo.color }} />
                      <span className="text-[11px] leading-tight text-[var(--hp-text-muted)]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-16 max-w-7xl mx-auto flex justify-center">
          <a href="#compare" className="text-sm font-mono text-[var(--hp-text-muted)] hover:text-[var(--hp-primary)] flex items-center gap-2 transition-colors">
            View full feature comparison <ChevronDown size={14} />
          </a>
        </div>

        {/* Detailed Comparison Table */}
        <div id="compare" className="mt-24 max-w-5xl mx-auto overflow-x-auto pb-4">
          <h2 className="text-2xl font-bold mb-8 text-center font-mono">Feature Comparison</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 border-b border-[var(--hp-border)] text-[var(--hp-text-muted)] font-mono text-xs w-1/3">FEATURE</th>
                <th className="p-4 border-b border-[var(--hp-border)] text-center font-mono text-xs text-[var(--hp-text-muted)]">FREE</th>
                <th className="p-4 border-b border-[var(--hp-border)] text-center font-mono text-xs text-[var(--hp-cyan)]">BASIC</th>
                <th className="p-4 border-b border-[var(--hp-border)] text-center font-mono text-xs text-[var(--hp-primary)]">INTERMEDIATE</th>
                <th className="p-4 border-b border-[var(--hp-border)] text-center font-mono text-xs text-[var(--hp-purple)]">ADVANCED</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { name: "Lab Access", f: "Curated Starter", b: "Basic-level", i: "Intermediate-level", a: "Full Library" },
                { name: "Session Duration", f: "45 mins", b: "1 hour", i: "1.5 hours", a: "2 hours" },
                { name: "POC Validation", f: true, b: true, i: true, a: true },
                { name: "Learning Paths", f: "Starter", b: "Foundation", i: "Advanced", a: "Advanced" },
                { name: "XP & Leaderboard", f: "Limited", b: true, i: true, a: true },
                { name: "Lab Resets", f: "Limited", b: "Standard", i: "Increased", a: "Maximum" },
                { name: "Practical Assessments", f: false, b: "Basic", i: "Advanced", a: "Full" },
                { name: "Attack-chain Scenarios", f: false, b: false, i: "Selected", a: "Full Library" },
                { name: "Evidence/POC History", f: "Basic", b: "Basic", i: "Detailed", a: "Complete" },
                { name: "Skill Passport", f: false, b: false, i: false, a: true },
                { name: "CPE Tracking Support", f: false, b: false, i: false, a: true },
                { name: "Priority Provisioning", f: false, b: false, i: "where supported", a: true },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-[var(--hp-bg-2)] transition-colors">
                  <td className="p-4 border-b border-[var(--hp-border)] text-[var(--hp-text-muted)]">{row.name}</td>
                  <td className="p-4 border-b border-[var(--hp-border)] text-center text-xs">
                    {row.f === true ? <Check size={14} className="mx-auto text-[var(--hp-text-muted)]" /> : row.f === false ? <span className="opacity-20">-</span> : row.f}
                  </td>
                  <td className="p-4 border-b border-[var(--hp-border)] text-center text-xs">
                    {row.b === true ? <Check size={14} className="mx-auto text-[var(--hp-cyan)]" /> : row.b === false ? <span className="opacity-20">-</span> : row.b}
                  </td>
                  <td className="p-4 border-b border-[var(--hp-border)] text-center text-xs">
                    {row.i === true ? <Check size={14} className="mx-auto text-[var(--hp-primary)]" /> : row.i === false ? <span className="opacity-20">-</span> : row.i}
                  </td>
                  <td className="p-4 border-b border-[var(--hp-border)] text-center text-xs">
                    {row.a === true ? <Check size={14} className="mx-auto text-[var(--hp-purple)]" /> : row.a === false ? <span className="opacity-20">-</span> : row.a}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      
      <footer className="py-8 border-t border-[var(--hp-border)] bg-[var(--hp-bg)] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/hplabs-logo.png" alt="HpLabs Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_10px_var(--hp-primary)]" />
            <span className="text-xl font-bold tracking-tight text-[var(--hp-text)] font-mono">HpLabs</span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <a 
              href="https://buymeacoffee.com/manivarma3p" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center transition-transform hover:scale-105 opacity-90 hover:opacity-100"
              title="Support HpLabs - Buy Me a Coffee"
            >
              <img 
                src="https://cdn.brandfetch.io/idlFAkJfur/w/192/h/192/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1690821080412" 
                alt="Buy Me A Coffee" 
                className="h-10 w-auto rounded-lg"
              />
            </a>
            <div className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} HpLabs. From <a href="https://hackerplus.in" target="_blank" rel="noopener noreferrer" className="text-[var(--hp-primary)] hover:underline">HackerPlus</a>.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
