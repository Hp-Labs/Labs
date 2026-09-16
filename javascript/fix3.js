const fs = require('fs');
const p = "C:/Users/VIJAY/.gemini/antigravity/brain/1c2b0c70-bd06-461b-b6cf-9cf481e0a2cc/scratch/lab_regression.mjs";
let text = fs.readFileSync(p, 'utf8');

text = text.replace(/const setCookie = res\.headers\.get\("set-cookie"\);/, 
    let setCookie = "";
    if (typeof res.headers.getSetCookie === 'function') {
        const cookies = res.headers.getSetCookie();
        if (cookies && cookies.length > 0) setCookie = cookies[0];
    } else {
        setCookie = res.headers.get("set-cookie");
    }
);
fs.writeFileSync(p, text);
