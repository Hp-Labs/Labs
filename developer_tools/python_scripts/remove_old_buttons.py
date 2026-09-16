import os
import re

# Remove old button from Navbar
path = 'src/components/Navbar.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

c = re.sub(r'\{\(!user\.dailyBonusClaimedDate.*?<\/button>\n\s*\}\)', '', c, flags=re.DOTALL)
with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

# Remove old button from Profile
path = 'src/app/profile/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

c = re.sub(r'\{\/\* Daily Claim Bonus CTA \*\/\}.*?<\/button>', '', c, flags=re.DOTALL)
with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("Old buttons removed.")
