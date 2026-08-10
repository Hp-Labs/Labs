"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Square,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Terminal,
  Shield,
  Zap,
  AlertTriangle,
  Info,
  Clock,
  Copy,
  Send,
  RefreshCw,
  Lock,
  Wifi,
  WifiOff,
  Flag,
  BookOpen,
  Target,
  DollarSign,
  Eye,
  EyeOff,
} from "lucide-react";
import { VULNERABILITIES } from "@/lib/data/vulnerabilities";
import Navbar from "@/components/Navbar";

type TabType = "info" | "lab" | "steps" | "tools";

export default function LabPage() {
  const params = useParams();
  const labId = params?.id as string;

  const vuln = VULNERABILITIES.find((v) => v.id === labId);

  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [labActive, setLabActive] = useState(false);
  const [labIp, setLabIp] = useState<string | null>(null);
  const [labTimer, setLabTimer] = useState(0); // seconds remaining
  const [activating, setActivating] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);
  const [pingLoading, setPingLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());
  const [flagInput, setFlagInput] = useState("");
  const [flagResult, setFlagResult] = useState<"correct" | "wrong" | null>(null);
  const [flagSubmitting, setFlagSubmitting] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Timer countdown
  useEffect(() => {
    if (!labActive || labTimer <= 0) return;
    const interval = setInterval(() => {
      setLabTimer((t) => {
        if (t <= 1) {
          setLabActive(false);
          setLabIp(null);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [labActive, labTimer]);

  if (!vuln) {
    return (
      <div className="min-h-screen bg-[var(--hp-bg)] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="font-mono text-[var(--hp-text-muted)]">Lab not found</p>
          <Link href="/labs" className="text-[var(--hp-primary)] text-sm mt-3 block hover:opacity-80">
            ← Back to Labs
          </Link>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleActivate = () => {
    setActivating(true);
    setTimeout(() => {
      // Simulate IP generation — in production this calls backend API
      const ip = `10.13.${Math.floor(Math.random() * 200) + 10}.${Math.floor(Math.random() * 200) + 10}`;
      setLabIp(ip);
      setLabActive(true);
      setLabTimer(4 * 3600); // 4 hours
      setActivating(false);
    }, 2000);
  };

  const handleDeactivate = () => {
    setLabActive(false);
    setLabIp(null);
    setLabTimer(0);
    setPingResult(null);
  };

  const handlePing = () => {
    if (!labIp) return;
    setPingLoading(true);
    setTimeout(() => {
      setPingResult(
        `PING ${labIp} (${labIp}): 56 data bytes\n64 bytes from ${labIp}: icmp_seq=0 ttl=64 time=12.3 ms\n64 bytes from ${labIp}: icmp_seq=1 ttl=64 time=11.8 ms\n64 bytes from ${labIp}: icmp_seq=2 ttl=64 time=12.1 ms\n--- ${labIp} ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss`
      );
      setPingLoading(false);
    }, 1500);
  };

  const handleCopyCmd = (cmd: string) => {
    const actualCmd = cmd.replace(/<TARGET_IP>/g, labIp || "TARGET_IP").replace(/<YOUR_IP>/g, "YOUR_IP");
    navigator.clipboard.writeText(actualCmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleFlagSubmit = () => {
    setFlagSubmitting(true);
    setTimeout(() => {
      const normalized = flagInput.trim().toUpperCase();
      const expected = vuln.flagFormat.toUpperCase();
      if (normalized === expected || normalized.startsWith("FLAG{")) {
        setFlagResult("correct");
      } else {
        setFlagResult("wrong");
      }
      setFlagSubmitting(false);
    }, 800);
  };

  const toggleHint = (stepIndex: number) => {
    setRevealedHints((prev) => {
      const next = new Set(prev);
      if (next.has(stepIndex)) next.delete(stepIndex);
      else next.add(stepIndex);
      return next;
    });
  };

  const TABS: { key: TabType; label: string; icon: React.ElementType }[] = [
    { key: "info", label: "Vulnerability Info", icon: BookOpen },
    { key: "lab", label: "Lab Console", icon: Terminal },
    { key: "steps", label: "Steps & Hints", icon: ChevronRight },
    { key: "tools", label: "Tools", icon: Target },
  ];

  const difficultyColor =
    vuln.difficulty === "Beginner"
      ? "text-green-400 border-green-400/30 bg-green-400/5"
      : vuln.difficulty === "Easy"
      ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/5"
      : vuln.difficulty === "Medium"
      ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/5"
      : vuln.difficulty === "Hard"
      ? "text-orange-400 border-orange-400/30 bg-orange-400/5"
      : "text-red-400 border-red-400/30 bg-red-400/5";

  return (
    <div className="min-h-screen bg-[var(--hp-bg)]">
      <Navbar />

      <div className="pt-20 max-w-7xl mx-auto px-4 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 py-5 text-xs text-[var(--hp-text-muted)]">
          <Link href="/labs" className="hover:text-[var(--hp-primary)] transition-colors flex items-center gap-1">
            <ArrowLeft size={12} />
            Labs
          </Link>
          <ChevronRight size={12} />
          <span className="text-[var(--hp-text-muted)]">Level {vuln.level}</span>
          <ChevronRight size={12} />
          <span className="text-[var(--hp-text)]">{vuln.shortName}</span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Main content */}
          <div className="xl:col-span-2 space-y-5">
            {/* Lab Header */}
            <div className="lab-card rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--hp-primary)] bg-[var(--hp-primary)]">
                      <span className="font-mono text-xs text-[var(--hp-primary)]">LVL {vuln.level}</span>
                    </div>
                    <span className="font-mono text-xs text-[#00e5ff]">{vuln.year}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        vuln.status === "new" ? "badge-new" : "badge-active"
                      }`}
                    >
                      {vuln.status.toUpperCase()}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${difficultyColor}`}>
                      {vuln.difficulty.toUpperCase()}
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold text-[var(--hp-text)] mb-1">{vuln.shortName}</h1>
                  <p className="text-sm text-[var(--hp-text-muted)] font-mono">{vuln.id}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--hp-primary)] border border-[var(--hp-primary)]">
                    <Zap size={14} className="text-[var(--hp-primary)]" />
                    <span className="font-mono text-sm font-bold text-[var(--hp-primary)]">{vuln.xpReward} XP</span>
                  </div>
                  {vuln.cvss && (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono ${
                      vuln.cvss >= 9 ? "border-red-400/30 text-red-400 bg-red-400/5"
                      : vuln.cvss >= 7 ? "border-orange-400/30 text-orange-400 bg-orange-400/5"
                      : "border-yellow-400/30 text-yellow-400 bg-yellow-400/5"
                    }`}>
                      CVSS {vuln.cvss}
                    </div>
                  )}
                  {vuln.cve && (
                    <span className="text-[10px] font-mono text-[var(--hp-text-muted)]">{vuln.cve}</span>
                  )}
                </div>
              </div>

              {/* Category tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {vuln.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[var(--hp-text-muted)] border border-white/5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="lab-card rounded-2xl overflow-hidden">
              {/* Tab headers */}
              <div className="flex border-b border-[var(--hp-primary)]">
                {TABS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                      activeTab === key
                        ? "border-[#bf5fff] text-[var(--hp-primary)] bg-[var(--hp-primary)]"
                        : "border-transparent text-[var(--hp-text-muted)] hover:text-[var(--hp-text-muted)]"
                    }`}
                  >
                    <Icon size={12} />
                    {label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* INFO TAB */}
                {activeTab === "info" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-mono text-[var(--hp-primary)] uppercase mb-3">
                        What is {vuln.shortName}?
                      </h3>
                      <p className="text-sm text-[var(--hp-text-muted)] leading-relaxed">{vuln.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-xl p-4 bg-[rgba(255,45,45,0.05)] border border-[rgba(255,45,45,0.15)]">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle size={14} className="text-red-400" />
                          <span className="text-xs font-mono text-red-400 uppercase">Impact</span>
                        </div>
                        <p className="text-xs text-[var(--hp-text-muted)] leading-relaxed">{vuln.impact}</p>
                      </div>

                      <div className="rounded-xl p-4 bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.15)]">
                        <div className="flex items-center gap-2 mb-2">
                          <Info size={14} className="text-[#00e5ff]" />
                          <span className="text-xs font-mono text-[#00e5ff] uppercase">Real World</span>
                        </div>
                        <p className="text-xs text-[var(--hp-text-muted)] leading-relaxed">{vuln.realWorldExample}</p>
                      </div>
                    </div>

                    {vuln.loss && (
                      <div className="rounded-xl p-4 bg-[rgba(255,107,0,0.05)] border border-[rgba(255,107,0,0.15)]">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign size={14} className="text-orange-400" />
                          <span className="text-xs font-mono text-orange-400 uppercase">Financial Impact</span>
                        </div>
                        <p className="text-xs text-[var(--hp-text-muted)]">{vuln.loss}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* LAB CONSOLE TAB */}
                {activeTab === "lab" && (
                  <div className="space-y-5">
                    {!labActive ? (
                      <div className="text-center py-10">
                        <div className="w-16 h-16 rounded-full border-2 border-[var(--hp-primary)] bg-[var(--hp-primary)] flex items-center justify-center mx-auto mb-4">
                          <WifiOff size={24} className="text-[var(--hp-text-muted)]" />
                        </div>
                        <h3 className="font-semibold text-[var(--hp-text)] mb-2">Lab Not Active</h3>
                        <p className="text-xs text-[var(--hp-text-muted)] mb-6 max-w-sm mx-auto">
                          Click "Activate Lab" to spawn a real vulnerable IP. Connect from your own Parrot/Kali/Ubuntu Linux.
                        </p>
                        <button
                          onClick={handleActivate}
                          disabled={activating}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-primary font-medium text-sm disabled:opacity-50"
                        >
                          {activating ? (
                            <>
                              <RefreshCw size={15} className="animate-spin" />
                              Spawning Lab...
                            </>
                          ) : (
                            <>
                              <Play size={15} />
                              Activate Lab
                            </>
                          )}
                        </button>
                        <p className="text-[10px] text-gray-600 mt-3 font-mono">Lab auto-expires in 4 hours</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Active lab status */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--hp-primary)] border border-[var(--hp-primary)]">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-3 h-3 rounded-full bg-[var(--hp-primary)]" />
                              <div className="absolute inset-0 w-3 h-3 rounded-full bg-[var(--hp-primary)] notif-ping" />
                            </div>
                            <div>
                              <div className="text-xs font-mono text-[var(--hp-primary)] font-bold">LAB ACTIVE</div>
                              <div className="text-[10px] text-[var(--hp-text-muted)] font-mono">Expires in {formatTime(labTimer)}</div>
                            </div>
                          </div>
                          <button
                            onClick={handleDeactivate}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg btn-danger text-xs"
                          >
                            <Square size={12} />
                            Stop Lab
                          </button>
                        </div>

                        {/* IP Display */}
                        <div className="rounded-xl border border-[var(--hp-primary)] bg-[#0a0a0f] overflow-hidden">
                          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--hp-primary)] bg-[var(--hp-primary)]">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[var(--hp-primary)]/60" />
                            <span className="ml-2 font-mono text-xs text-[var(--hp-text-muted)]">Target IP</span>
                          </div>
                          <div className="p-4 flex items-center justify-between">
                            <div>
                              <div className="text-[10px] font-mono text-[var(--hp-text-muted)] mb-1">TARGET IP ADDRESS</div>
                              <div className="font-mono text-lg font-bold text-[var(--hp-primary)] glow-green-text">
                                {labIp}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(labIp!);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.1)] bg-white/5 text-xs text-[var(--hp-text-muted)] hover:text-[var(--hp-text)] transition-all"
                              >
                                <Copy size={11} />
                                Copy IP
                              </button>
                              <button
                                onClick={handlePing}
                                disabled={pingLoading}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg btn-primary text-xs"
                              >
                                {pingLoading ? (
                                  <RefreshCw size={11} className="animate-spin" />
                                ) : (
                                  <Wifi size={11} />
                                )}
                                Ping
                              </button>
                            </div>
                          </div>

                          {/* Ping output */}
                          {pingResult && (
                            <div className="border-t border-[var(--hp-primary)] p-4">
                              <div className="font-mono text-[11px] text-green-400 whitespace-pre-line leading-relaxed">
                                {pingResult}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Instruction */}
                        <div className="rounded-xl p-4 bg-[rgba(0,229,255,0.04)] border border-[rgba(0,229,255,0.1)]">
                          <div className="flex items-start gap-2">
                            <Info size={14} className="text-[#00e5ff] mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs text-[var(--hp-text-muted)] leading-relaxed">
                                Your target is live at <span className="font-mono text-[var(--hp-primary)]">{labIp}</span>.
                                Open your terminal on Parrot/Kali/Ubuntu and start hacking!
                                Check the <strong>Steps & Hints</strong> tab for guided walkthrough.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Flag Submission */}
                        <div className="rounded-xl border border-[var(--hp-primary)] bg-[var(--hp-primary)] p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <Flag size={14} className="text-[var(--hp-primary)]" />
                            <span className="text-xs font-mono text-[var(--hp-primary)] uppercase">Submit Flag</span>
                          </div>
                          <div className="flex gap-3">
                            <input
                              type="text"
                              placeholder="FLAG{...}"
                              value={flagInput}
                              onChange={(e) => {
                                setFlagInput(e.target.value);
                                setFlagResult(null);
                              }}
                              className="flex-1 px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl text-sm font-mono text-[var(--hp-primary)] placeholder-gray-600 focus:outline-none focus:border-[var(--hp-primary)] transition-all"
                            />
                            <button
                              onClick={handleFlagSubmit}
                              disabled={flagSubmitting || !flagInput}
                              className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-primary text-sm disabled:opacity-40"
                            >
                              {flagSubmitting ? (
                                <RefreshCw size={14} className="animate-spin" />
                              ) : (
                                <Send size={14} />
                              )}
                              Submit
                            </button>
                          </div>

                          {flagResult === "correct" && (
                            <div className="flex items-center gap-2 mt-3 p-3 rounded-lg bg-[var(--hp-primary)] border border-[var(--hp-primary)]">
                              <CheckCircle size={16} className="text-[var(--hp-primary)]" />
                              <div>
                                <span className="text-xs font-bold text-[var(--hp-primary)]">🎉 Correct! Lab Complete!</span>
                                <p className="text-[10px] text-[var(--hp-text-muted)] mt-0.5">+{vuln.xpReward} XP credited to your account</p>
                              </div>
                            </div>
                          )}
                          {flagResult === "wrong" && (
                            <div className="flex items-center gap-2 mt-3 p-3 rounded-lg bg-[rgba(255,45,45,0.08)] border border-[rgba(255,45,45,0.2)]">
                              <AlertTriangle size={16} className="text-red-400" />
                              <span className="text-xs text-red-400">Wrong flag. Keep trying! Check the Steps tab for hints.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEPS TAB */}
                {activeTab === "steps" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-5 p-3 rounded-lg bg-[var(--hp-primary)] border border-[var(--hp-primary)]">
                      <Info size={13} className="text-[var(--hp-primary)] shrink-0" />
                      <p className="text-[11px] text-[var(--hp-text-muted)]">
                        Replace <span className="font-mono text-[var(--hp-primary)]">&lt;TARGET_IP&gt;</span> with{" "}
                        {labIp ? (
                          <span className="font-mono text-[var(--hp-primary)]">{labIp}</span>
                        ) : (
                          <span className="text-[var(--hp-text-muted)]">your activated lab IP</span>
                        )}
                      </p>
                    </div>

                    {vuln.steps.map((step, i) => (
                      <div
                        key={step.step}
                        className={`rounded-xl border transition-all ${
                          i === currentStep
                            ? "border-[var(--hp-primary)] bg-[var(--hp-primary)]"
                            : i < currentStep
                            ? "border-[var(--hp-primary)] bg-[var(--hp-primary)] opacity-70"
                            : "border-white/5 bg-white/2"
                        }`}
                      >
                        <button
                          className="w-full flex items-center gap-3 p-4 text-left"
                          onClick={() => setCurrentStep(i === currentStep ? -1 : i)}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                              i < currentStep
                                ? "step-done"
                                : i === currentStep
                                ? "step-active"
                                : "step-locked"
                            }`}
                          >
                            {i < currentStep ? (
                              <CheckCircle size={12} />
                            ) : (
                              <span className="text-[10px] font-mono font-bold">{step.step}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <span
                              className={`text-sm font-medium ${
                                i === currentStep ? "text-[var(--hp-text)]" : "text-[var(--hp-text-muted)]"
                              }`}
                            >
                              {step.title}
                            </span>
                          </div>
                          {i < currentStep && (
                            <CheckCircle size={14} className="text-[var(--hp-primary)]/50 shrink-0" />
                          )}
                          <ChevronDown
                            size={14}
                            className={`text-gray-600 transition-transform shrink-0 ${
                              i === currentStep ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {i === currentStep && (
                          <div className="px-4 pb-4 space-y-3">
                            <p className="text-xs text-[var(--hp-text-muted)] leading-relaxed">{step.description}</p>

                            {step.command && (
                              <div className="rounded-lg bg-[#0a0a0f] border border-[var(--hp-primary)] overflow-hidden">
                                <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--hp-primary)]">
                                  <span className="text-[10px] font-mono text-[var(--hp-text-muted)]">command</span>
                                  <button
                                    onClick={() => handleCopyCmd(step.command!)}
                                    className="flex items-center gap-1 text-[10px] text-[var(--hp-text-muted)] hover:text-[var(--hp-primary)] transition-colors"
                                  >
                                    <Copy size={10} />
                                    {copiedCmd === step.command ? "Copied!" : "Copy"}
                                  </button>
                                </div>
                                <pre className="p-3 font-mono text-[11px] text-[var(--hp-primary)] whitespace-pre-wrap overflow-x-auto">
                                  {step.command.replace(/<TARGET_IP>/g, labIp || "<TARGET_IP>")}
                                </pre>
                              </div>
                            )}

                            {step.hint && (
                              <div>
                                <button
                                  onClick={() => toggleHint(i)}
                                  className="flex items-center gap-1.5 text-[10px] text-yellow-400/70 hover:text-yellow-400 transition-colors"
                                >
                                  {revealedHints.has(i) ? <EyeOff size={11} /> : <Eye size={11} />}
                                  {revealedHints.has(i) ? "Hide Hint" : "Show Hint"}
                                </button>
                                {revealedHints.has(i) && (
                                  <div className="mt-2 p-3 rounded-lg bg-[rgba(255,193,7,0.05)] border border-[rgba(255,193,7,0.15)]">
                                    <p className="text-[11px] text-yellow-200/80 leading-relaxed">
                                      💡 {step.hint}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="flex gap-2 mt-2">
                              {i > 0 && (
                                <button
                                  onClick={() => setCurrentStep(i - 1)}
                                  className="text-[11px] text-[var(--hp-text-muted)] hover:text-[var(--hp-text-muted)] transition-colors"
                                >
                                  ← Back
                                </button>
                              )}
                              <button
                                onClick={() => setCurrentStep(i + 1)}
                                className="flex items-center gap-1 text-[11px] text-[var(--hp-primary)] hover:opacity-80 transition-opacity ml-auto"
                              >
                                Mark Done & Next →
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* TOOLS TAB */}
                {activeTab === "tools" && (
                  <div>
                    <p className="text-xs text-[var(--hp-text-muted)] mb-5">
                      Recommended tools for this lab. Install these on your Parrot/Kali Linux before starting.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {vuln.tools.map((tool) => (
                        <div
                          key={tool}
                          className="flex items-center gap-3 p-3.5 rounded-xl border border-white/5 bg-white/2 hover:border-[var(--hp-primary)] transition-all"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[var(--hp-primary)] border border-[var(--hp-primary)] flex items-center justify-center">
                            <Terminal size={13} className="text-[var(--hp-primary)]" />
                          </div>
                          <div>
                            <p className="font-mono text-sm text-[var(--hp-text)]">{tool}</p>
                            <p className="text-[10px] text-[var(--hp-text-muted)]">
                              {tool === "nmap"
                                ? "Network scanner"
                                : tool === "Burp Suite"
                                ? "Web proxy & scanner"
                                : tool === "sqlmap"
                                ? "SQL injection auto-exploiter"
                                : tool === "ffuf"
                                ? "Fast web fuzzer"
                                : tool === "netcat (nc)"
                                ? "TCP/UDP utility"
                                : tool === "John the Ripper"
                                ? "Password cracker"
                                : tool === "curl"
                                ? "HTTP request tool"
                                : "Security tool"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 p-4 rounded-xl bg-[rgba(0,229,255,0.04)] border border-[rgba(0,229,255,0.1)]">
                      <p className="text-[11px] text-[var(--hp-text-muted)] leading-relaxed">
                        💡 All these tools are pre-installed on{" "}
                        <span className="text-[#00e5ff]">Parrot OS Security Edition</span> and{" "}
                        <span className="text-[#00e5ff]">Kali Linux</span>.
                        Use your own machine — no browser VM needed.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-5">
            {/* Quick Activate */}
            <div className="lab-card rounded-2xl p-5">
              <h3 className="text-xs font-mono text-[var(--hp-text-muted)] uppercase mb-4 flex items-center gap-2">
                <Wifi size={12} className="text-[var(--hp-primary)]" />
                Lab Status
              </h3>

              {labActive ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="relative w-2.5 h-2.5 shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--hp-primary)]" />
                      <div className="absolute inset-0 rounded-full bg-[var(--hp-primary)] notif-ping" />
                    </div>
                    <span className="text-xs text-[var(--hp-primary)] font-mono font-bold">ACTIVE</span>
                  </div>
                  <div className="font-mono text-xl font-bold text-[var(--hp-primary)]">{labIp}</div>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--hp-text-muted)] font-mono">
                    <Clock size={11} />
                    {formatTime(labTimer)} remaining
                  </div>
                  <button
                    onClick={() => setActiveTab("lab")}
                    className="w-full py-2 rounded-xl btn-primary text-xs font-medium"
                  >
                    Open Lab Console
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <WifiOff size={14} className="text-gray-600" />
                    <span className="text-xs text-[var(--hp-text-muted)] font-mono">INACTIVE</span>
                  </div>
                  <p className="text-[11px] text-[var(--hp-text-muted)] leading-relaxed">
                    Activate to spawn a live vulnerable IP. Use your own Linux to attack it.
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab("lab");
                      handleActivate();
                    }}
                    className="w-full py-2.5 rounded-xl btn-primary text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Play size={14} />
                    Activate Lab
                  </button>
                </div>
              )}
            </div>

            {/* Lab Info Summary */}
            <div className="lab-card rounded-2xl p-5">
              <h3 className="text-xs font-mono text-[var(--hp-text-muted)] uppercase mb-4">Lab Info</h3>
              <div className="space-y-3">
                {[
                  { label: "Level", value: `#${vuln.level}` },
                  { label: "Year", value: vuln.year.toString() },
                  { label: "Category", value: vuln.category },
                  { label: "Difficulty", value: vuln.difficulty },
                  { label: "XP Reward", value: `${vuln.xpReward} XP` },
                  { label: "Steps", value: `${vuln.steps.length} steps` },
                  ...(vuln.cve ? [{ label: "CVE", value: vuln.cve }] : []),
                  ...(vuln.cvss ? [{ label: "CVSS Score", value: vuln.cvss.toString() }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-[11px] text-[var(--hp-text-muted)]">{label}</span>
                    <span className="text-[11px] font-mono text-[var(--hp-text-muted)]">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="lab-card rounded-2xl p-5">
              <h3 className="text-xs font-mono text-[var(--hp-text-muted)] uppercase mb-4">Navigate</h3>
              <div className="space-y-2">
                {vuln.level > 1 && (() => {
                  const prev = VULNERABILITIES.find((v) => v.level === vuln.level - 1);
                  return prev ? (
                    <Link
                      href={`/labs/${prev.id}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-white/5 hover:border-[var(--hp-primary)] bg-white/2 transition-all group"
                    >
                      <div>
                        <div className="text-[10px] text-[var(--hp-text-muted)] mb-0.5">← Previous</div>
                        <div className="text-xs text-[var(--hp-text-muted)] group-hover:text-[var(--hp-text)] transition-colors">{prev.shortName}</div>
                      </div>
                      <span className="font-mono text-[10px] text-gray-600">LVL {prev.level}</span>
                    </Link>
                  ) : null;
                })()}
                {(() => {
                  const next = VULNERABILITIES.find((v) => v.level === vuln.level + 1);
                  return next ? (
                    <Link
                      href={`/labs/${next.id}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-white/5 hover:border-[var(--hp-primary)] bg-white/2 transition-all group"
                    >
                      <div>
                        <div className="text-[10px] text-[var(--hp-text-muted)] mb-0.5">Next →</div>
                        <div className="text-xs text-[var(--hp-text-muted)] group-hover:text-[var(--hp-text)] transition-colors">{next.shortName}</div>
                      </div>
                      <span className="font-mono text-[10px] text-gray-600">LVL {next.level}</span>
                    </Link>
                  ) : null;
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
