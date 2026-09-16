import Link from 'next/link';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--hp-bg)] text-[var(--hp-text)] flex flex-col font-sans">
      <main className="flex-1 max-w-2xl mx-auto w-full p-6 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-[var(--hp-bg-3)] border border-red-500/20 rounded-full">
              <AlertTriangle className="w-12 h-12 text-red-500 animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-mono font-bold tracking-tight text-white glow-text">404 - Target Not Found</h1>
          <p className="text-[var(--hp-text-muted)] text-sm font-mono max-w-md mx-auto">
            The endpoint or lab you are looking for does not exist in this network segment.
            It may have been patched, moved, or deleted.
          </p>
          <div className="p-4 bg-[#0a0a0f] border border-[var(--hp-border)] rounded-lg font-mono text-xs text-left max-w-sm mx-auto mb-8">
            <div className="text-[var(--hp-text-muted)]">root@hplabs:~# curl -I https://hplabs/target</div>
            <div className="text-red-400 mt-1">HTTP/1.1 404 Not Found</div>
            <div className="text-[var(--hp-text-muted)] mt-1">Connection: closed</div>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--hp-primary)] text-white font-semibold rounded-lg hover:brightness-110 transition-all font-mono">
            <Home size={16} />
            Return to Base
          </Link>
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
