'use client';
import { useAuth } from "@/lib/auth";

export default function RedTeamLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const isAdmin = user?.email === 'info@hackerplus.in' && (user as any)?.loggedInViaAdminPortal === true;

  return (
    <div className={isAdmin ? 'admin-theme' : ''}>
      {children}
    </div>
  );
}
