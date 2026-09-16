import os

path = 'src/lib/services/userStore.ts'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('db.prepare(\n        INSERT INTO daily_claims (user_id, claim_date)\n        VALUES (?, ?)\n      ).run', 'db.prepare(`\n        INSERT INTO daily_claims (user_id, claim_date)\n        VALUES (?, ?)\n      `).run')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
print("Fixed userStore")
