import os

path = "src/app/admin/users/page.tsx"
with open(path, "w", encoding="utf-8") as f:
    f.write("""'use client';
import { useState, useEffect } from "react";
import { Users, Search } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(d => {
        if(d.success) setUsers(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[var(--hp-bg)] text-[var(--hp-text)] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <Users className="text-[var(--hp-primary)]" size={32} />
          User Management
        </h1>
        
        <div className="bg-[var(--hp-bg-2)] border border-[var(--hp-border)] rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-8 text-center text-[var(--hp-text-muted)] animate-pulse">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--hp-bg-3)] border-b border-[var(--hp-border-hover)] text-[var(--hp-text-muted)] font-mono text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">XP</th>
                    <th className="px-6 py-4">Premium Status</th>
                    <th className="px-6 py-4">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--hp-border)]">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-[var(--hp-bg-3)]/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[var(--hp-text)]">{u.username}</div>
                        <div className="text-xs text-[var(--hp-text-muted)]">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${u.is_admin ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-[var(--hp-bg-3)] text-[var(--hp-text-muted)] border border-[var(--hp-border)]'}`}>
                          {u.is_admin ? 'Admin' : u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-[var(--hp-primary)] font-bold">{u.xp}</td>
                      <td className="px-6 py-4">
                        {u.premium_until && u.premium_until > Date.now() ? (
                          <span className="text-green-400 text-xs font-bold uppercase">Active</span>
                        ) : (
                          <span className="text-[var(--hp-text-muted)] text-xs">Free</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-[var(--hp-text-muted)] font-mono">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <div className="p-8 text-center text-[var(--hp-text-muted)]">No users found.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
""")
print("Updated admin/users page")
