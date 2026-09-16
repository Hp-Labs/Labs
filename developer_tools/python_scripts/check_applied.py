path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

if "Restore active session if exists" in content:
    print("useEffect is IN THE FILE!")
else:
    print("useEffect is MISSING!")
