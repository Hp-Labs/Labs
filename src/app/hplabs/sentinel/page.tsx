'use client';

import { useState, useEffect } from 'react';
import { Target, AlertTriangle, Shield, Clock, Server, Eye, Ban, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function DetectorAdminPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = () => {
    setLoading(true);
    fetch('/api/admin/detector')
      .then(r => r.json())
      .then(d => {
        if(d.success) setEvents(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 15000); // Auto-refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const getSeverityStyle = (severity: string) => {
    switch(severity) {
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'error': return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      case 'warn': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--hp-bg)] text-[var(--hp-text)] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--hp-text)] mb-2 flex items-center gap-3">
          <Target className="text-red-500" size={32} />
          Intrusion & Security Detector
        </h1>
        <p className="text-[var(--hp-text-muted)] mb-8">Real-time monitoring of brute force attempts, unauthorized access, and system tampering.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[var(--hp-bg-2)] border border-[rgba(255,0,0,0.2)] rounded-xl p-6 shadow-[0_0_15px_rgba(255,0,0,0.1)]">
            <h3 className="text-[var(--hp-text-muted)] text-xs uppercase tracking-wider mb-2">Total Events (24h)</h3>
            <p className="text-3xl font-mono text-red-400">{events.length}</p>
          </div>
          <div className="bg-[var(--hp-bg-2)] border border-[rgba(255,255,255,0.1)] rounded-xl p-6">
            <h3 className="text-[var(--hp-text-muted)] text-xs uppercase tracking-wider mb-2">Critical Alerts</h3>
            <p className="text-3xl font-mono text-[var(--hp-text)]">{events.filter(e => e.severity === 'critical').length}</p>
          </div>
          <div className="bg-[var(--hp-bg-2)] border border-[rgba(255,255,255,0.1)] rounded-xl p-6">
            <h3 className="text-[var(--hp-text-muted)] text-xs uppercase tracking-wider mb-2">Brute Force Hits</h3>
            <p className="text-3xl font-mono text-yellow-500">{events.filter(e => e.event_type.includes('login_failed') || e.event_type.includes('brute')).length}</p>
          </div>
          <div className="bg-[var(--hp-bg-2)] border border-[rgba(255,255,255,0.1)] rounded-xl p-6 flex flex-col justify-center">
            <button onClick={fetchEvents} className="w-full py-3 bg-[var(--hp-bg-3)] hover:bg-[#1a1a24] border border-[rgba(255,255,255,0.1)] rounded-lg text-sm transition-colors flex justify-center items-center gap-2">
              <Clock size={16} /> Refresh Now
            </button>
          </div>
        </div>

        <div className="bg-[var(--hp-bg)] border border-[rgba(255,0,0,0.15)] rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-[rgba(255,255,255,0.1)] bg-[var(--hp-bg-2)]">
            <h2 className="text-sm font-bold uppercase tracking-widest text-red-400 flex items-center gap-2">
              <Shield size={16} /> Live Event Log
            </h2>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--hp-bg-3)] border-b border-[rgba(255,255,255,0.1)] text-[var(--hp-text-muted)] font-mono text-xs uppercase">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Severity</th>
                  <th className="px-6 py-4">Event Type</th>
                  <th className="px-6 py-4">User / IP Source</th>
                  <th className="px-6 py-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.05)] relative">
                {loading && events.length === 0 && (
                  <tr className="absolute inset-0 bg-[var(--hp-bg)]/50 backdrop-blur-sm z-10 flex items-center justify-center">
                    <td>
                      <div className="animate-spin w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full"></div>
                    </td>
                  </tr>
                )}
                {events.map(ev => (
                  <tr key={ev.id} className="hover:bg-[var(--hp-bg-3)]/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-[var(--hp-text-muted)] font-mono">
                      {new Date(ev.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getSeverityStyle(ev.severity)}`}>
                        {ev.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-[var(--hp-text)] text-xs">{ev.event_type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs">
                        {ev.email ? (
                          <Link href={`/hp-45641c95fa7157d2/users/${ev.user_id}`} className="text-blue-400 hover:underline">
                            {ev.email}
                          </Link>
                        ) : (
                          <span className="text-[var(--hp-text-muted)]">Unknown User</span>
                        )}
                      </div>
                      <div className="text-[10px] text-[var(--hp-text-muted)] font-mono mt-1">IP: {ev.ip || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <pre className="text-[10px] bg-[var(--hp-bg-3)] p-2 rounded border border-[rgba(255,255,255,0.05)] text-[var(--hp-cyan)] max-w-xs overflow-x-auto">
                        {ev.details}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && events.length === 0 && <div className="p-8 text-center text-[var(--hp-text-muted)]">No security events detected.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

