with open('src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read().encode('ascii', 'ignore').decode('ascii')
    
idx = c.find('setActivating(true)')
if idx != -1:
    print(c[idx-200:idx+2500])
else:
    print("Not found")
