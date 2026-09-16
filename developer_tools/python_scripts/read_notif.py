with open('src/lib/services/notificationService.ts', 'r', encoding='utf-8') as f:
    c = f.read().encode('ascii', 'ignore').decode('ascii')
    
idx = c.find('async function sendEmail')
print(c[idx:idx+2000])
