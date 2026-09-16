path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()
lines = content.split('\n')
start = max(0, 875)
end = min(len(lines), 905)
print("\n".join(lines[start:end]).encode("ascii", "ignore").decode())
