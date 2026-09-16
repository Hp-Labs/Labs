path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Line 693:     </div>
# Line 694:       </div>
# Line 695:   );
# Line 696: }

# So it has an extra </div>
lines[694] = ""

with open(path, "w", encoding="utf-8") as f:
    f.writelines(lines)
print("Removed extra div")
