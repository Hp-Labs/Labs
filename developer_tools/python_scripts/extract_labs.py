import os
import re
import json

def parse_ts_array(file_path):
    # This is a naive parser. It uses regex to find object properties.
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # We will look for blocks like { id: "...", ... }
    # Since the structure is nested, a quick and dirty way is to extract fields with regex.
    labs = []
    
    # Split by '{' and match id fields to roughly segment labs
    # Better: use regex to match the id block
    matches = re.finditer(r'id:\s*["\']([^"\']+)["\']', content)
    
    for match in matches:
        lab_id = match.group(1)
        start_idx = match.start()
        # find the end of this lab object (roughly the next id: or end of file)
        next_match = content.find('id: "', start_idx + 10)
        if next_match == -1:
            next_match = content.find("id: '", start_idx + 10)
        if next_match == -1:
            next_match = len(content)
            
        block = content[start_idx:next_match]
        
        # Extract fields
        name_m = re.search(r'(?:shortName|name):\s*["\']([^"\']+)["\']', block)
        name = name_m.group(1) if name_m else "Unknown"
        
        cwe_m = re.search(r'cwe:\s*\[(.*?)\]', block)
        cwe = []
        if cwe_m:
            cwe = [x.strip(" \"'") for x in cwe_m.group(1).split(",") if x.strip(" \"'")]
            
        cve_m = re.search(r'cve:\s*\[(.*?)\]', block)
        cve = []
        if cve_m:
            cve = [x.strip(" \"'") for x in cve_m.group(1).split(",") if x.strip(" \"'")]
            
        sev_m = re.search(r'(?:severity|difficulty):\s*["\']([^"\']+)["\']', block)
        severity = sev_m.group(1) if sev_m else "Unknown"
        
        xp_m = re.search(r'xpReward:\s*(\d+)', block)
        xp = xp_m.group(1) if xp_m else "Unknown"
        
        domain_m = re.search(r'domain:\s*["\']([^"\']+)["\']', block)
        domain = domain_m.group(1) if domain_m else "Unknown"
        
        # Determine status
        # Since it's in the TS file, it's at least MOCK/PLACEHOLDER or IMPLEMENTED.
        # Given generateSessionBoundFlag handles all IDs dynamically, they are "PARTIALLY IMPLEMENTED" 
        # (Frontend UI exists, Backend verification exists, but actual TARGET HPVuln doesn't exist yet).
        
        status = "PARTIALLY IMPLEMENTED"
        
        labs.append({
            "id": lab_id,
            "name": name,
            "domain": domain,
            "severity": severity,
            "cwe": cwe,
            "cve": cve,
            "xp": xp,
            "status": status,
            "source": file_path
        })
        
    return labs

all_labs = []

# Parse Red Team Labs
for root, dirs, files in os.walk("src/lib/data/redteam/pentesting"):
    for f in files:
        if f.endswith(".ts"):
            all_labs.extend(parse_ts_array(os.path.join(root, f)))

# Parse Legacy Labs
all_labs.extend(parse_ts_array("src/lib/data/vulnerabilities.ts"))

# Remove duplicates (some modules might export overlapping arrays or just in case)
unique_labs = {}
for lab in all_labs:
    # avoid picking up SubDomains or Modules that also have 'id'
    if lab["id"] in ["web", "api", "network", "cloud", "active-directory", "mobile", "wireless", "iot", "ot-ics", "kubernetes", "container", "pentesting", "red-team-ops", "exploit-dev", "reverse-engineering", "social-engineering"]:
        continue
    unique_labs[lab["id"]] = lab

labs = list(unique_labs.values())

with open("lab_dump.json", "w", encoding="utf-8") as f:
    json.dump(labs, f, indent=2)

print(f"Dumped {len(labs)} unique labs to lab_dump.json")
