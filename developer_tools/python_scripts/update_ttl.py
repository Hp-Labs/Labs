path = "src/app/api/labs/[id]/activity/route.ts"
with open(path, "r", encoding="utf-8-sig") as f:
    content = f.read()

import re

# Find the ttlMs assignment block
old_block = """      const isPro = user?.premiumUntil ? user.premiumUntil > Date.now() : false;
      const ttlMs = isPro ? 2 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000;"""

new_block = """      const isPremiumValid = user?.premiumUntil ? user.premiumUntil > Date.now() : false;
      const plan = (isPremiumValid && user?.plan) ? user.plan : 'FREE';
      
      let ttlMs = 45 * 60 * 1000; // Free: 45 min
      if (plan === 'BASIC') ttlMs = 60 * 60 * 1000; // 1 hour
      else if (plan === 'INTERMEDIATE') ttlMs = 90 * 60 * 1000; // 1.5 hours
      else if (plan === 'ADVANCED') ttlMs = 120 * 60 * 1000; // 2 hours
"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated lab TTL logic!")
else:
    print("Could not find old TTL block. Here is the block:")
    match = re.search(r'const user = getUserById\(userId\);[\s\S]*?const newLabSessionId', content)
    if match:
        print(match.group(0))
