path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix handleSubmitFlag (remove setActive(false))
content = content.replace("setShowSuccess(true);\n              setActive(false);", "setShowSuccess(true);")

# 2. Fix timeout function (remove setActive(false))
# if (t <= 1) { clearInterval(ref); setActive(false); setFailed(true);
content = content.replace("if (t <= 1) { \n                  clearInterval(ref); \n                  setActive(false); \n                  setFailed(true);", "if (t <= 1) { \n                  clearInterval(ref); \n                  setFailed(true);")

# 3. Fix Success close button
content = content.replace("onClick={() => setShowSuccess(false)}", "onClick={() => { setShowSuccess(false); setActive(false); }}")

# 4. Fix Failed acknowledge button
content = content.replace("onClick={() => setFailed(false)}", "onClick={() => { setFailed(false); setActive(false); }}")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed overlay state logic!")
