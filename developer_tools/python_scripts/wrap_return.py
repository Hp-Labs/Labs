path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()
lines = content.split('\n')

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "if (!unlocked) {" in line:
        start_idx = i
        break

for i in range(start_idx, len(lines)):
    if "Return to Domain Overview" in lines[i]:
        end_idx = i + 4
        break

locked_jsx = "\n".join(lines[start_idx+2 : end_idx]) # Skip the if and return (
locked_jsx = locked_jsx.rstrip().rstrip(";") # Remove trailing semicolon

# Remove the locked block from lines
new_lines = lines[:start_idx] + lines[end_idx+1:]

# Find main return
main_return_idx = -1
for i in range(len(new_lines)):
    if new_lines[i].strip() == "return (":
        main_return_idx = i
        break

final_lines = new_lines[:main_return_idx] + [
    "  if (!unlocked) {",
    "    const userXP = user?.xp ?? 0;",
    "    return (",
] + locked_jsx.split('\n') + [
    "    );",
    "  }",
    "  return ("
] + new_lines[main_return_idx+1:]

with open(path, "w", encoding="utf-8") as f:
    f.write("\n".join(final_lines))
print("Moved early return safely to the bottom.")
