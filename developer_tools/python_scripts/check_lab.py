path = "src/app/labs/[id]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Print context around flag submission
lines = content.split('\n')
for i, line in enumerate(lines):
    if "Flag" in line or "flag" in line:
        start = max(0, i - 5)
        end = min(len(lines), i + 10)
        print(f"--- Line {i} ---")
        print("\n".join(lines[start:end]))
        break
