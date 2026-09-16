with open('src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read().encode('ascii', 'ignore').decode('ascii')

for i, line in enumerate(c.splitlines()):
    if 'support' in line.lower() or 'escalat' in line.lower() or 'diagnos' in line.lower() or 'fix' in line.lower() or 'chatbot' in line.lower() or 'smart' in line.lower():
        print(f"Line {i}: {line.strip()}")
