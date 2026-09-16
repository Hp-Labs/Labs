const fs = require('fs');
const p = "C:/Users/VIJAY/.gemini/antigravity/brain/1c2b0c70-bd06-461b-b6cf-9cf481e0a2cc/scratch/lab_regression.mjs";
let text = fs.readFileSync(p, 'utf8');
text = text.replace(/console\.log\(\\n\[Discovery\] Probing \+ candidates\.length \+  candidate IDs\.\.\.\);/g, 'console.log("\\n[Discovery] Probing " + candidates.length + " candidate IDs...");');
text = text.replace(/console\.log\(\[Discovery\] Found \+ found\.length \+  labs\.\\n\);/g, 'console.log("[Discovery] Found " + found.length + " labs.\\n");');
fs.writeFileSync(p, text);
