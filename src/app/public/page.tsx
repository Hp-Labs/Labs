'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { SecurityMonitor } from '@/components/SecurityMonitor';
import { Search, Shield, Zap, Globe, ArrowRight, Loader2, BookOpen, Clock, ExternalLink, AlertTriangle } from 'lucide-react';



export default function PublicDashboard() {
  const [activeTab, setActiveTab] = useState<'news' | 'cve' | 'cwe' | 'updates'>('news');
  
    // News State
  const [newsData, setNewsData] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);

  React.useEffect(() => {
    fetch('/api/tools/news')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setNewsData(data.data);
        } else {
          setNewsError(data.error);
        }
        setNewsLoading(false);
      })
      .catch(err => {
        setNewsError(err.message);
        setNewsLoading(false);
      });
  }, []);

  // CVE State
  const [cveSearch, setCveSearch] = useState('');
  const [cveLoading, setCveLoading] = useState(false);
  const [cveData, setCveData] = useState<any>(null);
  const [cveError, setCveError] = useState<string | null>(null);

  // CWE State
  const [cweSearch, setCweSearch] = useState('');
  const [cweLoading, setCweLoading] = useState(false);
  const [cweData, setCweData] = useState<any>(null);
  const [cweError, setCweError] = useState<string | null>(null);

  const handleCveSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cveSearch) return;
    setCveLoading(true); setCveError(null); setCveData(null);
    try {
      const res = await fetch(`/api/tools/cve?id=${encodeURIComponent(cveSearch)}`);
      const data = await res.json();
      if (data.success) {
        setCveData(data.data);
      } else {
        setCveError(data.error || 'Failed to locate CVE');
      }
    } catch (err: any) {
      setCveError(err.message);
    }
    setCveLoading(false);
  };

  const handleCweSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cweSearch) return;
    setCweLoading(true); setCweError(null); setCweData(null);
    try {
      const res = await fetch(`/api/tools/cwe?id=${encodeURIComponent(cweSearch)}`);
      const data = await res.json();
      if (data.success) {
        setCweData(data.data);
      } else {
        setCweError(data.error || 'Failed to locate CWE');
      }
    } catch (err: any) {
      setCweError(err.message);
    }
    setCweLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--hp-bg)] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-24">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--hp-text)] tracking-tight mb-4 flex items-center justify-center gap-3">
            <Globe className="text-[var(--hp-primary)]" size={40} />
            HPLabs <span className="text-[var(--hp-primary)]">Public Hub</span>
          </h1>
          <p className="text-[var(--hp-text-muted)] max-w-2xl mx-auto">
            Open-access security intelligence and tools. No authentication required.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 p-1 bg-[var(--hp-card-bg)] rounded-lg border border-[var(--hp-border)]">
          {[
            { id: 'news', label: 'Cybersecurity News', icon: Globe },
            { id: 'cve', label: 'CVE Checker', icon: Shield },
            { id: 'cwe', label: 'CWE Checker', icon: BookOpen },
            { id: 'updates', label: 'Security Updates', icon: Zap },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-[var(--hp-primary)]/20 text-[var(--hp-primary)] border border-[var(--hp-primary)]/30'
                  : 'text-[var(--hp-text-muted)] hover:text-[var(--hp-text)] hover:bg-white/5'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-[var(--hp-card-bg)] border border-[var(--hp-border)] rounded-2xl p-6 min-h-[500px]">
          
          {/* TAB: NEWS */}
          {activeTab === 'news' && ( <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[var(--hp-text)] flex items-center gap-2">
                  <Globe className="text-[#3b82f6]" /> Latest Threat Intelligence
                </h2>
                <div className="grid gap-4">
                  {newsLoading ? (
                    <div className="p-8 text-center text-[var(--hp-text-muted)]"><Loader2 className="animate-spin mx-auto mb-4" /> Fetching live cyber threat intelligence...</div>
                  ) : newsError ? (
                    <div className="p-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">{newsError}</div>
                  ) : newsData.length === 0 ? (
                    <div className="p-8 text-center text-[var(--hp-text-muted)] border border-[var(--hp-border)] rounded-lg">No recent news available.</div>
                  ) : newsData.map((news) => (
                    <a href={news.url} target="_blank" rel="noopener noreferrer" key={news.id} className="block p-4 bg-[var(--hp-bg)] border border-[var(--hp-border)] rounded-lg hover:border-[#3b82f6]/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-[var(--hp-text)] group-hover:text-[#3b82f6] transition-colors">{news.title}</h3>
                        <span className="text-xs px-2 py-1 bg-[#3b82f6]/20 text-[#3b82f6] rounded">Verified</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[var(--hp-text-muted)] mt-2">
                        <span className="flex items-center gap-1"><Clock size={14} /> {news.date}</span>
                        <span className="flex items-center gap-1"><Globe size={14} /> Source: {news.source}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div> )}


          {/* TAB: CVE CHECKER */}
          {activeTab === 'cve' && (
            <div>
              <h2 className="text-2xl font-bold text-[var(--hp-text)] flex items-center gap-2 mb-6">
                <Shield className="text-[var(--hp-primary)]" /> CVE Lookups
              </h2>
              
              <form onSubmit={handleCveSearch} className="flex gap-2 mb-8">
                <div className="relative flex-1 max-w-xl">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--hp-text-muted)]" size={18} />
                  <input
                    type="text"
                    value={cveSearch}
                    onChange={(e) => setCveSearch(e.target.value)}
                    placeholder="Enter CVE ID (e.g. CVE-2021-44228)"
                    className="w-full bg-[var(--hp-bg)] border border-[var(--hp-border)] rounded-lg pl-10 pr-4 py-3 text-[var(--hp-text)] focus:outline-none focus:border-[var(--hp-primary)]"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={cveLoading}
                  className="px-6 py-3 bg-[var(--hp-primary)] hover:bg-[var(--hp-secondary)] text-white font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {cveLoading ? <Loader2 className="animate-spin" size={18} /> : 'Search'}
                </button>
              </form>

              {cveError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 flex items-center gap-2">
                  <AlertTriangle size={18} /> {cveError}
                </div>
              )}

              {cveData && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--hp-border)] pb-4">
                    <h3 className="text-3xl font-bold text-[var(--hp-text)]">{cveData.id}</h3>
                    <div className="flex gap-2">
                      {cveData.severity && (
                        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold uppercase border border-red-500/30">
                          {cveData.severity}
                        </span>
                      )}
                      {cveData.cvss && (
                        <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-bold uppercase border border-orange-500/30">
                          CVSS {cveData.cvss}
                        </span>
                      )}
                      <span className="px-3 py-1 bg-[#3b82f6]/20 text-[#3b82f6] rounded-full text-sm font-bold border border-[#3b82f6]/30">
                        {cveData.vulnStatus}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                      <div>
                        <h4 className="text-[var(--hp-text-muted)] text-sm font-semibold uppercase tracking-wider mb-2">Description</h4>
                        <p className="text-[var(--hp-text)] leading-relaxed">{cveData.description}</p>
                      </div>
                      {cveData.cwe && (
                        <div>
                          <h4 className="text-[var(--hp-text-muted)] text-sm font-semibold uppercase tracking-wider mb-2">Associated Weakness</h4>
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded text-purple-400">
                            <BookOpen size={16} /> {cveData.cwe}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-[var(--hp-bg)] rounded-lg border border-[var(--hp-border)]">
                        <h4 className="text-[var(--hp-text-muted)] text-xs font-semibold uppercase mb-2">Published</h4>
                        <p className="text-[var(--hp-text)] text-sm">{new Date(cveData.published).toLocaleDateString()}</p>
                      </div>
                      <div className="p-4 bg-[var(--hp-bg)] rounded-lg border border-[var(--hp-border)]">
                        <h4 className="text-[var(--hp-text-muted)] text-xs font-semibold uppercase mb-2">Last Modified</h4>
                        <p className="text-[var(--hp-text)] text-sm">{new Date(cveData.lastModified).toLocaleDateString()}</p>
                      </div>
                      <div className="p-4 bg-[var(--hp-bg)] rounded-lg border border-[var(--hp-border)] max-h-[200px] overflow-y-auto">
                        <h4 className="text-[var(--hp-text-muted)] text-xs font-semibold uppercase mb-2">References ({cveData.references?.length})</h4>
                        <ul className="space-y-2">
                          {cveData.references?.slice(0, 5).map((ref: string, i: number) => (
                            <li key={i}>
                              <a href={ref} target="_blank" rel="noreferrer" className="text-xs text-[#3b82f6] hover:underline flex items-center gap-1 truncate">
                                <ExternalLink size={10} /> {new URL(ref).hostname}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: CWE CHECKER */}
          {activeTab === 'cwe' && (
            <div>
              <h2 className="text-2xl font-bold text-[var(--hp-text)] flex items-center gap-2 mb-6">
                <BookOpen className="text-purple-400" /> CWE Lookup
              </h2>
              
              <form onSubmit={handleCweSearch} className="flex gap-2 mb-8">
                <div className="relative flex-1 max-w-xl">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--hp-text-muted)]" size={18} />
                  <input
                    type="text"
                    value={cweSearch}
                    onChange={(e) => setCweSearch(e.target.value)}
                    placeholder="Enter CWE ID (e.g. 79 or CWE-79)"
                    className="w-full bg-[var(--hp-bg)] border border-[var(--hp-border)] rounded-lg pl-10 pr-4 py-3 text-[var(--hp-text)] focus:outline-none focus:border-purple-500"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={cweLoading}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {cweLoading ? <Loader2 className="animate-spin" size={18} /> : 'Search'}
                </button>
              </form>

              {cweError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 flex items-center gap-2">
                  <AlertTriangle size={18} /> {cweError}
                </div>
              )}

              {cweData && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--hp-border)] pb-4">
                    <h3 className="text-2xl font-bold text-[var(--hp-text)]">CWE-{cweData.id}: {cweData.name}</h3>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-bold uppercase border border-purple-500/30">
                        {cweData.status || 'Verified'}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                      <div>
                        <h4 className="text-[var(--hp-text-muted)] text-sm font-semibold uppercase tracking-wider mb-2">Description</h4>
                        <p className="text-[var(--hp-text)] leading-relaxed">{cweData.description}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {cweData.likelihood && (
                        <div className="p-4 bg-[var(--hp-bg)] rounded-lg border border-[var(--hp-border)]">
                          <h4 className="text-[var(--hp-text-muted)] text-xs font-semibold uppercase mb-2">Exploit Likelihood</h4>
                          <p className="text-orange-400 font-bold">{cweData.likelihood}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: SECURITY UPDATES */}
          {activeTab === 'updates' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[var(--hp-text)] flex items-center gap-2 mb-4">
                <Zap className="text-[#10b981]" /> Live Security Updates
              </h2>
              <p className="text-[var(--hp-text-muted)] mb-6">
                Verified vulnerabilities ingested by the HPVuln pipeline and corresponding HPLabs training modules.
              </p>
              {/* SecurityMonitor internally fetches from /api/security-monitor */}
              <SecurityMonitor />
            </div>
          )}


          

        </div>
      </main>

      <footer className="py-8 border-t border-[var(--hp-border)] bg-[var(--hp-bg)] mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tight text-[var(--hp-text)] font-mono">HpLabs</span>
          </div>
          <div className="text-[var(--hp-text-muted)] text-sm">
            &copy; {new Date().getFullYear()} HpLabs. From <a href="https://hackerplus.in" target="_blank" rel="noopener noreferrer" className="text-[var(--hp-primary)] hover:underline">HackerPlus</a>.
          </div>
        </div>
      </footer>
    </div>
  );
}




