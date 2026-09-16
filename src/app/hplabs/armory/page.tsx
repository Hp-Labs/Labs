'use client';

// ============================================================
// HP Labs  Admin: Vulnerability Intelligence Pipeline
// URL: /hp-45641c95fa7157d2/vuln-pipeline
// INTERNAL USE ONLY  Not linked from user-facing nav
// Guard: admin username or @hplabs.io email
//
// Three tabs:
//   1. Pipeline Board  all items organised by stage
//   2. Item Editor     detail view + stage advancement + lab draft
//   3. Published       read-only list of pipeline-published labs
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import {
  RefreshCw, AlertTriangle, CheckCircle,
  Plus, Trash2, ArrowRight, BookOpen, Zap, Globe, Info,
  Edit2, Save
} from 'lucide-react';


//  Types 

type PipelineStage =
  | 'Detected' | 'Verified' | 'Classified' | 'Lab Candidate'
  | 'Lab Generation' | 'Validation' | 'Admin Review' | 'Published';

const ALL_STAGES: PipelineStage[] = [
  'Detected', 'Verified', 'Classified', 'Lab Candidate',
  'Lab Generation', 'Validation', 'Admin Review', 'Published',
];

interface LabDraft {
  name?: string;
  shortName?: string;
  description?: string;
  history?: string;
  firstDiscoveredYear?: number;
  domain?: string;
  severity?: string;
  owaspMapping?: string[];
  mitreMapping?: string[];
  osiLayer?: string[];
  impact?: string;
  realWorldExample?: string;
  methodology?: { step: number; title: string; description: string; command?: string; hint?: string }[];
  recommendedTools?: string[];
  xpReward?: number;
  timeLimitMinutes?: number;
  tags?: string[];
}

export interface LabSpecification {
  vulnerability: string;
  vulnerabilityClass: string;
  affectedTechnology: string;
  applicationType: string;
  difficulty: string;
  learningObjective: string;
  intendedChallenge: string;
  requiredApplicationFunctionality: string;
  syntheticDataRequirements: string;
  flagRequirement: string;
  hintStructure: string;
  validationRequirements: string;
  references: string[];
}

interface PipelineItem {
  id: string;
  stage: PipelineStage;
  source: 'hpvuln_webhook' | 'admin_manual';
  receivedAt: string;
  updatedAt: string;
  rawTitle: string;
  rawDescription: string;
  cve: string[];
  cwe: string[];
  cvssScore?: number;
  affectedProducts?: string[];
  hpvulnFeedId?: string;
  domain?: string;
  severity?: string;
  tags?: string[];
  isDuplicate: boolean;
  duplicateReason?: string;
  dedupWarnings?: string[];
  labDraft?: LabDraft;
  labSpec?: LabSpecification;
  adminNotes?: string;
  validationNotes?: string;
  reviewedBy?: string;
  approvedAt?: string;
  publishedLabId?: string;
}

//  Style tokens 

const C = {
  bg: '#06030c', bg2: 'rgba(17,8,32,0.85)',
  border: 'rgba(191,95,255,0.15)', borderHover: 'rgba(191,95,255,0.4)',
  text: '#e2d9f3', muted: '#7b6a9b', accent: '#bf5fff',
  green: '#00ff41', red: '#f87171', yellow: '#fbbf24', blue: '#60a5fa',
  orange: '#fb923c',
};

const STAGE_COLOR: Record<PipelineStage, string> = {
  'Detected':       '#60a5fa',
  'Verified':       '#34d399',
  'Classified':     '#a78bfa',
  'Lab Candidate':  '#fbbf24',
  'Lab Generation': '#f97316',
  'Validation':     '#f43f5e',
  'Admin Review':   '#bf5fff',
  'Published':      '#00ff41',
};

const SEV_COLOR: Record<string, string> = {
  information: '#60a5fa', low: '#4ade80', medium: '#fbbf24',
  high: '#fb923c', critical: '#f87171',
};

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span style={{
      background: `${color}18`, border: `1px solid ${color}44`,
      borderRadius: '4px', padding: '1px 8px', fontSize: '10px',
      color, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const,
      whiteSpace: 'nowrap' as const,
    }}>{text}</span>
  );
}

//  Main Component 

export default function VulnPipelinePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'board' | 'editor' | 'published'>('board');
  const [items, setItems] = useState<PipelineItem[]>([]);
  const [stageCounts, setStageCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [publishedLabs, setPublishedLabs] = useState<any[]>([]);

  // New item form
  const [showNewForm, setShowNewForm] = useState(false);
  const [newForm, setNewForm] = useState({ rawTitle: '', rawDescription: '', cve: '', cwe: '', cvssScore: '', domain: '', severity: '' });
  const [newFormSaving, setNewFormSaving] = useState(false);
  const [newFormMsg, setNewFormMsg] = useState<{ ok: boolean; text: string } | null>(null);

  //  Admin guard 
  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/login'); return; }
    const isAdmin = user.username === 'admin' || user.email?.endsWith('@hplabs.io');
    if (!isAdmin) router.replace('/dashboard');
  }, [user, isLoading, router]);

  //  Load pipeline 
  const loadItems = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/vuln-pipeline', {  });
      const data = await res.json();
      if (data.success) {
        setItems(data.items);
        setStageCounts(data.stageCounts ?? {});
      }
    } finally { setLoading(false); }
  }, [user]);

  useEffect(() => { if (user) loadItems(); }, [user]); // eslint-disable-line

  //  Load published labs (from sync API) 
  const loadPublished = useCallback(async () => {
    try {
      const res = await fetch('/api/vulnerabilities/sync');
      const data = await res.json();
      if (data.success) {
        const pipLabs = (data.syncSummary?.pipelinePublishedCount !== undefined)
          ? [] // placeholder
          : [];
        setPublishedLabs(pipLabs);
      }
      // Separate call for pipeline-published specifically
      const res2 = await fetch('/api/admin/vuln-pipeline?stage=Published', {  });
      const data2 = await res2.json();
      if (data2.success) setPublishedLabs(data2.items);
    } catch {}
  }, [user]);

  useEffect(() => { if (user && activeTab === 'published') loadPublished(); }, [user, activeTab]); // eslint-disable-line

  //  Create new item 
  const handleCreateItem = async () => {
    if (!user || newFormSaving) return;
    if (!newForm.rawTitle.trim()) { setNewFormMsg({ ok: false, text: 'Title is required.' }); return; }
    setNewFormSaving(true); setNewFormMsg(null);
    try {
      const res = await fetch('/api/admin/vuln-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawTitle:       newForm.rawTitle.trim(),
          rawDescription: newForm.rawDescription.trim(),
          cve:  newForm.cve.split(',').map(s => s.trim()).filter(Boolean),
          cwe:  newForm.cwe.split(',').map(s => s.trim()).filter(Boolean),
          cvssScore: newForm.cvssScore ? Number(newForm.cvssScore) : undefined,
          domain:   newForm.domain   || undefined,
          severity: newForm.severity || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewFormMsg({ ok: true, text: `Created: ${data.item.id} (${data.item.isDuplicate ? ' duplicate flagged' : 'clean'})` });
        setNewForm({ rawTitle: '', rawDescription: '', cve: '', cwe: '', cvssScore: '', domain: '', severity: '' });
        setShowNewForm(false);
        loadItems();
      } else { setNewFormMsg({ ok: false, text: data.message }); }
    } catch { setNewFormMsg({ ok: false, text: 'Network error.' }); }
    finally { setNewFormSaving(false); }
  };

  const selectedItem = items.find(i => i.id === selectedId) ?? null;
  const isAdmin = user?.username === 'admin' || user?.email?.endsWith('@hplabs.io');
  if (!isAdmin && !isLoading) return null;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'JetBrains Mono', monospace", padding: '32px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', paddingBottom: '16px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Zap size={24} color={C.accent} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '20px', color: C.text }}>Vulnerability Intelligence Pipeline</h1>
              <Badge text="Internal Only" color={C.accent} />
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: C.muted }}>
              HPVuln  HPLabs lab generation lifecycle  8 stages  Admin-gated publish
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={loadItems} style={{ background: `${C.accent}18`, border: `1px solid ${C.border}`, borderRadius: '6px', padding: '7px 12px', color: C.accent, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'inherit' }}>
            <RefreshCw size={11} /> Refresh
          </button>
          <button onClick={() => { setShowNewForm(f => !f); setNewFormMsg(null); }} style={{ background: `linear-gradient(135deg, #7c3aed, ${C.accent})`, border: 'none', borderRadius: '6px', padding: '7px 14px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'inherit', fontWeight: 600 }}>
            <Plus size={11} /> New Entry
          </button>
        </div>
      </div>

      {/* New entry form */}
      {showNewForm && (
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '13px', color: C.text }}>Manual Entry  New Vulnerability Finding</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            {[
              { key: 'rawTitle',       label: 'Title *',           placeholder: 'e.g. "Prototype Pollution in lodash"' },
              { key: 'rawDescription', label: 'Description',       placeholder: 'Brief description...' },
              { key: 'cve',            label: 'CVEs (comma-sep)',   placeholder: 'CVE-2024-1234' },
              { key: 'cwe',            label: 'CWEs (comma-sep)',   placeholder: 'CWE-79, CWE-89' },
              { key: 'cvssScore',      label: 'CVSS Score',        placeholder: '7.5' },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize: '10px', color: C.muted, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{f.label}</div>
                <input
                  type="text"
                  placeholder={f.placeholder}
                  value={(newForm as any)[f.key]}
                  onChange={e => setNewForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: '100%', background: '#0a0415', border: `1px solid ${C.border}`, borderRadius: '6px', padding: '8px 10px', color: C.text, fontSize: '12px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '10px', alignItems: 'end' }}>
            <div>
              <div style={{ fontSize: '10px', color: C.muted, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Domain</div>
              <select value={newForm.domain} onChange={e => setNewForm(p => ({ ...p, domain: e.target.value }))} style={{ width: '100%', background: '#0a0415', border: `1px solid ${C.border}`, borderRadius: '6px', padding: '8px 10px', color: C.text, fontSize: '12px', fontFamily: 'inherit', outline: 'none' }}>
                <option value=""> select </option>
                {['web','api','network','cloud','mobile','active-directory','wireless','iot','ot-ics','kubernetes','container'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: C.muted, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Severity</div>
              <select value={newForm.severity} onChange={e => setNewForm(p => ({ ...p, severity: e.target.value }))} style={{ width: '100%', background: '#0a0415', border: `1px solid ${C.border}`, borderRadius: '6px', padding: '8px 10px', color: C.text, fontSize: '12px', fontFamily: 'inherit', outline: 'none' }}>
                <option value=""> select </option>
                {['information','low','medium','high','critical'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button onClick={handleCreateItem} disabled={newFormSaving} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: `linear-gradient(135deg, #7c3aed, ${C.accent})`, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' as const }}>
              <Plus size={12} /> Create
            </button>
            <button onClick={() => setShowNewForm(false)} style={{ padding: '8px 12px', borderRadius: '6px', border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px' }}>
              Cancel
            </button>
          </div>
          {newFormMsg && (
            <div style={{ marginTop: '10px', padding: '8px 12px', borderRadius: '6px', background: newFormMsg.ok ? `${C.green}10` : `${C.red}10`, border: `1px solid ${newFormMsg.ok ? C.green : C.red}30`, fontSize: '12px', color: newFormMsg.ok ? C.green : C.red, display: 'flex', gap: '6px', alignItems: 'center' }}>
              {newFormMsg.ok ? <CheckCircle size={12} /> : <AlertTriangle size={12} />} {newFormMsg.text}
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: `1px solid ${C.border}` }}>
        {([
          { id: 'board',     label: 'Pipeline Board',  icon: <Globe size={12} /> },
          { id: 'editor',    label: selectedItem ? `Editing: ${selectedItem.id}` : 'Item Editor', icon: <Edit2 size={12} /> },
          { id: 'published', label: 'Published Labs',  icon: <BookOpen size={12} /> },
        ] as const).map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', fontWeight: 600, borderBottom: `2px solid ${activeTab === tab.id ? C.accent : 'transparent'}`, background: 'transparent', color: activeTab === tab.id ? C.accent : C.muted, marginBottom: '-1px', transition: 'all 0.15s' }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/*  BOARD TAB  */}
      {activeTab === 'board' && (
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', color: C.muted, padding: '48px' }}>Loading</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {ALL_STAGES.filter(s => s !== 'Published').map(stage => {
                const stageItems = items.filter(i => i.stage === stage);
                return (
                  <div key={stage} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: STAGE_COLOR[stage], textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stage}</span>
                      <span style={{ background: `${STAGE_COLOR[stage]}20`, border: `1px solid ${STAGE_COLOR[stage]}44`, borderRadius: '10px', padding: '0 8px', fontSize: '11px', color: STAGE_COLOR[stage] }}>{stageItems.length}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {stageItems.length === 0 && (
                        <div style={{ textAlign: 'center', color: C.muted, fontSize: '11px', padding: '16px 0', opacity: 0.5 }}>Empty</div>
                      )}
                      {stageItems.map(item => (
                        <div
                          key={item.id}
                          onClick={() => { setSelectedId(item.id); setActiveTab('editor'); }}
                          style={{ background: '#0a0415', border: `1px solid ${item.isDuplicate ? C.red : C.border}`, borderRadius: '8px', padding: '10px', cursor: 'pointer', transition: 'border-color 0.15s' }}
                        >
                          <div style={{ fontSize: '11px', color: C.text, marginBottom: '6px', fontWeight: 600, lineHeight: 1.4 }}>{item.rawTitle}</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
                            {item.severity && <Badge text={item.severity} color={SEV_COLOR[item.severity] ?? C.muted} />}
                            {item.domain && <Badge text={item.domain} color={C.blue} />}
                            {item.isDuplicate && <Badge text="DUPE" color={C.red} />}
                          </div>
                          <div style={{ fontSize: '10px', color: C.muted }}>
                            {item.source === 'hpvuln_webhook' ? ' HPVuln' : ' Manual'}  {new Date(item.receivedAt).toLocaleDateString()}
                          </div>
                          {item.cve.length > 0 && (
                            <div style={{ fontSize: '10px', color: C.muted, marginTop: '2px' }}>{item.cve.slice(0, 2).join(', ')}{item.cve.length > 2 ? ` +${item.cve.length - 2}` : ''}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {/* Published column */}
              <div style={{ background: C.bg2, border: `1px solid ${C.green}22`, borderRadius: '10px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: C.green, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Published</span>
                  <span style={{ background: `${C.green}20`, border: `1px solid ${C.green}44`, borderRadius: '10px', padding: '0 8px', fontSize: '11px', color: C.green }}>{stageCounts['Published'] ?? 0}</span>
                </div>
                <div style={{ textAlign: 'center', color: C.muted, fontSize: '11px', padding: '8px 0' }}>
                  <button onClick={() => setActiveTab('published')} style={{ background: 'transparent', border: `1px solid ${C.green}30`, borderRadius: '6px', padding: '6px 12px', color: C.green, cursor: 'pointer', fontFamily: 'inherit', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', margin: '0 auto' }}>
                    <BookOpen size={11} /> View all
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/*  EDITOR TAB  */}
      {activeTab === 'editor' && (
        <ItemEditor
          item={selectedItem}
          user={user}
          onRefresh={loadItems}
          onSelectItem={setSelectedId}
          items={items}
        />
      )}

      {/*  PUBLISHED TAB  */}
      {activeTab === 'published' && (
        <div>
          {publishedLabs.length === 0 ? (
            <div style={{ textAlign: 'center', color: C.muted, padding: '48px', fontSize: '13px' }}>
              No pipeline-published labs yet. Approve items at Admin Review stage to publish them.
            </div>
          ) : (
            <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Pipeline ID', 'Title', 'Domain', 'Severity', 'CVEs', 'Approved At', 'Approved By'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', background: `${C.accent}06`, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {publishedLabs.map((item: PipelineItem, i) => (
                    <tr key={item.id} style={{ background: i % 2 === 0 ? 'transparent' : `${C.accent}04` }}>
                      <td style={{ padding: '10px 12px', fontSize: '11px', borderBottom: `1px solid ${C.border}`, fontFamily: 'monospace', color: C.accent }}>{item.id}</td>
                      <td style={{ padding: '10px 12px', fontSize: '12px', borderBottom: `1px solid ${C.border}` }}>{item.rawTitle}</td>
                      <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}` }}>{item.domain ? <Badge text={item.domain} color={C.blue} /> : ''}</td>
                      <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}` }}>{item.severity ? <Badge text={item.severity} color={SEV_COLOR[item.severity] ?? C.muted} /> : ''}</td>
                      <td style={{ padding: '10px 12px', fontSize: '11px', borderBottom: `1px solid ${C.border}`, color: C.muted }}>{item.cve?.join(', ') || ''}</td>
                      <td style={{ padding: '10px 12px', fontSize: '11px', borderBottom: `1px solid ${C.border}`, color: C.muted }}>{item.approvedAt ? new Date(item.approvedAt).toLocaleDateString() : ''}</td>
                      <td style={{ padding: '10px 12px', fontSize: '11px', borderBottom: `1px solid ${C.border}`, color: C.muted }}>{item.reviewedBy ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

//  Item Editor Sub-component 

function ItemEditor({ item, user, onRefresh, onSelectItem, items }: {
  item: PipelineItem | null;
  user: any;
  onRefresh: () => void;
  onSelectItem: (id: string) => void;
  items: PipelineItem[];
}) {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Editable fields
  const [domain, setDomain]     = useState('');
  const [severity, setSeverity] = useState('');
  const [tags, setTags]         = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [validationNotes, setValidationNotes] = useState('');
  const [overrideNote, setOverrideNote] = useState('');
  const [labSpecStr, setLabSpecStr] = useState('');


  // Lab draft fields
  const [draftName,        setDraftName]        = useState('');
  const [draftShortName,   setDraftShortName]   = useState('');
  const [draftDesc,        setDraftDesc]        = useState('');
  const [draftHistory,     setDraftHistory]     = useState('');
  const [draftYear,        setDraftYear]        = useState('');
  const [draftImpact,      setDraftImpact]      = useState('');
  const [draftRWE,         setDraftRWE]         = useState('');
  const [draftOwasp,       setDraftOwasp]       = useState('');
  const [draftMitre,       setDraftMitre]       = useState('');
  const [draftTools,       setDraftTools]       = useState('');
  const [draftXP,          setDraftXP]          = useState('');
  const [draftTime,        setDraftTime]        = useState('');
  const [draftMethodology, setDraftMethodology] = useState('');
  const [draftOsiLayer,    setDraftOsiLayer]    = useState('');

  useEffect(() => {
    if (!item) return;
    setDomain(item.domain ?? '');
    setSeverity(item.severity ?? '');
    setTags((item.tags ?? []).join(', '));
    setAdminNotes(item.adminNotes ?? '');
    setValidationNotes(item.validationNotes ?? '');
    setLabSpecStr(item.labSpec ? JSON.stringify(item.labSpec, null, 2) : '');
    setOverrideNote('');
    setMsg(null);
    const d = item.labDraft ?? {};
    setDraftName(d.name ?? item.rawTitle ?? '');
    setDraftShortName(d.shortName ?? '');
    setDraftDesc(d.description ?? item.rawDescription ?? '');
    setDraftHistory(d.history ?? '');
    setDraftYear(String(d.firstDiscoveredYear ?? new Date().getFullYear()));
    setDraftImpact(d.impact ?? '');
    setDraftRWE(d.realWorldExample ?? '');
    setDraftOwasp((d.owaspMapping ?? []).join('\n'));
    setDraftMitre((d.mitreMapping ?? []).join('\n'));
    setDraftTools((d.recommendedTools ?? []).join(', '));
    setDraftXP(String(d.xpReward ?? ''));
    setDraftTime(String(d.timeLimitMinutes ?? ''));
    setDraftMethodology(JSON.stringify(d.methodology ?? [], null, 2));
    setDraftOsiLayer((d.osiLayer ?? []).join('\n'));
  }, [item?.id]); // eslint-disable-line

  if (!item) {
    return (
      <div>
        <p style={{ color: C.muted, marginBottom: '16px', fontSize: '13px' }}>Select an item from the Pipeline Board to edit it.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {items.filter(i => i.stage !== 'Published').map(i => (
            <button key={i.id} onClick={() => onSelectItem(i.id)} style={{ background: C.bg2, border: `1px solid ${i.isDuplicate ? C.red : C.border}`, borderRadius: '8px', padding: '10px 14px', color: C.text, cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: STAGE_COLOR[i.stage], fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: '100px' }}>{i.stage}</span>
              <span>{i.rawTitle}</span>
              {i.isDuplicate && <Badge text="DUPE" color={C.red} />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const currentStageIdx = ALL_STAGES.indexOf(item.stage);
  const nextStage = currentStageIdx < ALL_STAGES.length - 1 ? ALL_STAGES[currentStageIdx + 1] : null;
  const canPublish = item.stage === 'Admin Review';

  async function patch(body: object) {
    setSaving(true); setMsg(null);
    try {
      const res = await fetch(`/api/admin/vuln-pipeline/${item!.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) { setMsg({ ok: true, text: 'Saved.' }); onRefresh(); }
      else { setMsg({ ok: false, text: data.message }); }
    } catch { setMsg({ ok: false, text: 'Network error.' }); }
    finally { setSaving(false); }
  }

  function buildLabDraft(): object {
    let methodology: any[] = [];
    try { methodology = JSON.parse(draftMethodology); } catch {}
    return {
      name:               draftName,
      shortName:          draftShortName || draftName,
      description:        draftDesc,
      history:            draftHistory,
      firstDiscoveredYear: Number(draftYear) || new Date().getFullYear(),
      impact:             draftImpact,
      realWorldExample:   draftRWE,
      owaspMapping:       draftOwasp.split('\n').map(s => s.trim()).filter(Boolean),
      mitreMapping:       draftMitre.split('\n').map(s => s.trim()).filter(Boolean),
      osiLayer:           draftOsiLayer.split('\n').map(s => s.trim()).filter(Boolean),
      recommendedTools:   draftTools.split(',').map(s => s.trim()).filter(Boolean),
      xpReward:           Number(draftXP) || 50,
      timeLimitMinutes:   Number(draftTime) || 30,
      domain,
      severity,
      tags:               tags.split(',').map(s => s.trim()).filter(Boolean),
      methodology,
    };
  }

  return (
    <div>
      {/* Item header */}
      <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: C.muted }}>{item.id}</span>
            <Badge text={item.stage} color={STAGE_COLOR[item.stage]} />
            {item.severity && <Badge text={item.severity} color={SEV_COLOR[item.severity] ?? C.muted} />}
            {item.domain && <Badge text={item.domain} color={C.blue} />}
            {item.isDuplicate && <Badge text=" DUPLICATE" color={C.red} />}
            <span style={{ fontSize: '10px', color: C.muted }}>{item.source === 'hpvuln_webhook' ? ' HPVuln Webhook' : ' Admin Manual'}</span>
          </div>
          <h2 style={{ margin: 0, fontSize: '16px', color: C.text }}>{item.rawTitle}</h2>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: C.muted, lineHeight: 1.6 }}>{item.rawDescription}</p>
          {item.cve.length > 0 && <p style={{ margin: '4px 0 0', fontSize: '11px', color: C.yellow }}>CVEs: {item.cve.join(', ')}</p>}
          {item.cwe.length > 0 && <p style={{ margin: '2px 0 0', fontSize: '11px', color: C.muted }}>CWEs: {item.cwe.join(', ')}</p>}
          {item.cvssScore !== undefined && <p style={{ margin: '2px 0 0', fontSize: '11px', color: C.orange }}>CVSS: {item.cvssScore}</p>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '160px' }}>
          <div style={{ fontSize: '10px', color: C.muted }}>Received: {new Date(item.receivedAt).toLocaleString()}</div>
          <div style={{ fontSize: '10px', color: C.muted }}>Updated: {new Date(item.updatedAt).toLocaleString()}</div>
        </div>
      </div>

      {/* Duplicate warning */}
      {item.isDuplicate && (
        <div style={{ background: `${C.red}08`, border: `1px solid ${C.red}30`, borderRadius: '8px', padding: '14px 16px', marginBottom: '16px', fontSize: '12px', color: C.red }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px' }}>
            <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
            <strong>Duplicate Detected:</strong>
          </div>
          <p style={{ margin: '0 0 10px', color: C.text, lineHeight: 1.6 }}>{item.duplicateReason}</p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input type="text" placeholder="Override reason (required)" value={overrideNote} onChange={e => setOverrideNote(e.target.value)} style={{ flex: 1, background: '#0a0415', border: `1px solid ${C.border}`, borderRadius: '6px', padding: '7px 10px', color: C.text, fontSize: '12px', fontFamily: 'inherit', outline: 'none' }} />
            <button onClick={() => patch({ action: 'override_duplicate', reviewedBy: user?.username ?? 'admin', note: overrideNote })} disabled={!overrideNote.trim() || saving} style={{ background: `${C.yellow}22`, border: `1px solid ${C.yellow}44`, borderRadius: '6px', padding: '7px 14px', color: C.yellow, cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', whiteSpace: 'nowrap' as const }}>
              Override Duplicate
            </button>
          </div>
        </div>
      )}

      {/* Dedup warnings */}
      {(item.dedupWarnings ?? []).length > 0 && (
        <div style={{ background: `${C.yellow}08`, border: `1px solid ${C.yellow}22`, borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '12px', color: C.yellow }}>
          <Info size={12} style={{ marginRight: '6px' }} />
          {item.dedupWarnings!.map((w, i) => <div key={i}>{w}</div>)}
        </div>
      )}

      {/* Feedback message */}
      {msg && (
        <div style={{ background: msg.ok ? `${C.green}10` : `${C.red}10`, border: `1px solid ${msg.ok ? C.green : C.red}30`, borderRadius: '6px', padding: '8px 12px', marginBottom: '14px', fontSize: '12px', color: msg.ok ? C.green : C.red, display: 'flex', gap: '6px', alignItems: 'center' }}>
          {msg.ok ? <CheckCircle size={12} /> : <AlertTriangle size={12} />} {msg.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Left: Classification + Stage */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Classification */}
          <Section title="Classification">
            <Field label="Domain">
              <select value={domain} onChange={e => setDomain(e.target.value)} style={selectStyle}>
                <option value=""> not set </option>
                {['web','api','network','cloud','mobile','active-directory','wireless','iot','ot-ics','kubernetes','container'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Severity">
              <select value={severity} onChange={e => setSeverity(e.target.value)} style={selectStyle}>
                <option value=""> not set </option>
                {['information','low','medium','high','critical'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Tags (comma-separated)">
              <input type="text" value={tags} onChange={e => setTags(e.target.value)} style={inputStyle} placeholder="e.g. injection, auth-bypass" />
            </Field>
            <Field label="Admin Notes">
              <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' as const }} placeholder="Internal notes" />
            </Field>
            {currentStageIdx >= ALL_STAGES.indexOf('Validation') && (
              <Field label="Validation Notes (Required before publish)">
                <textarea value={validationNotes} onChange={e => setValidationNotes(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' as const }} placeholder="Confirm isolated environment validation..." />
              </Field>
            )}
            <button onClick={() => patch({ action: 'update', domain: domain || undefined, severity: severity || undefined, tags: tags.split(',').map(s => s.trim()).filter(Boolean), adminNotes, validationNotes, labSpec: labSpecStr ? JSON.parse(labSpecStr) : undefined, labDraft: buildLabDraft() })} disabled={saving} style={saveButtonStyle}>
              <Save size={12} /> Save Classification &amp; Draft
            </button>
          </Section>

          {/* Stage advancement */}
          <Section title="Lifecycle Stages">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
              {ALL_STAGES.map((s, i) => {
                const done = i < currentStageIdx;
                const active = s === item.stage;
                const future = i > currentStageIdx;
                return (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: future ? 0.4 : 1 }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: active ? STAGE_COLOR[s] : done ? '#4ade80' : '#333', flexShrink: 0 }} />
                    <span style={{ fontSize: '11px', color: active ? STAGE_COLOR[s] : done ? '#4ade80' : C.muted, fontWeight: active ? 700 : 400 }}>{s}</span>
                    {active && <Badge text="Current" color={STAGE_COLOR[s]} />}
                  </div>
                );
              })}
            </div>
            {nextStage && nextStage !== 'Published' && !item.isDuplicate && (
              <button onClick={() => patch({ action: 'advance', targetStage: nextStage, adminNotes, validationNotes, reviewedBy: user?.username ?? 'admin', domain: domain || undefined, severity: severity || undefined, tags: tags.split(',').map(s => s.trim()).filter(Boolean), labSpec: labSpecStr ? JSON.parse(labSpecStr) : undefined, labDraft: buildLabDraft() })} disabled={saving} style={{ ...saveButtonStyle, background: `${STAGE_COLOR[nextStage]}22`, border: `1px solid ${STAGE_COLOR[nextStage]}55`, color: STAGE_COLOR[nextStage] }}>
                <ArrowRight size={12} /> Advance to "{nextStage}"
              </button>
            )}
            {canPublish && (
              <button onClick={() => { if (confirm('Publish this lab? It will become live immediately.')) patch({ action: 'publish', approvedBy: user?.username ?? 'admin' }); }} disabled={saving} style={{ ...saveButtonStyle, background: `${C.green}22`, border: `1px solid ${C.green}55`, color: C.green, marginTop: '6px' }}>
                <CheckCircle size={12} />  Approve &amp; Publish Lab
              </button>
            )}
            {item.stage !== 'Published' && (
              <button onClick={() => { if (confirm(`Delete pipeline item ${item.id}?`)) fetch(`/api/admin/vuln-pipeline/${item.id}`, { method: 'DELETE' }).then(() => onRefresh()); }} style={{ ...saveButtonStyle, background: `${C.red}10`, border: `1px solid ${C.red}30`, color: C.red, marginTop: '4px' }}>
                <Trash2 size={12} /> Delete Item
              </button>
            )}
          </Section>
          
          {/* Lab Specification Generation */}
          {currentStageIdx >= ALL_STAGES.indexOf('Lab Generation') && (
            <Section title="Smart Lab Specification">
              {!labSpecStr ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p style={{ fontSize: '12px', color: C.muted }}>Generate a structured specification for isolated environment validation.</p>
                  <button onClick={() => patch({ action: 'generate_spec' })} disabled={saving} style={{ ...saveButtonStyle, background: `${C.blue}22`, border: `1px solid ${C.blue}55`, color: C.blue }}>
                    <Zap size={12} /> Generate Smart Lab Spec
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Field label="Specification (JSON)">
                    <textarea value={labSpecStr} onChange={e => setLabSpecStr(e.target.value)} rows={15} style={{ ...inputStyle, resize: 'vertical' as const, fontFamily: 'monospace', fontSize: '11px', whiteSpace: 'pre' }} />
                  </Field>
                  <button onClick={() => patch({ action: 'update', labSpec: JSON.parse(labSpecStr) })} disabled={saving} style={saveButtonStyle}>
                    <Save size={12} /> Update Spec
                  </button>
                </div>
              )}
            </Section>
          )}
        </div>

        {/* Right: Lab Draft */}
        <Section title={`Lab Draft ${item.stage === 'Published' ? '(Published  read only)' : ''}`}>
          <Field label="Lab Name *"><input type="text" value={draftName} onChange={e => setDraftName(e.target.value)} style={inputStyle} /></Field>
          <Field label="Short Name"><input type="text" value={draftShortName} onChange={e => setDraftShortName(e.target.value)} style={inputStyle} /></Field>
          <Field label="Description"><textarea value={draftDesc} onChange={e => setDraftDesc(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' as const }} /></Field>
          <Field label="History"><textarea value={draftHistory} onChange={e => setDraftHistory(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' as const }} /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <Field label="First Discovered Year"><input type="number" value={draftYear} onChange={e => setDraftYear(e.target.value)} style={inputStyle} /></Field>
            <Field label="CVSS Score"><input type="text" value={String(item.cvssScore ?? '')} readOnly style={{ ...inputStyle, opacity: 0.6 }} /></Field>
          </div>
          <Field label="Impact"><textarea value={draftImpact} onChange={e => setDraftImpact(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' as const }} /></Field>
          <Field label="Real World Example"><textarea value={draftRWE} onChange={e => setDraftRWE(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' as const }} /></Field>
          <Field label="OWASP Mapping (one per line)"><textarea value={draftOwasp} onChange={e => setDraftOwasp(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' as const }} placeholder="A03:2021 - Injection" /></Field>
          <Field label="MITRE Mapping (one per line)"><textarea value={draftMitre} onChange={e => setDraftMitre(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' as const }} placeholder="T1190 - Exploit Public-Facing Application" /></Field>
          <Field label="OSI Layer (one per line)"><textarea value={draftOsiLayer} onChange={e => setDraftOsiLayer(e.target.value)} rows={1} style={{ ...inputStyle, resize: 'vertical' as const }} placeholder="Application Layer (L7)" /></Field>
          <Field label="Recommended Tools (comma-sep)"><input type="text" value={draftTools} onChange={e => setDraftTools(e.target.value)} style={inputStyle} placeholder="Burp Suite, sqlmap" /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <Field label="XP Reward"><input type="number" value={draftXP} onChange={e => setDraftXP(e.target.value)} style={inputStyle} /></Field>
            <Field label="Time Limit (minutes)"><input type="number" value={draftTime} onChange={e => setDraftTime(e.target.value)} style={inputStyle} /></Field>
          </div>
          <Field label="Methodology Steps (JSON array)">
            <textarea value={draftMethodology} onChange={e => setDraftMethodology(e.target.value)} rows={6} style={{ ...inputStyle, resize: 'vertical' as const, fontFamily: 'monospace', fontSize: '11px' }} placeholder={'[\n  { "step": 1, "title": "...", "description": "...", "command": "..." }\n]'} />
          </Field>
        </Section>
      </div>
    </div>
  );
}

//  Shared layout helpers 

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'rgba(17,8,32,0.85)', border: '1px solid rgba(191,95,255,0.15)', borderRadius: '12px', padding: '18px' }}>
      <h3 style={{ margin: '0 0 14px', fontSize: '12px', color: '#e2d9f3', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: '10px', color: '#7b6a9b', marginBottom: '5px', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{label}</div>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: '#0a0415', border: '1px solid rgba(191,95,255,0.15)',
  borderRadius: '6px', padding: '8px 10px', color: '#e2d9f3', fontSize: '12px',
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle, cursor: 'pointer',
};

const saveButtonStyle: React.CSSProperties = {
  width: '100%', padding: '9px', borderRadius: '6px', border: 'none',
  background: 'linear-gradient(135deg, #7c3aed, #bf5fff)', color: '#fff',
  cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', fontWeight: 600,
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
};


