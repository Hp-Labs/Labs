import json
import os
import re

missing = []

for root, dirs, files in os.walk("src/lib/data/redteam/pentesting"):
    for f in files:
        if not f.endswith(".ts"): continue
        path = os.path.join(root, f)
        with open(path, "r", encoding="utf-8") as fp:
            c = fp.read()
            matches = re.finditer(r'id:\s*["\']([^"\']+)["\']', c)
            for match in matches:
                lab_id = match.group(1)
                start_idx = match.start()
                next_match = c.find('id: "', start_idx + 10)
                if next_match == -1: next_match = c.find("id: '", start_idx + 10)
                if next_match == -1: next_match = len(c)
                    
                block = c[start_idx:next_match]
                cwe_m = re.search(r'cwe:\s*\[(.*?)\]', block)
                cve_m = re.search(r'cve:\s*\[(.*?)\]', block)
                
                cwe = [x.strip(" \"'") for x in cwe_m.group(1).split(",") if x.strip(" \"'")] if cwe_m else []
                cve = [x.strip(" \"'") for x in cve_m.group(1).split(",") if x.strip(" \"'")] if cve_m else []
                
                name_m = re.search(r'(?:shortName|name):\s*["\']([^"\']+)["\']', block)
                name = name_m.group(1) if name_m else "Unknown"
                
                if not cwe and not cve:
                    missing.append({"id": lab_id, "name": name, "file": path})

print(f"Missing metadata in {len(missing)} labs. Examples:")
for m in missing[:10]:
    print(f"- {m['id']} ({m['name']}) in {m['file']}")
