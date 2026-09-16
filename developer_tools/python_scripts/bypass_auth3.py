import os
import re

with open('src/lib/auth.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

replacement = '''      // Load persisted session & check daily streak / penalty
      try {
        const stored = localStorage.getItem("hplabs_user");
        if (stored) {
          const loadedUser: User = JSON.parse(stored);
          const updatedUser = checkAndApplyDailyStreak(loadedUser);
          persistUser(updatedUser);
        } else {
          const mockUser: User = {
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
          };
          persistUser(mockUser);
        }
      } catch {}
      setIsLoading(false);'''

c = re.sub(r'// Load persisted session & check daily streak / penalty.*?setIsLoading\(false\);', replacement.strip(), c, flags=re.DOTALL)

with open('src/lib/auth.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
print("Replaced with regex.")
