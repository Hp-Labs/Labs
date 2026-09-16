import os

with open('src/app/api/auth/session/route.ts', 'r', encoding='utf-8') as f:
    c = f.read()

replacement = '''
    if (!sessionToken) {
      return NextResponse.json({
        success: true,
        user: {
            id: "guest-bypass",
            username: "hacker_guest",
            email: "guest@hplabs.local",
            phone: "0000000000",
            xp: 2500,
            completedLabs: [],
            completedLevels: {},
            joinedAt: new Date().toISOString(),
            loginStreak: 1,
            lastLoginDate: new Date().toISOString(),
            badges: ["Script Kiddie"],
            certifications: [],
            isPremium: true
          }
      });
    }
'''

c = c.replace("if (!sessionToken) {\n      return NextResponse.json({ success: false }, { status: 401 });\n    }", replacement.strip())

with open('src/app/api/auth/session/route.ts', 'w', encoding='utf-8') as f:
    f.write(c)

