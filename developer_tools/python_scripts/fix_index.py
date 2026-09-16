path = "src/lib/data/redteam/index.ts"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "targetRequiredForHpVuln" in line or "hpVulnIntegrationId" in line:
        continue
    new_lines.append(line)

with open(path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Fixed index.ts")
