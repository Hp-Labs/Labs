with open('src/lib/services/notificationService.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if i >= 200:
        print(f"{i+1}: {line.rstrip()}")
