path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8-sig") as f:
    content = f.read()

# 1. Look for Security Monitor
import re
sm_match = re.search(r'Security Monitor.{0,100}', content, re.IGNORECASE)
if sm_match:
    print("Found Security Monitor:", sm_match.group(0))

# 2. Look for Blue Team and Threat Intelligence to see corrupted characters
bt_match = re.search(r'.{0,30}Blue Team.{0,30}', content)
if bt_match:
    print("Found Blue Team:", bt_match.group(0).encode('utf-8', 'replace').decode('utf-8'))

ti_match = re.search(r'.{0,30}Threat Intelligence.{0,30}', content)
if ti_match:
    print("Found Threat Intelligence:", ti_match.group(0).encode('utf-8', 'replace').decode('utf-8'))
