'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Zap, X, Gift } from 'lucide-react';

export function DailyBonusModal() {
  const { user, claimDailyBonus, checkDailyBonusAvailable, markModalSeen, dailyModalSeen } = useAuth();
  const [isEligible, setIsEligible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (!user || dailyModalSeen) {
      setLoading(false);
      return;
    }
    
    // Quick local check first to avoid unnecessary API calls
    const today = new Date().toISOString().split("T")[0];
    if (user.dailyBonusClaimedDate === today) {
      setLoading(false);
      return;
    }

    checkDailyBonusAvailable().then(available => {
      setIsEligible(available);
      setLoading(false);
    });
  }, [user, dailyModalSeen]);

  if (loading || !isEligible || dailyModalSeen) return null;

  const handleClaim = async () => {
    setClaiming(true);
    const res = await claimDailyBonus();
    setClaiming(false);
    if (res.success) {
      markModalSeen();
    } else {
      alert(res.message);
    }
  };

  const handleClose = () => {
    markModalSeen();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--hp-bg-2)] border border-[var(--hp-border)] rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(147,51,234,0.3)] relative overflow-hidden animate-in fade-in zoom-in duration-300">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--hp-cyan)] via-[var(--hp-primary)] to-[var(--hp-secondary)]" />
        
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 rounded-md text-[var(--hp-text-muted)] hover:text-[var(--hp-text)] hover:bg-[var(--hp-bg-3)] transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[var(--hp-primary)]/10 border-2 border-[var(--hp-primary)] rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_var(--hp-primary)]/40">
            <Gift size={32} className="text-[var(--hp-primary)] animate-bounce" />
          </div>
          
          <h2 className="text-2xl font-bold text-[var(--hp-text)] mb-2">Daily Login Reward</h2>
          <p className="text-[var(--hp-text-muted)] text-sm mb-6">
            Welcome back! Claim your daily reward to boost your XP and climb the leaderboard.
          </p>
          
          <div className="bg-[var(--hp-bg-3)] border border-[var(--hp-border)] rounded-xl py-3 px-8 mb-6 flex items-center gap-2">
            <Zap size={20} className="text-[var(--hp-primary)]" />
            <span className="text-2xl font-mono font-bold text-[var(--hp-text)]">+100 XP</span>
          </div>
          
          <button 
            onClick={handleClaim}
            disabled={claiming}
            className="w-full py-3.5 bg-gradient-to-r from-[var(--hp-primary-dim)] to-[var(--hp-primary)] text-white font-bold rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:shadow-[0_0_25px_rgba(147,51,234,0.7)] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {claiming ? "Claiming..." : "Claim Reward"}
          </button>
          
          <button 
            onClick={handleClose}
            className="mt-4 text-sm font-medium text-[var(--hp-text-muted)] hover:text-[var(--hp-text)] transition-colors"
          >
            Maybe Later
          </button>
        </div>
        
      </div>
    </div>
  );
}
