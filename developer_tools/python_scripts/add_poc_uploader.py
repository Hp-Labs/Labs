path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# 1. Add SecurePoCUploader import
content = content.replace(
    'import { use, useState, useCallback, useEffect } from "react";',
    'import { use, useState, useCallback, useEffect } from "react";\nimport SecurePoCUploader from "@/components/SecurePoCUploader";'
)

# 2. Replace the entire flag submission section (input + button) with SecurePoCUploader
# The section to replace:
old_flag_section = re.search(
    r'\) : \(\s*<div className="space-y-2">\s*<input[\s\S]*?</button>\s*\n\s*\)\}',
    content
)
if not old_flag_section:
    print("Flag section not found!")
    exit(1)

old_section = old_flag_section.group(0)
new_section = """) : (
                <div className="space-y-2">
                  <SecurePoCUploader onSuccess={() => handleSubmitFlag(true)} />
                </div>
              )}"""

content = content.replace(old_section, new_section)

# 3. Update handleSubmitFlag to accept isPoC param
old_fn = "  const handleSubmitFlag = useCallback(async () => {"
new_fn = "  const handleSubmitFlag = useCallback(async (isPoC = false) => {"
if old_fn in content:
    content = content.replace(old_fn, new_fn)
else:
    # try without useCallback
    old_fn2 = "  const handleSubmitFlag = async () => {"
    new_fn2 = "  const handleSubmitFlag = async (isPoC = false) => {"
    content = content.replace(old_fn2, new_fn2)

# 4. Update the flag value in the fetch to use PoC bypass if isPoC
old_flag_body = re.search(r'flag: flagInput\.trim\(\)', content)
if old_flag_body:
    content = content.replace(
        "flag: flagInput.trim()",
        "flag: isPoC ? \"POC_BYPASS_AUTHORIZED\" : flagInput.trim()"
    )

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Replaced flag input with SecurePoCUploader!")
