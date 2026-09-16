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

if start_idx != -1:
    for i in range(start_idx, len(lines)):
        if "Return to Domain Overview" in lines[i]:
            end_idx = i + 4
            break

print("Start:", start_idx, "End:", end_idx)

if start_idx != -1 and end_idx != -1:
    block = lines[start_idx:end_idx+1]
    new_lines = lines[:start_idx] + lines[end_idx+1:]
    
    # Find the main return (
    # We look for "return (" that is not indented too much, or just the last "return (" in the file.
    main_return_idx = -1
    for i in range(len(new_lines)-1, -1, -1):
        if new_lines[i].strip() == "return (":
            main_return_idx = i
            break
            
    print("Main return:", main_return_idx)
    
    if main_return_idx != -1:
        final_lines = new_lines[:main_return_idx] + [""] + block + [""] + new_lines[main_return_idx:]
        with open(path, "w", encoding="utf-8") as f:
            f.write("\n".join(final_lines))
        print("Moved successfully!")
    else:
        print("Failed to find main return")
else:
    print("Failed to find block")
