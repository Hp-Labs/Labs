import re

with open(r"C:\Users\VIJAY\.gemini\antigravity\brain\1c2b0c70-bd06-461b-b6cf-9cf481e0a2cc\coverage_audit.md", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split("\n")
in_table = False
entries = []
for line in lines:
    if line.startswith("| Vulnerability Concept |"):
        in_table = True
        continue
    if line.startswith("|---|"):
        continue
    if in_table and line.startswith("|"):
        parts = [p.strip() for p in line.split("|")]
        if len(parts) >= 3:
            vuln = parts[1]
            labs_raw = parts[2]
            lab_entries = labs_raw.split("<br>")
            lab_list = []
            for lab in lab_entries:
                lab = lab.strip()
                m = re.match(r"`([^`]+)`[:\s]+(.+)", lab)
                if m:
                    lab_list.append((m.group(1).strip(), m.group(2).strip()))
            entries.append((vuln, lab_list))

# Group by domain
domains = {
    "web": [],
    "api": [],
    "cloud": [],
    "net": [],
    "ad": [],
    "mob": [],
    "hist": []
}

for vuln, labs in entries:
    for lab_id, lab_name in labs:
        l = lab_id.lower()
        if l.startswith("web-") or l.startswith("cwe-"):
            domains["web"].append((lab_id, lab_name, vuln))
        elif l.startswith("api-"):
            domains["api"].append((lab_id, lab_name, vuln))
        elif l.startswith("cloud-") or l.startswith("net-cloud"):
            domains["cloud"].append((lab_id, lab_name, vuln))
        elif l.startswith("net-"):
            domains["net"].append((lab_id, lab_name, vuln))
        elif l.startswith("ad-"):
            domains["ad"].append((lab_id, lab_name, vuln))
        elif l.startswith("mob-"):
            domains["mob"].append((lab_id, lab_name, vuln))
        else:
            domains["hist"].append((lab_id, lab_name, vuln))

total = sum(len(v) for v in domains.values())
print(f"Total labs: {total}")
for d, labs in domains.items():
    print(f"{d}: {len(labs)}")

# Now build the markdown artifact
out = []
out.append("# HPLabs – Complete Lab & Vulnerability List\n")
out.append(f"> **Total Labs: {total}** | **Total Unique Vulnerabilities: {len(entries)}**\n")
out.append("")

domain_labels = {
    "web":  ("🌐 Web Application Labs", "web-"),
    "api":  ("🔌 API Labs", "api-"),
    "mob":  ("📱 Mobile Labs", "mob-"),
    "cloud":("☁️ Cloud Labs", "cloud-"),
    "net":  ("🖧 Network / Infrastructure Labs", "net-"),
    "ad":   ("🏢 Active Directory Labs", "ad-"),
    "hist": ("📜 Historical / CVE-specific Labs", "")
}

for key in ["web", "api", "mob", "cloud", "net", "ad", "hist"]:
    label, _ = domain_labels[key]
    labs = domains[key]
    out.append(f"## {label} ({len(labs)} labs)\n")
    out.append("| # | Lab ID | Lab Name | Vulnerability Concept |")
    out.append("|---|--------|----------|-----------------------|")
    for i, (lab_id, lab_name, vuln) in enumerate(labs, 1):
        # clean up encoding issues
        lab_name = lab_name.replace("\u00e2\u0080\u0093", "–").replace("\u00e2\u0080\u009c", '"').replace("\u00e2\u0080\u009d", '"')
        vuln = vuln.replace("\u00e2\u0080\u0093", "–")
        out.append(f"| {i} | `{lab_id}` | {lab_name} | {vuln} |")
    out.append("")

artifact_path = r"C:\Users\VIJAY\.gemini\antigravity\brain\1c2b0c70-bd06-461b-b6cf-9cf481e0a2cc\all_labs_list.md"
with open(artifact_path, "w", encoding="utf-8") as f:
    f.write("\n".join(out))

print("Artifact written!")
