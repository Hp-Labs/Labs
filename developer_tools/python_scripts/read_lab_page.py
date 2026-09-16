with open('src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx', 'r', encoding='utf-8') as f:
    print(f.read().encode('ascii', 'ignore').decode('ascii')[:1500])
