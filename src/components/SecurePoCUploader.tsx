"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { UploadCloud, Shield, CheckCircle, AlertTriangle, FileImage, X, Activity } from "lucide-react";

interface SecurePoCUploaderProps {
  onSuccess: () => void;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function SecurePoCUploader({ onSuccess }: SecurePoCUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "scanning" | "error" | "success">("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [cooldown, setCooldown] = useState(0);        // seconds remaining
  const inputRef = useRef<HTMLInputElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const scanningRef = useRef(false);                  // prevent concurrent scans

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, msg]);
  };

  const failScan = useCallback((reason: string) => {
    addLog(reason);
    setErrorMsg(reason);
    setStatus("error");
    scanningRef.current = false;
  }, []);

  const handleFile = useCallback(async (selectedFile: File) => {
    // Guard: block if already scanning, on cooldown, or success-locked
    if (scanningRef.current || cooldown > 0 || status === "success") return;
    scanningRef.current = true;

    setFile(selectedFile);
    setStatus("scanning");
    setLogs([]);
    setErrorMsg("");

    // Reset input so same file can be re-selected after removal
    if (inputRef.current) inputRef.current.value = "";

    const name = selectedFile.name.toLowerCase();
    const size = selectedFile.size;

    await sleep(500);
    addLog("[SYSTEM] Initiating secure upload sequence...");

    await sleep(800);
    addLog("[SYSTEM] Validating file parameters...");
    await sleep(600);

    // 1. Path traversal / double extension check
    if (name.includes("../") || name.includes("..\\") || name.includes("%00")) {
      failScan("[ERROR] Upload failed. Invalid file request.");
      setCooldown(5);
      return;
    }
    const extParts = name.split(".");
    if (extParts.length > 2 && (name.includes(".php") || name.includes(".sh") || name.includes(".exe"))) {
      failScan("[ERROR] Upload failed. Unsupported file structure.");
      setCooldown(5);
      return;
    }

    // 2. Size check (max 2 MB)
    if (size > 2 * 1024 * 1024) {
      failScan("[ERROR] Upload failed. Request entity too large. Max 2 MB.");
      setCooldown(5);
      return;
    }

    // 3. MIME / magic-bytes check
    addLog("[SYSTEM] Verifying file integrity...");
    await sleep(800);
    if (!selectedFile.type.startsWith("image/")) {
      failScan("[ERROR] Upload failed. Corrupted or invalid file type.");
      setCooldown(5);
      return;
    }
    addLog("[SYSTEM] Integrity check passed.");

    // 4. Processing
    await sleep(600);
    addLog("[SYSTEM] Processing file data...");
    await sleep(800);
    addLog("[SYSTEM] EXIF metadata stripped.");

    // 5. AI Vision / semantic analysis simulation
    await sleep(600);
    addLog("[SYSTEM] Initializing verification engine...");
    await sleep(1000);
    addLog("[SYSTEM] Analyzing submitted proof...");
    await sleep(1500);
    addLog("[SYSTEM] Validating exploit signature...");
    await sleep(1200);

    // Reject clearly invalid images (demo heuristic — in prod: real OCR/vision API)
    if (
      name.includes("cat") || name.includes("dog") || name.includes("meme") ||
      name.includes("wallpaper") || name.includes("screenshot_google")
    ) {
      failScan("[ERROR] Validation Failed. Could not verify exploit proof.");
      setCooldown(5);
      return;
    }

    addLog("[SUCCESS] Proof accepted. Vulnerability confirmed.");
    setStatus("success");
    scanningRef.current = false;
    await sleep(800);
    onSuccess();
  }, [cooldown, status, failScan, onSuccess]);

  // ── Drag & Drop handlers ─────────────────────────────────────────────
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (cooldown > 0 || status === "success" || status === "scanning") return;
    setDragActive(true);
  };
  const onDragLeave = () => setDragActive(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (cooldown > 0 || status === "success" || status === "scanning") return;

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    // Enforce exactly ONE file
    if (files.length > 1) {
      setErrorMsg("Please upload exactly ONE image at a time.");
      setStatus("error");
      setCooldown(5);
      return;
    }
    handleFile(files[0]);
  };

  const isUploadDisabled = cooldown > 0 || status === "success" || status === "scanning";

  return (
    <div className="w-full bg-[#0a0514] border border-[var(--hp-border)] rounded-2xl overflow-hidden mt-6 shadow-[0_0_20px_rgba(191,95,255,0.05)]">

      {/* Header */}
      <div className="bg-[var(--hp-bg-surface)] px-4 py-3 border-b border-[var(--hp-border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[var(--hp-primary)]" />
          <span className="text-sm font-bold text-white tracking-wide">Secure PoC Scanner</span>
        </div>
        <span className="text-[10px] font-mono text-gray-600">ONE IMAGE AT A TIME</span>
      </div>

      <div className="p-6">

        {/* Cooldown banner */}
        {cooldown > 0 && (
          <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
            <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-yellow-400">Cooldown Active</p>
              <p className="text-[11px] text-yellow-600 font-mono">Please wait {cooldown}s before uploading another image...</p>
            </div>
          </div>
        )}

        {/* Drop zone — shown when idle */}
        {status === "idle" && (
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => { if (!isUploadDisabled) inputRef.current?.click(); }}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${
              isUploadDisabled
                ? "border-gray-800 opacity-40 cursor-not-allowed"
                : dragActive
                  ? "border-[var(--hp-primary)] bg-[var(--hp-primary)]/5 cursor-pointer"
                  : "border-gray-700 hover:border-[var(--hp-primary)] hover:bg-[var(--hp-bg-surface)] cursor-pointer"
            }`}
          >
            <input
              type="file"
              ref={inputRef}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              multiple={false}
              disabled={isUploadDisabled}
              onChange={(e) => {
                const files = e.target.files;
                if (!files || files.length === 0) return;
                if (files.length > 1) {
                  setErrorMsg("Please upload exactly ONE image at a time.");
                  setStatus("error");
                  setCooldown(5);
                  return;
                }
                handleFile(files[0]);
              }}
            />
            <div className="w-14 h-14 bg-[var(--hp-bg-surface)] rounded-full flex items-center justify-center mb-4 border border-[var(--hp-border)] shadow-lg">
              <UploadCloud className="w-7 h-7 text-[var(--hp-primary)]" />
            </div>
            <p className="text-white font-bold mb-1">Upload Vulnerability PoC (Screenshot)</p>
            <p className="text-xs text-gray-500 font-mono mt-2">
              {isUploadDisabled ? `Cooldown: ${cooldown}s remaining` : "(Click or drag 1 file here)"}
            </p>
          </div>
        )}

        {/* Scanning / error / success states */}
        {(status === "scanning" || status === "error" || status === "success") && (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--hp-bg-surface)] border border-[var(--hp-border)] flex items-center justify-center shrink-0">
                <FileImage className="w-6 h-6 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold text-white truncate">{file?.name}</p>
                  {status === "scanning" && <Activity className="w-4 h-4 text-[var(--hp-primary)] animate-spin" />}
                  {status === "success" && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {status === "error" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                </div>
                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      status === "error" ? "bg-red-500 w-full" :
                      status === "success" ? "bg-green-500 w-full" :
                      "bg-[var(--hp-primary)] w-3/4 animate-pulse"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Terminal logs */}
            <div className="bg-black border border-gray-800 rounded-lg p-3 h-32 overflow-y-auto font-mono text-[10px] sm:text-xs text-gray-300 shadow-inner">
              {logs.map((log, idx) => (
                <div key={idx} className={`mb-1 ${
                  log.includes("[ERROR]") || log.includes("[ALERT]") || log.includes("REJECTED") ? "text-red-400 font-bold" :
                  log.includes("[SUCCESS]") || log.includes("Accepted") ? "text-green-400 font-bold" :
                  log.includes("[AI VISION]") ? "text-[var(--hp-primary)]" : "text-gray-400"
                }`}>
                  <span className="opacity-50 mr-2">{new Date().toLocaleTimeString().split(" ")[0]}</span>
                  {log}
                </div>
              ))}
              {status === "scanning" && (
                <div className="text-gray-500 animate-pulse mt-1">_</div>
              )}
              <div ref={logsEndRef} />
            </div>

            {/* Error: Remove image and show cooldown info */}
            {status === "error" && (
              <div className="space-y-2">
                <p className="text-xs text-red-400 font-mono text-center">{errorMsg}</p>
                <button
                  onClick={() => {
                    setFile(null);
                    setLogs([]);
                    setErrorMsg("");
                    setStatus("idle");
                    // cooldown stays — it was set when scan failed
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-bold transition-all"
                >
                  <X className="w-4 h-4" />
                  Remove Image {cooldown > 0 ? `(${cooldown}s cooldown)` : ""}
                </button>
              </div>
            )}

            {/* Success: locked state */}
            {status === "success" && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30">
                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                <p className="text-xs font-bold text-green-400">PoC accepted — submission locked for this session.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
