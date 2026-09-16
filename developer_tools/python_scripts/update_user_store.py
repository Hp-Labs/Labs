import os

with open('src/lib/services/userStore.ts', 'r', encoding='utf-8') as f:
    c = f.read()

award_func = '''
export function awardDailyBonus(userId: string): { success: boolean, xpAdded: number, message: string } {
  const db = getDb();
  const today = new Date().toISOString().split("T")[0];
  const bonusXP = 100;
  
  try {
    const claimTx = db.transaction(() => {
      // Attempt to insert claim
      const res = db.prepare(
        INSERT INTO daily_claims (user_id, claim_date)
        VALUES (?, ?)
      ).run(userId, today);
      
      // If user exists, award XP
      if (res.changes > 0) {
        db.prepare("UPDATE users SET xp = xp + ?, updated_at = ? WHERE id = ?").run(bonusXP, Date.now(), userId);
      }
    });
    
    claimTx();
    return { success: true, xpAdded: bonusXP, message: "Daily Login Bonus Claimed! +100 XP Added!" };
  } catch (error: any) {
    // Unique constraint violation -> already claimed
    if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
      return { success: false, xpAdded: 0, message: "Today's daily bonus already claimed!" };
    }
    console.error("Error awarding daily bonus:", error);
    return { success: false, xpAdded: 0, message: "Server error claiming bonus" };
  }
}
'''
if 'awardDailyBonus' not in c:
    c = c + '\n' + award_func
    with open('src/lib/services/userStore.ts', 'w', encoding='utf-8') as f:
        f.write(c)
    print("Added awardDailyBonus to userStore.ts")
else:
    print("awardDailyBonus already exists")
