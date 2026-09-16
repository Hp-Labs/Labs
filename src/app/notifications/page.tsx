import Navbar from "@/components/Navbar";
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-[var(--hp-bg)] text-[var(--hp-text)]" suppressHydrationWarning>
      <Navbar />
      <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Bell className="text-[var(--hp-primary)]" size={32} />
          Notifications
        </h1>
        <div className="bg-[var(--hp-bg-3)] border border-[var(--hp-border)] rounded-xl p-8 text-center">
          <p className="text-[var(--hp-text-muted)]">You have no new notifications.</p>
        </div>
      </div>
    </div>
  );
}