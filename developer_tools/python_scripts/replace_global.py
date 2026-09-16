import re

path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

pattern = r'<div className="space-y-2">\s*<input[\s\S]*?</button>\s*</div>'
replacement = """<div className="space-y-2">
                  <SecurePoCUploader onSuccess={() => handleSubmitFlag(true)} />
                </div>"""

content, n = re.subn(pattern, replacement, content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("RedTeam: Replaced", n)

path2 = "src/app/labs/[id]/page.tsx"
with open(path2, "r", encoding="utf-8") as f:
    content2 = f.read()
    
content2, n2 = re.subn(pattern, """<div className="space-y-2">
                  <SecurePoCUploader onSuccess={() => handleFlagSubmit(true)} />
                </div>""", content2)
                
with open(path2, "w", encoding="utf-8") as f:
    f.write(content2)
print("LegacyLab: Replaced", n2)
