path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
# Extract state hooks
states = re.findall(r'const\s+\[.*?\]\s*=\s*useState.*', content)
print("States:\n", "\n".join(states))

# Extract useEffects briefly
effects = re.findall(r'useEffect\(\(\)\s*=>\s*\{[\s\S]*?\},', content)
print("\nEffects found:", len(effects))

# Check timer logic
timer = re.findall(r'.{0,50}timeLeft.{0,50}', content)
print("\nTimeLeft logic:\n", "\n".join(timer))

# Check for activate lab modal
modal = re.findall(r'<ActivateLabModal[\s\S]*?/>|<div[^>]*modal[^>]*>[\s\S]*?</div>', content, re.IGNORECASE)
print("\nModals found:", len(modal))

# Check for lock UI
lock = re.findall(r'locked|isActivated', content, re.IGNORECASE)
print("\nLock/Activate references count:", len(lock))
