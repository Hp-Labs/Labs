import os
import re

path = "src/components/AIChatWidget.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# 1. Update text for filing phase
c = c.replace('<p className="text-xs text-[var(--hp-text-muted)]">Notifying the support team via email and WhatsApp.</p>', '<p className="text-xs text-[var(--hp-text-muted)]">Securing ticket information...</p>')

# 2. Remove the Lab ID manual input box
c = re.sub(r'<div>\s*<label[^>]*>\s*Lab ID.*?<\/div>', '', c, flags=re.DOTALL)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Updated AIChatWidget panel")
