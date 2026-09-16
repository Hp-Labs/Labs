with open("src/lib/data/redteam/index.ts", "r", encoding="utf-8") as f:
    c = f.read()
    start = c.find("export function getLabsByDomainAndSeverity")
    end = c.find("export const PENTESTING_SUBDOMAINS", start)
    print(c[start:start+1000])
