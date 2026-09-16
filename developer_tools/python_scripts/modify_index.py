import os

path = r"src/lib/data/redteam/index.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

sorting_func = """
// Helper to sort labs by commonality/popularity without exposing metadata in the UI
function sortLabsByPopularity(labs: Lab[]): Lab[] {
  const priority: Record<string, number> = {
    // Tier 1 - The absolute classics
    "CWE-89": 100, "CWE-79": 99,
    "SQL Injection": 100, "Cross-Site Scripting": 99, "XSS": 99,
    
    // Tier 2 - Very common OWASP Top 10
    "CWE-639": 95, "CWE-284": 95, "IDOR": 95, "BOLA": 95,
    "CWE-287": 94, "Authentication": 94,
    "CWE-352": 93, "CSRF": 93,
    
    // Tier 3 - Common structural issues
    "CWE-918": 90, "SSRF": 90,
    "CWE-22": 89, "Traversal": 89, "LFI": 89,
    "CWE-434": 88, "File Upload": 88,
    
    // Tier 4 - Well known but slightly less prevalent than top tiers
    "CWE-611": 85, "XXE": 85,
    "CWE-200": 84, "CWE-74": 83, "CWE-94": 83, "CWE-78": 83,
    "Command Injection": 83, "CWE-502": 80, "Deserialization": 80,
  };

  return [...labs].sort((a, b) => {
    const getScore = (lab: Lab) => {
      let score = 0;
      for (const c of lab.cwe || []) if (priority[c]) score = Math.max(score, priority[c]);
      for (const [kw, val] of Object.entries(priority)) {
        if (lab.name.toLowerCase().includes(kw.toLowerCase())) score = Math.max(score, val);
      }
      return score;
    };
    
    const scoreA = getScore(a);
    const scoreB = getScore(b);
    
    if (scoreA !== scoreB) return scoreB - scoreA;
    // Keep stable alphabetical sort for remainder to ensure deterministic output
    return a.name.localeCompare(b.name);
  });
}
"""

# Insert sorting function before getLabsByDomainAndSeverity
c = c.replace("export function getLabsByDomainAndSeverity(", sorting_func + "\nexport function getLabsByDomainAndSeverity(")

# Wrap returns with sortLabsByPopularity
import re

def replacer(match):
    # Match group 1 is the case statement and return keyword, group 2 is the array/variable
    return f"{match.group(1)} sortLabsByPopularity({match.group(2)});"

c = re.sub(r'(case\s+"[^"]+":\s*return\s+)([^;]+);', replacer, c)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Updated index.ts with dynamic sorting.")
