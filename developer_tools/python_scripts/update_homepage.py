path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove SecurityMonitor
import re
content = re.sub(r'\{/\* Security Monitor \*/\}\s*<SecurityMonitor />', '', content)

# It might have been imported at the top, let's remove the import too.
content = re.sub(r'import\s+SecurityMonitor\s+from\s+[^;]+;', '', content)

# Update HackerPlus text
old_text = "The parent platform behind HpLabs. HackerPlus is India's premier cybersecurity training ecosystem, offering professional courses, certifications, and real-world skills to turn beginners into elite hackers."
new_text = "The parent platform behind HpLabs. HackerPlus is India's premier cybersecurity training and services ecosystem, offering professional courses, certifications, and top-tier security services for organizations."

if old_text in content:
    content = content.replace(old_text, new_text)
else:
    print("Could not find the old HackerPlus text to replace")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated page.tsx successfully")
