'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername: email, password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Access Denied. Invalid credentials.');
        setLoading(false);
        return;
      }

      if (data.mfaRequired) {
        router.replace('/mfa');
      } else {
        router.replace('/hplabs');
        router.refresh();
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
        <div className="w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="bg-[#0a0a0a] border border-red-900/30 rounded-lg p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3 mb-2 text-red-500">
              <Shield size={32} />
              <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
            </div>
            <p className="text-xs text-red-500/70 font-mono tracking-widest uppercase mt-2">Restricted Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-950/40 border border-red-500/50 text-red-400 p-3 rounded text-sm text-center font-mono">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all font-mono"
                placeholder="info@hackerplus.in"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">Secure Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded px-4 py-3 pr-12 text-white placeholder-gray-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all font-mono"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-red-900/80 hover:bg-red-800 text-white rounded font-mono uppercase tracking-widest text-sm transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] disabled:opacity-50 flex justify-center items-center gap-2 mt-6"
            >
              {loading ? 'Authenticating...' : 'Authorize'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

