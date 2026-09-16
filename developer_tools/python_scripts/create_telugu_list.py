import collections

# Read the blueprint
with open(r"C:\Users\VIJAY\.gemini\antigravity\brain\1c2b0c70-bd06-461b-b6cf-9cf481e0a2cc\target_blueprint.md", "r", encoding="utf-8") as f:
    lines = f.readlines()

families = collections.defaultdict(list)

in_table = False
for line in lines:
    if line.startswith("| Vulnerability"):
        in_table = True
        continue
    if line.startswith("|---|"):
        continue
    if in_table and line.startswith("|"):
        parts = [p.strip() for p in line.split("|")]
        if len(parts) >= 8:
            vuln = parts[1].replace("?", "-")
            labs = parts[2].replace("?", "-")
            family = parts[3]
            families[family].append((vuln, labs))

artifact_content = """# HPLabs Complete Vulnerabilities List

ఈ క్రింద ఇవ్వబడిన జాబితాలో HPLabs లో ఉన్న **అన్ని 222 Vulnerability Concepts** మరియు వాటికి సంబంధించిన **475 Labs** ఉన్నాయి. ఒక్కటి కూడా మిస్ కాకుండా అన్నీ కేటగిరీల వారీగా (Domain/Family) విభజించబడ్డాయి.

"""

for family in sorted(families.keys()):
    artifact_content += f"## {family}\n\n"
    artifact_content += "| Vulnerability Concept | Labs |\n"
    artifact_content += "|-----------------------|------|\n"
    for vuln, labs in families[family]:
        artifact_content += f"| {vuln} | {labs} |\n"
    artifact_content += "\n"

with open(r"C:\Users\VIJAY\.gemini\antigravity\brain\1c2b0c70-bd06-461b-b6cf-9cf481e0a2cc\complete_vulnerabilities_list.md", "w", encoding="utf-8") as f:
    f.write(artifact_content)

print("Artifact created!")
