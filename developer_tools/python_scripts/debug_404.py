path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

robust_params = """  // Robust params handling
  let domain, severity, level;
  try {
    const resolved = params instanceof Promise ? use(params) : params;
    domain = (resolved as any).domain;
    severity = (resolved as any).severity;
    level = (resolved as any).level;
  } catch (e) {
    domain = (params as any).domain;
    severity = (params as any).severity;
    level = (params as any).level;
  }
"""

content = content.replace("  const { domain, severity, level } = use(params);", robust_params)

robust_lab = """  if (!lab) {
    return (
      <div className="p-20 text-white font-mono">
        <h1>404 Lab Not Found (Debug)</h1>
        <p>Domain: {domain}</p>
        <p>Severity: {severity}</p>
        <p>Level: {level}</p>
        <p>LevelNum: {levelNum}</p>
        <p>Labs Array Length: {labs?.length}</p>
        <p>Make sure the URL is correct.</p>
      </div>
    );
  }"""

content = content.replace("  if (!lab) notFound();", robust_lab)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Added debug info to LabDetailPage instead of hard 404.")
