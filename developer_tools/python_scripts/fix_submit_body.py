path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# The function is a simple `() => {` style (no useCallback, no async, no isPoC)
# The original just checks flagInput against uniqueFlag.
# Since uploader always means success (PoC verified), we just call setSolved + the solve logic.
# Simplest fix: update the definition to accept an optional param AND handle isPoC.

old_def = "const handleSubmitFlag = () => {"
old_def2 = "const handleSubmitFlag = (isPoC: boolean = false) => {"

if old_def in content:
    new_def = "const handleSubmitFlag = (isPoC: boolean = false) => {"
    # Also update the body to handle isPoC
    content = content.replace(old_def, new_def)
    # Check the body and add isPoC logic
    # Find the body
    body_start = content.find(new_def) + len(new_def)
    body_end = content.find("\n  };", body_start) + len("\n  };")
    old_body = content[body_start:body_end]
    print("OLD BODY:")
    print(old_body[:500].encode("ascii","replace").decode())
    
    # New body: if isPoC, directly solve. Otherwise check flag.
    new_body = """
    if (isPoC) {
      setSolved(true);
      completeLevel(domainId, severityId, levelNum);
      addXP(lab.xpReward);
      return;
    }
    if (flagInput.trim() === uniqueFlag) {
""" + old_body[old_body.find("if (flagInput.trim() === uniqueFlag) {") + len("if (flagInput.trim() === uniqueFlag) {"):]
    
    content = content[:body_start] + new_body

elif old_def2 in content:
    print("Already has isPoC param. Checking body...")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed handleSubmitFlag!")
