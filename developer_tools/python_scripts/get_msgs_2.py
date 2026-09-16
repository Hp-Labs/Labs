with open('src/components/AIChatWidget.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
    
idx = c.find('useState<ChatMsg[]>([')
print(c[idx:idx+400].encode('ascii', 'ignore').decode('ascii'))
