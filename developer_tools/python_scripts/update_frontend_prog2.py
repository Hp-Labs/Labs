path = "src/lib/auth.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

old_func = """  const isLevelUnlocked = (domain: string, severity: string, level: number) => {
    if (level === 1) return isSeverityUnlocked(domain, severity);
    return isLevelCompleted(domain, severity, level - 1) && isSeverityUnlocked(domain, severity);
  };"""

new_func = """  const isLevelUnlocked = (domain: string, severity: string, level: number) => {
    if (user && user.isAdmin) return true; // Admins have all labs unlocked
    if (level === 1) return isSeverityUnlocked(domain, severity);
    return isLevelCompleted(domain, severity, level - 1) && isSeverityUnlocked(domain, severity);
  };"""

c = c.replace(old_func, new_func)
with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed isLevelUnlocked for admins.")
