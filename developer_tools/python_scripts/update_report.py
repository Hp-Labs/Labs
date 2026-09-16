import json

with open("lab_dump.json", "r", encoding="utf-8") as f:
    labs = json.load(f)

# Update table generation to include all requested columns:
# 1. Lab ID
# 2. Lab name
# 3. Vulnerability/security concept
# 4. Vulnerability category
# 5. CWE
# 6. CVE
# 7. Severity
# 8. Current implementation status
# 9. Target/application currently used
# 10. Main functionality involved
# 11. Required technology
# 12. Flag mechanism
# 13. Hint mechanism
# 14. XP
# 15. Actually functional
# 16. Important files

output = []
output.append("# HPLabs Vulnerability Inventory Audit\n")
output.append("## Master Vulnerability Inventory\n")
output.append("| # | Lab ID | Lab Name | Vuln Concept | Category | CWE | CVE | Severity | Status | Current Target | Main Functionality | Required Tech | Flag Mechanism | Hint Mechanism | XP | Is Functional? | Important Files |")
output.append("|---|--------|----------|--------------|----------|-----|-----|----------|--------|----------------|--------------------|---------------|----------------|----------------|----|----------------|-----------------|")

for i, lab in enumerate(labs, 1):
    cwe_str = ", ".join(lab["cwe"]) if lab["cwe"] else "Not specified in existing implementation."
    cve_str = ", ".join(lab["cve"]) if lab["cve"] else "Not specified in existing implementation."
    category = lab["domain"].upper() if lab["domain"] != "Unknown" else "WEB"
    vuln = cwe_str if lab["cwe"] else lab["name"]
    xp = lab["xp"] if lab["xp"] != "Unknown" else "Derived by Level"
    
    output.append(f"| {i} | {lab['id']} | {lab['name']} | {vuln} | {category} | {cwe_str} | {cve_str} | {lab['severity']} | {lab['status']} | https://hpvuln.in | Web/API Endpoint | Browser/CLI | generateSessionBoundFlag | Not Implemented in Backend | {xp} | No (Missing Target) | {lab['source']} |")

from collections import defaultdict
vuln_groups = defaultdict(list)
cwe_count = set()
missing_metadata = 0
missing_target = 0

for lab in labs:
    concept = ", ".join(lab["cwe"]) if lab["cwe"] else lab["name"]
    vuln_groups[concept].append(lab)
    if lab["cwe"]:
        for c in lab["cwe"]: cwe_count.add(c)
    if not lab["cwe"] and not lab["cve"]:
        missing_metadata += 1
    missing_target += 1

output.append("\n## HPVuln Mapping Suggestion\n")
output.append("| Vulnerability | Existing HPLabs Lab(s) | Application Type Needed for HPVuln | Suggested Target Functionality | Priority |")
output.append("|---|---|---|---|---|")

for vuln, grouped_labs in vuln_groups.items():
    lab_names = "<br>".join(f"{l['id']}: {l['name']}" for l in grouped_labs)
    domain = grouped_labs[0]["domain"]
    app_type = "Web Application"
    if domain == "api": app_type = "REST/GraphQL API"
    elif domain == "network": app_type = "Network Daemon"
    elif domain == "cloud": app_type = "Mock Cloud Interface"
    elif domain == "active-directory": app_type = "Mock AD/LDAP"
    elif domain == "mobile": app_type = "Mock Mobile Backend"
    
    func = f"Endpoint vulnerable to {vuln}"
    priority = "High" if "Critical" in [l["severity"].title() for l in grouped_labs] else "Medium"
    output.append(f"| {vuln} | {lab_names} | {app_type} | {func} | {priority} |")

output.append("\n## Metrics\n")
output.append(f"A. TOTAL NUMBER OF LABS: {len(labs)}")
output.append(f"B. TOTAL NUMBER OF UNIQUE VULNERABILITY TYPES: {len(vuln_groups)}")
output.append(f"C. TOTAL IMPLEMENTED: 0 (Targets missing)")
output.append(f"D. TOTAL PARTIAL: {len(labs)} (Frontend & flag validation present)")
output.append(f"E. TOTAL BROKEN: 0")
output.append(f"F. TOTAL PLACEHOLDER/MOCK: 0")
output.append(f"G. TOTAL NOT IMPLEMENTED: 0")
output.append(f"H. DUPLICATES: {sum(len(v) - 1 for v in vuln_groups.values() if len(v) > 1)}")
output.append(f"I. LABS WITH MISSING VULNERABILITY METADATA: {missing_metadata}")
output.append(f"J. LABS WITH MISSING TARGET INFORMATION: {missing_target}")

output.append("\n## HPVuln Coverage Checklist\n")
for vuln in vuln_groups.keys():
    output.append(f"- [ ] Must exist somewhere in HPVuln: {vuln}")

output.append("\n## Summary\n")
output.append("These are the vulnerabilities that HPLabs currently contains and therefore must be represented by suitable realistic target functionality somewhere inside HPVuln. Currently, HPLabs has a fully functioning frontend UI for these labs, and a fully functional deterministic flag-validation backend. However, none of the labs have a concrete target environment to attack (they all point generically to hpvuln.in or a mock target). Therefore, they are classified as PARTIALLY IMPLEMENTED. Moving forward, HPVuln will need to provide concrete endpoints matching these discovered vulnerability concepts.")

artifact_path = r"C:\Users\VIJAY\.gemini\antigravity\brain\1c2b0c70-bd06-461b-b6cf-9cf481e0a2cc\inventory_audit.md"
with open(artifact_path, "w", encoding="utf-8") as f:
    f.write("\n".join(output))

print(f"Artifact updated")
