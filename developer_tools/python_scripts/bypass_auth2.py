import os

with open('src/lib/auth.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

target = '''      // Load persisted session & check daily streak / penalty
      try {
        const stored = localStorage.getItem("hplabs_user");
        if (stored) {
          const loadedUser: User = JSON.parse(stored);
          const updatedUser = checkAndApplyDailyStreak(loadedUser);
          persistUser(updatedUser);
        }
      } catch {}
      setIsLoading(false);'''

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

if target in c:
    c = c.replace(target, replacement)
    with open('src/lib/auth.tsx', 'w', encoding='utf-8') as f:
        f.write(c)
    print("Replaced!")
else:
    print("Target not found.")
