with open("src/lib/data/vulnerabilities.ts", "r", encoding="utf-8") as f:
    c = f.read()
    import re
    matches = re.findall(r'id:\s*["\']([a-zA-Z0-9_-]+)["\']', c)
    print(f"Legacy Labs in VULNERABILITIES: {len(matches)}")
