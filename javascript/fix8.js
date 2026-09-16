const fs = require('fs');
const p = "C:/Users/VIJAY/.gemini/antigravity/brain/1c2b0c70-bd06-461b-b6cf-9cf481e0a2cc/scratch/lab_regression.mjs";
let text = fs.readFileSync(p, 'utf8');

text = text.replace(/\/api\/auth\/otp\/send/g, '/api/auth/register-otp');
text = text.replace(/const userId = "regression_test_user_v2";/g, 'const userId = "regression_user_" + Date.now();');

fs.writeFileSync(p, text);
