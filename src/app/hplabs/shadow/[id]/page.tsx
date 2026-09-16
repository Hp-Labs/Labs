'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Shield, AlertTriangle, Play, RefreshCw, StopCircle, 
  Ban, CheckCircle, Clock, Calendar, Zap, CreditCard, Activity 
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  async function fetchUserData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      const json = await res.json();
      if (json.success) setData(json.data);
      else setMessage(json.message || 'Error fetching user');
    } catch (e) {
      setMessage('Network error');
    }
    setLoading(false);
  }

  async function performAction(action: string, payload: any = {}) {
    if (!confirm(`Are you sure you want to perform: ${action}?`)) return;
    setActionLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
      });
      const json = await res.json();
      setMessage(json.message);
      if (json.success) await fetchUserData();
    } catch (e) {
      setMessage('Network error during action');
    }
    setActionLoading(false);
  }

  if (loading) return <div className="min-h-screen bg-[#050508] text-white flex items-center justify-center">Loading user data...</div>;
  if (!data) return <div className="min-h-screen bg-[#050508] text-red-500 flex items-center justify-center">{message}</div>;

  const { user, authSessions, labSessions, payments, securityEvents, entitlements, coupons } = data;
  const isSuperAdmin = user.email === 'info@hackerplus.in';

  return (
    <div className="min-h-screen bg-[#050508] text-gray-300 font-sans selection:bg-purple-500/30">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Shield className="text-purple-500 w-8 h-8" />
              User Management: {user.username}
            </h1>
            <p className="text-sm text-gray-500 mt-1">ID: {user.id}</p>
          </div>
          <button onClick={() => router.push('/hp-45641c95fa7157d2/users')} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm border border-white/10 transition-colors">
            Back to Users
          </button>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-purple-900/20 border border-purple-500/30 text-purple-300 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Col: Info & Actions */}
          <div className="space-y-8">
            
            {/* Identity Card */}
            <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500"></div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" /> Identity
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Username</span><span className="font-mono text-purple-300">{user.username}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-mono text-gray-200">{user.email}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Email Verified</span>
                  {user.emailVerified ? <span className="text-emerald-400 font-bold">YES</span> : <span className="text-amber-400 font-bold">NO</span>}
                </div>
                <div className="flex justify-between"><span className="text-gray-500">MFA Enabled</span>
                  {user.mfaEnabled ? <span className="text-emerald-400 font-bold">YES</span> : <span className="text-gray-500 font-bold">NO</span>}
                </div>
                <div className="flex justify-between"><span className="text-gray-500">Status</span>
                  {user.suspended ? <span className="text-red-400 font-bold">SUSPENDED</span> : <span className="text-emerald-400 font-bold">ACTIVE</span>}
                </div>
                <div className="pt-2 border-t border-white/10"></div>
                <div className="flex justify-between"><span className="text-gray-500">Plan</span><span className="text-amber-400 font-bold">{user.plan}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Expiry</span><span className="text-gray-300">{user.premiumUntil ? new Date(user.premiumUntil).toLocaleDateString() : 'N/A'}</span></div>
                <div className="pt-2 border-t border-white/10"></div>
                <div className="flex justify-between"><span className="text-gray-500">XP</span><span>{user.xp} XP</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Joined</span><span>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span></div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" /> Admin Operations
              </h2>
              
              {isSuperAdmin ? (
                <div className="text-sm text-amber-500/80 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                  Operations disabled on the Super Admin account.
                </div>
              ) : (
                <div className="space-y-3">
                  <button 
                    disabled={actionLoading}
                    onClick={() => performAction(user.suspended ? 'unsuspend' : 'suspend')}
                    className={`w-full py-2 px-4 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 ${user.suspended ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'}`}
                  >
                    <Ban className="w-4 h-4" /> {user.suspended ? 'Unsuspend Account' : 'Suspend Account'}
                  </button>

                  <button 
                    disabled={actionLoading}
                    onClick={() => performAction('force_logout')}
                    className="w-full py-2 px-4 rounded-lg text-sm bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <StopCircle className="w-4 h-4" /> Force Logout (Revoke Sessions)
                  </button>

                  <button 
                    disabled={actionLoading}
                    onClick={() => performAction('repair_lab_access')}
                    className="w-full py-2 px-4 rounded-lg text-sm bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Repair Lab Access (Clear Stuck)
                  </button>

                                    <div className="pt-4 border-t border-white/10 space-y-3">
                    <p className="text-xs text-amber-500 uppercase tracking-wider font-semibold flex items-center gap-2">
                      <Zap className="w-4 h-4" /> God Mode Controls
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      
                      <button 
                        disabled={actionLoading}
                        onClick={() => performAction('add_xp', { xp: 5000 })}
                        className="w-full py-2 px-2 rounded-lg text-xs bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30 transition-colors flex items-center justify-center gap-1"
                      >
                        <Zap className="w-3 h-3" /> Add 5000 XP
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <select id="plan-select" className="bg-black/50 border border-white/20 rounded p-1 text-xs text-white flex-1">
                        <option value="PREMIUM">Premium Plan</option>
                        <option value="INTERMEDIATE">Intermediate Plan</option>
                        <option value="BASIC">Basic Plan</option>
                      </select>
                      <select id="months-select" className="bg-black/50 border border-white/20 rounded p-1 text-xs text-white w-20">
                        <option value="1">1 Mo</option>
                        <option value="6">6 Mo</option>
                        <option value="12">12 Mo</option>
                      </select>
                      <button 
                        disabled={actionLoading}
                        onClick={() => {
                          const p = (document.getElementById('plan-select') as HTMLSelectElement).value;
                          const m = parseInt((document.getElementById('months-select') as HTMLSelectElement).value);
                          performAction('shift_subscription', { plan: p, months: m });
                        }}
                        className="py-2 px-3 rounded-lg text-xs bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30 transition-colors font-bold whitespace-nowrap"
                      >
                        Shift Sub
                      </button>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Account Recovery</p>
                    <button 
                      disabled={actionLoading}
                      onClick={() => performAction('resend_verification')}
                      className="w-full py-2 px-4 rounded-lg text-sm bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" /> Resend Verification Email
                    </button>
                    <button 
                      disabled={actionLoading}
                      onClick={() => performAction('reset_account_state')}
                      className="w-full py-2 px-4 rounded-lg text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-colors flex items-center justify-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4" /> Reset MFA & Verification State
                    </button>
                  </div>

                                    <div className="pt-4 border-t border-white/10 space-y-3">
                    <p className="text-xs text-amber-500 uppercase tracking-wider font-semibold flex items-center gap-2">
                      <Zap className="w-4 h-4" /> God Mode Controls
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      
                      <button 
                        disabled={actionLoading}
                        onClick={() => performAction('add_xp', { xp: 5000 })}
                        className="w-full py-2 px-2 rounded-lg text-xs bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30 transition-colors flex items-center justify-center gap-1"
                      >
                        <Zap className="w-3 h-3" /> Add 5000 XP
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <select id="plan-select" className="bg-black/50 border border-white/20 rounded p-1 text-xs text-white flex-1">
                        <option value="PREMIUM">Premium Plan</option>
                        <option value="INTERMEDIATE">Intermediate Plan</option>
                        <option value="BASIC">Basic Plan</option>
                      </select>
                      <select id="months-select" className="bg-black/50 border border-white/20 rounded p-1 text-xs text-white w-20">
                        <option value="1">1 Mo</option>
                        <option value="6">6 Mo</option>
                        <option value="12">12 Mo</option>
                      </select>
                      <button 
                        disabled={actionLoading}
                        onClick={() => {
                          const p = (document.getElementById('plan-select') as HTMLSelectElement).value;
                          const m = parseInt((document.getElementById('months-select') as HTMLSelectElement).value);
                          performAction('shift_subscription', { plan: p, months: m });
                        }}
                        className="py-2 px-3 rounded-lg text-xs bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30 transition-colors font-bold whitespace-nowrap"
                      >
                        Shift Sub
                      </button>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Entitlements & Subscriptions</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        disabled={actionLoading}
                        onClick={() => performAction('recalculate_entitlements')}
                        className="w-full py-2 px-2 rounded-lg text-xs bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors"
                      >
                        Recalculate Entitlements
                      </button>
                      <button 
                        disabled={actionLoading}
                        onClick={() => performAction('reconcile_payment')}
                        className="w-full py-2 px-2 rounded-lg text-xs bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors"
                      >
                        Reconcile Payments
                      </button>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        disabled={actionLoading}
                        onClick={() => performAction('extend_entitlement', { days: 30 })}
                        className="flex-1 py-2 px-4 rounded-lg text-xs bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30 transition-colors"
                      >
                        +30 Days
                      </button>
                      <button 
                        disabled={actionLoading}
                        onClick={() => performAction('revoke_entitlement')}
                        className="flex-1 py-2 px-4 rounded-lg text-xs bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 border border-gray-500/30 transition-colors"
                      >
                        Revoke Plan
                      </button>
                      <button 
                        disabled={actionLoading}
                        onClick={() => performAction('revoke_collaboration')}
                        className="flex-1 py-2 px-2 rounded-lg text-xs bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 border border-gray-500/30 transition-colors"
                      >
                        Revoke Collab
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Col: Details (Sessions, Audit, Labs) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Payments & Entitlements */}
            <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" /> Payments & Entitlements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Recent Payments</h3>
                  {!payments || payments.length === 0 ? (
                    <p className="text-xs text-gray-600">No payments found.</p>
                  ) : (
                    <div className="space-y-2">
                      {payments.map((p: any) => (
                        <div key={p.id} className="p-2 bg-white/5 border border-white/10 rounded text-xs flex justify-between">
                          <span className="font-mono text-gray-300">${(p.amount/100).toFixed(2)}</span>
                          <span className={p.status === 'succeeded' ? 'text-emerald-400' : 'text-red-400'}>{p.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Coupons & Collabs</h3>
                  {!coupons || coupons.length === 0 ? (
                    <p className="text-xs text-gray-600">No redemptions found.</p>
                  ) : (
                    <div className="space-y-2">
                      {coupons.map((c: any) => (
                        <div key={c.id} className="p-2 bg-white/5 border border-white/10 rounded text-xs flex flex-col gap-1">
                          <div className="flex justify-between">
                            <span className="font-bold text-purple-300">{c.organization}</span>
                            <span className="text-gray-500">{new Date(c.redeemed_at).toLocaleDateString()}</span>
                          </div>
                          <span className="text-gray-400">Coupon: {c.coupon_hash.substring(0,8)}...</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Auth Sessions */}
            <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" /> Active Auth Sessions
              </h2>
              {authSessions.length === 0 ? (
                <p className="text-sm text-gray-500">No active sessions.</p>
              ) : (
                <div className="space-y-3">
                  {authSessions.map((s: any) => (
                    <div key={s.session_id} className="p-3 bg-white/5 border border-white/10 rounded-lg flex justify-between items-center text-sm">
                      <div className="font-mono text-gray-400 text-xs">...{s.session_id.slice(-8)}</div>
                      <div className="text-gray-500 flex gap-4">
                        <span>Created: {new Date(s.created_at).toLocaleString()}</span>
                        <span className={s.expires_at < Date.now() ? "text-red-400" : "text-emerald-400"}>
                          {s.expires_at < Date.now() ? 'Expired' : 'Active'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Security Audit Log */}
            <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" /> Recent Security Events
              </h2>
              {securityEvents.length === 0 ? (
                <p className="text-sm text-gray-500">No events logged.</p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {securityEvents.map((e: any) => (
                    <div key={e.id} className={`p-3 border rounded-lg text-sm ${e.severity === 'warn' || e.severity === 'error' ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-white/10'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-white">{e.event_type}</span>
                        <span className="text-xs text-gray-500">{new Date(e.created_at).toLocaleString()}</span>
                      </div>
                      <div className="text-xs font-mono text-gray-400 break-all">
                        {e.ip && <span className="mr-2">IP: {e.ip}</span>}
                        {e.details}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Lab Sessions */}
            <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-fuchsia-400" /> Lab Sessions
              </h2>
              {labSessions.length === 0 ? (
                <p className="text-sm text-gray-500">No lab sessions found.</p>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {labSessions.map((ls: any) => (
                    <div key={ls.labSessionId} className="p-3 bg-white/5 border border-white/10 rounded-lg flex justify-between items-center text-sm">
                      <div className="font-bold text-gray-300">{ls.labId}</div>
                      <div className="text-gray-500 flex gap-4 text-xs">
                        <span>Started: {new Date(ls.startTime).toLocaleString()}</span>
                        {ls.completed ? <span className="text-emerald-400">Completed</span> : <span className="text-amber-400">In Progress</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
