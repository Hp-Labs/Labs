import Navbar from "@/components/Navbar";
import { Shield } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[var(--hp-bg)] text-[var(--hp-text)]" suppressHydrationWarning>
      <Navbar />
      <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Shield className="text-[var(--hp-primary)]" size={32} />
          Help & Support
        </h1>
        <div className="bg-[var(--hp-bg-3)] border border-[var(--hp-border)] rounded-xl p-8 text-center">
          <h2 className="text-xl text-white mb-4">Need Assistance?</h2>
          <p className="text-[var(--hp-text-muted)] mb-6">Our Smart Support Agent can automatically diagnose and fix common lab issues, XP syncing, and session state problems.</p>
          <p className="text-[var(--hp-text-muted)]">Click the support icon in the bottom right corner of your screen to get started.</p>
        </div>
      </div>
    </div>
  );
}