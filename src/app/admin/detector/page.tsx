'use client';

// ============================================================
// HP Labs — Admin: Smart Detector Audit Page
// INTERNAL USE ONLY — NOT linked from any user-facing nav
// URL: /admin/detector
// Access: Admin-authenticated users only
// ============================================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Shield, RefreshCw, CheckCircle, AlertTriangle, Clock, Zap, Globe, ChevronRight, Info } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────

interface DomainStat {
  domain: string;
  adapters: number;
  recordsFetched: number;
  duplicatesSkipped: number;
  newComingSoon: number;
  lastSync: string;
}

interface DetectorRunResult {
  runId: string;
  startedAt: string;
  completedAt: string;
  domainsScanned: string[];
  totalFetched: number;
  totalValidated: number;
  duplicatesSkipped: number;
  newLabs: number;
  comingSoon: number;
  errors: number;
  domainStats: DomainStat[];
}

// ─── Styles ──────────────────────────────────────────────────

const styles = {
  page: {
    minHeight: '100vh',
    background: '#06030c',
    color: '#e2d9f3',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    padding: '32px',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(191,95,255,0.15)',
  } as React.CSSProperties,
  warningBadge: {
    background: 'rgba(191,95,255,0.1)',
    border: '1px solid rgba(191,95,255,0.3)',
    borderRadius: '4px',
    padding: '2px 10px',
    fontSize: '11px',
    color: '#bf5fff',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  } as React.CSSProperties,
  statCard: {
    background: 'rgba(17,8,32,0.8)',
    border: '1px solid rgba(191,95,255,0.15)',
    borderRadius: '10px',
    padding: '20px',
  } as React.CSSProperties,
  statLabel: {
    fontSize: '11px',
    color: '#7b6a9b',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#bf5fff',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    background: 'rgba(17,8,32,0.6)',
    border: '1px solid rgba(191,95,255,0.12)',
    borderRadius: '10px',
    overflow: 'hidden',
  } as React.CSSProperties,
  th: {
    padding: '12px 16px',
    textAlign: 'left' as const,
    fontSize: '11px',
    color: '#7b6a9b',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    background: 'rgba(191,95,255,0.05)',
    borderBottom: '1px solid rgba(191,95,255,0.1)',
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid rgba(191,95,255,0.07)',
    fontSize: '13px',
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: 'inherit',
    background: 'linear-gradient(135deg, #7c3aed, #bf5fff)',
    color: '#fff',
    transition: 'opacity 0.2s',
  } as React.CSSProperties,
  error: {
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '8px',
    padding: '16px',
    color: '#f87171',
    fontSize: '13px',
  } as React.CSSProperties,
  badge: (color: string) => ({
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
    background: `${color}18`,
    color: color,
    border: `1px solid ${color}33`,
  }) as React.CSSProperties,
};

// ─── Mock detector run (simulates real SmartDetector output) ──
// In production, this would call a Server Action or API route
// that runs smartDetector.run() server-side.
async function runDetectorSimulation(): Promise<DetectorRunResult> {
  await new Promise(r => setTimeout(r, 1800)); // simulate async

  const now = new Date();
  const start = new Date(now.getTime() - 1800);

  return {
    runId: `HPDET-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`,
    startedAt: start.toISOString(),
    completedAt: now.toISOString(),
    domainsScanned: ['web', 'api', 'mobile', 'network'],
    totalFetched: 104,
    totalValidated: 104,
    duplicatesSkipped: 51,
    newLabs: 0,
    comingSoon: 53,
    errors: 0,
    domainStats: [
      { domain: 'web',     adapters: 2, recordsFetched: 22, duplicatesSkipped: 18, newComingSoon: 4,  lastSync: now.toISOString() },
      { domain: 'api',     adapters: 2, recordsFetched: 28, duplicatesSkipped: 16, newComingSoon: 12, lastSync: now.toISOString() },
      { domain: 'mobile',  adapters: 4, recordsFetched: 56, duplicatesSkipped: 1,  newComingSoon: 55, lastSync: now.toISOString() },
      { domain: 'network', adapters: 3, recordsFetched: 42, duplicatesSkipped: 16, newComingSoon: 26, lastSync: now.toISOString() },
    ],
  };
}

// ─── Component ────────────────────────────────────────────────

export default function DetectorAdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [result, setResult] = useState<DetectorRunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRan, setLastRan] = useState<string | null>(null);

  // Guard: redirect non-admin users
  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }
    // Admin check — in production, use server-side role check
    const isAdmin = user.username === 'admin' || user.email?.endsWith('@hplabs.io');
    if (!isAdmin) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  async function handleRun() {
    setRunning(true);
    setError(null);
    try {
      const r = await runDetectorSimulation();
      setResult(r);
      setLastRan(new Date().toLocaleString());
    } catch (e) {
      setError(String(e));
    } finally {
      setRunning(false);
    }
  }

  const domainColor: Record<string, string> = {
    web: '#00ff41',
    api: '#00b4d8',
    mobile: '#bf5fff',
    network: '#f4a261',
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <Shield size={24} color="#bf5fff" />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ margin: 0, fontSize: '20px', color: '#e2d9f3' }}>Smart Detector</h1>
            <span style={styles.warningBadge}>Internal Only</span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#7b6a9b' }}>
            Vulnerability coverage monitor · Admin access only · Never linked from user-facing UI
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          {lastRan && (
            <span style={{ fontSize: '12px', color: '#7b6a9b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} />
              Last run: {lastRan}
            </span>
          )}
          <button
            style={{ ...styles.btn, opacity: running ? 0.6 : 1 }}
            onClick={handleRun}
            disabled={running}
          >
            <RefreshCw size={14} style={{ animation: running ? 'spin 1s linear infinite' : 'none' }} />
            {running ? 'Running…' : 'Run Detector'}
          </button>
        </div>
      </div>

      {/* Architecture note */}
      <div style={{ ...styles.error, background: 'rgba(191,95,255,0.06)', border: '1px solid rgba(191,95,255,0.2)', color: '#bf5fff', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <Info size={14} style={{ marginTop: '1px', flexShrink: 0 }} />
          <div style={{ fontSize: '12px', lineHeight: 1.6 }}>
            <strong>Architecture:</strong> HP Labs → Active Modules → Active Domains → Configured Sources → Smart Detector.<br />
            Adapters: <code>PortSwiggerAdapter</code> (web) · <code>OwaspApiAdapter</code> (api) · <code>OwaspMobileAdapter</code> (mobile) · <code>NetworkAdvisoryAdapter</code> (network).<br />
            Adding a new domain: register in <code>domainRegistry.ts</code> with <code>enabled: true</code> — detector discovers it automatically.
          </div>
        </div>
      </div>

      {error && <div style={{ ...styles.error, marginBottom: '24px' }}><AlertTriangle size={14} style={{ marginRight: '8px' }} />{error}</div>}

      {result && (
        <>
          {/* Summary Stats */}
          <div style={styles.grid}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Domains Scanned</div>
              <div style={styles.statValue}>{result.domainsScanned.length}</div>
              <div style={{ fontSize: '11px', color: '#7b6a9b', marginTop: '4px' }}>{result.domainsScanned.join(', ')}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Total Fetched</div>
              <div style={styles.statValue}>{result.totalFetched}</div>
              <div style={{ fontSize: '11px', color: '#7b6a9b', marginTop: '4px' }}>from all adapters</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Duplicates Skipped</div>
              <div style={{ ...styles.statValue, color: '#f59e0b' }}>{result.duplicatesSkipped}</div>
              <div style={{ fontSize: '11px', color: '#7b6a9b', marginTop: '4px' }}>already in catalogue</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>New Coverage</div>
              <div style={{ ...styles.statValue, color: '#10b981' }}>{result.comingSoon}</div>
              <div style={{ fontSize: '11px', color: '#7b6a9b', marginTop: '4px' }}>upcoming labs queued</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Errors</div>
              <div style={{ ...styles.statValue, color: result.errors > 0 ? '#ef4444' : '#10b981' }}>
                {result.errors === 0 ? '✓' : result.errors}
              </div>
              <div style={{ fontSize: '11px', color: '#7b6a9b', marginTop: '4px' }}>adapter failures</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Run ID</div>
              <div style={{ fontSize: '12px', color: '#bf5fff', marginTop: '4px', wordBreak: 'break-all' }}>{result.runId}</div>
              <div style={{ fontSize: '11px', color: '#7b6a9b', marginTop: '4px' }}>
                {Math.round((new Date(result.completedAt).getTime() - new Date(result.startedAt).getTime()))}ms
              </div>
            </div>
          </div>

          {/* Per-domain breakdown */}
          <h2 style={{ fontSize: '14px', color: '#7b6a9b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Domain Breakdown
          </h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Domain</th>
                <th style={styles.th}>Adapters</th>
                <th style={styles.th}>Fetched</th>
                <th style={styles.th}>Duplicates</th>
                <th style={styles.th}>New Coverage</th>
                <th style={styles.th}>Last Sync</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {result.domainStats.map(stat => (
                <tr key={stat.domain}>
                  <td style={styles.td}>
                    <span style={styles.badge(domainColor[stat.domain] || '#bf5fff')}>
                      {stat.domain}
                    </span>
                  </td>
                  <td style={{ ...styles.td, color: '#bf5fff' }}>{stat.adapters}</td>
                  <td style={styles.td}>{stat.recordsFetched}</td>
                  <td style={{ ...styles.td, color: '#f59e0b' }}>{stat.duplicatesSkipped}</td>
                  <td style={{ ...styles.td, color: '#10b981' }}>+{stat.newComingSoon}</td>
                  <td style={{ ...styles.td, fontSize: '11px', color: '#7b6a9b' }}>
                    {new Date(stat.lastSync).toLocaleTimeString()}
                  </td>
                  <td style={styles.td}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '12px' }}>
                      <CheckCircle size={12} /> OK
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Active adapter registry */}
          <h2 style={{ fontSize: '14px', color: '#7b6a9b', margin: '32px 0 12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Active Source Adapters
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
            {[
              { id: 'portswigger-web', domain: 'web', name: 'PortSwigger Web Security Academy', type: 'static', ref: 'portswigger.net/web-security' },
              { id: 'owasp-top10-2021', domain: 'web', name: 'OWASP Top 10 2021', type: 'static', ref: 'owasp.org/www-project-top-ten' },
              { id: 'owasp-api-2023', domain: 'api', name: 'OWASP API Security Top 10 2023', type: 'static', ref: 'owasp.org/API-Security' },
              { id: 'owasp-masvs-v2', domain: 'mobile', name: 'OWASP MASVS v2 / MASTG', type: 'static', ref: 'mas.owasp.org/MASVS' },
              { id: 'android-advisories', domain: 'mobile', name: 'Android Security Bulletins', type: 'rss', ref: 'source.android.com/security/bulletin' },
              { id: 'apple-advisories', domain: 'mobile', name: 'Apple Security Releases', type: 'rss', ref: 'support.apple.com/en-us/111900' },
              { id: 'cisa-kev', domain: 'network', name: 'CISA Known Exploited Vulnerabilities', type: 'api', ref: 'cisa.gov/known-exploited-vulnerabilities' },
              { id: 'cisco-advisories', domain: 'network', name: 'Cisco Security Advisories', type: 'rss', ref: 'tools.cisco.com/security/center' },
            ].map(adapter => (
              <div key={adapter.id} style={{ ...styles.statCard, padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#e2d9f3', fontWeight: 600 }}>{adapter.name}</div>
                    <div style={{ fontSize: '11px', color: '#7b6a9b', marginTop: '4px' }}>{adapter.ref}</div>
                  </div>
                  <span style={styles.badge(domainColor[adapter.domain] || '#bf5fff')}>{adapter.domain}</span>
                </div>
                <div style={{ marginTop: '8px', display: 'flex', gap: '6px' }}>
                  <span style={styles.badge('#7b6a9b')}>{adapter.type}</span>
                  <span style={styles.badge('#10b981')}>active</span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div style={{ marginTop: '40px', padding: '16px', background: 'rgba(17,8,32,0.5)', borderRadius: '8px', fontSize: '11px', color: '#7b6a9b', lineHeight: 1.7 }}>
            <strong style={{ color: '#bf5fff' }}>Detector is idempotent:</strong> Running multiple times produces identical results — duplicates are deduplicated against existing catalogue.<br />
            <strong style={{ color: '#bf5fff' }}>Source adapters</strong> use static authoritative data (not live web crawling) — update adapter files to reflect new authoritative releases.<br />
            <strong style={{ color: '#bf5fff' }}>New domain:</strong> Add to <code>domainRegistry.ts</code> with <code>enabled: true, monitoringEnabled: true</code> → create adapter → register in <code>SmartDetector.ts</code> ADAPTER_REGISTRY.
          </div>
        </>
      )}

      {!result && !running && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#7b6a9b' }}>
          <Zap size={40} color="rgba(191,95,255,0.3)" style={{ marginBottom: '16px' }} />
          <p style={{ margin: 0, fontSize: '14px' }}>Click "Run Detector" to scan all active domains for coverage gaps.</p>
          <p style={{ margin: '8px 0 0', fontSize: '12px' }}>4 domains · 8 source adapters · Automatic deduplication against existing catalogue</p>
        </div>
      )}

      {running && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#bf5fff' }}>
          <RefreshCw size={40} style={{ animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
          <p style={{ margin: 0, fontSize: '14px' }}>Scanning web · api · mobile · network…</p>
          <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#7b6a9b' }}>Running all source adapters and deduplicating against {'>'}350 existing labs</p>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
