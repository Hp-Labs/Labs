path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

if "Deploy Target" in content and "Activate Lab" in content:
    print("Button text exists in file.")
else:
    print("Button text IS MISSING from file!")
