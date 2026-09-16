path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    if "generateStaticParams" in f.read():
        print("Found generateStaticParams")
    else:
        print("No generateStaticParams")
