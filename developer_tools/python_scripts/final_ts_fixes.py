path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
content = content.replace("lab.timeLimitMinutes", "lab?.timeLimitMinutes")
content = content.replace("lab.tags.length", "(lab?.tags?.length ?? 0)")
content = content.replace("const { user, addXP, completeLevel,", "const { user, addXP, completeLevel,\n  } = useAuth();\n  const userId = user?.id;")

# For line 153, it's likely the fetch call: `/api/labs/${lab?.id}/activity` or `labId: lab?.id`.
# Let's replace `labId: lab?.id` with `labId: lab?.id || ""`
content = content.replace("labId: lab?.id,", "labId: lab?.id || \"\",")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Manual TS fixes applied")
