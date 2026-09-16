'use client';
import { useState, useEffect } from "react";
import { Users, Search, ChevronLeft, ChevronRight, Ban, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const fetchUsers = () => {
    setLoading(true);
    fetch(`/api/admin/users?search=${encodeURIComponent(search)}&page=${page}`)
      .then(r => r.json())
      .then(d => {
        if(d.success) {
          setUsers(d.data);
          setPagination(d.pagination);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, page]);

  return (
    <div className="min-h-screen bg-[var(--hp-bg)] text-[var(--hp-text)] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--hp-text)] mb-2 flex items-center gap-3">
          <Users className="text-[#00ff41]" size={32} />
          User Management
        </h1>
        <p className="text-[var(--hp-text-muted)] mb-8">View and manage all users, their plans, and lab statistics.</p>
        
        <div className="bg-[var(--hp-bg)] border border-[rgba(0,255,65,0.15)] rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-[rgba(0,255,65,0.15)] flex justify-between items-center bg-[var(--hp-bg-2)]">
            <div className="relative w-72">
              <input
                type="text"
                placeholder="Search email or username..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full bg-[var(--hp-bg-3)] border border-[rgba(255,255,255,0.1)] rounded-lg pl-10 pr-4 py-2 text-sm text-[var(--hp-text)] focus:outline-none focus:border-[#00ff41]/50"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--hp-text-muted)]" size={16} />
            </div>
            <div className="text-sm font-mono text-[var(--hp-text-muted)]">
              Total Users: <span className="text-[var(--hp-text)] font-bold">{pagination.total}</span>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--hp-bg-3)] border-b border-[rgba(0,255,65,0.3)] text-[var(--hp-text-muted)] font-mono text-xs uppercase">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4 text-right">XP & Labs</th>
                  <th className="px-6 py-4 text-right">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(0,255,65,0.15)] relative">
                {loading && (
                  <tr className="absolute inset-0 bg-[var(--hp-bg)]/50 backdrop-blur-sm z-10 flex items-center justify-center">
                    <td>
                      <div className="animate-spin w-8 h-8 border-2 border-[#00ff41]/30 border-t-[#00ff41] rounded-full"></div>
                    </td>
                  </tr>
                )}
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-[var(--hp-bg-3)]/80 transition-colors group">
                    <td className="px-6 py-4">
                      <Link href={`/hp-45641c95fa7157d2/users/${u.id}`} className="block">
                        <div className="font-bold text-[var(--hp-text)] group-hover:text-[#00ff41] transition-colors">{u.username}</div>
                        <div className="text-xs text-[var(--hp-text-muted)]">{u.email}</div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {u.suspended ? (
                        <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                          <Ban size={10} /> Suspended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/30 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                          <CheckCircle2 size={10} /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start">
                        {u.is_admin ? (
                          <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/30">Admin (God Mode)</span>
                        ) : (
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            u.plan === 'ADVANCED' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                            u.plan === 'PREMIUM' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                            u.plan === 'INTERMEDIATE' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                            u.plan === 'BASIC' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' :
                            'bg-[var(--hp-bg-3)] text-[var(--hp-text-muted)] border-gray-700'
                          }`}>
                            {u.plan}
                          </span>
                        )}
                        {!u.is_admin && u.premium_until && u.premium_until > Date.now() && (
                          <span className="text-[10px] text-[var(--hp-text-muted)] mt-1">Exp: {new Date(u.premium_until).toLocaleDateString()}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-mono text-[#00ff41] font-bold">{u.xp} XP</div>
                      <div className="text-xs text-[var(--hp-text-muted)]">{u.labs_completed || 0} Labs Completed</div>
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-[var(--hp-text-muted)] font-mono">
                      {u.last_login ? new Date(u.last_login).toLocaleString() : 'Never logged in'}
                      <div className="text-[10px] mt-1">Joined: {new Date(u.created_at).toLocaleDateString()}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && users.length === 0 && <div className="p-8 text-center text-[var(--hp-text-muted)]">No users found matching your search.</div>}
          </div>

          <div className="p-4 border-t border-[rgba(0,255,65,0.15)] flex justify-between items-center bg-[var(--hp-bg-2)]">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 rounded bg-[var(--hp-bg-3)] border border-[rgba(255,255,255,0.1)] text-[var(--hp-text)] disabled:opacity-30 flex items-center gap-1 hover:bg-[#1a1a24] transition-colors"
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <div className="text-sm font-mono text-[var(--hp-text-muted)]">
              Page {page} of {pagination.pages || 1}
            </div>
            <button 
              disabled={page >= pagination.pages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 rounded bg-[var(--hp-bg-3)] border border-[rgba(255,255,255,0.1)] text-[var(--hp-text)] disabled:opacity-30 flex items-center gap-1 hover:bg-[#1a1a24] transition-colors"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

