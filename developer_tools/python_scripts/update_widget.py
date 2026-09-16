import os
import re

path = "src/components/AIChatWidget.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# 1. Update imports for pathname
c = c.replace('import { useState, useEffect, useRef } from "react";', 'import { useState, useEffect, useRef } from "react";\nimport { usePathname } from "next/navigation";')

# 2. Add pathname and regex for lab
hook_addition = """
  const pathname = usePathname() || "";
  const labMatch = pathname.match(/\\/labs\\/([^/]+)/) || pathname.match(/\\/pentesting\\/[^/]+\\/[^/]+\\/(\\d+)/);
  const currentLabId = labMatch ? labMatch[1] : undefined;
"""
c = re.sub(r'(const messagesEndRef = useRef<HTMLDivElement>\(null\);)', lambda m: hook_addition + '\n  ' + m.group(1), c)

# 3. Change initial message
old_initial = """{
      role: "bot",
      text: " Hi! I'm the **HpLabs Smart Support Bot**.\\n\\nI can automatically diagnose and fix many common issues  no waiting for a human unless truly needed.\\n\\nWhat's going wrong today?",
    }"""
new_initial = """{
      role: "bot",
      text: "Hi! How can I help you today?\\n\\nTell me what went wrong and I'll help you troubleshoot it.",
    }"""
c = c.replace(old_initial, new_initial)

# 4. Remove small text
c = c.replace('<p className="text-[10px] text-[var(--hp-primary)] font-mono">Auto-diagnose  Self-service  Escalate</p>', '<p className="text-[10px] text-[var(--hp-primary)] font-mono">Online</p>')

# 5. Remove manual escalate link
c = re.sub(r'\{\/\* Contact footer \*\/\}.*?<\/div>', '', c, flags=re.DOTALL)

# 6. Change escalate payload to send labId automatically and do not send name/email since they are server authoritative.
old_payload = """body: JSON.stringify({
          userId: user?.id || "guest",
          name: "HpLabs User", // Would pull from profile
          email: user?.email || "user@hplabs.io",
          phone: user?.phone,
          issueDescription: payloadContext,
          labId: labIdInput || undefined,
          errorCode: "USER_ESCALATION",
          remediationAttempts: messages.filter(m => m.autoFixed).map(m => m.text),
          userAgent: window.navigator.userAgent
        })"""

new_payload = """body: JSON.stringify({
          userId: user?.id || "guest-bypass",
          issueDescription: payloadContext,
          labId: currentLabId || undefined,
          errorCode: "USER_ESCALATION",
          remediationAttempts: messages.filter(m => m.autoFixed).map(m => m.text),
          userAgent: window.navigator.userAgent
        })"""
c = c.replace(old_payload, new_payload)

# Remove the ticket creation text that claims email/whatsapp
# Look for "Our support team has been notified via email and WhatsApp." or similar in AIChatWidget
# It might just use data.message. So data.message in escalate route already says "Your support ticket has been raised."
c = c.replace('text: ` Escalate manually`,', 'text: ` Escalate`,')

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
print("Updated AIChatWidget")
