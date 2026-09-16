with open('src/lib/services/notificationService.ts', 'r', encoding='utf-8') as f:
    c = f.read()
    
idx = c.find('async function sendEmail')
print(c[idx:idx+2500].encode('ascii', 'ignore').decode('ascii'))
