'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, User as UserType } from '@/lib/auth';
import {
  Mail, Lock, Eye, EyeOff, Shield, ArrowLeft, Terminal,
  Smartphone, KeyRound, AlertTriangle, ShieldCheck, ShieldAlert,
  Clock, CheckCircle, RefreshCw
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, verifyPasswordCredentials, generateOTP, verifyLoginOTP, completeLoginWithOTP, getLockoutStatus } = useAuth();

  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingUser, setPendingUser] = useState<UserType | null>(null);

  // OTP Simulation State
  const [activeOTP, setActiveOTP] = useState<string>('');
  const [otpNotification, setOtpNotification] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Lockout State
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [remainingTimeText, setRemainingTimeText] = useState('');

  // Anti-DDoS / Rate Limiting simulation
  const [requestCount, setRequestCount] = useState(0);
  const [ipBlocked, setIpBlocked] = useState(false);

  const [matrixChars, setMatrixChars] = useState<{ char: string; x: number; y: number; opacity: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    // Generate matrix background
    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:\'",.<>/?';
    let seed = 12345;
    const seededRand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const newChars = Array.from({ length: 100 }).map(() => ({
      char: chars[Math.floor(seededRand() * chars.length)],
      x: seededRand() * 100,
      y: seededRand() * 100,
      opacity: seededRand() * 0.3 + 0.1,
      size: seededRand() * 14 + 10,
      duration: seededRand() * 20 + 10,
      delay: seededRand() * 5
    }));
    setMatrixChars(newChars);
  }, []);

  // Live 24-Hour Countdown Timer Check
  useEffect(() => {
    if (!emailOrUser) return;
    const interval = setInterval(() => {
      const lockout = getLockoutStatus(emailOrUser);
      if (lockout.lockoutUntil && Date.now() < lockout.lockoutUntil) {
        setIsLockedOut(true);
        const diffMs = lockout.lockoutUntil - Date.now();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        setRemainingTimeText(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setIsLockedOut(false);
        setRemainingTimeText('');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [emailOrUser, getLockoutStatus]);

  // Resend OTP Countdown Timer
  useEffect(() => {
    if (step !== 'otp' || resendTimer <= 0) return;
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  const triggerOTPFlow = (targetUser: UserType) => {
    setPendingUser(targetUser);
    const code = generateOTP(targetUser.email);
    setActiveOTP(code);
    setOtpNotification(`🔒 2FA Verification: 6-digit OTP code sent to ${targetUser.email} & ${targetUser.phone}: [ ${code} ]`);
    setStep('otp');
    setResendTimer(60);
    setCanResend(false);
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Rate limiting / DDoS check
    if (requestCount > 6) {
      setIpBlocked(true);
      setError('⚡ Rate Limit Exceeded! WAF Anti-DDoS temporarily blocked requests. Please wait 10 seconds.');
      setTimeout(() => {
        setIpBlocked(false);
        setRequestCount(0);
      }, 10000);
      return;
    }
    setRequestCount((prev) => prev + 1);

    if (isLockedOut) {
      setError(`Account locked due to 5 failed attempts! Unlocks in ${remainingTimeText}`);
      return;
    }

    setIsLoading(true);

    try {
      const res = await verifyPasswordCredentials(emailOrUser, password);
      if (!res.success || !res.user) {
        setError(res.error || 'Failed to authenticate');
        // Re-check lockout status
        const lock = getLockoutStatus(emailOrUser);
        if (lock.lockoutUntil && Date.now() < lock.lockoutUntil) {
          setIsLockedOut(true);
        }
      } else {
        // Step 1 Passed -> Initiate 2FA OTP Step
        triggerOTPFlow(res.user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pendingUser) return;

    if (!otpCode || otpCode.length < 6) {
      setError('Please enter the full 6-digit OTP code.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const valid = verifyLoginOTP(emailOrUser, otpCode);
      if (valid) {
        completeLoginWithOTP(pendingUser);
        router.push('/dashboard');
      } else {
        setError('Invalid OTP code. Please check the 6-digit verification code and try again.');
        setIsLoading(false);
      }
    }, 600);
  };

  const handleResendOTP = () => {
    if (!pendingUser || !canResend) return;
    const code = generateOTP(pendingUser.email);
    setActiveOTP(code);
    setOtpNotification(`🔄 New OTP Sent to ${pendingUser.email} & ${pendingUser.phone}: [ ${code} ]`);
    setResendTimer(60);
    setCanResend(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[var(--hp-bg)] text-[var(--hp-text)] flex items-center justify-center relative overflow-hidden font-sans py-10 px-4">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--hp-bg-3)] via-[var(--hp-bg)] to-[var(--hp-bg)] z-0" />

      {/* Matrix background */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        {matrixChars.map((item, i) => (
          <div
            key={i}
            className="absolute text-[var(--hp-primary)] font-mono whitespace-nowrap"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              opacity: item.opacity,
              fontSize: `${item.size}px`,
              animation: `fall ${item.duration}s linear infinite`,
              animationDelay: `${item.delay}s`
            }}
          >
            {item.char}
          </div>
        ))}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fall {
            0% { transform: translateY(-100vh); }
            100% { transform: translateY(100vh); }
          }
        `}} />
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-[var(--hp-card-bg)] border border-[var(--hp-primary)] backdrop-blur-2xl rounded-3xl shadow-[0_0_80px_var(--hp-primary)]">

        {/* Top Back & WAF Status Bar */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center text-[var(--hp-text-muted)] hover:text-[var(--hp-text)] transition-colors text-xs font-mono">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back
          </Link>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--hp-primary)]/10 border border-[var(--hp-border)] text-[10px] font-mono text-[var(--hp-primary)]">
            <ShieldCheck size={12} />
            Sentinel WAF Active
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--hp-primary)]/5 border border-[var(--hp-border-hover)] flex items-center justify-center mb-3 relative overflow-hidden shadow-[0_0_15px_rgba(191,95,255,0.2)]">
            <div className="absolute inset-0 bg-[var(--hp-primary)] blur-[20px] opacity-10"></div>
            <img src="/hplabs-logo.png" alt="HpLabs Logo" className="w-10 h-10 object-contain relative z-10 drop-shadow-[0_0_8px_rgba(191,95,255,0.4)]" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--hp-text)] mb-1">
            {step === 'credentials' ? 'Secure Authentication' : '2FA OTP Verification'}
          </h1>
          <p className="text-[var(--hp-text-muted)] text-xs font-mono">
            {step === 'credentials'
              ? 'Enter registered credentials'
              : `Enter 6-digit OTP sent to ${pendingUser?.email}`}
          </p>
        </div>

        {/* OTP Simulated Security Toast Notification */}
        {otpNotification && step === 'otp' && (
          <div className="mb-6 p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-xs font-mono flex items-start gap-2 shadow-[0_0_20px_rgba(0,229,255,0.15)] animate-pulse">
            <Smartphone size={16} className="text-[#00e5ff] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#00e5ff] mb-0.5">2FA Dispatch Sent!</p>
              <p>{otpNotification}</p>
            </div>
          </div>
        )}

        {/* 24-Hour Lockout Warning Box */}
        {isLockedOut && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start gap-3 shadow-[0_0_25px_rgba(239,68,68,0.25)]">
            <ShieldAlert size={24} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-400 text-sm mb-1">ACCOUNT & IP LOCKED OUT</p>
              <p className="mb-2 leading-relaxed">
                5 consecutive failed attempts detected. Access blocked for 24 hours to prevent brute-force attacks.
              </p>
              <div className="flex items-center gap-1.5 font-mono text-red-300 bg-black/60 px-3 py-1.5 rounded-lg border border-red-500/30 w-fit">
                <Clock size={13} />
                <span>Unlocks in: {remainingTimeText}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Credentials Form */}
        {step === 'credentials' && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--hp-text-muted)]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={emailOrUser}
                  onChange={(e) => setEmailOrUser(e.target.value)}
                  disabled={isLockedOut || ipBlocked}
                  required
                  className="block w-full pl-10 pr-3.5 py-3 border border-[var(--hp-border-hover)] rounded-xl bg-[var(--hp-bg-3)] text-[var(--hp-text)] placeholder-[var(--hp-text-muted)] placeholder-opacity-50 focus:outline-none focus:border-[var(--hp-primary)] focus:ring-1 focus:ring-[var(--hp-primary)] text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Registered Email or Username"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--hp-text-muted)]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLockedOut || ipBlocked}
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-[var(--hp-border-hover)] rounded-xl bg-[var(--hp-bg-3)] text-[var(--hp-text)] placeholder-[var(--hp-text-muted)] placeholder-opacity-50 focus:outline-none focus:border-[var(--hp-primary)] focus:ring-1 focus:ring-[var(--hp-primary)] text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 w-12 flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-transform z-10"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  <div style={{
                    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    transform: showPassword ? 'scale(1.1) translateY(-2px)' : 'scale(1)',
                  }}>
                    {showPassword ? '🐵' : '🙈'}
                  </div>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-relaxed flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || isLockedOut || ipBlocked}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-[var(--hp-text)] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_25px_var(--hp-primary)]"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #bf5fff)' }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Proceed to 2FA Verification'
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 2: 2FA OTP Form */}
        {step === 'otp' && (
          <form onSubmit={handleOTPSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[var(--hp-text-muted)] mb-2">
                Enter 6-Digit Verification Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--hp-text-muted)]">
                  <KeyRound className="h-4 w-4 text-[#00e5ff]" />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  required
                  autoFocus
                  className="block w-full pl-10 pr-3.5 py-3 border border-[rgba(0,229,255,0.4)] rounded-xl bg-[#00e5ff]/5 text-[var(--hp-text)] placeholder-gray-600 focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] text-center font-mono text-lg tracking-widest transition-all"
                  placeholder="------"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs font-mono text-[var(--hp-text-muted)] pt-1">
              <span>Resend code in:</span>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-[#00e5ff] hover:underline flex items-center gap-1"
                >
                  <RefreshCw size={12} /> Resend OTP
                </button>
              ) : (
                <span className="text-[var(--hp-primary)] font-bold">{resendTimer}s</span>
              )}
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isLoading || otpCode.length < 6}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-[var(--hp-text)] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_25px_rgba(0,229,255,0.3)] hover:shadow-[0_0_35px_rgba(0,229,255,0.5)]"
                style={{ background: 'linear-gradient(135deg, #0099ff, #00e5ff)' }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Verify & Authenticate'
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="w-full text-xs text-[var(--hp-text-muted)] hover:text-[var(--hp-text-muted)] py-1 font-mono transition-colors"
              >
                ← Change Email / Credentials
              </button>
            </div>
          </form>
        )}

        {/* Footer info & Register redirection */}
        <div className="mt-6 text-center border-t border-[rgba(255,255,255,0.08)] pt-4">
          <p className="text-xs text-[var(--hp-text-muted)]">
            Don't have an account?{' '}
            <button onClick={() => router.push('/register')} className="font-bold text-[var(--hp-primary)] hover:text-[#d89eff] hover:underline transition-colors">
              Register New Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
