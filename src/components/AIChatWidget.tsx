"use client";

import { useState } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! I'm HpLabs Support Bot. How can I help you today? Are you facing any issues with the platform?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: "user", text: input }]);
    const userInput = input;
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { 
          role: "bot", 
          text: `I understand you're asking about "${userInput}". Our team has been notified of this issue and will get back to you shortly. For immediate technical assistance, please email support@hackerplus.in.` 
        }
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[var(--hp-primary)] text-white shadow-[0_0_20px_var(--hp-border)] hover:scale-105 transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        title="Chat with Support"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] flex flex-col bg-[var(--hp-card-bg)] backdrop-blur-xl border border-[var(--hp-border)] rounded-2xl shadow-2xl transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--hp-border)] bg-[var(--hp-primary)]/10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--hp-primary)] flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--hp-text)]">HpLabs AI Support</h3>
              <p className="text-[10px] text-[var(--hp-text-muted)]">Typically replies instantly</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-[var(--hp-text-muted)] hover:text-[var(--hp-text)] hover:bg-[var(--hp-border)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[var(--hp-border)]' : 'bg-[var(--hp-primary)]/20'}`}>
                {msg.role === 'user' ? <User size={12} className="text-[var(--hp-text)]" /> : <Bot size={12} className="text-[var(--hp-primary)]" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[var(--hp-primary)] text-white rounded-tr-sm' : 'bg-[var(--hp-border)] text-[var(--hp-text)] rounded-tl-sm'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-[var(--hp-border)] bg-[var(--hp-card-bg)] rounded-b-2xl">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent border border-[var(--hp-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--hp-text)] placeholder-[var(--hp-text-muted)] focus:outline-none focus:border-[var(--hp-primary)] transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-[var(--hp-primary)] text-white hover:bg-[var(--hp-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
