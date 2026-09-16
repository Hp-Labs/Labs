path = "src/lib/data/types.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

if "targetRequiredForHpVuln?: boolean;" not in c:
    c = c.replace(
        "status: LabStatus;",
        "status: LabStatus;\n  targetRequiredForHpVuln?: boolean;\n  hpVulnIntegrationId?: string;"
    )

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Updated types.ts")
