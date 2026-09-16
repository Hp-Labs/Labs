"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  ShieldAlert, ShieldCheck, RefreshCw, ExternalLink, AlertTriangle,
  Clock, Tag, ChevronDown, ChevronUp, Zap, BookOpen,
} from "lucide-react";

interface SecurityEvent {
  id: string;
  type: "new_lab" | "new_vulnerability" | "security_advisory";
  title: string;
  vulnerabilityName: string;
  detectedAt: string;
  severity: string;
  affectedTechnology: string[];
  cwe?: string[];
  cve?: string[];
  cvssScore?: number;
  shortExplanation: string;
  whyItMatters: string;
  hplabsAvailability: "available" | "coming_soon" | "not_applicable";
  hplabsLabId?: string;
  isVerified: boolean;
}

const SEVERITY_STYLES: Record<string, { border: string; badge: string; dot: string }> = {
  critical: { border: "border-red-500/30",   badge: "bg-red-500/15 text-red-400",    dot: "bg-red-500" },
  high:     { border: "border-orange-500/30", badge: "bg-orange-500/15 text-orange-400", dot: "bg-orange-500" },
  medium:   { border: "border-yellow-500/30", badge: "bg-yellow-500/15 text-yellow-400", dot: "bg-yellow-500" },
  low:      { border: "border-blue-500/30",   badge: "bg-blue-500/15 text-blue-400",    dot: "bg-blue-400" },
  info:     { border: "border-slate-500/30",  badge: "bg-slate-500/15 text-slate-400",  dot: "bg-slate-400" },
  information: { border: "border-slate-500/30", badge: "bg-slate-500/15 text-slate-400", dot: "bg-slate-400" },
};

function getSeverityStyle(s: string) {
  return SEVERITY_STYLES[s.toLowerCase()] ?? SEVERITY_STYLES.medium;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch {
    return iso.slice(0, 10);
  }
}

function EventCard({ ev }: { ev: SecurityEvent }) {
  const [expanded, setExpanded] = useState(false);
  const style = getSeverityStyle(ev.severity);
  const isLab = ev.type === "new_lab";

  return (
    <div className={`rounded-xl border ${style.border} bg-[var(--hp-card-bg)] overflow-hidden transition-all duration-200 hover:shadow-[0_0_20px_rgba(191,95,255,0.06)]`}>
      {/* Card header */}
      <div
        className="flex items-start gap-3 p-4 cursor-pointer select-none"
        onClick={() => setExpanded(p => !p)}
        role="button"
        aria-expanded={expanded}
      >
        {/* Severity dot */}
        <div className="mt-1.5 shrink-0">
          <div className={`w-2.5 h-2.5 rounded-full ${style.dot} shadow-[0_0_6px_currentColor]`} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Type badge + severity */}
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono ${isLab ? "bg-[var(--hp-primary)]/15 text-[var(--hp-primary)]" : "bg-amber-500/15 text-amber-400"}`}>
              {isLab ? <Zap size={9} /> : <AlertTriangle size={9} />}
              {isLab ? "New Lab" : "Verified Advisory"}
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono ${style.badge}`}>
              {ev.severity}
            </span>
            {ev.cvssScore !== undefined && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[var(--hp-border)] text-[var(--hp-text-muted)]">
                CVSS {ev.cvssScore.toFixed(1)}
              </span>
            )}
            <span className="flex items-center gap-1 text-[10px] text-[var(--hp-text-muted)] font-mono ml-auto shrink-0">
              <Clock size={9} /> {formatDate(ev.detectedAt)}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-sm font-bold text-[var(--hp-text)] leading-tight mb-1.5 pr-6">
            {ev.vulnerabilityName}
          </h4>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5">
            {ev.affectedTechnology.slice(0, 4).map(t => (
              <span key={t} className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-[var(--hp-border)] text-[var(--hp-text-muted)] font-mono">
                <Tag size={8} /> {t}
              </span>
            ))}
            {ev.affectedTechnology.length > 4 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-[var(--hp-border)] text-[var(--hp-text-muted)] font-mono">
                +{ev.affectedTechnology.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Expand toggle */}
        <div className="text-[var(--hp-text-muted)] shrink-0 mt-1">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-[var(--hp-border)] px-4 pb-4 pt-3 space-y-3">
          {/* Short explanation */}
          <div>
            <p className="text-[10px] font-bold text-[var(--hp-text-muted)] uppercase tracking-wider mb-1 font-mono">What is it?</p>
            <p className="text-xs text-[var(--hp-text)] leading-relaxed">{ev.shortExplanation}</p>
          </div>

          {/* Why it matters */}
          <div>
            <p className="text-[10px] font-bold text-[var(--hp-text-muted)] uppercase tracking-wider mb-1 font-mono">Why it matters</p>
            <p className="text-xs text-[var(--hp-text)] leading-relaxed">{ev.whyItMatters}</p>
          </div>

          {/* CWE / CVE */}
          {((ev.cwe && ev.cwe.length > 0) || (ev.cve && ev.cve.length > 0)) && (
            <div className="flex flex-wrap gap-2">
              {ev.cwe?.map(c => (
                <a key={c} href={`https://cwe.mitre.org/data/definitions/${c.replace(/\D/g, "")}.html`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors">
                  <ExternalLink size={9} /> {c}
                </a>
              ))}
              {ev.cve?.map(c => (
                <a key={c} href={`https://nvd.nist.gov/vuln/detail/${c}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                  <ExternalLink size={9} /> {c}
                </a>
              ))}
            </div>
          )}

          {/* HPLabs availability */}
          <div className="flex items-center justify-between pt-1">
            <div className={`flex items-center gap-1.5 text-[11px] font-mono font-bold ${ev.hplabsAvailability === "available" ? "text-emerald-400" : "text-[var(--hp-text-muted)]"}`}>
              {ev.hplabsAvailability === "available"
                ? <><ShieldCheck size={12} /> Lab Available on HPLabs</>
                : <><Clock size={12} /> Lab Coming Soon</>
              }
            </div>
            {ev.hplabsAvailability === "available" && ev.hplabsLabId && (
              <Link
                href={`/labs/${ev.hplabsLabId}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #7c3aed, #bf5fff)" }}
              >
                <BookOpen size={11} /> Start Lab
              </Link>
            )}
            {ev.hplabsAvailability === "available" && !ev.hplabsLabId && (
              <Link
                href="/labs"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #7c3aed, #bf5fff)" }}
              >
                <BookOpen size={11} /> Browse Labs
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function SecurityMonitor() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const notifiedIds = useRef(new Set<string>());

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/security-monitor");
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      if (data.success) {
        setEvents(data.events);
        setLastUpdated(data.lastUpdated);
        setError(false);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // Refresh every 5 minutes
    const t = setInterval(fetchEvents, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  if (loading) {
    return (
      <section className="py-16 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <ShieldAlert size={22} className="text-[var(--hp-primary)]" />
            <h2 className="text-2xl font-bold text-[var(--hp-text)]">Security Monitor</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-xl border border-[var(--hp-border)] bg-[var(--hp-card-bg)] p-4 animate-pulse">
                <div className="h-3 bg-[var(--hp-border)] rounded w-1/4 mb-2" />
                <div className="h-4 bg-[var(--hp-border)] rounded w-3/4 mb-3" />
                <div className="h-2.5 bg-[var(--hp-border)] rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || events.length === 0) {
    return (
      <section className="py-16 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <ShieldAlert size={22} className="text-[var(--hp-primary)]" />
            <h2 className="text-2xl font-bold text-[var(--hp-text)]">Security Monitor</h2>
          </div>
          <div className="rounded-xl border border-[var(--hp-border)] bg-[var(--hp-card-bg)] p-8 text-center">
            <ShieldCheck size={32} className="text-[var(--hp-text-muted)] mx-auto mb-3 opacity-40" />
            <p className="text-sm text-[var(--hp-text-muted)]">
              {error
                ? "Security feed temporarily unavailable. Check back soon."
                : "No new verified security events right now. All clear!"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 relative z-10" id="security-monitor">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--hp-primary)]/15 flex items-center justify-center">
                <ShieldAlert size={16} className="text-[var(--hp-primary)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--hp-text)]">Security Monitor</h2>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                LIVE
              </span>
            </div>
            <p className="text-sm text-[var(--hp-text-muted)] max-w-lg">
              Genuinely new, independently verified security discoveries and freshly published HPLabs labs.
              Unverified claims are never surfaced here.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-[10px] font-mono text-[var(--hp-text-muted)] flex items-center gap-1">
                <Clock size={9} /> Updated {formatDate(lastUpdated)}
              </span>
            )}
            <button
              onClick={() => { setLoading(true); fetchEvents(); }}
              className="p-1.5 rounded-lg border border-[var(--hp-border)] text-[var(--hp-text-muted)] hover:text-[var(--hp-primary)] hover:border-[var(--hp-primary)] transition-colors"
              title="Refresh"
            >
              <RefreshCw size={13} />
            </button>
          </div>
        </div>

        {/* Event grid */}
        <div className="grid grid-cols-1 gap-3">
          {events.map(ev => (
            <EventCard key={ev.id} ev={ev} />
          ))}
        </div>

        {/* Integrity notice */}
        <div className="mt-6 flex items-start gap-2.5 p-3 rounded-xl border border-[var(--hp-border)] bg-[var(--hp-card-bg)]/50">
          <ShieldCheck size={13} className="text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-[var(--hp-text-muted)] leading-relaxed">
            All security events displayed here have passed HPVuln pipeline verification. Unverified or duplicate
            vulnerability claims are automatically excluded. CWE/CVE links open official MITRE and NVD sources.
          </p>
        </div>
      </div>
    </section>
  );
}
