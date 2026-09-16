import os

with open('src/lib/services/userStore.ts', 'r', encoding='utf-8') as f:
    c = f.read()

check_func = '''
export function checkDailyBonusAvailable(userId: string): boolean {
  const db = getDb();
  const today = new Date().toISOString().split("T")[0];
  const row = db.prepare("SELECT 1 FROM daily_claims WHERE user_id = ? AND claim_date = ?").get(userId, today);
  return !row;
}
'''
if 'checkDailyBonusAvailable' not in c:
    c = c + '\n' + check_func
    with open('src/lib/services/userStore.ts', 'w', encoding='utf-8') as f:
        f.write(c)
    print("Added checkDailyBonusAvailable to userStore.ts")
