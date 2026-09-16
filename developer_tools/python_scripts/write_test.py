// Since I can't run TS directly easily, I will write a small TS script and use npx tsx to execute it.
const fs = require("fs");
const path = require("path");

const script = `
import { getLabsByDomainAndSeverity } from "./src/lib/data/redteam";
console.log("Fetching web information...");
const labs = getLabsByDomainAndSeverity("web", "information");
console.log("Labs length:", labs.length);
if (labs.length > 0) {
    console.log("First lab level:", labs[0].level);
    const lab = labs.find((l) => l.level === 1);
    console.log("Lab found?", !!lab);
}
`;
fs.writeFileSync("test_labs.ts", script);
