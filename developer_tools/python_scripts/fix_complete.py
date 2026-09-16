path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("completeLevel(domainId, severityId, levelNum, lab?.id);", "completeLevel(domainId, severityId, levelNum, lab?.id || \"\");")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed completeLevel param")
