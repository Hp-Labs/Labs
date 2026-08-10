"use client";

import Link from "next/link";
import {
  Shield, ChevronRight, Lock, Zap, Clock, Star
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { RED_TEAM_MODULES } from "@/lib/data/redteam";

export default function RedTeamPage() {
  return (
    <div className="min-h-screen bg-[var(--hp-bg)]" suppressHydrationWarning>
      <Navbar />

      <div className="pt-24 pb-20 px-6 lg:px-12 max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--hp-text-muted)] mb-6">
            <Link href="/" className="hover:text-[var(--hp-primary)] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[var(--hp-primary)]">Red Team</span>
          </div>

          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--hp-red)]/10 border border-[var(--hp-red)]/30 flex items-center justify-center shrink-0">
              <span className="text-2xl">🔴</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--hp-text)] mb-2">Red Team Module</h1>
              <p className="text-[var(--hp-text-muted)] text-sm max-w-2xl">
                Offensive security training across all Red Team disciplines. Start with
                Pentesting — more modules launch after Red Team reaches production-level
                completeness.
              </p>
            </div>
          </div>

          {/* Road map note */}
          <div className="mt-4 p-3 rounded-xl border border-[var(--hp-cyan)]/20 bg-[var(--hp-cyan)]/5 flex items-start gap-2 max-w-2xl">
            <Clock size={13} className="text-[var(--hp-cyan)] mt-0.5 shrink-0" />
            <p className="text-xs text-[var(--hp-text-muted)] leading-relaxed">
              <span className="text-[var(--hp-cyan)] font-medium">Roadmap:</span> Red Team
              Ops, Exploit Dev, Reverse Engineering, and Social Engineering launch after
              Pentesting reaches full production coverage. Blue Team, DFIR, GRC, and
              Cloud Security follow as separate modules.
            </p>
          </div>
        </div>

        {/* Module cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {RED_TEAM_MODULES.map((mod) => {
            const isAvailable = mod.status === "available";
            const totalLabs = mod.subDomains
              ? mod.subDomains.reduce((acc, sd) => {
                  return acc + Object.values(sd.labCounts).reduce((a, b) => a + b, 0);
                }, 0)
              : 0;

            return (
              <div key={mod.id} className="relative group">
                {isAvailable ? (
                  <Link href={`/red-team/${mod.id}`} className="block">
                    <ModuleCard mod={mod} totalLabs={totalLabs} />
                  </Link>
                ) : (
                  <div className="opacity-60 cursor-not-allowed">
                    <ModuleCard mod={mod} totalLabs={totalLabs} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Coming soon — other modules */}
        <div className="mt-16 text-center">
          <p className="text-xs font-mono text-[var(--hp-text-muted)] uppercase tracking-widest mb-3">
            Future Modules (Post Red Team)
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "🔵 Blue Team", "🔬 DFIR / Forensics", "📋 GRC & Compliance",
              "🧠 Threat Intelligence", "🏗️ Security Architecture",
              "🔒 Privacy", "☁️ Cloud Security", "🔍 Investigations",
              "⚡ Incident Response",
            ].map((item) => (
              <span
                key={item}
                className="px-3 py-1 rounded-full border border-[var(--hp-border)] bg-[var(--hp-bg-3)] text-xs text-[var(--hp-text-muted)] font-mono"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleCard({
  mod,
  totalLabs,
}: {
  mod: (typeof RED_TEAM_MODULES)[0];
  totalLabs: number;
}) {
  const isAvailable = mod.status === "available";
  const subdomainCount = mod.subDomains?.length ?? 0;

  return (
    <div
      className={`lab-card rounded-2xl p-5 h-full transition-all duration-300 ${
        isAvailable
          ? "hover:border-[var(--hp-primary)] group-hover:-translate-y-0.5"
          : ""
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-3xl">{mod.icon}</span>
        {isAvailable ? (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-[var(--hp-primary)]/30 bg-[var(--hp-primary)]/10">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--hp-primary)] animate-pulse" />
            <span className="text-[10px] font-mono text-[var(--hp-primary)]">ACTIVE</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-[var(--hp-border)] bg-[var(--hp-bg-3)]">
            <Lock size={9} className="text-[var(--hp-text-muted)] opacity-70" />
            <span className="text-[10px] font-mono text-[var(--hp-text-muted)] opacity-70">SOON</span>
          </div>
        )}
      </div>

      <h2 className="text-base font-bold text-[var(--hp-text)] mb-1">{mod.name}</h2>
      <p className="text-xs text-[var(--hp-text-muted)] leading-relaxed mb-5">{mod.description}</p>

      <div className="flex items-center gap-4 pt-4 border-t border-[var(--hp-border)]/50">
        {isAvailable ? (
          <>
            <div className="flex items-center gap-1">
              <Shield size={11} className="text-[var(--hp-primary)]" />
              <span className="text-[11px] text-[var(--hp-text-muted)]">{subdomainCount} domains</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap size={11} className="text-[var(--hp-cyan)]" />
              <span className="text-[11px] text-[var(--hp-text-muted)]">{totalLabs} labs</span>
            </div>
          </>
        ) : (
          <span className="text-[11px] text-[var(--hp-text-muted)] opacity-70 font-mono">Launching after Pentesting</span>
        )}
        {isAvailable && (
          <div className="ml-auto">
            <ChevronRight size={14} className="text-[var(--hp-text-muted)] group-hover:text-[var(--hp-primary)] transition-colors" />
          </div>
        )}
      </div>
    </div>
  );
}
