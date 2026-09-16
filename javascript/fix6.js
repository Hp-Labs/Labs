const fs = require('fs');
const p = "C:/Users/VIJAY/.gemini/antigravity/brain/1c2b0c70-bd06-461b-b6cf-9cf481e0a2cc/scratch/lab_regression.mjs";
let text = fs.readFileSync(p, 'utf8');

text = text.replace(/await api\("POST", "\/api\/auth\/register", \{/, 
  const regRes = await api("POST", "/api/auth/register", {);

text = text.replace(/phoneOTP: "000000"(\r?\n)\s*\}\);/, phoneOTP: "000000"\n  });\n  console.log("Register response:", regRes.status, regRes.json););

fs.writeFileSync(p, text);
