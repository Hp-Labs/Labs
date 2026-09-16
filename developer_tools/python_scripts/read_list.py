with open(r"src/app/red-team/pentesting/[domain]/[severity]/page.tsx", "r", encoding="utf-8") as f:
    print(f.read().encode("ascii", "ignore").decode("ascii")[:500])
