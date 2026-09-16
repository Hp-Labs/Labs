path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# There is a second (original) flag input section that was NOT replaced - it has `disabled={!flagInput.trim()}`
# The first section was replaced correctly, but there was a SECOND occurrence left over.
# Let's remove this leftover second occurrence

# Find the second submit flag block (the old one with input still there)
second_block_start = content.find('              ) : (\n                <div className="space-y-2">\n                  <input')
if second_block_start == -1:
    print("No more old flag inputs found.")
else:
    print("Found second block at", second_block_start)
    end_idx = content.find("              )}", second_block_start) + len("              )}")
    old_block = content[second_block_start:end_idx]
    print("Removing:", old_block[:100].encode("ascii","replace").decode())
    new_block = """              ) : (
                <div className="space-y-2">
                  <SecurePoCUploader onSuccess={() => handleSubmitFlag(true)} />
                </div>
              )}"""
    content = content[:second_block_start] + new_block + content[end_idx:]
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Replaced second flag input too!")
