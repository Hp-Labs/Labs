with open('src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read().encode('ascii', 'ignore').decode('ascii')
    
idx = c.find('Lab Session')
if idx == -1:
    idx = c.find('countdown')
if idx != -1:
    print(c[idx-500:idx+1500])
else:
    print("Not found")
