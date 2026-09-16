path = "src/components/SecurePoCUploader.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# We need to enforce a cooldown visually and on upload

old_upload = """  const handleUpload = (f: File) => {
    setFile(f);
    setStatus("scanning");
    setLogs(["Initializing secure PoC scanner...", "Authenticating user session..."]);

    // Simulate scanning
    let step = 0;
    const scannerInterval = setInterval(() => {
      step++;"""

new_upload = """  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [cooldown]);

  const handleUpload = async (f: File) => {
    if (cooldown > 0) return;
    setFile(f);
    setStatus("scanning");
    setLogs(["Initializing secure PoC scanner...", "Authenticating user session..."]);

    // Simulate scanning
    let step = 0;
    const scannerInterval = setInterval(() => {
      step++;"""

content = content.replace(old_upload, new_upload)

old_error = """      } else if (step === 3) {
        setLogs((prev) => [...prev, "Validation failed: Image does not match target environment."]);
        setStatus("error");
        setErrorMsg("The screenshot provided does not appear to be from your assigned Target IP/Domain. Please ensure you are capturing the correct environment.");
        clearInterval(scannerInterval);
      }
    }, 1200);"""

new_error = """      } else if (step === 3) {
        setLogs((prev) => [...prev, "Validation failed: Image does not match target environment."]);
        setStatus("error");
        setErrorMsg("The screenshot provided does not appear to be from your assigned Target IP/Domain. Please ensure you are capturing the correct environment.");
        setCooldown(5); // 5 second cooldown penalty
        clearInterval(scannerInterval);
      }
    }, 1200);"""

content = content.replace(old_error, new_error)

old_drop = """      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (status === "idle" || status === "error") setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (status === "idle" || status === "error") {
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleUpload(e.dataTransfer.files[0]);
            }
          }
        }}
        className={`relative overflow-hidden border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-300 ${
          status === "success"
            ? "border-[var(--hp-primary)] bg-[var(--hp-primary)]/5"
            : status === "error"
            ? "border-red-500/50 bg-red-500/5"
            : dragActive
            ? "border-[var(--hp-primary)] bg-[var(--hp-primary)]/10"
            : "border-[var(--hp-border)] hover:border-[var(--hp-border-hover)] bg-[var(--hp-bg-2)]"
        }`}
      >"""

new_drop = """      <div
        onDragOver={(e) => {
          e.preventDefault();
          if ((status === "idle" || status === "error") && cooldown === 0) setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if ((status === "idle" || status === "error") && cooldown === 0) {
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              if (e.dataTransfer.files.length > 1) {
                setErrorMsg("Please upload exactly ONE image at a time.");
                setStatus("error");
                return;
              }
              handleUpload(e.dataTransfer.files[0]);
            }
          }
        }}
        className={`relative overflow-hidden border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-300 ${
          cooldown > 0
            ? "border-yellow-500/50 bg-yellow-500/5 opacity-50 cursor-not-allowed"
            : status === "success"
            ? "border-[var(--hp-primary)] bg-[var(--hp-primary)]/5"
            : status === "error"
            ? "border-red-500/50 bg-red-500/5"
            : dragActive
            ? "border-[var(--hp-primary)] bg-[var(--hp-primary)]/10"
            : "border-[var(--hp-border)] hover:border-[var(--hp-border-hover)] bg-[var(--hp-bg-2)]"
        }`}
      >"""

content = content.replace(old_drop, new_drop)

# Update the input block to show cooldown text
old_input = """              <p className="text-sm text-[var(--hp-text-muted)] text-center max-w-[200px]">
                Click or drag file here to upload PoC
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleUpload(e.target.files[0]);
                }
              }}
            />
          </>"""

new_input = """              <p className="text-sm text-[var(--hp-text-muted)] text-center max-w-[200px]">
                {cooldown > 0 ? `Cooldown active. Please wait ${cooldown}s` : "Click or drag file here to upload PoC"}
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={cooldown > 0}
              onChange={(e) => {
                if (cooldown > 0) return;
                if (e.target.files && e.target.files.length > 0) {
                  if (e.target.files.length > 1) {
                    setErrorMsg("Please upload exactly ONE image at a time.");
                    setStatus("error");
                    return;
                  }
                  handleUpload(e.target.files[0]);
                }
              }}
            />
          </>"""

content = content.replace(old_input, new_input)


# Remove file when clicking X
old_remove = """                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setStatus("idle");
                    setLogs([]);
                    setErrorMsg("");
                  }}"""

new_remove = """                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setStatus("idle");
                    setLogs([]);
                    setErrorMsg("");
                  }}"""

# actually, cooldown handles it so no change needed to remove button, 
# except we might want cooldown to trigger exactly when error happens, which it does.

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated SecurePoCUploader.tsx")
