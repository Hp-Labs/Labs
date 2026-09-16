path = "src/components/SecurePoCUploader.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

replacements = {
    "[SYSTEM] Uploading to secure sandbox environment...": "[SYSTEM] Initiating secure upload sequence...",
    "[SECURITY] Analyzing filename heuristics...": "[SYSTEM] Validating file parameters...",
    "[ALERT] Path traversal or null-byte injection detected. Request blocked.": "[ERROR] Upload failed. Invalid file request.",
    "[ALERT] Suspicious double extension detected. Possible shell upload attempt.": "[ERROR] Upload failed. Unsupported file structure.",
    "[ERROR] File exceeds 2MB limit. Memory overflow protection activated.": "[ERROR] Upload failed. Request entity too large.",
    "[SECURITY] Verifying Magic Bytes (File Signature)...": "[SYSTEM] Verifying file integrity...",
    "[ERROR] Magic Bytes mismatch. Uploaded file is not a valid image format.": "[ERROR] Upload failed. Corrupted or invalid file.",
    "[SUCCESS] Magic Bytes verified as valid image.": "[SYSTEM] Integrity check passed.",
    "[SECURITY] Stripping EXIF metadata and hidden payloads...": "[SYSTEM] Processing file data...",
    "[SUCCESS] File sanitized.": "[SYSTEM] Processing complete.",
    "[AI VISION] Initiating Neural PoC Analyzer...": "[SYSTEM] Initializing verification engine...",
    "[AI VISION] Scanning screenshot for exploit footprints...": "[SYSTEM] Analyzing submitted proof...",
    "[AI VISION] Validating payload execution impact...": "[SYSTEM] Validating exploit signature...",
    "[AI REJECTED] Invalid PoC. No vulnerability signature or payload detected in the screenshot.": "[ERROR] Validation Failed. Could not verify exploit proof.",
    "[SUCCESS] Valid PoC Accepted! Exploit verified by AI.": "[SUCCESS] Proof accepted. Vulnerability confirmed."
}

for old, new in replacements.items():
    content = content.replace(old, new)

# Also remove the "AI ACTIVE" indicator just to be completely stealthy
content = content.replace(
    """        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[10px] text-gray-400 font-mono">AI ACTIVE</span>
        </div>""",
    ""
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated messages to be generic and stealthy.")
