path = "src/app/labs/[id]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

if "placeholder=\"FLAG" in content:
    print("WARNING: placeholder=FLAG is still in labs/[id]/page.tsx!")
else:
    print("labs/[id]/page.tsx is clean.")

path2 = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path2, "r", encoding="utf-8") as f:
    content2 = f.read()

if "placeholder=\"FLAG" in content2:
    print("WARNING: placeholder=FLAG is still in red-team page!")
else:
    print("red-team page is clean.")
