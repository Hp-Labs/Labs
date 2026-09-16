'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [emailOTP, setEmailOTP] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login-otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: emailOTP }) // We only require email OTP
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

  async function handleResend() {
    if (!email) {
      setError('Please enter your email to resend OTP.');
      return;
    }
    setError('');
    setMessage('');
    setResendLoading(true);

    try {
      const res = await fetch('/api/auth/login-otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to resend OTP.');
      } else {
        setMessage('A new verification code has been sent to your email.');
      }
    } catch (err) {
      setError('A network error occurred.');
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#06030c] flex items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
        <div className="w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="bg-[#110924]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Verify Email</h1>
            <p className="text-sm text-gray-400 text-center">
              Enter the verification code sent to your email to activate your account.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center mb-4">
              {error}
            </div>
          )}
          
          {message && (
            <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg text-sm text-center mb-4">
              {message}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required readOnly={!!emailParam}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-gray-400 focus:outline-none transition-all"
                placeholder="you@domain.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">OTP Code</label>
              <input type="text" value={emailOTP} onChange={e => setEmailOTP(e.target.value.trim())} required
                className="w-full font-mono tracking-widest text-center text-xl bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-emerald-500 transition-all"
                placeholder="XXXXXXXX" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 px-4 mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:opacity-50 flex justify-center items-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Verify Account"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <button type="button" onClick={handleResend} disabled={resendLoading} className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              {resendLoading ? "Sending..." : "Resend Code"}
            </button>
            <div className="text-sm text-gray-400">
              <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#06030c]"></div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}

