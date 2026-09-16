path = "src/app/labs/[id]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Import SecurePoCUploader
if "SecurePoCUploader" not in content:
    content = content.replace(
        "import Navbar from \"@/components/Navbar\";",
        "import Navbar from \"@/components/Navbar\";\nimport { SecurePoCUploader } from \"@/components/SecurePoCUploader\";"
    )

# 2. Update handleFlagSubmit Signature
old_submit = """  const handleFlagSubmit = async () => {
    if (!flagInput.trim() || flagSubmitting) return;
    logMeaningfulActivity();
    setFlagSubmitting(true);
    setFlagResult(null);"""
new_submit = """  const handleFlagSubmit = async (isPoC: boolean = false) => {
    if (!isPoC && (!flagInput.trim() || flagSubmitting)) return;
    logMeaningfulActivity();
    setFlagSubmitting(true);
    setFlagResult(null);"""
content = content.replace(old_submit, new_submit)

# 3. Update body inside handleFlagSubmit
old_body = """        body: JSON.stringify({ 
          userId: user?.id ?? "guest", 
          labId: vuln.id, 
          flag: flagInput.trim(),
          isRepeat: solved,"""
new_body = """        body: JSON.stringify({ 
          userId: user?.id ?? "guest", 
          labId: vuln.id, 
          flag: isPoC ? "POC_BYPASS_AUTHORIZED" : flagInput.trim(),
          isRepeat: solved,"""
content = content.replace(old_body, new_body)

# 4. Fix ALL onClick bindings for handleFlagSubmit
content = content.replace("onClick={handleFlagSubmit}", "onClick={() => handleFlagSubmit(false)}")

# 5. Replace UI text input with SecurePoCUploader
old_ui = """                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="FLAG{...}"
                          value={flagInput}
                          onChange={(e) => { 
                            setFlagInput(e.target.value); 
                            setFlagResult(null); 
                            logMeaningfulActivity();
                          }}
                          className="w-full px-4 py-3 rounded-xl bg-[var(--hp-bg-3)] border border-[var(--hp-border)] text-sm font-mono text-[var(--hp-text)] focus:outline-none focus:border-[var(--hp-primary)] transition-all"
                        />
                        {flagResult === "wrong" && <p className="text-xs text-red-400 font-mono"> Incorrect flag.</p>}
                        <button
                          onClick={() => handleFlagSubmit(false)}
                          disabled={!flagInput.trim() || flagSubmitting}
                          className="w-full py-3 rounded-xl btn-primary text-sm font-medium disabled:opacity-40 flex justify-center items-center gap-2"
                        >
                          {flagSubmitting ? <><RefreshCw size={14} className="animate-spin" /> Validating...</> : <><Flag size={14} /> Submit</>}
                        </button>
                      </div>"""
new_ui = """                      <div className="space-y-3 mt-4">
                        <SecurePoCUploader onSuccess={() => handleFlagSubmit(true)} />
                      </div>"""
content = content.replace(old_ui, new_ui)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("PoC Uploader successfully inserted!")
