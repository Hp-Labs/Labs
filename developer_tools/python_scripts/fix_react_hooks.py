path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# 1. Strip out the bad try/catch and use() logic
# We need to find everything from `export default function LabDetailPage` to the start of `const [active, setActive]`
start_pattern = r'export default function LabDetailPage\(\{[\s\S]*?\}\) \{[\s\S]*?(?=  // Lab state)'
match = re.search(start_pattern, content)

if match:
    # We will replace this entire top block with a clean, hook-friendly block.
    new_top_block = """export default function LabDetailPage({
  params,
}: {
  params: Promise<{ domain: string; severity: string; level: string }>;
}) {
  const unwrappedParams = use(params);
  const domainId = unwrappedParams.domain as DomainId;
  const severityId = unwrappedParams.severity as Severity;
  const levelNum = parseInt(unwrappedParams.level, 10);
  const { user, addXP, completeLevel, isLevelCompleted, isSeverityUnlocked, isLevelUnlocked } = useAuth();
"""
    content = content.replace(match.group(0), new_top_block)
else:
    print("Could not find start pattern")

# Now we must move `const labs`, `const lab`, `const cfg` BELOW all hooks?
# No, `useState` doesn't depend on them being below, we can compute pure variables anywhere.
# BUT we cannot early return `if (!lab)` before the hooks!
# So we move `if (!lab) return <div>404</div>;` to the BOTTOM of the component, just above `if (!unlocked)`.

# First, let's remove any `if (!lab) ...` blocks from the current file.
content = re.sub(r'  if \(!lab\) \{[\s\S]*?make sure the URL is correct\.</p>\n\s*</div>\n\s*\);\n\s*\}', '', content)
content = re.sub(r'  if \(!lab\) notFound\(\);', '', content)

# Now inject `labs`, `lab`, `cfg`, `prevLab`, `nextLab` right after `useAuth()`
pure_vars = """
  const labs = getLabsByDomainAndSeverity(domainId, severityId);
  const lab = labs.find((l) => l.level === levelNum);
  const cfg = SEVERITY_CONFIG[severityId];
  const prevLab = labs.find((l) => l.level === levelNum - 1);
  const nextLab = labs.find((l) => l.level === levelNum + 1);

  // Lab state
"""
content = content.replace("  // Lab state\n", pure_vars)

# Now, we must fix the `useEffect` and `useCallback` to handle `lab` possibly being undefined safely.
# Replace `lab.id` with `lab?.id` inside hooks.
content = content.replace("lab.id", "lab?.id")
content = content.replace("lab.xpReward", "lab?.xpReward")
content = content.replace("lab.timeLimitMinutes", "lab?.timeLimitMinutes")
content = content.replace("lab.tags", "lab?.tags")

# Now inject the `if (!lab) notFound();` AFTER all hooks, right before `if (!unlocked)`
# Let's find `  if (!unlocked) {` and put it right above.
early_returns = """  if (!lab) notFound();

  if (!unlocked) {"""
content = content.replace("  if (!unlocked) {", early_returns)

# Also fix the TS error for `lab.tags.length` since lab might be undefined in the JSX (even though the early return catches it, TS might complain if it doesn't infer).
# Actually TS knows `notFound()` never returns.

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Hooks order fixed!")
