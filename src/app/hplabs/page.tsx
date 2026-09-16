'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Shield, Zap, Activity, Users, Settings, Target, Terminal, Server, Key, Unlock, Crosshair, ChevronRight, LifeBuoy, Lock, ArrowRight, LayoutGrid } from 'lucide-react';
import { PENTESTING_SUBDOMAINS } from "@/lib/data/redteam";
import { SEVERITY_CONFIG } from "@/lib/data/types";

export default function AdminIndex() {
  const [activeTab, setActiveTab] = useState<'labs' | 'management'>('management');

  const totalLabs = PENTESTING_SUBDOMAINS.reduce((acc, sd) => {
    return acc + Object.values(sd.labCounts).reduce((a, b) => a + b, 0);
  }, 0);

  return (
    <div className="min-h-screen bg-[var(--hp-bg)] text-[var(--hp-text)] p-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[var(--hp-text)] mb-2 flex items-center gap-3">
          <Shield className="text-[var(--hp-primary)]" size={32} />
          HPLabs Super Admin Console
        </h1>
        <p className="text-[var(--hp-text-muted)] mb-12">Centralized control center for platform administration and lab testing.</p>

        <div className="flex gap-4 mb-10 border-b border-[rgba(255,255,255,0.1)] pb-px">
          <button
            onClick={() => setActiveTab('management')}
            className={`flex items-center gap-2 px-6 py-3 font-bold transition-all ${
              activeTab === 'management' 
                ? 'text-[var(--hp-primary)] border-b-2 border-[var(--hp-primary)]' 
                : 'text-[var(--hp-text-muted)] hover:text-[var(--hp-text)]'
            }`}
          >
            <Settings size={20} /> User & Platform Management
          </button>
          <button
            onClick={() => setActiveTab('labs')}
            className={`flex items-center gap-2 px-6 py-3 font-bold transition-all ${
              activeTab === 'labs' 
                ? 'text-[var(--hp-cyan)] border-b-2 border-[var(--hp-cyan)]' 
                : 'text-[var(--hp-text-muted)] hover:text-[var(--hp-text)]'
            }`}
          >
            <Terminal size={20} /> Pentesting Labs Catalog
          </button>
        </div>

        {activeTab === 'management' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AdminCard 
                title="User Management" 
                icon={Users} 
                href="/hplabs/shadow" 
                desc="Manage platform users, verify emails, reset accounts, and reconcile payments." 
              />
              <AdminCard 
                title="Collaborations" 
                icon={Key} 
                href="/hplabs/nexus" 
                desc="Bulk import enterprises, assign HPLabs access, and generate secure one-time coupons." 
              />
              <AdminCard 
                title="Lab Sessions" 
                icon={Activity} 
                href="/hplabs/forge" 
                desc="Monitor live lab sessions and active student tracking." 
              />
              <AdminCard 
                title="Lab Freshness" 
                icon={Zap} 
                href="/hplabs/pulse" 
                desc="Monitor and hard-reset lab environments for maintenance." 
              />
              <AdminCard 
                title="Detector" 
                icon={Target} 
                href="/hplabs/sentinel" 
                desc="Security event, anomaly detection, and tamper logging." 
              />

              <AdminCard 
                title="Support Tickets" 
                icon={LifeBuoy} 
                href="/hplabs/comms" 
                desc="View and resolve student support tickets and lab issues." 
              />
            </div>
          </div>
        )}

        {activeTab === 'labs' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="px-3 py-1 bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/50 rounded text-xs font-bold uppercase flex items-center gap-2">
                <Unlock size={14} /> PREMIUM ACTIVE (PERMANENT)
              </div>
              <div className="px-3 py-1 bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/50 rounded text-xs font-bold uppercase flex items-center gap-2">
                <Target size={14} /> ALL MODULES UNLOCKED
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { name: "Pentesting", icon: "🔥", desc: "Web, Network, Cloud, API, and Crypto exploitation." },
                { name: "Red Team Ops", icon: "🎯", desc: "Advanced adversary simulation and C2 infrastructure." },
                { name: "Exploit Dev", icon: "💻", desc: "Buffer overflows, ROP chains, and 0-day research." },
                { name: "Reverse Engineering", icon: "🔍", desc: "Malware analysis, unpacking, and binary patching." },
                { name: "Social Engineering", icon: "🎣", desc: "Phishing, OSINT, and human exploitation techniques." },
                { name: "Blue Team", icon: "🛡️", desc: "Defensive security, SIEM analysis, and threat hunting." },
                { name: "DFIR / Forensics", icon: "🕵️", desc: "Digital forensics and incident response." },
                { name: "GRC & Compliance", icon: "📋", desc: "Governance, risk, compliance, and auditing." },
                { name: "Threat Intelligence", icon: "🧠", desc: "IoCs, threat actor profiling, and MITRE ATT&CK." },
                { name: "Security Architecture", icon: "🏗️", desc: "Secure design patterns and zero trust architecture." },
                { name: "Privacy", icon: "🔐", desc: "Data protection and privacy engineering." },
                { name: "Cloud Security", icon: "☁️", desc: "AWS, Azure, and GCP security misconfigurations." },
              ].map(mod => (
                <Link key={mod.name} href={mod.name === 'Pentesting' ? "/red-team/pentesting" : "#"} className="group block">
                  <div className="rounded-2xl p-5 h-full transition-all duration-300 border bg-[#18181b] border-[var(--hp-border)] hover:border-[var(--hp-primary)] hover:-translate-y-0.5 shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-3xl">{mod.icon}</span>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-[var(--hp-primary)]/30 bg-[var(--hp-primary)]/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--hp-primary)] animate-pulse" />
                        <span className="text-[10px] font-mono text-[var(--hp-primary)]">UNLOCKED</span>
                      </div>
                    </div>
                    <h2 className="text-base font-bold text-white mb-1">{mod.name}</h2>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed mb-5">{mod.desc}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--hp-border)]/50">
                      <span className="text-[11px] text-[var(--hp-primary)]">Admin Override Access</span>
                      <ChevronRight size={14} className="text-[#a1a1aa] group-hover:text-[var(--hp-primary)] transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function AdminCard({ title, icon: Icon, href, desc }: any) {
  if (href === '#') {
    return (
      <div className="block p-6 bg-[var(--hp-bg-3)] border border-[rgba(0,255,65,0.15)] opacity-50 rounded-xl transition-all cursor-not-allowed">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-[#64748b]/10 rounded-lg">
            <Icon className="text-[var(--hp-text-muted)]" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-[var(--hp-text)]">{title}</h3>
        </div>
        <p className="text-[var(--hp-text-muted)] text-sm">{desc}</p>
      </div>
    );
  }
  return (
    <Link href={href} className="block p-6 bg-[var(--hp-bg-3)] border border-[rgba(0,255,65,0.15)] hover:border-[var(--hp-primary)] rounded-xl transition-all group">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-[#00ff41]/10 rounded-lg group-hover:bg-[#00ff41]/20 transition-colors">
          <Icon className="text-[var(--hp-primary)]" size={24} />
        </div>
        <h3 className="text-xl font-semibold text-[var(--hp-text)]">{title}</h3>
      </div>
      <p className="text-[var(--hp-text-muted)] text-sm">{desc}</p>
    </Link>
  );
}





