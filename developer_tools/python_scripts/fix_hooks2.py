path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split('\n')

# Find the mistakenly placed block
start_mistake = -1
for i, line in enumerate(lines):
    if "if (!unlocked) {" in line:
        start_mistake = i
        break

end_mistake = -1
for i in range(start_mistake, len(lines)):
    if "Return to Domain Overview" in lines[i]:
        # The block ends a few lines after this
        end_mistake = i + 4
        break

if start_mistake != -1 and end_mistake != -1:
    mistake_block = lines[start_mistake:end_mistake+1]
    new_lines = lines[:start_mistake] + lines[end_mistake+1:]
    
    # Now find the REAL main return
    real_return_idx = -1
    for i in range(len(new_lines)-1, -1, -1):
        if new_lines[i].strip() == "return (":
            real_return_idx = i
            break
            
    if real_return_idx != -1:
        final_lines = new_lines[:real_return_idx] + [""] + mistake_block + [""] + new_lines[real_return_idx:]
        with open(path, "w", encoding="utf-8") as f:
            f.write("\n".join(final_lines))
        print("Fixed! Moved to the actual main return.")
    else:
        print("Could not find real return.")
else:
    print("Could not find mistake block.")
