import os

path = "src/app/admin/labs/page.tsx"
with open(path, "w", encoding="utf-8") as f:
    f.write("""'use client';
import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

export default function AdminLabsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/labs')
      .then(r => r.json())
      .then(d => {
        if(d.success) setSessions(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[var(--hp-bg)] text-[var(--hp-text)] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <Zap className="text-[var(--hp-primary)]" size={32} />
          Lab Environment Management
        </h1>
        
        <div className="bg-[var(--hp-bg-2)] border border-[var(--hp-border)] rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-8 text-center text-[var(--hp-text-muted)] animate-pulse">Loading active labs...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--hp-bg-3)] border-b border-[var(--hp-border-hover)] text-[var(--hp-text-muted)] font-mono text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">Lab ID</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Started</th>
                    <th className="px-6 py-4">Expires</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--hp-border)]">
                  {sessions.map(s => {
                    const isExpired = s.expires_at < Date.now();
                    return (
                    <tr key={s.lab_session_id} className="hover:bg-[var(--hp-bg-3)]/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-[var(--hp-text)] font-bold">{s.lab_id}</td>
                      <td className="px-6 py-4 text-[var(--hp-primary)]">{s.username}</td>
                      <td className="px-6 py-4">
                        {s.completed ? (
                          <span className="text-green-400 text-xs font-bold uppercase">Completed</span>
                        ) : isExpired ? (
                          <span className="text-red-400 text-xs font-bold uppercase">Expired</span>
                        ) : (
                          <span className="text-blue-400 text-xs font-bold uppercase animate-pulse">Running</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-[var(--hp-text-muted)] font-mono">
                        {new Date(s.start_time).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-xs text-[var(--hp-text-muted)] font-mono">
                        {new Date(s.expires_at).toLocaleString()}
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
              {sessions.length === 0 && <div className="p-8 text-center text-[var(--hp-text-muted)]">No lab sessions found.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
""")
print("Updated admin/labs page")
