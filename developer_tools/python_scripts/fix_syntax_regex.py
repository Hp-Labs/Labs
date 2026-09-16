import os
import re

for root, dirs, files in os.walk("src/lib/data"):
    for f in files:
        if f.endswith(".ts"):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8") as file:
                c = file.read()
            
            # Use regex to fix hpVulnIntegrationId: ""some-id"", -> hpVulnIntegrationId: "some-id",
            new_c = re.sub(r'hpVulnIntegrationId:\s*""([^"]+)""', r'hpVulnIntegrationId: "\1"', c)
            
            if new_c != c:
                with open(path, "w", encoding="utf-8") as file:
                    file.write(new_c)

print("Fixed syntax errors using regex.")
