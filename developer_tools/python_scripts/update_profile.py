import os
import re

path = "src/app/profile/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Replace ACTIVITY mock with state
old_mock = """// Activity heatmap mock data (last 28 days)  deterministic to avoid hydration mismatch
const ACTIVITY = Array.from({ length: 28 }, (_, i) => {
  const s1 = Math.abs(Math.sin(i * 17.3 + 1) * 10000) % 1;
  const s2 = Math.abs(Math.sin(i * 31.7 + 2) * 10000) % 1;
  return { day: i, count: s1 > 0.6 ? Math.floor(s2 * 3) + 1 : 0 };
});"""

c = c.replace(old_mock, "")

# Add state
c = c.replace('const { user } = useAuth();', 'const { user } = useAuth();\n  const [activity, setActivity] = useState<{day: number, count: number}[]>(Array(28).fill(0).map((_, i) => ({day: i, count: 0})));')

# Add fetch in useEffect
use_effect_addition = """
    if (user) {
      fetch("/api/users/activity")
        .then(r => r.json())
        .then(d => { if(d.success) setActivity(d.activity); })
        .catch(() => {});
    }
"""
c = re.sub(r'(useEffect\(\(\) => \{)', r'\1' + use_effect_addition, c)

# Replace ACTIVITY variable with activity state
c = c.replace('ACTIVITY.map((', 'activity.map((')
c = c.replace('ACTIVITY.filter((', 'activity.filter((')
c = c.replace('ACTIVITY.reduce((', 'activity.reduce((')
c = c.replace('ACTIVITY[27]', 'activity[27]')

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
print("Updated profile page")
