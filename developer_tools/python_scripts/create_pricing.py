import os

os.makedirs("src/app/pricing", exist_ok=True)
path = "src/app/pricing/page.tsx"

content = """'use client';

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Check, Shield, Zap, Terminal, Sparkles, Star } from "lucide-react";

const plans = [
  {
    name: "3 Months",
    duration: "Quarterly",
    price: "₹1,499",
    period: "/ 3 mo",
    description: "Perfect for cracking your next certification.",
    features: [
      "Access to all 200+ Premium Labs",
      "Unlimited Hints & Walkthroughs",
      "Personalized Target Instances",
      "Community Discord Access"
    ],
    buttonText: "Get 3 Months",
    popular: false,
    color: "var(--hp-cyan)"
  },
  {
    name: "6 Months",
    duration: "Half-Yearly",
    price: "₹2,499",
    period: "/ 6 mo",
    description: "Build deep expertise across multiple domains.",
    features: [
      "Everything in 3 Months plan",
      "Early access to new labs",
      "Blue Team & Cloud domains",
      "Save 16% compared to quarterly"
    ],
    buttonText: "Get 6 Months",
    popular: true,
    color: "var(--hp-primary)"
  },
  {
    name: "12 Months",
    duration: "Annually",
    price: "₹3,999",
    period: "/ year",
    description: "The ultimate arsenal for serious hackers.",
    features: [
      "Everything in 6 Months plan",
      "Exclusive 'Pro Hacker' Badge",
      "1-on-1 Mentorship Sessions (Monthly)",
      "Save 33% (Best Value \u2b50)"
    ],
    buttonText: "Get 12 Months",
    popular: false,
    color: "var(--hp-purple, #bf5fff)"
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--hp-bg)] text-[var(--hp-text)] overflow-hidden">
      <Navbar />
      
      {/* Background Matrix/Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-[var(--hp-primary)]/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--hp-primary)]/10 border border-[var(--hp-primary)]/30 text-[var(--hp-primary)] text-sm font-mono mb-6">
            <Sparkles size={14} /> PRO SUBSCRIPTION
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Unlock the Full <span className="glow-green-text text-[var(--hp-primary)]">Arsenal</span>
          </h1>
          <p className="text-lg text-[var(--hp-text-muted)]">
            Upgrade to Pro and get access to exclusive domains, dedicated targets, and advanced vulnerability scenarios.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative rounded-3xl p-8 bg-[var(--hp-card-bg)] border transition-all duration-300 hover:-translate-y-2 ${
                plan.popular 
                  ? "border-[var(--hp-primary)] shadow-[0_0_40px_rgba(0,255,65,0.15)] md:scale-105 z-10" 
                  : "border-[var(--hp-border)] hover:border-[var(--hp-border-hover)]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--hp-primary)] text-[var(--hp-bg)] text-xs font-bold font-mono tracking-wider shadow-[0_0_15px_var(--hp-primary)]">
                  MOST POPULAR
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-[var(--hp-text-muted)] mb-6 h-10">{plan.description}</p>
                <div className="flex items-end justify-center gap-1 mb-2">
                  <span className="text-4xl font-extrabold" style={{ color: plan.color }}>{plan.price}</span>
                  <span className="text-sm text-[var(--hp-text-muted)] font-mono mb-1">{plan.period}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3">
                    <Check size={18} className="shrink-0 mt-0.5" style={{ color: plan.color }} />
                    <span className="text-sm text-[var(--hp-text-muted)]">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all ${
                  plan.popular 
                    ? "bg-[var(--hp-primary)] text-[var(--hp-bg)] hover:bg-[var(--hp-primary-dim)] shadow-[0_0_20px_var(--hp-primary)] hover:shadow-[0_0_30px_var(--hp-primary)]" 
                    : "bg-[var(--hp-bg-2)] text-[var(--hp-text)] border border-[var(--hp-border)] hover:bg-[var(--hp-border)]"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ or Trust Section */}
        <div className="mt-24 max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-[var(--hp-bg-2)] border border-[var(--hp-border)]">
            <Shield className="mx-auto mb-3 text-[var(--hp-primary)]" size={24} />
            <h4 className="font-bold mb-2">Dedicated Instances</h4>
            <p className="text-xs text-[var(--hp-text-muted)]">No shared targets. Every lab gives you an isolated environment.</p>
          </div>
          <div className="p-6 rounded-2xl bg-[var(--hp-bg-2)] border border-[var(--hp-border)]">
            <Zap className="mx-auto mb-3 text-[var(--hp-primary)]" size={24} />
            <h4 className="font-bold mb-2">Instant Access</h4>
            <p className="text-xs text-[var(--hp-text-muted)]">Get immediate access to all locked domains right after purchase.</p>
          </div>
          <div className="p-6 rounded-2xl bg-[var(--hp-bg-2)] border border-[var(--hp-border)]">
            <Terminal className="mx-auto mb-3 text-[var(--hp-primary)]" size={24} />
            <h4 className="font-bold mb-2">Always Updated</h4>
            <p className="text-xs text-[var(--hp-text-muted)]">New CVEs and zero-days added weekly to the pro catalog.</p>
          </div>
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
"""

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Created /pricing page!")
