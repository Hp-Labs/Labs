import os
import re

with open('src/app/leaderboard/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the broken XpBar progress text:
content = content.replace('{nextRank ?  to next : "MAX"}', '{nextRank ? ${nextRank.minXP - xp} to next : "MAX"}')
content = content.replace('style={{ width: % }}', 'style={{ width: ${progress}% }}')

# Fix medal keys and colors
content = content.replace('label: "??"', 'label: "🥇"').replace('label: "??"', 'label: "🥈"').replace('label: "??"', 'label: "🥉"')

with open('src/app/leaderboard/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

