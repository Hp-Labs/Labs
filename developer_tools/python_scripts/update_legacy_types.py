path1 = "src/lib/data/redteam/pentesting/ad/labs.ts"
with open(path1, "r", encoding="utf-8") as f:
    c = f.read()
c = c.replace("type LegacyADLab = {", "type LegacyADLab = {\n  targetRequiredForHpVuln?: boolean;\n  hpVulnIntegrationId?: string;")
with open(path1, "w", encoding="utf-8") as f:
    f.write(c)

path2 = "src/lib/data/redteam/pentesting/cloud/labs.ts"
with open(path2, "r", encoding="utf-8") as f:
    c2 = f.read()
c2 = c2.replace("type LegacyCloudLab = {", "type LegacyCloudLab = {\n  targetRequiredForHpVuln?: boolean;\n  hpVulnIntegrationId?: string;")
with open(path2, "w", encoding="utf-8") as f:
    f.write(c2)

print("Updated legacy types.")
