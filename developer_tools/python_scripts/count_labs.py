import re

counts = {
    "Web": 0,
    "API": 0,
    "Cloud": 0,
    "Network": 0,
    "Active Directory (AD)": 0,
    "Mobile": 0,
    "Historical / CVEs": 0
}

with open(r"C:\Users\VIJAY\.gemini\antigravity\brain\1c2b0c70-bd06-461b-b6cf-9cf481e0a2cc\target_blueprint.md", "r", encoding="utf-8") as f:
    lines = f.readlines()

for line in lines:
    if line.startswith("|") and not line.startswith("|---|") and not line.startswith("| Vulnerability"):
        # extract the labs column (part 2)
        parts = [p.strip() for p in line.split("|")]
        if len(parts) >= 3:
            labs_str = parts[2]
            # split by comma, since multiple labs might be in one line
            lab_entries = labs_str.split(", ")
            for lab in lab_entries:
                lab_id = lab.split(":")[0].replace("`", "").strip()
                if lab_id.startswith("web-"):
                    counts["Web"] += 1
                elif lab_id.startswith("api-"):
                    counts["API"] += 1
                elif lab_id.startswith("cloud-"):
                    counts["Cloud"] += 1
                elif lab_id.startswith("net-") and not lab_id.startswith("net-cloud"):
                    # Wait, is there a net-cloud? net-cloud-info-001 exists?
                    counts["Network"] += 1
                elif lab_id.startswith("ad-"):
                    counts["Active Directory (AD)"] += 1
                elif lab_id.startswith("mob-"):
                    counts["Mobile"] += 1
                elif "20" in lab_id or "19" in lab_id or "cve" in lab_id.lower() or lab_id.startswith("SYS"):
                    counts["Historical / CVEs"] += 1
                elif lab_id.startswith("net-cloud"):
                    counts["Cloud"] += 1

print("Counts:")
total = 0
for k, v in counts.items():
    print(f"{k}: {v}")
    total += v
print(f"Total: {total}")
