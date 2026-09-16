import re

path = "src/app/public/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update state type back to original
content = content.replace(
    "useState<'news' | 'cve' | 'cwe' | 'updates' | 'hardware'>('news')",
    "useState<'news' | 'cve' | 'cwe' | 'updates'>('news')"
)

# 2. Remove from tabs array
hardware_tab_obj = "            { id: 'hardware', label: 'Hardware Toolkit', icon: Zap },\n"
content = content.replace(hardware_tab_obj, "")

# 3. Remove the content block
hardware_tab_content = r"          \{/\* TAB: HARDWARE TOOLKIT \*/\}.*?          \}"
content = re.sub(hardware_tab_content, "", content, flags=re.DOTALL)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Removed Hardware Toolkit from Public Hub.")
