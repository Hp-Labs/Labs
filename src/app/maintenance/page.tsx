import Navbar from '@/components/Navbar';
import { Wrench } from 'lucide-react';

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-[var(--hp-bg)] text-[var(--hp-text)] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full p-6 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-[var(--hp-bg-3)] border border-amber-500/20 rounded-full">
              <Wrench className="w-12 h-12 text-amber-500 animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-mono font-bold tracking-tight text-white glow-text">System Maintenance</h1>
          <p className="text-[var(--hp-text-muted)] text-sm font-mono max-w-md mx-auto">
            Our servers are currently undergoing scheduled maintenance to upgrade lab environments and patch vulnerabilities.
            Please check back shortly.
          </p>
        </div>
      </main>
      <footer className="border-t border-[var(--hp-border)] py-6 mt-12 bg-[#050508]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[var(--hp-text-muted)] text-xs font-mono">
          &copy; {new Date().getFullYear()} HpLabs. From HackerPlus.
        </div>
      </footer>
    </div>
  );
}
