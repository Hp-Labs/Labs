path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# 1. Add SecurePoCUploader import (if not already)
if "SecurePoCUploader" not in content:
    content = content.replace(
        'import { use, useState, useCallback, useEffect } from "react";',
        'import { use, useState, useCallback, useEffect } from "react";\nimport SecurePoCUploader from "@/components/SecurePoCUploader";'
    )

# 2. Find and replace the entire `): (... input ... button ... )}` block
# Find the start index
start_marker = '              ) : (\n                <div className="space-y-2">\n                  <input'
start_idx = content.find(start_marker)
if start_idx == -1:
    print("Start marker not found!")
    exit(1)

# Find the matching close )} after this
end_idx = content.find("              )}", start_idx)
if end_idx == -1:
    print("End marker not found!")
    exit(1)
end_idx += len("              )}")

old_block = content[start_idx:end_idx]
print("Replacing block of length", len(old_block))

new_block = """              ) : (
                <div className="space-y-2">
                  <SecurePoCUploader onSuccess={() => handleSubmitFlag(true)} />
                </div>
              )}"""

content = content[:start_idx] + new_block + content[end_idx:]

# 3. Update handleSubmitFlag signature
old_sig1 = "  const handleSubmitFlag = useCallback(async () => {"
old_sig2 = "  const handleSubmitFlag = async () => {"
if old_sig1 in content:
    content = content.replace(old_sig1, "  const handleSubmitFlag = useCallback(async (isPoC = false) => {")
elif old_sig2 in content:
    content = content.replace(old_sig2, "  const handleSubmitFlag = async (isPoC = false) => {")

# 4. Update flag value in fetch body
content = content.replace(
    "flag: flagInput.trim()",
    "flag: isPoC ? \"POC_BYPASS_AUTHORIZED\" : flagInput.trim()"
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Successfully replaced flag input with SecurePoCUploader!")
