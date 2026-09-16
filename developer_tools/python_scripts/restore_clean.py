import re

with open("original_page.tsx", "r", encoding="utf-16") as f:
    content = f.read()

# 1. Remove the Stop Lab button
# Find and remove the stop lab button block
stop_lab_btn = re.search(r'\s*<button\s[^>]*onClick=\{handleStop\}[\s\S]*?Stop Lab\s*</button>', content)
if stop_lab_btn:
    content = content.replace(stop_lab_btn.group(0), "")
    print("Removed Stop Lab button!")
else:
    print("Stop Lab button not found in original! Searching...")
    idx = content.find("Stop Lab")
    if idx != -1:
        print("Found at idx", idx)
        print(repr(content[idx-200:idx+100]))

# 2. Add useEffect to restore session (timer persistence on refresh)
use_effect = """
  // Restore active session if the user navigates back
  useEffect(() => {
    if (!user?.id || !lab?.id) return;
    fetch(`/api/labs/${lab.id}/activity`)
      .then(r => r.json())
      .then(d => {
        if (d.active && d.session) {
          setLabSessionId(d.session.labSessionId);
          setActive(true);
          const remaining = Math.max(0, Math.floor((d.session.expiresAt - Date.now()) / 1000));
          setTimeLeft(remaining);
          setLabIP(TARGET_CONFIG.ip);
          setLabDomain(TARGET_CONFIG.domain);
          if (remaining > 0) {
            const ref = setInterval(() => {
              setTimeLeft((t) => {
                if (t <= 1) { clearInterval(ref); setActive(false); return 0; }
                return t - 1;
              });
            }, 1000);
            setTimerRef(ref);
          } else {
            setActive(false);
          }
        }
      })
      .catch(() => {});
  }, [user?.id, lab?.id]);

"""

# 3. Add useEffect import
content = re.sub(
    r"import \{ ([^}]+) \} from \"react\";",
    lambda m: f"import {{ {m.group(1)}{', useEffect' if 'useEffect' not in m.group(1) else ''} }} from \"react\";",
    content
)

# 4. Insert useEffect right before the first handler (handleActivate)
content = content.replace("  const handleActivate = useCallback", use_effect + "  const handleActivate = useCallback")

with open("src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Done! Wrote clean page with session restore and NO Stop Lab button!")
