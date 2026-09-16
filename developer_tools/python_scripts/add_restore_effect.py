path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Add the useEffect right before `const handleActivate = useCallback`
use_effect_block = """  // Restore active session if exists
  useEffect(() => {
    if (!userId || !lab?.id) return;
    fetch(`/api/labs/${lab?.id}/activity`)
      .then(r => r.json())
      .then(d => {
        if (d.active && d.session) {
          setLabSessionId(d.session.labSessionId);
          setActive(true);
          const remaining = Math.max(0, Math.floor((d.session.expiresAt - Date.now()) / 1000));
          setTimeLeft(remaining);
          const ip = TARGET_CONFIG.ip;
          const dom = TARGET_CONFIG.domain;
          setLabIP(ip);
          setLabDomain(dom);
          
          if (remaining > 0) {
            const ref = setInterval(() => {
              setTimeLeft((t) => {
                if (t <= 1) {
                  clearInterval(ref);
                  setFailed(true);
                  fetch(`/api/labs/${lab?.id}/activity`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "timeout", sessionId: d.session.labSessionId, userId })
                  }).then(r => r.json()).then(res => { if(res.penalty) setTimeoutPenalty(res.penalty); }).catch(console.error);
                  return 0;
                }
                return t - 1;
              });
            }, 1000);
            setTimerRef(ref);
          } else {
             setFailed(true);
          }
        }
      })
      .catch(console.error);
  }, [userId, lab?.id]);

"""

content = content.replace("  const handleActivate = useCallback(async () => {", use_effect_block + "  const handleActivate = useCallback(async () => {")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Added useEffect to restore session")
