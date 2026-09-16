"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Ticket, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function RedeemPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user && (user as any).plan !== 'FREE' && (user as any).plan !== undefined) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleRedeem = async () => {
    if (!code) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/collaborations/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => {
          // Force a full page reload to ensure auth state and everything is fresh
          window.location.href = "/dashboard";
        }, 2000);
      } else {
        setError(data.error);
        setLoading(false);
      }
    } catch (err) {
      setError("Network error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--hp-bg)] flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[var(--hp-bg-2)] border border-[var(--hp-border)] rounded-2xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-[#00e5ff]/10 border border-[#00e5ff]/30 rounded-full flex items-center justify-center mx-auto mb-6 text-[#00e5ff]">
            <Ticket size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Redeem Access</h1>
          <p className="text-sm text-[var(--hp-text-muted)] mb-8">
            Enter the collaboration coupon code provided by your organization to activate your HPLabs access.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm text-left">
              <AlertTriangle size={16} className="shrink-0" /> {error}
            </div>
          )}

          {success ? (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl mb-6 flex flex-col items-center gap-3">
              <CheckCircle size={32} />
              <p className="font-bold">{success}</p>
              <p className="text-sm opacity-80">Redirecting to dashboard...</p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-left">
                <label className="block text-xs font-bold text-[var(--hp-text-muted)] uppercase tracking-wider mb-2">Coupon Code</label>
                <input 
                  type="text" 
                  value={code} 
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="HP-XXXX-XXXX"
                  className="w-full bg-[var(--hp-bg-3)] border border-[var(--hp-border-hover)] text-white p-4 rounded-xl font-mono text-center text-lg tracking-[0.2em] focus:border-[#00e5ff] focus:outline-none transition-colors uppercase placeholder:opacity-30" 
                />
              </div>
              <button 
                onClick={handleRedeem}
                disabled={loading || code.length < 5}
                className="w-full flex items-center justify-center gap-2 bg-[#00e5ff] hover:bg-[#00cce6] text-[#06030c] font-bold p-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] disabled:opacity-50 disabled:shadow-none"
              >
                {loading ? "Verifying..." : "Redeem Code"} <ArrowRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
