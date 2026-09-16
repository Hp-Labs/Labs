path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

print("Occurrences of ΓÇó:", content.count("ΓÇó"))
print("Occurrences of ΓÇ:", content.count("ΓÇ"))
print("Occurrences of \u274c (cross mark):", content.count("\u274c"))
print("Occurrences of ???:", content.count("???"))

# Fix ΓÇó -> •
# Fix ΓÇÖ -> '
# Fix ΓÇ£ -> "
# Fix ΓÇ¥ -> "
# Fix ΓÇô -> -
# Fix ΓÇö -> —

content = content.replace("ΓÇó", "•")
content = content.replace("ΓÇÖ", "'")
content = content.replace("ΓÇ£", '"')
content = content.replace("ΓÇ¥", '"')
content = content.replace("ΓÇô", "-")
content = content.replace("ΓÇö", "—")
content = content.replace("??? Incorrect flag", "❌ Incorrect flag")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Replaced bad characters in page.tsx")
