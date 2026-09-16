import os
import re

def update_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        c = f.read()
    
    # We want to find `id: "some-id",` and inject our two properties right below it.
    def replacer(match):
        lab_id = match.group(1)
        # return original string + new properties
        return f'{match.group(0)}\n    targetRequiredForHpVuln: true,\n    hpVulnIntegrationId: "{lab_id}",'

    # match `id: "web-info-001",` or `id: '...',`
    new_c = re.sub(r'id:\s*(["\'][a-zA-Z0-9_-]+["\']),?', replacer, c)
    
    if new_c != c:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_c)
        return True
    return False

updated_count = 0
for root, dirs, files in os.walk("src/lib/data/redteam/pentesting"):
    for f in files:
        if f.endswith(".ts"):
            if update_file(os.path.join(root, f)):
                updated_count += 1

if update_file("src/lib/data/vulnerabilities.ts"):
    updated_count += 1

print(f"Updated {updated_count} files with HPVuln integration points.")
