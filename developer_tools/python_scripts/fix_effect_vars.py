path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# The original uses `lab.id` not TARGET_CONFIG
# Replace the useEffect we added with a corrected version that uses the right variable names

old_effect = """
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

new_effect = """
  // Restore active session if the user navigates back
  useEffect(() => {
    const labId = lab?.id;
    if (!userId || !labId) return;
    fetch(`/api/labs/${labId}/activity`)
      .then(r => r.json())
      .then(d => {
        if (d.active && d.session) {
          setActive(true);
          const remaining = Math.max(0, Math.floor((d.session.expiresAt - Date.now()) / 1000));
          setTimeLeft(remaining);
          setLabIP(d.session.targetIp || labId);
          setLabDomain(d.session.targetDomain || labId);
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
  }, [userId, lab?.id]);

"""

content = content.replace(old_effect, new_effect)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed useEffect to use correct variable names!")
