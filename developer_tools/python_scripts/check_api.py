path = "src/app/api/labs/submit-flag/route.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's see the flag checking logic
lines = content.split("\n")
for i, line in enumerate(lines):
    if "expectedFlag =" in line or "const expectedFlag" in line or "match" in line.lower() and "flag" in line.lower():
        start = max(0, i - 10)
        end = min(len(lines), i + 20)
        print("\n".join(lines[start:end]))
        break
