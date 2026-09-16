path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split('\n')
start = max(0, 100)
end = min(len(lines), 150)
text = "\n".join(f"{i}: {line}" for i, line in enumerate(lines[start:end], start=start))
print(text.encode("ascii", "ignore").decode())
