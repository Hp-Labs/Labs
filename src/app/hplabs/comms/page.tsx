'use client';
import { useState, useEffect } from "react";
import { LifeBuoy, Search, Filter, CheckCircle, Clock, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchTickets = () => {
    setLoading(true);
    fetch('/api/admin/support')
      .then(r => r.json())
      .then(d => {
        if(d.success) setTickets(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const resolveTicket = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/support/${id}/resolve`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchTickets();
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert("Network error");
    }
  };

  const filteredTickets = tickets.filter(t => filter === 'all' || t.status === filter);

  return (
    <div className="min-h-screen bg-[var(--hp-bg)] text-[var(--hp-text)] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--hp-text)] mb-2 flex items-center gap-3">
          <LifeBuoy className="text-[#00ff41]" size={32} />
          Support Tickets
        </h1>
        <p className="text-[var(--hp-text-muted)] mb-8">View and resolve student issues and platform problems.</p>
        
        <div className="bg-[var(--hp-bg)] border border-[rgba(0,255,65,0.15)] rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-[rgba(0,255,65,0.15)] flex justify-between items-center bg-[var(--hp-bg-2)]">
            <div className="flex gap-2">
              {(['all', 'open', 'resolved'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                    filter === f 
                      ? 'bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/50' 
                      : 'bg-[var(--hp-bg-3)] text-[var(--hp-text-muted)] border border-[rgba(255,255,255,0.1)] hover:text-[var(--hp-text)]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="text-sm font-mono text-[var(--hp-text-muted)]">
              Showing {filteredTickets.length} tickets
            </div>
          </div>

          <div className="divide-y divide-[rgba(255,255,255,0.05)] min-h-[400px]">
            {loading ? (
              <div className="p-12 flex justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-[#00ff41]/30 border-t-[#00ff41] rounded-full"></div>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-12 text-center text-[var(--hp-text-muted)]">
                No tickets found for this filter.
              </div>
            ) : (
              filteredTickets.map(ticket => (
                <div key={ticket.id} className="bg-[var(--hp-bg-2)] hover:bg-[var(--hp-bg-3)]/50 transition-colors">
                  <div 
                    className="p-4 sm:px-6 cursor-pointer flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
                    onClick={() => setExpandedId(expandedId === ticket.id ? null : ticket.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {ticket.status === 'resolved' ? (
                          <CheckCircle className="text-green-500" size={20} />
                        ) : ticket.status === 'escalated' ? (
                          <AlertTriangle className="text-red-500" size={20} />
                        ) : (
                          <Clock className="text-yellow-500" size={20} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-[var(--hp-text)]">{ticket.contact_name}</span>
                          <span className="text-xs text-[var(--hp-text-muted)] bg-[var(--hp-bg-3)] px-2 py-0.5 rounded border border-[rgba(255,255,255,0.1)] font-mono">
                            {ticket.id.substring(0, 8)}
                          </span>
                        </div>
                        <div className="text-sm text-[var(--hp-text)] line-clamp-1">{ticket.issue_description}</div>
                        <div className="flex gap-4 mt-2 text-xs text-[var(--hp-text-muted)] font-mono">
                          <span>{ticket.user_email || ticket.contact_email}</span>
                          <span>{new Date(ticket.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {expandedId === ticket.id ? <ChevronUp size={20} className="text-[var(--hp-text-muted)]" /> : <ChevronDown size={20} className="text-[var(--hp-text-muted)]" />}
                    </div>
                  </div>

                  {expandedId === ticket.id && (
                    <div className="p-6 bg-[var(--hp-bg)] border-t border-[rgba(255,255,255,0.05)]">
                      <h3 className="font-bold text-[var(--hp-text)] mb-2 text-sm uppercase tracking-wider">Full Issue Description</h3>
                      <p className="text-[var(--hp-text)] whitespace-pre-wrap text-sm mb-6 bg-[var(--hp-bg-3)] p-4 rounded-lg border border-[rgba(255,255,255,0.05)]">
                        {ticket.issue_description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="font-bold text-[var(--hp-text)] mb-2 text-sm uppercase tracking-wider">Context Details</h3>
                          <ul className="space-y-2 text-sm text-[var(--hp-text-muted)]">
                            <li><span className="text-[var(--hp-text)]">Lab ID:</span> {ticket.lab_id || 'N/A'}</li>
                            <li><span className="text-[var(--hp-text)]">Session ID:</span> {ticket.session_id || 'N/A'}</li>
                            <li><span className="text-[var(--hp-text)]">User ID:</span> {ticket.user_id || 'Not logged in'}</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-bold text-[var(--hp-text)] mb-2 text-sm uppercase tracking-wider">Diagnostics JSON</h3>
                          <pre className="bg-[var(--hp-bg-3)] p-3 rounded-lg border border-[rgba(255,255,255,0.05)] text-xs font-mono text-[#00e5ff] overflow-x-auto">
                            {ticket.system_diagnostics || '{}'}
                          </pre>
                        </div>
                      </div>

                      {ticket.status !== 'resolved' && (
                        <div className="flex gap-3 justify-end pt-4 border-t border-[rgba(255,255,255,0.05)]">
                          <button 
                            onClick={(e) => { e.stopPropagation(); resolveTicket(ticket.id); }}
                            className="bg-[#00ff41]/20 hover:bg-[#00ff41]/30 text-[#00ff41] border border-[#00ff41]/50 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                          >
                            <CheckCircle size={16} /> Mark as Resolved
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

