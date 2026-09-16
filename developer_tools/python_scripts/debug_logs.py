path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

debug_inject = """  const { domain, severity, level } = use(params);
  console.log("SERVER SIDE PARAMS:", domain, severity, level);
  const domainId = domain as DomainId;
  const severityId = severity as Severity;
  const levelNum = parseInt(level, 10);
  const { user, addXP, completeLevel, isLevelCompleted, isSeverityUnlocked, isLevelUnlocked } = useAuth();

  const labs = getLabsByDomainAndSeverity(domainId, severityId);
  const lab = labs.find((l) => l.level === levelNum);
  console.log("FOUND LAB?", !!lab, "levelNum:", levelNum, "labs.length:", labs.length);
"""

content = content.replace("  const { domain, severity, level } = use(params);\n  const domainId = domain as DomainId;\n  const severityId = severity as Severity;\n  const levelNum = parseInt(level, 10);\n  const { user, addXP, completeLevel, isLevelCompleted, isSeverityUnlocked, isLevelUnlocked } = useAuth();\n\n  const labs = getLabsByDomainAndSeverity(domainId, severityId);\n  const lab = labs.find((l) => l.level === levelNum);", debug_inject)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
