'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Terminal, Shield, Target, Search, BookOpen, Cloud, Database, Network, Server,
  Lock, Zap, Award, Activity, Code, Cpu, ChevronRight, CheckCircle2, Play,
  Menu, X, ExternalLink
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

// deterministic random for matrix rain initial positions
const seededRand = (seed: number) => {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const toggleDomain = (id: string) => {
    setExpandedDomain(prev => prev === id ? null : id);
    setExpandedModule(null);
  };
  const toggleModule = (id: string) => {
    setExpandedModule(prev => prev === id ? null : id);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Small particles animation
    const particles: { x: number, y: number, radius: number, vx: number, vy: number }[] = [];
    const numParticles = Math.min(100, (canvas.width * canvas.height) / 15000);
    
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = 'rgba(191, 95, 255, 0.4)';
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    draw();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Timeline', href: '#features' }, // Usually maps to a timeline section, linking to features for now
    { name: 'Domains', href: '#domains' },
    { name: 'Pricing', href: '#xp' }, // Mapping to XP for now
  ];

  return (
    <div className="min-h-screen bg-[var(--hp-bg)] text-[var(--hp-text-muted)] font-sans overflow-x-hidden relative">
      <style dangerouslySetInnerHTML={{__html: `
        html { scroll-behavior: smooth; }
        .glow-text { text-shadow: 0 0 8px rgba(191,95,255,0.3); }
        .glass-panel {
          background: var(--hp-card-bg);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid var(--hp-border);
        }
        .glass-panel:hover {
          border-color: var(--hp-primary);
          box-shadow: 0 0 25px var(--hp-primary);
        }
        .radial-bg {
          background: radial-gradient(circle at 50% 50%, rgba(191,95,255,0.15) 0%, transparent 60%);
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}} />

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[var(--hp-bg)]/80 backdrop-blur-md border-b border-[var(--hp-border)] py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/hplabs-logo.png"
              alt="HpLabs Logo"
              className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(191,95,255,0.4)] group-hover:scale-105 transition-all duration-300"
            />
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-[var(--hp-text)] font-mono glow-text">HpLabs</span>
              <span className="text-[10px] text-[var(--hp-text-muted)] font-mono leading-none">by HackerPlus</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-sm font-medium text-[var(--hp-text-muted)] hover:text-[var(--hp-primary)] transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/login" className="px-5 py-2.5 text-sm font-medium text-[var(--hp-text)] border border-[var(--hp-border-hover)] rounded-md hover:bg-[var(--hp-primary)]/10 hover:border-[#bf5fff] transition-all">
                Login
              </Link>
              <Link href="/register" className="px-5 py-2.5 text-sm font-medium text-white dark:text-[#06030c] bg-[var(--hp-primary)] hover:bg-[var(--hp-secondary)] rounded-md transition-all shadow-[0_0_8px_rgba(191,95,255,0.3)] hover:shadow-[0_0_15px_rgba(224,64,251,0.5)] font-bold">
                Start Free
              </Link>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button type="button" className="md:hidden text-[var(--hp-text)] relative z-[60] p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[var(--hp-bg)]/95 backdrop-blur-lg border-b border-[var(--hp-border)] py-4 flex flex-col px-6 gap-4">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-[var(--hp-text-muted)] hover:text-[var(--hp-primary)] py-2 border-b border-white/5">
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex justify-center mb-2"><ThemeToggle /></div>
              <Link href="/login" className="px-5 py-3 text-center text-sm font-medium text-[var(--hp-text)] border border-[var(--hp-border-hover)] rounded-md hover:bg-[var(--hp-primary)]/10">
                Login
              </Link>
              <Link href="/register" className="px-5 py-3 text-center text-sm font-medium text-white dark:text-[#06030c] bg-[var(--hp-primary)] rounded-md font-bold">
                Start Free
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Matrix Rain Background */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
        
        {/* Ambient Glow */}
        <div className="absolute inset-0 z-0 radial-bg pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="inline-block px-4 py-1.5 rounded-full border border-[var(--hp-border)] bg-[var(--hp-primary)]/10 text-[var(--hp-secondary)] text-sm font-mono tracking-wider font-semibold animate-float">
              1947 — FIRST DOCUMENTED COMPUTER BUG
            </div>
            <a href="https://hackerplus.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--hp-card-bg)] border border-[var(--hp-border)] text-sm font-medium text-[var(--hp-text-muted)] hover:text-[var(--hp-primary)] hover:border-[var(--hp-primary)] transition-all">
              <ExternalLink size={14} />
              Developed by HackerPlus.in
            </a>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--hp-text)] mb-4 tracking-tight leading-tight">
            Hack Real IPs.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--hp-primary)] to-[#e040fb]">Master Every Vulnerability.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            From early computer bugs to modern CVEs — master vulnerabilities, attack vectors, exploitation techniques, and real-world security research.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16">
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-[var(--hp-primary)] text-white dark:text-[#06030c] font-bold rounded-md hover:bg-[var(--hp-secondary)] transition-all shadow-[0_0_8px_rgba(191,95,255,0.3)] hover:shadow-[0_0_15px_rgba(224,64,251,0.5)] flex items-center justify-center gap-2">
              <Terminal size={20} />
              Start Hacking Free
            </Link>
            <Link href="#features" className="w-full sm:w-auto px-8 py-4 bg-transparent text-[var(--hp-text)] font-semibold rounded-md border border-[var(--hp-border-hover)] hover:bg-[var(--hp-primary)]/10 transition-all flex items-center justify-center gap-2">
              <Play size={20} />
              Watch Demo
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-[var(--hp-border)]">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-[var(--hp-text)] mb-1">200+</span>
              <span className="text-sm text-slate-400 font-mono">Labs</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-[var(--hp-text)] mb-1">79+</span>
              <span className="text-sm text-slate-400 font-mono">Years (1947–Present)</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-[var(--hp-text)] mb-1">5</span>
              <span className="text-sm text-slate-400 font-mono">Severity Tiers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-[var(--hp-text)] mb-1">15+</span>
              <span className="text-sm text-slate-400 font-mono">Domains</span>
            </div>
          </div>
        </div>
      </section>

      {/* What is HpLabs Section */}
      <section id="features" className="py-24 relative z-10 bg-[var(--hp-bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--hp-text)] mb-4">
              What is <span className="text-[var(--hp-primary)]">HpLabs?</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">The ultimate cybersecurity training platform built for realism.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Network className="text-[var(--hp-primary)] mb-4" size={36} />, title: 'Real IP Labs', desc: 'No sandboxed browser VMs. Activate a lab → get a real IP → hack with your own Kali/Parrot Linux.' },
              { icon: <Activity className="text-[var(--hp-primary)] mb-4" size={36} />, title: '1947–Present Timeline', desc: 'Every vulnerability discovered from early computer bugs to present day. Grace Hopper bug → Log4Shell → latest 2026 exploits.' },
              { icon: <Award className="text-[var(--hp-primary)] mb-4" size={36} />, title: 'Severity Progression', desc: 'Information → Low → Medium → High → Critical. XP gates ensure you master fundamentals before advanced exploits.' },
              { icon: <Lock className="text-[var(--hp-primary)] mb-4" size={36} />, title: 'Unique Flags', desc: 'Every user gets a different flag hash. Copy-paste writeups don\'t work here. You have to understand the exploit.' },
              { icon: <Search className="text-[var(--hp-primary)] mb-4" size={36} />, title: 'CVE/CWE/MITRE Mapped', desc: 'Every lab has CVE references, CWE classification, and MITRE ATT&CK technique mapping for real-world context.' },
              { icon: <Cloud className="text-[var(--hp-primary)] mb-4" size={36} />, title: 'Multi-Domain', desc: 'Web, API, Network, Cloud, Mobile, Active Directory, Wireless, IoT, OT/ICS, Kubernetes, Container security.' },
            ].map((feature, i) => (
              <div key={i} className="glass-panel p-8 rounded-2xl transition-all duration-300">
                {feature.icon}
                <h3 className="text-xl font-bold text-[var(--hp-text)] mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Lab Structure Section */}
      <section id="domains" className="py-24 relative z-10 bg-[var(--hp-bg)] border-y border-[var(--hp-primary)]/10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--hp-primary)]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--hp-text)] mb-4">
              What&apos;s <span className="text-[var(--hp-primary)]">Inside?</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Click any domain to explore its modules and sub-topics.</p>
          </div>

          <div className="space-y-2">
            {[
              {
                id: 'red-team', icon: '🎯', name: 'Red Team',
                modules: [
                  {
                    id: 'pentesting', icon: '🕵️', name: 'Pentesting',
                    subs: [
                      { icon: '🌐', name: 'Web Pentesting' },
                      { icon: '🔌', name: 'API Security' },
                      { icon: '🌐', name: 'Network Pentesting' },
                      { icon: '📱', name: 'Mobile Pentesting' },
                      { icon: '☁️', name: 'Cloud Pentesting' },
                      { icon: '🐳', name: 'Container / Docker' },
                      { icon: '⚓', name: 'Kubernetes' },
                      { icon: '🏢', name: 'Active Directory' },
                      { icon: '📡', name: 'Wireless Security' },
                      { icon: '🏭', name: 'OT / ICS / SCADA' },
                      { icon: '🔗', name: 'IoT Security' },
                    ]
                  },
                  { id: 'exploit', icon: '💥', name: 'Exploit Development', subs: [] },
                  { id: 'redops', icon: '🔴', name: 'Red Team Ops', subs: [] },
                  { id: 'reverse', icon: '⚙️', name: 'Reverse Engineering', subs: [] },
                  { id: 'social', icon: '🎭', name: 'Social Engineering', subs: [] },
                ]
              },
              {
                id: 'blue-team', icon: '🛡️', name: 'Blue Team',
                modules: [
                  { id: 'soc', icon: '📊', name: 'SOC Analysis', subs: [] },
                  { id: 'threathunt', icon: '🔎', name: 'Threat Hunting', subs: [] },
                  { id: 'incident', icon: '🚨', name: 'Incident Response', subs: [] },
                  { id: 'siem', icon: '📈', name: 'SIEM & Log Analysis', subs: [] },
                ]
              },
              {
                id: 'forensics', icon: '🔬', name: 'Forensics & DFIR',
                modules: [
                  { id: 'dfir', icon: '💾', name: 'Digital Forensics', subs: [] },
                  { id: 'malware', icon: '🦠', name: 'Malware Analysis', subs: [] },
                  { id: 'memforen', icon: '🧠', name: 'Memory Forensics', subs: [] },
                  { id: 'netforen', icon: '🌐', name: 'Network Forensics', subs: [] },
                ]
              },
              {
                id: 'grc', icon: '📋', name: 'GRC & Compliance',
                modules: [
                  { id: 'iso', icon: '📜', name: 'ISO 27001', subs: [] },
                  { id: 'nist', icon: '🏛️', name: 'NIST CSF', subs: [] },
                  { id: 'soc2', icon: '✅', name: 'SOC 2', subs: [] },
                  { id: 'gdpr', icon: '🔐', name: 'GDPR / PCI-DSS', subs: [] },
                ]
              },
              {
                id: 'threat-intel', icon: '🕵️', name: 'Threat Intelligence',
                modules: [
                  { id: 'osint', icon: '🌍', name: 'OSINT', subs: [] },
                  { id: 'cti', icon: '🧩', name: 'Cyber Threat Intelligence', subs: [] },
                  { id: 'darkweb', icon: '🌑', name: 'Dark Web Monitoring', subs: [] },
                  { id: 'ioc', icon: '🔍', name: 'IOC Analysis', subs: [] },
                ]
              },
              {
                id: 'cloud', icon: '☁️', name: 'Cloud Security',
                modules: [
                  { id: 'aws', icon: '🟠', name: 'AWS Security', subs: [] },
                  { id: 'gcp', icon: '🔵', name: 'GCP Security', subs: [] },
                  { id: 'azure', icon: '🔷', name: 'Azure Security', subs: [] },
                ]
              },
            ].map((domain) => {
              const isOpen = expandedDomain === domain.id;
              return (
                <div key={domain.id} className="rounded-xl overflow-hidden border border-[var(--hp-border)] bg-[var(--hp-card-bg)]">
                  {/* Domain row — clickable */}
                  <button
                    type="button"
                    onClick={() => toggleDomain(domain.id)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--hp-primary)]/5 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{domain.icon}</span>
                      <span className="font-bold text-[var(--hp-text)] text-base">{domain.name}</span>
                      <span className="text-[11px] text-[var(--hp-text-muted)] font-mono">{domain.modules.length} modules</span>
                    </div>
                    <span className="text-[var(--hp-primary)] text-lg font-bold transition-transform duration-200" style={{ display: 'inline-block', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>›</span>
                  </button>

                  {/* Modules — shown when domain expanded */}
                  {isOpen && (
                    <div className="border-t border-[var(--hp-border)] divide-y divide-[var(--hp-border)]/50">
                      {domain.modules.map((mod) => {
                        const modOpen = expandedModule === mod.id;
                        return (
                          <div key={mod.id}>
                            {/* Module row */}
                            <button
                              type="button"
                              onClick={() => mod.subs.length > 0 ? toggleModule(mod.id) : undefined}
                              className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${mod.subs.length > 0 ? 'hover:bg-[var(--hp-primary)]/5 cursor-pointer' : 'cursor-default'}`}
                            >
                              <div className="w-4 h-px bg-[var(--hp-border)] shrink-0" />
                              <span className="text-base shrink-0">{mod.icon}</span>
                              <span className="text-sm font-medium text-[var(--hp-text)] flex-1">{mod.name}</span>
                              {mod.subs.length > 0 && (
                                <span className="text-[var(--hp-text-muted)] text-sm transition-transform duration-200" style={{ display: 'inline-block', transform: modOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>›</span>
                              )}
                            </button>

                            {/* Sub-domains — shown when module expanded */}
                            {mod.subs.length > 0 && modOpen && (
                              <div className="pb-2">
                                {mod.subs.map((sub, si) => (
                                  <div key={si} className="flex items-center gap-3 px-8 py-1.5">
                                    <div className="ml-6 w-3 h-px bg-[var(--hp-border)] opacity-50 shrink-0" />
                                    <span className="text-base shrink-0">{sub.icon}</span>
                                    <span className="text-xs text-[var(--hp-text-muted)]">{sub.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #7c3aed, #bf5fff)', boxShadow: '0 0 30px rgba(191,95,255,0.3)' }}>
              Start Hacking — It&apos;s Free
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative z-10 bg-[var(--hp-bg)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--hp-text)] mb-4">How It Works</h2>
            <p className="text-slate-400 text-lg">Your path from novice to expert.</p>
          </div>
          
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-[var(--hp-primary)]/10 via-[#bf5fff]/40 to-[#bf5fff]/10 -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                { step: '01', title: 'Register', desc: 'Create a free account to track your progress.' },
                { step: '02', title: 'Choose Domain', desc: 'Select Red Team, Blue Team, or others.' },
                { step: '03', title: 'Select Level', desc: 'Pick severity appropriate for your XP.' },
                { step: '04', title: 'Hack & Submit', desc: 'Activate lab, get IP, hack, and submit flag.' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--hp-bg)] border-2 border-[#bf5fff] flex items-center justify-center text-2xl font-bold text-[var(--hp-primary)] mb-6 shadow-[0_0_8px_rgba(191,95,255,0.3)]">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-[var(--hp-text)] mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-12 border-t border-[var(--hp-border)] bg-[var(--hp-bg)] relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/hplabs-logo.png" alt="HpLabs Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_10px_var(--hp-primary)]" />
            <span className="text-xl font-bold tracking-tight text-[var(--hp-text)] font-mono">HpLabs</span>
          </div>
          
          <div className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} HpLabs. Built by <a href="https://hackerplus.in" target="_blank" rel="noopener noreferrer" className="text-[var(--hp-primary)] hover:underline">HackerPlus team</a>.
          </div>
        </div>
      </footer>
    </div>
  );
}
