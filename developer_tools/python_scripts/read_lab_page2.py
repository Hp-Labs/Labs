with open('src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read().encode('ascii', 'ignore').decode('ascii')
    
idx = c.find('handleStartLab')
if idx != -1:
    print(c[idx:idx+1500])
else:
    print("handleStartLab not found")
