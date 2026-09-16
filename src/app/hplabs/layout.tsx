import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/services/sessionStore';
import { logSecurityEvent } from '@/lib/db';
import React from 'react';

const SECRET = 'hplabs';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('hplabs_session_id')?.value;

  if (!sessionId) {
    redirect('/hp-45641c95fa7157d2');
  }

  const user = getSession(sessionId);
  if (!user || user.isAdmin !== true || !user.mfaVerified) {
    logSecurityEvent({
      eventType: "admin_ui_access_denied",
      userId: user?.id,
      severity: "warn"
    });
    redirect('/hp-45641c95fa7157d2');
  }

  logSecurityEvent({
    eventType: "admin_ui_access_granted",
    userId: user.id,
    severity: "info"
  });

  return (
    <div className="admin-theme min-h-screen">
      {children}
    </div>
  );
}


