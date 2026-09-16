'use client';
import { useState, useEffect } from 'react';
import { RefreshCw, ServerCrash, AlertOctagon, CheckCircle, Clock, Search, Trash2 } from 'lucide-react';

export default function LabFreshnessResetPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ok: boolean, text: string} | null>(null);

  const fetchSessions = () => {
    setLoading(true);
    fetch('/api/admin/lab-freshness')
      .then(r => r.json())
      .then(d => {
        if(d.success) setSessions(d.activeSessions);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleResetOne = async (id: string) => {
    if(!confirm("Are you sure you want to reset this student's active lab environment? Their progress (XP/Completion) will NOT be lost, but they will have to click 'Start Lab' again.")) return;
    
    setMsg(null);
    try {
      const res = await fetch('/api/admin/lab-freshness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_one', sessionId: id })
      });
      const data = await res.json();
      setMsg({ ok: data.success, text: data.message });
      if(data.success) fetchSessions();
    } catch {
      setMsg({ ok: false, text: "Network error" });
    }
  };

  const handleResetAll = async () => {
    if(!confirm("WARNING: You are about to hard-reset EVERY active lab environment across the platform. Students will lose their active container instances, but XP/completed labs will remain safe. Proceed?")) return;
    
    setMsg(null);
    try {
      const res = await fetch('/api/admin/lab-freshness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_all' })
      });
      const data = await res.json();
      setMsg({ ok: data.success, text: data.message });
      if(data.success) fetchSessions();
    } catch {
      setMsg({ ok: false, text: "Network error" });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--hp-bg)] text-[var(--hp-text)] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--hp-text)] mb-2 flex items-center gap-3">
          <RefreshCw className="text-[var(--hp-cyan)]" size={32} />
          Lab Environment Refresher
        </h1>
        <p className="text-[var(--hp-text-muted)] mb-8 max-w-3xl">
          Hard-reset active lab containers. Use this if a student is facing environment issues (e.g., container crash, flag not submitting). <strong className="text-yellow-500">Student XP and completed lab progress will NEVER be lost</strong>, this only restarts their temporary virtual machine/container.
        </p>

        {msg && (
          <div className={`p-4 mb-8 rounded-lg flex items-center gap-3 ${msg.ok ? 'bg-green-500/10 text-green-500 border border-green-500/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}>
            {msg.ok ? <CheckCircle size={20} /> : <AlertOctagon size={20} />}
            {msg.text}
          </div>
        )}

        <div className="flex gap-4 mb-8">
          <button onClick={fetchSessions} className="px-4 py-2 bg-[var(--hp-bg-3)] border border-[rgba(255,255,255,0.1)] rounded-lg hover:text-[var(--hp-text)] transition-colors flex items-center gap-2">
            <RefreshCw size={16} /> Refresh List
          </button>
          <button onClick={handleResetAll} className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2 ml-auto">
            <ServerCrash size={16} /> Reset ALL Active Labs (Platform Wide)
          </button>
        </div>

        <div className="bg-[var(--hp-bg)] border border-[#00e5ff]/20 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-[rgba(255,255,255,0.1)] bg-[var(--hp-bg-2)]">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--hp-cyan)] flex items-center gap-2">
              <Clock size={16} /> Active Lab Sessions ({sessions.length})
            </h2>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--hp-bg-3)] border-b border-[rgba(255,255,255,0.1)] text-[var(--hp-text-muted)] font-mono text-xs uppercase">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Lab ID</th>
                  <th className="px-6 py-4">Started At</th>
                  <th className="px-6 py-4">Time Remaining</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.05)] relative">
                {loading && (
                  <tr className="absolute inset-0 bg-[var(--hp-bg)]/50 backdrop-blur-sm z-10 flex items-center justify-center">
                    <td>
                      <div className="animate-spin w-8 h-8 border-2 border-[#00e5ff]/30 border-t-[#00e5ff] rounded-full"></div>
                    </td>
                  </tr>
                )}
                {sessions.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--hp-text-muted)]">
                      No active lab sessions right now. Everything is quiet.
                    </td>
                  </tr>
                )}
                {sessions.map(s => {
                  const now = Date.now();
                  const timeLeft = Math.max(0, s.expires_at - now);
                  const minsLeft = Math.floor(timeLeft / 1000 / 60);
                  
                  return (
                    <tr key={s.lab_session_id} className="hover:bg-[var(--hp-bg-3)]/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[var(--hp-text)]">{s.username}</div>
                        <div className="text-xs text-[var(--hp-text-muted)]">{s.email}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-[var(--hp-cyan)] text-xs">
                        {s.lab_id}
                      </td>
                      <td className="px-6 py-4 text-xs text-[var(--hp-text-muted)]">
                        {new Date(s.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {minsLeft > 0 ? (
                          <span className="text-yellow-500 font-mono text-xs">{minsLeft} mins</span>
                        ) : (
                          <span className="text-red-500 font-mono text-xs">Expired</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleResetOne(s.lab_session_id)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded text-xs transition-colors flex items-center gap-2 inline-flex"
                        >
                          <Trash2 size={14} /> Force Reset
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

