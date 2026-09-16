"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  MessageSquare, X, Send, Bot, User, RefreshCw, CheckCircle, AlertTriangle,
  ArrowUpRight, Loader2, Ticket, Phone, Mail, ClipboardList, ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

//  Types 
type MsgRole = "bot" | "user" | "system";
type MsgStatus = "idle" | "diagnosing" | "fixing" | "done" | "escalated" | "ticket_created";

interface ChatMsg {
  role: MsgRole;
  text: string;
  status?: MsgStatus;
  autoFixed?: boolean;
  issue?: string;
  ticketId?: string;
  ticketStatus?: string;
}

type EscalationPhase =
  | "none"               // normal chat
  | "confirm_info"       // bot asking user to confirm account details
  | "awaiting_extra"     // collecting extra issue context
  | "filing"             // API call in flight
  | "filed";             // ticket created

interface PendingEscalation {
  originalMessage: string;
  issueCode: string;
  remediationAttempts: string[];
}

//  Quick-issue chips 
const QUICK_ISSUES = [
  { label: "Lab not starting",    message: "My lab is stuck and won't provision" },
  { label: "XP not updating",     message: "My XP is not showing correctly after completing a lab" },
  { label: "Session expired",     message: "I keep getting logged out / stale session issue" },
  { label: "Hints missing",       message: "My hints are not showing up in the lab" },
  { label: "Premium not active",  message: "My premium access or tier unlock is not showing" },
  { label: "Page not loading",    message: "The platform is showing server errors and pages won't load" },
];

//  Lightweight markdown renderer 
function md(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br />");
}

//  Component 
export function AIChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "bot",
      text: " Hi! I'm the **HpLabs Support Assistant**.\n\nI can automatically diagnose and fix many common issues  no waiting for a human unless truly needed.\n\nWhat's going wrong today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  // Escalation state
  const [escalationPhase, setEscalationPhase] = useState<EscalationPhase>("none");
  const [pending, setPending] = useState<PendingEscalation | null>(null);
  const [extraContext, setExtraContext] = useState("");
  const [labIdInput, setLabIdInput] = useState("");

  
  const pathname = usePathname() || "";
  const labMatch = pathname.match(/\/labs\/([^/]+)/) || pathname.match(/\/pentesting\/[^/]+\/[^/]+\/(\d+)/);
  const currentLabId = labMatch ? labMatch[1] : undefined;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, escalationPhase]);

  //  Core: send message to /api/support 
  const sendMessage = async (text: string) => {
    if (!text.trim() || isBusy || escalationPhase !== "none") return;
    setIsBusy(true);

    const userMsg: ChatMsg = { role: "user", text };
    const diagMsg: ChatMsg = { role: "bot", text: " Diagnosing your issue", status: "diagnosing" };
    setMessages(prev => [...prev, userMsg, diagMsg]);
    setInput("");

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, userId: user?.id }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setMessages(prev => {
          const u = [...prev];
          u[u.length - 1] = { role: "bot", text: " Error reaching support. Please try again or email **support@hackerplus.in**.", status: "done" };
          return u;
        });
        setIsBusy(false);
        return;
      }

      if (data.autoFixed) {
        setMessages(prev => {
          const u = [...prev];
          u[u.length - 1] = { role: "bot", text: " Applying safe remediation", status: "fixing" };
          return u;
        });
        await new Promise(r => setTimeout(r, 900));
      }

      if (data.severity === "escalate") {
        // Trigger the ticket-confirm flow instead of dead-ending
        const attempts: string[] = [];
        setMessages(prev => {
          const u = [...prev];
          u[u.length - 1] = {
            role: "bot",
            text:
              " **This issue needs human review.** I wasn't able to fix it automatically.\n\n" +
              "I'll create a support ticket for our team right now. Let me confirm your account details first so you don't have to re-enter them.",
            status: "escalated",
            issue: data.issue,
          };
          return u;
        });
        setPending({ originalMessage: text, issueCode: data.issue, remediationAttempts: attempts });
        setEscalationPhase("confirm_info");
      } else {
        setMessages(prev => {
          const u = [...prev];
          u[u.length - 1] = {
            role: "bot",
            text: data.response,
            status: "done",
            autoFixed: data.autoFixed,
            issue: data.issue,
          };
          return u;
        });
      }
    } catch {
      setMessages(prev => {
        const u = [...prev];
        u[u.length - 1] = { role: "bot", text: " Network error. Please check your connection.", status: "done" };
        return u;
      });
    }
    setIsBusy(false);
  };

  //  File the ticket 
  const fileTicket = async () => {
    if (!user || !pending) return;
    setEscalationPhase("filing");

    const fullDescription =
      pending.originalMessage +
      (extraContext.trim() ? `\n\nAdditional context: ${extraContext.trim()}` : "");

    try {
      const res = await fetch("/api/support/escalate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name: user.username,
          email: user.email,
          phone: user.phone ?? "",
          issueDescription: fullDescription,
          labId: labIdInput.trim() || undefined,
          errorCode: pending.issueCode !== "unknown" ? pending.issueCode : undefined,
          remediationAttempts: pending.remediationAttempts,
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setMessages(prev => [
          ...prev,
          {
            role: "bot",
            text:
              ` **Ticket Created Successfully!**\n\n` +
              `**Ticket ID:** \`${data.ticketId}\`\n` +
              `**Status:** Open  Under Review\n\n` +
              `Our support team has been notified via email and WhatsApp. ` +
              `You will receive a confirmation at **${user.email}**.\n\n` +
              `Please keep your Ticket ID: **${data.ticketId}** for follow-up.`,
            status: "ticket_created",
              ticketId: data.ticketId,
              ticketStatus: data.status,
            },
        ]);
        setEscalationPhase("filed");
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: "bot",
            text:
              " Could not create your ticket automatically. Please email **support@hackerplus.in** directly with your issue description.",
            status: "done",
          },
        ]);
        setEscalationPhase("none");
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: "bot",
          text: " Network error while creating ticket. Please email **support@hackerplus.in**.",
          status: "done",
        },
      ]);
      setEscalationPhase("none");
    }
    setPending(null);
  };

  //  Reset 
  const handleReset = () => {
    setMessages([{
      role: "bot",
      text: " Hi! I'm the **HpLabs Support Assistant**.\n\nI can automatically diagnose and fix many common issues  no waiting for a human unless truly needed.\n\nWhat's going wrong today?",
    }]);
    setInput("");
    setIsBusy(false);
    setEscalationPhase("none");
    setPending(null);
    setExtraContext("");
    setLabIdInput("");
  };

  const showChips = messages.length <= 2 && escalationPhase === "none";

  //  Confirm-info panel (inline, not a separate modal) 
  const renderEscalationPanel = () => {
    if (escalationPhase === "none" || escalationPhase === "filed") return null;

    if (escalationPhase === "filing") {
      return (
        <div className="mx-4 mb-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex items-center gap-3">
          <Loader2 size={18} className="text-amber-400 animate-spin shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-300">Creating your support ticket</p>
            <p className="text-xs text-[var(--hp-text-muted)]">Securing ticket information...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="mx-3 mb-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
        <div className="flex items-center gap-2">
          <ClipboardList size={14} className="text-amber-400 shrink-0" />
          <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">Ticket Confirmation</p>
        </div>

        {/* Pre-filled from verified account  not editable */}
        {user && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[11px]">
              <ShieldCheck size={11} className="text-emerald-400 shrink-0" />
              <span className="text-[var(--hp-text-muted)]">Using verified account details</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[var(--hp-bg-3)] rounded-lg px-3 py-2">
                <p className="text-[9px] text-[var(--hp-text-muted)] uppercase tracking-wider mb-0.5">Name</p>
                <p className="text-xs text-[var(--hp-text)] font-mono truncate">{user.username}</p>
              </div>
              <div className="bg-[var(--hp-bg-3)] rounded-lg px-3 py-2">
                <p className="text-[9px] text-[var(--hp-text-muted)] uppercase tracking-wider mb-0.5">Email</p>
                <p className="text-xs text-[var(--hp-text)] font-mono truncate">{user.email}</p>
              </div>
            </div>
            {user.phone && (
              <div className="bg-[var(--hp-bg-3)] rounded-lg px-3 py-1.5">
                <p className="text-[9px] text-[var(--hp-text-muted)] uppercase tracking-wider mb-0.5">Phone</p>
                <p className="text-xs text-[var(--hp-text)] font-mono">{user.phone}</p>
              </div>
            )}
          </div>
        )}

        {/* Extra context */}
        <div>
          <label className="block text-[10px] text-[var(--hp-text-muted)] mb-1">
            Additional detail <span className="opacity-60">(optional)</span>
          </label>
          <textarea
            value={extraContext}
            onChange={e => setExtraContext(e.target.value.slice(0, 500))}
            rows={2}
            placeholder="Any extra information, error messages or steps you tried"
            className="w-full text-xs bg-[var(--hp-bg-3)] border border-[var(--hp-border)] rounded-lg px-3 py-2 text-[var(--hp-text)] placeholder-[var(--hp-text-muted)] focus:outline-none focus:border-amber-500/50 resize-none"
          />
        </div>

        

        <div className="flex gap-2 pt-1">
          <button
            onClick={fileTicket}
            className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Ticket size={12} /> Create Ticket
          </button>
          <button
            onClick={() => { setEscalationPhase("none"); setPending(null); }}
            className="px-3 py-2 rounded-lg border border-[var(--hp-border)] text-[var(--hp-text-muted)] text-xs hover:text-[var(--hp-text)] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  //  Render 
  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[var(--hp-primary)] text-white shadow-[0_0_20px_var(--hp-border)] hover:scale-105 transition-all duration-300 ${isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"}`}
        title="Chat with Support"
        aria-label="Open support chat"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[360px] sm:w-[420px] flex flex-col bg-[var(--hp-card-bg)] backdrop-blur-xl border border-[var(--hp-border)] rounded-2xl shadow-2xl transition-all duration-300 origin-bottom-right ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"}`}
        style={{ maxHeight: "min(640px, 88vh)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--hp-border)] bg-[var(--hp-primary)]/10 rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--hp-primary)] flex items-center justify-center shadow-[0_0_12px_var(--hp-primary)]">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--hp-text)]">HpLabs Support</h3>
              <p className="text-[10px] text-[var(--hp-primary)] font-mono">Auto-diagnose  Self-service  Escalate</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleReset} title="New conversation" className="p-1.5 rounded-lg text-[var(--hp-text-muted)] hover:text-[var(--hp-text)] hover:bg-[var(--hp-border)] transition-colors">
              <RefreshCw size={15} />
            </button>
            <button aria-label="Close chat" title="Close chat" onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-[var(--hp-text-muted)] hover:text-[var(--hp-text)] hover:bg-[var(--hp-border)] transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-2 ${msg.role === "user" ? "self-end flex-row-reverse max-w-[85%]" : "self-start max-w-[95%]"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${msg.role === "user" ? "bg-[var(--hp-border)]" : "bg-[var(--hp-primary)]/20"}`}>
                {msg.role === "user" ? <User size={12} className="text-[var(--hp-text)]" />
                  : msg.status === "diagnosing" || msg.status === "fixing" ? <Loader2 size={12} className="text-[var(--hp-primary)] animate-spin" />
                  : msg.status === "ticket_created" ? <Ticket size={12} className="text-amber-400" />
                  : msg.status === "escalated" ? <AlertTriangle size={12} className="text-amber-400" />
                  : msg.autoFixed ? <CheckCircle size={12} className="text-emerald-400" />
                  : <Bot size={12} className="text-[var(--hp-primary)]" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[var(--hp-primary)] text-white rounded-tr-sm"
                  : msg.status === "ticket_created"
                    ? "bg-amber-500/10 border border-amber-500/25 text-[var(--hp-text)] rounded-tl-sm"
                    : msg.status === "escalated"
                      ? "bg-amber-500/5 border border-amber-500/15 text-[var(--hp-text)] rounded-tl-sm"
                      : msg.autoFixed
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-[var(--hp-text)] rounded-tl-sm"
                        : "bg-[var(--hp-border)] text-[var(--hp-text)] rounded-tl-sm"
              }`}>
                <span dangerouslySetInnerHTML={{ __html: md(msg.text) }} />
                {msg.ticketId && (<div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-amber-300 bg-amber-500/10 rounded-lg px-2 py-1 w-fit"><Ticket size={10} /> {msg.ticketId}{msg.ticketStatus && <span className="opacity-70 px-1 border-l border-amber-500/30 uppercase">{msg.ticketStatus}</span>}</div>)}
              </div>
            </div>
          ))}

          {/* Quick chips */}
          {showChips && (
            <div className="mt-1">
              <p className="text-[10px] text-[var(--hp-text-muted)] font-mono mb-2 uppercase tracking-wider">Common issues</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_ISSUES.map(chip => (
                  <button
                    key={chip.label}
                    onClick={() => sendMessage(chip.message)}
                    disabled={isBusy}
                    className="px-2.5 py-1 text-[11px] rounded-lg border border-[var(--hp-border)] text-[var(--hp-text-muted)] hover:border-[var(--hp-primary)] hover:text-[var(--hp-primary)] transition-colors disabled:opacity-40 font-mono"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Escalation panel  injected above input */}
        {renderEscalationPanel()}

        

        {/* Input  disabled during escalation */}
        <div className="p-3 border-t border-[var(--hp-border)] bg-[var(--hp-card-bg)] rounded-b-2xl shrink-0">
          <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={
                escalationPhase !== "none"
                  ? "Please complete the ticket form above"
                  : isBusy
                    ? "Diagnosing"
                    : "Describe your issue"
              }
              disabled={isBusy || escalationPhase !== "none"}
              maxLength={500}
              className="flex-1 bg-transparent border border-[var(--hp-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--hp-text)] placeholder-[var(--hp-text-muted)] focus:outline-none focus:border-[var(--hp-primary)] transition-colors disabled:opacity-40"
            />
            <button
              type="submit"
              disabled={!input.trim() || isBusy || escalationPhase !== "none"}
              className="p-2.5 rounded-xl bg-[var(--hp-primary)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {isBusy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

