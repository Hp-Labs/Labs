'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername: email, password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.requiresVerification) {
          if (data.type === 'login') {
            router.replace(`/verify-login?email=${encodeURIComponent(data.email || email)}`);
          } else {
            router.replace(`/verify-email?email=${encodeURIComponent(email)}`);
          }
          return;
        }
        setError(data.message || 'Login failed. Invalid credentials.');
        setLoading(false);
        return;
      }

      if (data.mfaRequired) {
        router.replace('/mfa');
      } else {
        router.replace('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#06030c] flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
        <div className="w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="bg-[#110924]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
                style={{ background: "linear-gradient(135deg, #9333ea, #bf5fff)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/hplabs-logo.png" alt="Logo" className="w-6 h-auto brightness-0 invert" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">HpLabs</h1>
              </div>
            </div>
            <p className="text-sm text-gray-400">Welcome back, hacker.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email or Username</label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                placeholder="info@hackerplus.in"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <Link href="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  style={{ paddingRight: '48px' }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '18px', lineHeight: 1 }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] disabled:opacity-50 flex justify-center items-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Request access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

