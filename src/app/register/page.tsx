'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  
  // Step 1 states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // Step 2 states
  const [emailOTP, setEmailOTP] = useState('');
  const [phoneOTP, setPhoneOTP] = useState('');
  
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRequestOTP(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, phone: phone || '0000000000' })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      setStep(2);
      setLoading(false);
    } catch (err) {
      setError('A network error occurred.');
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register-otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, emailOTP, phoneOTP: phoneOTP || '00000000' }) 
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Verification failed. Incorrect OTP.');
        setLoading(false);
        return;
      }

      router.replace('/dashboard');
      router.refresh();
    } catch (err) {
      setError('A network error occurred.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#06030c] flex items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
        <div className="w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="bg-[#110924]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
                style={{ background: "linear-gradient(135deg, #9333ea, #bf5fff)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/hplabs-logo.png" alt="Logo" className="w-6 h-auto brightness-0 invert" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">HpLabs</h1>
            </div>
            <p className="text-sm text-gray-400">Join the elite platform.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center mb-4">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required minLength={3} maxLength={30}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-all"
                  placeholder="hacker1337" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email (No throwaways)</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-all"
                  placeholder="you@domain.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-all"
                  placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-all"
                  placeholder="+91 9999999999" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] disabled:opacity-50 flex justify-center items-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Continue"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="bg-purple-900/20 border border-purple-500/30 text-purple-200 p-4 rounded-lg text-sm text-center mb-2">
                We sent verification codes to your Email and Phone.
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email OTP</label>
                <input type="text" value={emailOTP} onChange={e => setEmailOTP(e.target.value.trim())} required
                  className="w-full font-mono tracking-widest text-center text-xl bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-purple-500 transition-all"
                  placeholder="XXXXXXXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">SMS OTP</label>
                <input type="text" value={phoneOTP} onChange={e => setPhoneOTP(e.target.value.trim())} required
                  className="w-full font-mono tracking-widest text-center text-xl bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-purple-500 transition-all"
                  placeholder="XXXXXXXX" />
              </div>
              
              <button type="submit" disabled={loading}
                className="w-full py-3 px-4 mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:opacity-50 flex justify-center items-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Verify & Activate Account"}
              </button>
              
              <button type="button" onClick={() => setStep(1)} className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors">
                Back
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
