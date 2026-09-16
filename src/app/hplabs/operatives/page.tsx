'use client';

// ============================================================
// HP Labs  Admin: Partner Student Import
// URL: /hp-45641c95fa7157d2/partner-students
// INTERNAL USE ONLY  Not linked from any user-facing nav
// Guard: admin username or @hplabs.io email
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import {
  Shield, Upload, Users, CheckCircle, AlertTriangle,
  Trash2, RefreshCw, FileSpreadsheet, Info, Search,
  Settings, Plus, Edit2, Save, X
} from 'lucide-react';

interface PartnerStudent {
  id: string;
  studentId: string;
  email: string;
  course: string;
  duration: string;
  parsedCourseDurationMonths: number;
  entitledPremiumMonths: number;
  matchedRuleLabel: string | null;
  importedAt: string;
  batch: string;
  redeemed: boolean;
  redeemedAt?: string;
}

interface EntitlementRule {
  id: string;
  label: string;
  minCourseDurationMonths: number;
  premiumMonthsAwarded: number;
  createdAt: string;
  updatedAt: string;
}

//  Style tokens (matches admin/detector dark theme) 
const C = {
  bg: '#06030c',
  bg2: 'rgba(17,8,32,0.85)',
  border: 'rgba(191,95,255,0.15)',
  borderHover: 'rgba(191,95,255,0.4)',
  text: '#e2d9f3',
  muted: '#7b6a9b',
  accent: '#bf5fff',
  green: '#00ff41',
  red: '#f87171',
  yellow: '#fbbf24',
  blue: '#60a5fa',
};

export default function PartnerStudentImportPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();


  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [students, setStudents] = useState<PartnerStudent[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [listLoading, setListLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Rules state
  const [rules, setRules] = useState<EntitlementRule[]>([]);
  const [rulesLoading, setRulesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'import' | 'rules'>('import');
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<EntitlementRule>>({});
  const [newRuleForm, setNewRuleForm] = useState({ label: '', minCourseDurationMonths: '', premiumMonthsAwarded: '' });
  const [ruleSaving, setRuleSaving] = useState(false);
  const [ruleMsg, setRuleMsg] = useState<{ ok: boolean; text: string } | null>(null);


  //  Admin guard 
  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/login'); return; }
    const isAdmin = user.username === 'admin' || user.email?.endsWith('@hplabs.io');
    if (!isAdmin) router.replace('/dashboard');
  }, [user, isLoading, router]);

  //  Load list 
  const loadStudents = useCallback(async (p = page) => {
    if (!user) return;
    setListLoading(true);
    try {
      const res = await fetch(`/api/admin/partner-students?page=${p}&pageSize=20`, {});
      const data = await res.json();
      if (data.success) {
        setStudents(data.items);
        setTotal(data.total);
        setPage(p);
      }
    } finally {
      setListLoading(false);
    }
  }, [user, page]);

  useEffect(() => {
    if (user) loadStudents(1);
  }, [user]);  // eslint-disable-line

  //  File drop/select 
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  //  Import 
  const handleImport = async () => {
    if (!file || !user) return;
    setImporting(true);
    setImportResult(null);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch('/api/admin/partner-students', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      setImportResult(data);
      if (data.success) {
        setFile(null);
        loadStudents(1);
      }
    } catch {
      setImportResult({ success: false, message: 'Network error during upload.' });
    } finally {
      setImporting(false);
    }
  };

  //  Delete 
  const handleDelete = async (id: string) => {
    if (!user) return;
    setDeleteId(id);
    try {
      await fetch(`/api/admin/partner-students/${id}`, {
        method: 'DELETE',
      });
      loadStudents(page);
    } finally {
      setDeleteId(null);
    }
  };

  const filteredStudents = search.trim()
    ? students.filter(s =>
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.studentId.toLowerCase().includes(search.toLowerCase()) ||
        s.course.toLowerCase().includes(search.toLowerCase())
      )
    : students;

  //  Rules CRUD 
  const loadRules = useCallback(async () => {
    if (!user) return;
    setRulesLoading(true);
    try {
      const res = await fetch('/api/admin/partner-entitlement-rules', {  });
      const data = await res.json();
      if (data.success) setRules(data.rules);
    } finally {
      setRulesLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) loadRules();
  }, [user]); // eslint-disable-line

  const handleCreateRule = async () => {
    if (!user || ruleSaving) return;
    setRuleSaving(true); setRuleMsg(null);
    try {
      const res = await fetch('/api/admin/partner-entitlement-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: newRuleForm.label,
          minCourseDurationMonths: Number(newRuleForm.minCourseDurationMonths),
          premiumMonthsAwarded: Number(newRuleForm.premiumMonthsAwarded),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRuleMsg({ ok: true, text: 'Rule created.' });
        setNewRuleForm({ label: '', minCourseDurationMonths: '', premiumMonthsAwarded: '' });
        loadRules();
      } else {
        setRuleMsg({ ok: false, text: data.message });
      }
    } catch { setRuleMsg({ ok: false, text: 'Network error.' }); }
    finally { setRuleSaving(false); }
  };

  const handleUpdateRule = async () => {
    if (!user || !editingRuleId || ruleSaving) return;
    setRuleSaving(true); setRuleMsg(null);
    try {
      const res = await fetch('/api/admin/partner-entitlement-rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingRuleId, ...editForm }),
      });
      const data = await res.json();
      if (data.success) {
        setRuleMsg({ ok: true, text: 'Rule updated.' });
        setEditingRuleId(null); setEditForm({});
        loadRules();
      } else {
        setRuleMsg({ ok: false, text: data.message });
      }
    } catch { setRuleMsg({ ok: false, text: 'Network error.' }); }
    finally { setRuleSaving(false); }
  };

  const handleDeleteRule = async (id: string) => {
    if (!user) return;
    try {
      await fetch(`/api/admin/partner-entitlement-rules?id=${id}`, {
        method: 'DELETE',
      });
      loadRules();
    } catch {}
  };

  const isAdmin = user?.username === 'admin' || user?.email?.endsWith('@hplabs.io');
  if (!isAdmin && !isLoading) return null;


  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'JetBrains Mono', monospace", padding: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingBottom: '16px', borderBottom: `1px solid ${C.border}` }}>
        <Shield size={24} color={C.accent} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ margin: 0, fontSize: '20px', color: C.text }}>Partner Student Import</h1>
            <span style={{ background: `${C.accent}18`, border: `1px solid ${C.accent}44`, borderRadius: '4px', padding: '2px 10px', fontSize: '11px', color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Internal Only
            </span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: C.muted }}>
            Upload approved partner institution CSV/XLSX  Creates individual eligibility records  Admin access only
          </p>
        </div>
      </div>

      {/* Info banner */}
      <div style={{ background: `${C.accent}08`, border: `1px solid ${C.accent}22`, borderRadius: '8px', padding: '14px 16px', marginBottom: '28px', fontSize: '12px', color: C.muted, display: 'flex', gap: '10px' }}>
        <Info size={14} style={{ flexShrink: 0, marginTop: '2px', color: C.accent }} />
        <div style={{ lineHeight: 1.7 }}>
          <strong style={{ color: C.text }}>Required CSV columns:</strong> <code style={{ color: C.accent }}>Student ID / Roll Number</code>, <code style={{ color: C.accent }}>Email</code>, <code style={{ color: C.accent }}>Course</code>, <code style={{ color: C.accent }}>Duration</code>.
          {' '}Column names are case-insensitive and spaces/underscores are ignored. Both <strong style={{ color: C.text }}>.csv</strong> and <strong style={{ color: C.text }}>.xlsx</strong> are supported.
          Duplicate emails are automatically skipped.
        </div>
      </div>

      {/* Tab navigation */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: `1px solid ${C.border}`, paddingBottom: '0' }}>
        {([
          { id: 'import', label: 'Import Students', icon: <Upload size={13} /> },
          { id: 'rules',  label: 'Entitlement Rules', icon: <Settings size={13} /> },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: '12px', fontWeight: 600,
              borderBottom: `2px solid ${activeTab === tab.id ? C.accent : 'transparent'}`,
              background: 'transparent',
              color: activeTab === tab.id ? C.accent : C.muted,
              transition: 'all 0.15s',
              marginBottom: '-1px',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/*  IMPORT TAB  */}
      {activeTab === 'import' && (
      <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Upload panel */}
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '14px', color: C.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Upload size={16} color={C.accent} /> Upload File
          </h2>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            style={{
              border: `2px dashed ${dragOver ? C.accent : C.border}`,
              borderRadius: '10px',
              padding: '36px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragOver ? `${C.accent}08` : 'transparent',
              transition: 'all 0.2s',
              marginBottom: '16px',
            }}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <FileSpreadsheet size={32} color={file ? C.green : C.muted} style={{ marginBottom: '12px' }} />
            {file ? (
              <div>
                <div style={{ color: C.green, fontWeight: 600, marginBottom: '4px' }}>{file.name}</div>
                <div style={{ color: C.muted, fontSize: '12px' }}>{(file.size / 1024).toFixed(1)} KB</div>
              </div>
            ) : (
              <div>
                <div style={{ color: C.text, marginBottom: '4px' }}>Drop CSV or XLSX here</div>
                <div style={{ color: C.muted, fontSize: '12px' }}>or click to browse</div>
              </div>
            )}
            <input id="file-input" type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }} onChange={handleFileSelect} />
          </div>

          <button
            disabled={!file || importing}
            onClick={handleImport}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px', border: 'none', cursor: file && !importing ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit', fontSize: '13px', fontWeight: 600,
              background: file && !importing ? `linear-gradient(135deg, #7c3aed, ${C.accent})` : `${C.accent}22`,
              color: file && !importing ? '#fff' : C.muted,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            {importing
              ? <><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Importing</>
              : <><Upload size={14} /> Import Students</>
            }
          </button>
        </div>

        {/* Result panel */}
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '14px', color: C.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={16} color={C.accent} /> Import Result
          </h2>
          {!importResult ? (
            <div style={{ color: C.muted, fontSize: '13px', paddingTop: '8px' }}>
              No import run yet. Upload a file and click Import.
            </div>
          ) : importResult.success ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {[
                  { label: 'Imported', value: importResult.imported, color: C.green },
                  { label: 'Skipped (dupe)', value: importResult.skipped, color: C.yellow },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: `${color}10`, border: `1px solid ${color}30`, borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 700, color }}>{value}</div>
                    <div style={{ fontSize: '11px', color: C.muted, marginTop: '4px' }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ color: C.green, fontSize: '13px', marginBottom: '10px' }}> {importResult.message}</div>
              {importResult.duplicates?.length > 0 && (
                <div style={{ fontSize: '11px', color: C.muted }}>
                  <strong style={{ color: C.yellow }}>Skipped emails:</strong>
                  <div style={{ maxHeight: '80px', overflowY: 'auto', marginTop: '4px' }}>
                    {importResult.duplicates.map((e: string) => <div key={e}>{e}</div>)}
                  </div>
                </div>
              )}
              {importResult.validationErrors?.length > 0 && (
                <div style={{ marginTop: '10px', fontSize: '11px', color: C.yellow }}>
                  <strong>Row warnings:</strong>
                  <div style={{ maxHeight: '80px', overflowY: 'auto', marginTop: '4px' }}>
                    {importResult.validationErrors.map((e: string, i: number) => <div key={i}>{e}</div>)}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ color: C.red, fontSize: '13px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={14} /> {importResult.message}
              </div>
              {importResult.errors?.map((e: string, i: number) => (
                <div key={i} style={{ fontSize: '11px', color: C.muted, borderBottom: `1px solid ${C.border}`, paddingBottom: '4px', marginBottom: '4px' }}>{e}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Student list */}
      <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ margin: 0, fontSize: '14px', color: C.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} color={C.accent} /> Imported Students
            <span style={{ background: `${C.accent}18`, border: `1px solid ${C.accent}33`, borderRadius: '12px', padding: '1px 10px', fontSize: '11px', color: C.accent }}>{total}</span>
          </h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
              <input
                type="text"
                placeholder="Search email / ID / course"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  background: '#0a0415', border: `1px solid ${C.border}`, borderRadius: '6px', padding: '7px 10px 7px 30px',
                  color: C.text, fontSize: '12px', fontFamily: 'inherit', outline: 'none', width: '240px'
                }}
              />
            </div>
            <button onClick={() => loadStudents(1)} style={{ background: `${C.accent}18`, border: `1px solid ${C.border}`, borderRadius: '6px', padding: '7px 12px', color: C.accent, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontFamily: 'inherit' }}>
              <RefreshCw size={12} /> Refresh
            </button>
          </div>
        </div>

        {listLoading ? (
          <div style={{ textAlign: 'center', color: C.muted, padding: '40px', fontSize: '13px' }}>Loading</div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ textAlign: 'center', color: C.muted, padding: '40px', fontSize: '13px' }}>
            {total === 0 ? 'No students imported yet.' : 'No results match your search.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Student ID', 'Email', 'Course', 'Duration (parsed)', 'Premium Entitlement', 'Rule Matched', 'Imported At', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', background: `${C.accent}06`, borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, i) => (
                  <tr key={s.id} style={{ background: i % 2 === 0 ? 'transparent' : `${C.accent}04` }}>
                    <td style={{ padding: '10px 12px', fontSize: '12px', borderBottom: `1px solid ${C.border}`, fontFamily: 'monospace', color: C.accent }}>{s.studentId}</td>
                    <td style={{ padding: '10px 12px', fontSize: '12px', borderBottom: `1px solid ${C.border}` }}>{s.email}</td>
                    <td style={{ padding: '10px 12px', fontSize: '12px', borderBottom: `1px solid ${C.border}` }}>{s.course}</td>
                    <td style={{ padding: '10px 12px', fontSize: '12px', borderBottom: `1px solid ${C.border}`, color: C.muted }}>
                      {s.duration}
                      {s.parsedCourseDurationMonths > 0 && (
                        <span style={{ marginLeft: '6px', color: C.blue, fontSize: '10px' }}>({s.parsedCourseDurationMonths}mo)</span>
                      )}
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: '12px', borderBottom: `1px solid ${C.border}` }}>
                      {s.entitledPremiumMonths > 0
                        ? <span style={{ color: C.green, fontWeight: 700 }}>{s.entitledPremiumMonths} months</span>
                        : <span style={{ color: C.muted, fontSize: '11px' }}>None</span>
                      }
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: '11px', borderBottom: `1px solid ${C.border}`, color: C.muted, maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={s.matchedRuleLabel ?? ''}>
                      {s.matchedRuleLabel ?? ''}
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: '11px', borderBottom: `1px solid ${C.border}`, color: C.muted, whiteSpace: 'nowrap' }}>{new Date(s.importedAt).toLocaleDateString()}</td>
                    <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}` }}>
                      {s.redeemed
                        ? <span style={{ background: `${C.yellow}18`, color: C.yellow, border: `1px solid ${C.yellow}30`, borderRadius: '4px', padding: '2px 8px', fontSize: '10px', fontWeight: 600 }}>REDEEMED</span>
                        : <span style={{ background: `${C.green}18`, color: C.green, border: `1px solid ${C.green}30`, borderRadius: '4px', padding: '2px 8px', fontSize: '10px', fontWeight: 600 }}>ELIGIBLE</span>
                      }
                    </td>
                    <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}` }}>
                      <button
                        onClick={() => { if (confirm(`Delete record for ${s.email}?`)) handleDelete(s.id); }}
                        disabled={deleteId === s.id}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.muted, padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
                        title="Delete record"
                      >
                        {deleteId === s.id ? <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={13} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {total > 20 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
                {Array.from({ length: Math.ceil(total / 20) }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => loadStudents(p)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: `1px solid ${page === p ? C.accent : C.border}`, background: page === p ? `${C.accent}20` : 'transparent', color: page === p ? C.accent : C.muted, cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      </>
      )} {/* end import tab */}

      {/*  RULES TAB  */}
      {activeTab === 'rules' && (
        <div>
          {/* Info */}
          <div style={{ background: `${C.blue}08`, border: `1px solid ${C.blue}22`, borderRadius: '8px', padding: '14px 16px', marginBottom: '24px', fontSize: '12px', color: C.muted, display: 'flex', gap: '10px' }}>
            <Info size={14} style={{ flexShrink: 0, marginTop: '2px', color: C.blue }} />
            <div style={{ lineHeight: 1.7 }}>
              <strong style={{ color: C.text }}>How matching works:</strong> When a student is imported, the server parses their course duration and finds the rule with the highest
              {' '}<code style={{ color: C.blue }}>Min Course Duration</code> that is  their parsed duration. That rule's
              {' '}<code style={{ color: C.blue }}>Premium Months Awarded</code> is stored permanently on the student record.
              Rules only affect <em>future</em> imports  existing records are not retroactively changed.
            </div>
          </div>

          {/* Feedback message */}
          {ruleMsg && (
            <div style={{ background: ruleMsg.ok ? `${C.green}10` : `${C.red}10`, border: `1px solid ${ruleMsg.ok ? C.green : C.red}30`, borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '12px', color: ruleMsg.ok ? C.green : C.red, display: 'flex', gap: '8px', alignItems: 'center' }}>
              {ruleMsg.ok ? <CheckCircle size={13} /> : <AlertTriangle size={13} />} {ruleMsg.text}
            </div>
          )}

          {/* Create new rule */}
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '13px', color: C.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={14} color={C.accent} /> Add New Rule
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
              <div>
                <div style={{ fontSize: '10px', color: C.muted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Rule Label</div>
                <input
                  type="text"
                  placeholder='e.g. "6-month course track"'
                  value={newRuleForm.label}
                  onChange={e => setNewRuleForm(f => ({ ...f, label: e.target.value }))}
                  style={{ width: '100%', background: '#0a0415', border: `1px solid ${C.border}`, borderRadius: '6px', padding: '8px 10px', color: C.text, fontSize: '12px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <div style={{ fontSize: '10px', color: C.muted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Min Course (months)</div>
                <input
                  type="number"
                  min={1}
                  placeholder="e.g. 6"
                  value={newRuleForm.minCourseDurationMonths}
                  onChange={e => setNewRuleForm(f => ({ ...f, minCourseDurationMonths: e.target.value }))}
                  style={{ width: '100%', background: '#0a0415', border: `1px solid ${C.border}`, borderRadius: '6px', padding: '8px 10px', color: C.text, fontSize: '12px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <div style={{ fontSize: '10px', color: C.muted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Premium Awarded (months)</div>
                <input
                  type="number"
                  min={1}
                  placeholder="e.g. 8"
                  value={newRuleForm.premiumMonthsAwarded}
                  onChange={e => setNewRuleForm(f => ({ ...f, premiumMonthsAwarded: e.target.value }))}
                  style={{ width: '100%', background: '#0a0415', border: `1px solid ${C.border}`, borderRadius: '6px', padding: '8px 10px', color: C.text, fontSize: '12px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <button
                onClick={handleCreateRule}
                disabled={ruleSaving || !newRuleForm.label || !newRuleForm.minCourseDurationMonths || !newRuleForm.premiumMonthsAwarded}
                style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', fontWeight: 600, background: `linear-gradient(135deg, #7c3aed, ${C.accent})`, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', opacity: ruleSaving ? 0.6 : 1, whiteSpace: 'nowrap' }}
              >
                <Plus size={13} /> Add Rule
              </button>
            </div>
          </div>

          {/* Rules table */}
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '13px', color: C.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={14} color={C.accent} /> Active Rules
                <span style={{ background: `${C.accent}18`, border: `1px solid ${C.accent}33`, borderRadius: '12px', padding: '1px 10px', fontSize: '11px', color: C.accent }}>{rules.length}</span>
              </h3>
              <button onClick={loadRules} style={{ background: `${C.accent}18`, border: `1px solid ${C.border}`, borderRadius: '6px', padding: '6px 12px', color: C.accent, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'inherit' }}>
                <RefreshCw size={11} /> Refresh
              </button>
            </div>

            {rulesLoading ? (
              <div style={{ textAlign: 'center', color: C.muted, padding: '32px', fontSize: '13px' }}>Loading</div>
            ) : rules.length === 0 ? (
              <div style={{ textAlign: 'center', color: C.muted, padding: '32px', fontSize: '13px' }}>No rules configured. Add one above.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Label', 'Min Course Duration', 'Premium Months Awarded', 'Last Updated', ''].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', background: `${C.accent}06`, borderBottom: `1px solid ${C.border}` }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rules.map((rule, i) => {
                    const isEditing = editingRuleId === rule.id;
                    return (
                      <tr key={rule.id} style={{ background: i % 2 === 0 ? 'transparent' : `${C.accent}04` }}>
                        <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}`, fontSize: '12px' }}>
                          {isEditing
                            ? <input value={editForm.label ?? rule.label} onChange={e => setEditForm(f => ({ ...f, label: e.target.value }))} style={{ background: '#0a0415', border: `1px solid ${C.accent}`, borderRadius: '4px', padding: '4px 8px', color: C.text, fontSize: '12px', fontFamily: 'inherit', width: '100%' }} />
                            : rule.label}
                        </td>
                        <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}`, fontSize: '12px' }}>
                          {isEditing
                            ? <input type="number" min={1} value={editForm.minCourseDurationMonths ?? rule.minCourseDurationMonths} onChange={e => setEditForm(f => ({ ...f, minCourseDurationMonths: Number(e.target.value) }))} style={{ background: '#0a0415', border: `1px solid ${C.accent}`, borderRadius: '4px', padding: '4px 8px', color: C.text, fontSize: '12px', fontFamily: 'inherit', width: '80px' }} />
                            : <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ color: C.blue, fontWeight: 600 }}> {rule.minCourseDurationMonths}</span> <span style={{ color: C.muted }}>months</span></span>}
                        </td>
                        <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}`, fontSize: '12px' }}>
                          {isEditing
                            ? <input type="number" min={1} value={editForm.premiumMonthsAwarded ?? rule.premiumMonthsAwarded} onChange={e => setEditForm(f => ({ ...f, premiumMonthsAwarded: Number(e.target.value) }))} style={{ background: '#0a0415', border: `1px solid ${C.accent}`, borderRadius: '4px', padding: '4px 8px', color: C.text, fontSize: '12px', fontFamily: 'inherit', width: '80px' }} />
                            : <span style={{ color: C.green, fontWeight: 700 }}>{rule.premiumMonthsAwarded} months</span>}
                        </td>
                        <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}`, fontSize: '11px', color: C.muted }}>
                          {new Date(rule.updatedAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}` }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {isEditing ? (
                              <>
                                <button onClick={handleUpdateRule} disabled={ruleSaving} style={{ background: `${C.green}20`, border: `1px solid ${C.green}40`, borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: C.green, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontFamily: 'inherit' }}>
                                  <Save size={11} /> Save
                                </button>
                                <button onClick={() => { setEditingRuleId(null); setEditForm({}); }} style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: C.muted, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontFamily: 'inherit' }}>
                                  <X size={11} /> Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => { setEditingRuleId(rule.id); setEditForm({ label: rule.label, minCourseDurationMonths: rule.minCourseDurationMonths, premiumMonthsAwarded: rule.premiumMonthsAwarded }); setRuleMsg(null); }} style={{ background: `${C.blue}15`, border: `1px solid ${C.blue}30`, borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: C.blue, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontFamily: 'inherit' }}>
                                  <Edit2 size={11} /> Edit
                                </button>
                                <button onClick={() => { if (confirm(`Delete rule "${rule.label}"?`)) handleDeleteRule(rule.id); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.muted, padding: '4px', display: 'flex', alignItems: 'center' }} title="Delete rule">
                                  <Trash2 size={13} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )} {/* end rules tab */}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
