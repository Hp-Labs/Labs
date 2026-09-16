with open('src/components/AIChatWidget.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
    
idx = c.find('/* Extra context */')
print(c[idx:idx+1000].encode('ascii', 'ignore').decode('ascii'))
