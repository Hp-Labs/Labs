"use client";

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
  const [premiumStatus, setPremiumStatus] = useState<{ isPremium: boolean; premiumUntil: number | null } | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemMessage, setRedeemMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);

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

  const handleRedeemCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login?redirect=/premium");
      return;
    }
    if (!couponCode.trim()) return;
    
    setRedeemLoading(true);
    setRedeemMessage(null);
    try {
      const res = await fetch("/api/collaborations/redeem", { 
          method: "POST", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ code: couponCode.trim() }) 
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setRedeemMessage({ type: 'error', text: data.error || data.message || "Failed to redeem coupon" });
      } else {
        setRedeemMessage({ type: 'success', text: data.message || "Coupon redeemed successfully!" });
        setCouponCode("");
        // Reload page to reflect new status
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch(e) {
      setRedeemMessage({ type: 'error', text: "Network error." });
    }
    setRedeemLoading(false);
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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full p-6 pt-24">
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
          <div className="mt-8 flex justify-center">
            <div className="bg-[var(--hp-bg-2)] border border-[var(--hp-border)] rounded-xl p-4 w-full max-w-md shadow-lg">
              <h3 className="text-[var(--hp-text)] font-bold text-sm mb-2 flex items-center justify-center gap-2">
                <Lock size={14} className="text-[var(--hp-primary)]" /> Have a Collaboration Coupon?
              </h3>
              <form onSubmit={handleRedeemCoupon} className="flex gap-2">
                <input 
                  type="text" 
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  placeholder="Enter 16-character code"
                  className="flex-1 bg-black/40 border border-[var(--hp-border)] rounded px-3 py-2 text-sm text-[var(--hp-text)] focus:outline-none focus:border-[var(--hp-primary)] transition-colors text-center font-mono uppercase"
                  required
                />
                <button 
                  type="submit"
                  disabled={redeemLoading || !couponCode}
                  className="bg-[var(--hp-primary)]/20 hover:bg-[var(--hp-primary)]/30 text-[var(--hp-primary)] border border-[var(--hp-primary)]/50 px-4 py-2 rounded text-sm font-bold transition-colors disabled:opacity-50"
                >
                  {redeemLoading ? "..." : "Redeem"}
                </button>
              </form>
              {redeemMessage && (
                <div className={`mt-3 text-xs p-2 rounded text-center ${redeemMessage.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {redeemMessage.text}
                </div>
              )}
            </div>
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
              {premiumStatus && (
                <div className={`mb-6 p-4 rounded-xl border ${premiumStatus.isPremium ? 'bg-green-500/10 border-green-500/30' : 'bg-[var(--hp-bg-3)] border-[var(--hp-border-hover)]'}`}>
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    {premiumStatus.isPremium ? <Star className="text-green-400" size={16} /> : <Lock className="text-[var(--hp-text-muted)]" size={16} />}
                    Current Subscription State: {premiumStatus.isPremium ? <span className="text-green-400 uppercase tracking-wider text-xs">Premium (Active)</span> : <span className="text-[var(--hp-text-muted)] uppercase tracking-wider text-xs">Free Plan</span>}
                  </h3>
                  {premiumStatus.isPremium && premiumStatus.premiumUntil && (
                    <p className="text-sm text-[var(--hp-text-muted)] font-mono">
                      Expiry Date: {new Date(premiumStatus.premiumUntil).toLocaleDateString()}
                    </p>
                  )}
                  {premiumStatus.isPremium && (
                    <p className="text-xs text-[var(--hp-text-muted)] mt-2 italic">
                      Purchasing additional months will seamlessly extend your current expiry date.
                    </p>
                  )}
                </div>
              )}
              <h2 className="text-xl font-bold mb-6">Select Duration</h2>
              <div className="space-y-4 mb-8">
                {options.map((opt) => (
                  <label 
                    key={opt.months} 
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedMonths === opt.months 
                        ? "border-[var(--hp-primary)] bg-[var(--hp-primary)]/5" 
                        : "border-[var(--hp-border-hover)] bg-[var(--hp-bg-3)] hover:border-[var(--hp-primary)]/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedMonths === opt.months ? "border-[var(--hp-primary)]" : "border-gray-500"
                      }`}>
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
                    {checkoutLoading ? "Processing..." : `Checkout  ${currency}${selectedOption.totalPrice}`}
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
