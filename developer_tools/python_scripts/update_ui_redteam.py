import re

path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Import SecurePoCUploader
if "SecurePoCUploader" not in content:
    content = content.replace(
        "import Navbar from \"@/components/Navbar\";",
        "import Navbar from \"@/components/Navbar\";\nimport { SecurePoCUploader } from \"@/components/SecurePoCUploader\";"
    )

# 2. Update handleSubmitFlag Signature
old_submit = """  const handleSubmitFlag = async () => {
    if (!flagInput.trim() || flagSubmitting) return;
    logMeaningfulActivity();
    setFlagSubmitting(true);
    setFlagResult(null);"""
new_submit = """  const handleSubmitFlag = async (isPoC: boolean = false) => {
    if (!isPoC && (!flagInput.trim() || flagSubmitting)) return;
    logMeaningfulActivity();
    setFlagSubmitting(true);
    setFlagResult(null);"""
content = content.replace(old_submit, new_submit)

# 3. Update body inside handleSubmitFlag
old_body = """        body: JSON.stringify({ 
          userId, 
          labId: lab.id, 
          flag: flagInput.trim(),
          isRepeat: solved,"""
new_body = """        body: JSON.stringify({ 
          userId, 
          labId: lab.id, 
          flag: isPoC ? "POC_BYPASS_AUTHORIZED" : flagInput.trim(),
          isRepeat: solved,"""
content = content.replace(old_body, new_body)

# 4. Fix ALL onClick bindings for handleSubmitFlag
content = content.replace("onClick={handleSubmitFlag}", "onClick={() => handleSubmitFlag(false)}")

# 5. Replace UI text input with SecurePoCUploader
pattern = r'<div className="space-y-3">\s*<input[\s\S]*?</button>\s*</div>'
replacement = """<div className="space-y-3 mt-4">
                        <SecurePoCUploader onSuccess={() => handleSubmitFlag(true)} />
                      </div>"""
content, num_subs = re.subn(pattern, replacement, content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"PoC Uploader successfully inserted! Replacements: {num_subs}")
