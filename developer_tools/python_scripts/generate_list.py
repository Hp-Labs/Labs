import json
from collections import defaultdict

with open("lab_dump.json", "r", encoding="utf-8") as f:
    labs = json.load(f)

vuln_groups = defaultdict(list)
for lab in labs:
    concept = ", ".join(lab["cwe"]) if lab["cwe"] else lab["name"]
    vuln_groups[concept].append(lab)

# Sort alphabetically by concept
sorted_concepts = sorted(vuln_groups.items(), key=lambda x: x[0])

out = []
for concept, group_labs in sorted_concepts:
    # If it's just a CWE, try to get the first lab's name to give it context
    if concept.startswith("CWE"):
        name_context = group_labs[0]["name"]
        out.append(f"- **{concept}** ({name_context}) - *{len(group_labs)} lab variant(s)*")
    else:
        out.append(f"- **{concept}** - *{len(group_labs)} lab variant(s)*")

with open("vuln_list.md", "w", encoding="utf-8") as f:
    f.write("\n".join(out))
print("List generated")
