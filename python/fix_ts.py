import os
import re

# 1. api/notifications/route.ts
with open('src/app/api/notifications/route.ts', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('export async function GET(req) {', 'export async function GET(req: Request) {')
with open('src/app/api/notifications/route.ts', 'w', encoding='utf-8') as f:
    f.write(c)

# 2. api/premium/webhook/route.ts
with open('src/app/api/premium/webhook/route.ts', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('const targetUser = getUserById(userId);', 'const targetUser: any = getUserById(userId);')
with open('src/app/api/premium/webhook/route.ts', 'w', encoding='utf-8') as f:
    f.write(c)

# 3. dashboard/page.tsx
with open('src/app/dashboard/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('React.useEffect', 'useEffect')
c = c.replace('const [notifications, setNotifications] = React.useState([])', 'const [notifications, setNotifications] = useState<any[]>([])')
c = c.replace('data.notifications.map((n) =>', 'data.notifications.map((n: any) =>')
with open('src/app/dashboard/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

# 4. profile/page.tsx
with open('src/app/profile/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('+{vuln.xp} XP', '+50 XP')
with open('src/app/profile/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

# 5. Navbar.tsx - remove duplicate title/aria-label
with open('src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = re.sub(r'aria-label=".*?"\s+aria-label=".*?"', 'aria-label="Toggle Navigation"', c)
c = re.sub(r'title=".*?"\s+title=".*?"', 'title="Toggle Navigation"', c)
with open('src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

# 6. ThemeToggle.tsx
with open('src/components/ThemeToggle.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = re.sub(r'aria-label=".*?"\s+aria-label=".*?"', 'aria-label="Toggle Theme"', c)
c = re.sub(r'title=".*?"\s+title=".*?"', 'title="Toggle Theme"', c)
with open('src/components/ThemeToggle.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

# 7. smartEngine.ts
with open('src/lib/services/smartEngine.ts', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('check: payload.check,', '')
with open('src/lib/services/smartEngine.ts', 'w', encoding='utf-8') as f:
    f.write(c)

