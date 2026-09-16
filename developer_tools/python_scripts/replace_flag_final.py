import re
path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace both occurrences
# The input block starts with <input type="text" placeholder="FLAG{...}"
# and ends with </button> after Submit
pattern = r'<input[\s\S]*?placeholder="FLAG\{\.\.\.\}"[\s\S]*?</button>'
replacement = '<SecurePoCUploader onSuccess={() => handleSubmitFlag(true)} />'

content, count = re.subn(pattern, replacement, content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print(f"Replaced {count} instances.")
