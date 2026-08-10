'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Mail, Lock, Eye, EyeOff, Shield, ArrowLeft, Terminal } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [matrixChars, setMatrixChars] = useState<{char: string, x: number, y: number, opacity: number, size: number, duration: number, delay: number}[]>([]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06030c] text-white flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#110820] via-[#06030c] to-[#06030c] z-0" />
      
      {/* Matrix background */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        {matrixChars.map((item, i) => (
          <div 
            key={i}
            className="absolute text-[#bf5fff] font-mono whitespace-nowrap"
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

      <div className="relative z-10 w-full max-w-md p-8 bg-[rgba(17,8,32,0.9)] border border-[rgba(191,95,255,0.2)] backdrop-blur-xl rounded-2xl" style={{ boxShadow: '0 0 60px rgba(191,95,255,0.1)' }}>
        
        <button onClick={() => router.push('/')} className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[rgba(191,95,255,0.1)] border border-[rgba(191,95,255,0.3)] flex items-center justify-center mb-4 text-[#bf5fff] relative overflow-hidden">
             <div className="absolute inset-0 bg-[#bf5fff] blur-[20px] opacity-20"></div>
             <Terminal className="w-8 h-8 relative z-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome back, Hacker</h1>
          <p className="text-gray-400 text-sm">Access your HpLabs terminal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-3 border border-[rgba(255,255,255,0.1)] rounded-xl bg-[rgba(255,255,255,0.04)] text-white placeholder-gray-500 focus:outline-none focus:border-[#bf5fff] focus:ring-1 focus:ring-[#bf5fff] transition-all"
                placeholder="Email address"
              />
            </div>
          </div>
          
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full pl-10 pr-10 py-3 border border-[rgba(255,255,255,0.1)] rounded-xl bg-[rgba(255,255,255,0.04)] text-white placeholder-gray-500 focus:outline-none focus:border-[#bf5fff] focus:ring-1 focus:ring-[#bf5fff] transition-all"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_20px_rgba(191,95,255,0.4)]"
              style={{ background: 'linear-gradient(135deg, #9333ea, #bf5fff)' }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Initialize Session'
              )}
            </button>
          </div>
          
          <div className="mt-4 text-center border-t border-[rgba(255,255,255,0.1)] pt-4">
            <p className="text-xs text-gray-500">
              Demo access: <span className="text-[#bf5fff] font-mono bg-[#bf5fff]/10 px-1 py-0.5 rounded">demo@hplabs.io</span> / <span className="text-[#bf5fff] font-mono bg-[#bf5fff]/10 px-1 py-0.5 rounded">demo123</span>
            </p>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <button onClick={() => router.push('/register')} className="font-medium text-[#bf5fff] hover:text-[#d89eff] hover:underline transition-colors">
              Request access
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
