import os
path = "src/components/AIChatWidget.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('"Diagnosing"', '"Thinking..."')
with open(path, "w", encoding="utf-8") as f:
    f.write(c)
print("Updated placeholder")
