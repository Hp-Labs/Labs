import os
path = "src/components/AIChatWidget.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('HpLabs Smart Support Bot', 'HpLabs Support Assistant')
c = c.replace('HpLabs Smart Support', 'HpLabs Support')
with open(path, "w", encoding="utf-8") as f:
    f.write(c)
print("Updated chatbot title")
