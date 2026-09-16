path = "src/lib/auth.tsx"
with open(path, "r", encoding="utf-8-sig") as f:
    content = f.read()

old_unlock = """  const isSeverityUnlocked = (domain: string, severity: string): boolean => {
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

new_unlock = """  const isSeverityUnlocked = (domain: string, severity: string): boolean => {
    if (!user) return false;
    if (user.isAdmin) return true;
    
    // Check XP requirements first
    const reqXP = SEVERITY_XP_GATES[severity] || 0;
    const meetsXP = user.xp >= reqXP;
    if (!meetsXP) return false;

    // Evaluate plan-based entitlements
    const isPremiumValid = user.premiumUntil ? user.premiumUntil > Date.now() : false;
    const plan = (isPremiumValid && (user as any).plan) ? (user as any).plan : 'FREE';

    if (plan === 'ADVANCED') return true; // Advanced gets everything
    if (plan === 'INTERMEDIATE' && ['information', 'low', 'medium', 'high'].includes(severity)) return true;
    if (plan === 'BASIC' && ['information', 'low'].includes(severity)) return true;
    if (plan === 'FREE' && severity === 'information') return true;

    // Fallback manual unlocks
    const userUnlocked = user.unlockedSeverities?.[domain] || [];
    if (userUnlocked.includes(severity)) return true;

    return false;
  };"""

if old_unlock in content:
    content = content.replace(old_unlock, new_unlock)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated isSeverityUnlocked!")
else:
    print("Could not find old_unlock block")
