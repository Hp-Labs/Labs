import json
import os
from collections import defaultdict

with open("lab_dump.json", "r", encoding="utf-8") as f:
    labs = json.load(f)

# Metrics
total_labs = len(labs)

# Group by vulnerability concept (CWE or name if CWE is missing)
vuln_groups = defaultdict(list)
cwe_count = set()
missing_metadata = 0
missing_target = 0

for lab in labs:
    # Determine the vulnerability concept
    concept = ", ".join(lab["cwe"]) if lab["cwe"] else lab["name"]
    vuln_groups[concept].append(lab)
    
    if lab["cwe"]:
        for c in lab["cwe"]:
            cwe_count.add(c)
    
    if not lab["cwe"] and not lab["cve"]:
        missing_metadata += 1
        
    # Since we have no target defined per lab (all point to generic hpvuln.in), target info is essentially missing for all
    missing_target += 1

total_unique_vulns = len(vuln_groups)
total_implemented = 0
total_partial = total_labs  # Because frontend and backend validation exists, but real target is missing
total_broken = 0
total_placeholder = 0
total_not_implemented = 0
duplicates = sum(len(v) - 1 for v in vuln_groups.values() if len(v) > 1)

output = []
output.append("# HPLabs Vulnerability Inventory Audit\n")

output.append("## Master Vulnerability Inventory\n")
output.append("| # | Lab ID | Lab Name | Vulnerability | Category | CWE | CVE | Severity | Status | Current Target | Main Functionality |")
output.append("|---|--------|----------|--------------|----------|-----|-----|----------|--------|---------------|-------------------|")

for i, lab in enumerate(labs, 1):
    cwe_str = ", ".join(lab["cwe"]) if lab["cwe"] else "Not specified in existing implementation."
    cve_str = ", ".join(lab["cve"]) if lab["cve"] else "Not specified in existing implementation."
    
    # We use domain as category for now
    category = lab["domain"].upper() if lab["domain"] != "Unknown" else "WEB"
    vuln = cwe_str if lab["cwe"] else lab["name"]
    
    output.append(f"| {i} | {lab['id']} | {lab['name']} | {vuln} | {category} | {cwe_str} | {cve_str} | {lab['severity']} | {lab['status']} | https://hpvuln.in | Web/API Endpoint |")

output.append("\n## HPVuln Mapping Suggestion\n")
output.append("| Vulnerability | Existing HPLabs Lab(s) | Application Type Needed for HPVuln | Suggested Target Functionality | Priority |")
output.append("|---|---|---|---|---|")

for vuln, grouped_labs in vuln_groups.items():
    lab_names = "<br>".join(f"{l['id']}: {l['name']}" for l in grouped_labs)
    domain = grouped_labs[0]["domain"]
    
    app_type = "Web Application"
    if domain == "api": app_type = "REST/GraphQL API"
    elif domain == "network": app_type = "Network Daemon (SSH/FTP/SMB)"
    elif domain == "cloud": app_type = "Mock Cloud Metadata/S3"
    elif domain == "active-directory": app_type = "Mock AD/LDAP environment"
    elif domain == "mobile": app_type = "Mock Mobile Backend"
    
    func = f"Endpoint vulnerable to {vuln}"
    priority = "High" if "Critical" in [l["severity"].title() for l in grouped_labs] else "Medium"
    
    output.append(f"| {vuln} | {lab_names} | {app_type} | {func} | {priority} |")

output.append("\n## Metrics\n")
output.append(f"A. TOTAL NUMBER OF LABS: {total_labs}")
output.append(f"B. TOTAL NUMBER OF UNIQUE VULNERABILITY TYPES: {total_unique_vulns}")
output.append(f"C. TOTAL IMPLEMENTED: {total_implemented}")
output.append(f"D. TOTAL PARTIAL: {total_partial}")
output.append(f"E. TOTAL BROKEN: {total_broken}")
output.append(f"F. TOTAL PLACEHOLDER/MOCK: {total_placeholder}")
output.append(f"G. TOTAL NOT IMPLEMENTED: {total_not_implemented}")
output.append(f"H. DUPLICATES (Variants of same underlying vuln): {duplicates}")
output.append(f"I. LABS WITH MISSING VULNERABILITY METADATA: {missing_metadata}")
output.append(f"J. LABS WITH MISSING TARGET INFORMATION: {missing_target}")

output.append("\n## HPVuln Coverage Checklist\n")
for vuln in vuln_groups.keys():
    output.append(f"- [ ] Must exist somewhere in HPVuln: {vuln}")

output.append("\n## Summary\n")
output.append("These are the vulnerabilities that HPLabs currently contains and therefore must be represented by suitable realistic target functionality somewhere inside HPVuln. Currently, HPLabs has a fully functioning frontend UI for these labs, and a fully functional deterministic flag-validation backend. However, none of the labs have a concrete target environment to attack (they all point generically to hpvuln.in or a mock target). Therefore, they are classified as PARTIALLY IMPLEMENTED. Moving forward, HPVuln will need to provide concrete endpoints matching these discovered vulnerability concepts.")

# Write to artifact
artifact_path = r"C:\Users\VIJAY\.gemini\antigravity\brain\1c2b0c70-bd06-461b-b6cf-9cf481e0a2cc\inventory_audit.md"
with open(artifact_path, "w", encoding="utf-8") as f:
    f.write("\n".join(output))

print(f"Generated artifact at {artifact_path}")
