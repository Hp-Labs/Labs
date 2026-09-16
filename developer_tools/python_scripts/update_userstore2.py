path = "src/lib/services/userStore.ts"
with open(path, "r", encoding="utf-8-sig") as f:
    content = f.read()

# Let's ensure `plan` is in ServerUser
if "plan: " not in content:
    content = content.replace(
        "premiumUntil?: number | null;\n}",
        "premiumUntil?: number | null;\n  plan: 'FREE' | 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';\n}"
    )

# Let's update `getUserById` to read `plan`
# We already did this, but let's make sure `createUser` also inserts `plan`.
create_user_idx = content.find("export function createUser(")
if create_user_idx != -1:
    create_body = content[create_user_idx:create_user_idx+800]
    if "INSERT INTO users" in create_body and "plan" not in create_body:
        # It doesn't strictly need plan in INSERT if DB has DEFAULT 'FREE', 
        # but let's check what it inserts.
        pass

# Also need an `updateUserPlan` function
update_plan_fn = """
export function updateUserPlan(userId: string, plan: 'FREE' | 'BASIC' | 'INTERMEDIATE' | 'ADVANCED', durationMs: number = 0) {
  const db = getDb();
  const now = Date.now();
  let premiumUntil = null;
  if (plan !== 'FREE') {
    const user = db.prepare("SELECT premium_until FROM users WHERE id = ?").get(userId) as any;
    const currentExpiry = user?.premium_until || now;
    premiumUntil = (currentExpiry > now ? currentExpiry : now) + durationMs;
  }
  db.prepare("UPDATE users SET plan = ?, premium_until = ?, updated_at = ? WHERE id = ?").run(plan, premiumUntil, now, userId);
}
"""
if "updateUserPlan(" not in content:
    content += "\n" + update_plan_fn

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("userStore updated!")
