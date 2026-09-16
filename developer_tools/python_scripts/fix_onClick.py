path = "src/app/labs/[id]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    "onClick={handleFlagSubmit}",
    "onClick={() => handleFlagSubmit(false)}"
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed onClick TS issues.")
