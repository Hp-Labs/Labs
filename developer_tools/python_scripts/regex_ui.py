import re

path = "src/app/labs/[id]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the input block using regex
# We want to match:
# <div className="space-y-3">
#   <input ... />
#   ...
# </button>
# </div>

pattern = r'<div className="space-y-3">\s*<input[\s\S]*?</button>\s*</div>'
replacement = """<div className="space-y-3 mt-4">
                        <SecurePoCUploader onSuccess={() => handleFlagSubmit(true)} />
                      </div>"""

content, num_subs = re.subn(pattern, replacement, content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print(f"Substitutions made: {num_subs}")
