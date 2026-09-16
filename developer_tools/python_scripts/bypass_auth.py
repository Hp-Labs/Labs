import os

with open('src/lib/auth.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

replacement = '''
      try {
        const stored = localStorage.getItem("hplabs_user");
        if (stored) {
          const loadedUser: User = JSON.parse(stored);
          setUser(checkAndApplyDailyStreak(loadedUser));
        } else {
          // TEMP BYPASS: Auto-login disabled registration for now
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
          setUser(mockUser);
          localStorage.setItem("hplabs_user", JSON.stringify(mockUser));
        }
      } catch (err) {
        console.warn("Storage restricted", err);
      } finally {
        setIsLoading(false);
      }
'''

import re
# Find the try/catch block inside useEffect for localStorage
c = re.sub(r'try\s*\{\s*const stored = localStorage\.getItem\("hplabs_user"\);\s*if \(stored\) \{\s*const loadedUser: User = JSON\.parse\(stored\);\s*setUser\(checkAndApplyDailyStreak\(loadedUser\)\);\s*\}\s*\} catch \(err\) \{\s*console\.warn\("Storage restricted", err\);\s*\} finally \{\s*setIsLoading\(false\);\s*\}', replacement.strip(), c, flags=re.DOTALL)

with open('src/lib/auth.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
