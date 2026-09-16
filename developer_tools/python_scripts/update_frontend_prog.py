path = "src/lib/auth.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

old_func = """  const isSeverityUnlocked = (domain: string, severity: string): boolean => {
    if (!user) return false;
    if (severity === "information") return true;
    const userUnlocked = user.unlockedSeverities?.[domain] || [];
    if (userUnlocked.includes(severity)) return true;
    // Fallback auto-unlock if requirement is met and already unlocked
    return false;
  };"""

new_func = """  const isSeverityUnlocked = (domain: string, severity: string): boolean => {
    if (!user) return false;
    if (user.isAdmin) return true; // Admins have all labs unlocked
    if (severity === "information") return true;
    const userUnlocked = user.unlockedSeverities?.[domain] || [];
    if (userUnlocked.includes(severity)) return true;
    
    // Auto-unlock if XP requirement is met
    const reqXP = SEVERITY_XP_GATES[severity] || 0;
    if (user.xp >= reqXP) return true;
    
    return false;
  };"""

c = c.replace(old_func, new_func)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed isSeverityUnlocked.")
