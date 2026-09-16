with open('src/components/AIChatWidget.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
    
idx = c.find('useState<ChatMessage[]>([')
print(c[idx:idx+500])
