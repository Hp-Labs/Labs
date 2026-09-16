with open('src/components/AIChatWidget.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
    
idx = c.find('renderEscalationPanel')
if idx != -1:
    print(c[idx:idx+2500].encode('ascii', 'ignore').decode('ascii'))
else:
    print("Not found")
