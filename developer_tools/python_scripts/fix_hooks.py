path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split('\n')
# Find the start of the locked block
start_locked = -1
for i in range(50, 150):
    if "if (!unlocked) {" in lines[i] or "if (!unlocked)" in lines[i]:
        start_locked = i
        break

# Find the end of the locked block (which is the closing brace of the if statement)
end_locked = -1
for i in range(start_locked, 150):
    if lines[i].strip() == "}":
        end_locked = i
        break

if start_locked != -1 and end_locked != -1:
    locked_block = lines[start_locked:end_locked+1]
    
    # Remove it from the original position
    new_lines = lines[:start_locked] + lines[end_locked+1:]
    
    # Now find the main return
    main_return_idx = -1
    for i in range(150, len(new_lines)):
        if new_lines[i].strip().startswith("return"):
            main_return_idx = i
            break
            
    if main_return_idx != -1:
        # Insert the locked block right before the main return
        final_lines = new_lines[:main_return_idx] + [""] + locked_block + [""] + new_lines[main_return_idx:]
        
        with open(path, "w", encoding="utf-8") as f:
            f.write("\n".join(final_lines))
        print("Successfully moved the early return block!")
    else:
        print("Could not find main return.")
else:
    print("Could not find locked block.")
