import os
import urllib.request

code = '''"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Check, Shield, Star, Zap, Lock, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PremiumOption {
  months: number;
  totalPrice: number;
  originalPrice: number;
  discountText: string | null;
}

export default function PremiumPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [options, setOptions] = useState<PremiumOption[]>([]);
  const [currency, setCurrency] = useState("$");
  const [selectedMonths, setSelectedMonths] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/premium/options")
      .then(res => res.json())
      .then(data => {
        setOptions(data.options);
        setCurrency(data.currency);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login?redirect=/premium");
      return;
    }
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/premium/create-checkout-session", { 
          method: "POST", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ months: selectedMonths }) 
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Checkout failed");
      } else {
        setSuccess(true);
      }
    } catch(e) {
      alert("Network error.");
    }
    setCheckoutLoading(false);
  };

  const selectedOption = options.find(o => o.months === selectedMonths);

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--hp-bg)] flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto w-full p-6 flex items-center justify-center pt-24">
          <div className="bg-[var(--hp-bg-2)] border border-[var(--hp-border)] p-8 rounded-2xl shadow-[0_0_40px_var(--hp-primary)]/20 text-center">
            <div className="w-16 h-16 bg-[var(--hp-primary)]/20 border-2 border-[var(--hp-primary)] rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="text-[var(--hp-primary)] w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-[var(--hp-text)] mb-4">Payment Successful!</h1>
            <p className="text-[var(--hp-text-muted)] mb-8">
              Your HPLabs Premium subscription is now active. The session webhook has securely authenticated your upgrade.
            </p>
            <Link href="/dashboard" className="px-6 py-3 bg-[var(--hp-primary)] text-white font-bold rounded-lg transition-colors flex items-center gap-2 justify-center mx-auto w-max">
              <ArrowLeft size={18} /> Return to Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--hp-bg)] flex flex-col font-sans selection:bg-[var(--hp-primary)] selection:text-[var(--hp-bg)]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 pt-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--hp-primary)]/30 bg-[var(--hp-primary)]/10 text-[var(--hp-primary)] text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Star size={14} /> HPLabs Premium
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--hp-text)] mb-4">
            Unlock the Full Arsenal
          </h1>
          <p className="text-[var(--hp-text-muted)] max-w-2xl mx-auto text-lg">
            Get unlimited access to all advanced labs, exclusive certifications, and priority support.
          </p>
          <div className="mt-4 flex justify-center">
            <a href="/partner-activate" className="text-[var(--hp-primary)] font-semibold hover:underline flex items-center gap-1">
              Have a university partner code? Activate here <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[var(--hp-text-muted)]">Loading premium options...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Everything you need to master offensive security</h2>
              <ul className="space-y-4">
                {[
                  { icon: Lock, title: "Unlock Advanced & Critical Labs", desc: "Gain access to high-severity domains including Cloud and advanced reverse engineering." },
                  { icon: Shield, title: "Official HpLabs Certifications", desc: "Attempt certification exams like HPL-WebPT to prove your skills." },
                  { icon: Zap, title: "Priority AI Support", desc: "Skip the queue and get instant diagnostic help from the Smart Support agent." },
                  { icon: Sparkles, title: "Early Access to New CVEs", desc: "Practice on the latest vulnerabilities within 24 hours of disclosure." }
                ].map((f, i) => (
                  <li key={i} className="flex gap-4 p-4 rounded-xl bg-[var(--hp-bg-2)] border border-[var(--hp-border)]">
                    <div className="shrink-0 p-3 rounded-lg bg-[var(--hp-bg-3)] border border-[var(--hp-border-hover)]">
                      <f.icon className="text-[var(--hp-primary)]" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--hp-text)]">{f.title}</h3>
                      <p className="text-sm text-[var(--hp-text-muted)]">{f.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[var(--hp-bg-2)] border border-[var(--hp-border)] p-8 rounded-2xl">
              <h2 className="text-xl font-bold mb-6">Select Duration</h2>
              <div className="space-y-4 mb-8">
                {options.map((opt) => (
                  <label 
                    key={opt.months} 
                    className={lex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all }
                  >
                    <div className="flex items-center gap-4">
                      <div className={w-5 h-5 rounded-full border-2 flex items-center justify-center }>
                        {selectedMonths === opt.months && <div className="w-2.5 h-2.5 rounded-full bg-[var(--hp-primary)]" />}
                      </div>
                      <div>
                        <div className="font-bold">{opt.months} Month{opt.months > 1 ? 's' : ''}</div>
                        {opt.discountText && (
                          <div className="text-[10px] uppercase font-bold text-green-400 font-mono border border-green-500/30 bg-green-500/10 px-1.5 py-0.5 rounded mt-1 w-max">
                            {opt.discountText}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{currency}{opt.totalPrice}</div>
                      {opt.originalPrice > opt.totalPrice && (
                        <div className="text-xs text-[var(--hp-text-muted)] line-through">{currency}{opt.originalPrice}</div>
                      )}
                    </div>
                    <input 
                      type="radio" 
                      name="months" 
                      className="hidden" 
                      checked={selectedMonths === opt.months}
                      onChange={() => setSelectedMonths(opt.months)}
                    />
                  </label>
                ))}
              </div>

              {selectedOption && (
                <>
                  <div className="flex justify-between items-center mb-6 pt-6 border-t border-[var(--hp-border-hover)]">
                    <span className="text-[var(--hp-text-muted)]">Total Amount</span>
                    <span className="text-2xl font-black font-mono text-[var(--hp-text)]">{currency}{selectedOption.totalPrice}</span>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                    className="w-full px-6 py-3 bg-[var(--hp-primary)] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90"
                  >
                    {checkoutLoading ? "Processing..." : Checkout • }
                  </button>
                  <p className="text-center text-xs text-[var(--hp-text-muted)] mt-4">
                    Secure checkout powered by HpLabs Simulator.
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
'''

with open('src/app/premium/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

with open('src/app/api/premium/create-checkout-session/route.ts', 'r', encoding='utf-8') as f:
    checkout = f.read()

checkout = checkout.replace('\://\System.Management.Automation.Internal.Host.InternalHost', '://System.Management.Automation.Internal.Host.InternalHost')

with open('src/app/api/premium/create-checkout-session/route.ts', 'w', encoding='utf-8') as f:
    f.write(checkout)

