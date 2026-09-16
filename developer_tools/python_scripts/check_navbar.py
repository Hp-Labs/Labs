with open('src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    c = f.read().encode('ascii', 'ignore').decode('ascii')
    
for i, line in enumerate(c.splitlines()):
    if 'support' in line.lower() or 'smart' in line.lower():
        print(f"Line {i}: {line.strip()}")
