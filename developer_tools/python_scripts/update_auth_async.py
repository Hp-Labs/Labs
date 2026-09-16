import os

with open('src/lib/auth.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('claimDailyBonus: () => { success: boolean; message: string; xpAdded: number };', 'claimDailyBonus: () => Promise<{ success: boolean; message: string; xpAdded: number }>;\n  checkDailyBonusAvailable: () => Promise<boolean>;\n  markModalSeen: () => void;\n  dailyModalSeen: boolean;')

new_claim = """
  const checkDailyBonusAvailable = async () => {
    if (!user) return false;
    try {
      const res = await fetch(`/api/users/daily-bonus?userId=${user.id}`);
      const data = await res.json();
      return data.available === true;
    } catch {
      return false;
    }
  };

  const claimDailyBonus = async () => {
    if (!user) return { success: false, message: "Not logged in", xpAdded: 0 };
    
    try {
      const res = await fetch("/api/users/daily-bonus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();
      
      if (data.success) {
        const today = new Date().toISOString().split("T")[0];
        const updated: User = {
          ...user,
          xp: user.xp + data.xpAdded,
          dailyBonusClaimedDate: today,
        };
        persistUser(updated);
      }
      return data;
    } catch (error) {
      return { success: false, message: "Network error", xpAdded: 0 };
    }
  };

  const [dailyModalSeen, setDailyModalSeen] = useState(false);
  const markModalSeen = () => setDailyModalSeen(true);
"""

import re
c = re.sub(r'const claimDailyBonus = \(\) => \{.*?\n  \};\n', lambda m: new_claim + '\n', c, flags=re.DOTALL)
c = c.replace('addXP, claimDailyBonus,', 'addXP, claimDailyBonus, checkDailyBonusAvailable, markModalSeen, dailyModalSeen,')

with open('src/lib/auth.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
print("Updated auth.tsx for async claim")
