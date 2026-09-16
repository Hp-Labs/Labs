const fs = require('fs');
const p = "C:/Users/VIJAY/.gemini/antigravity/brain/1c2b0c70-bd06-461b-b6cf-9cf481e0a2cc/scratch/lab_regression.mjs";
let text = fs.readFileSync(p, 'utf8');

text = text.replace(/recordResult\(labId, labId, severity, "unknown", checks\);/, 
    let overallStatus = "PASS";
    if (checks.some(c => c.status === "FAIL")) overallStatus = "FAIL";
    else if (checks.some(c => c.status === "WARN")) overallStatus = "WARN";
    recordResult(labId, labId, severity, overallStatus, checks);
);
fs.writeFileSync(p, text);
