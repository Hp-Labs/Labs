import os

with open('src/app/profile/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace broken React interpolations
content = content.replace('style={{ width: % }}', 'style={{ width: ${xpProgress}% }}')

with open('src/app/profile/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

