path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# I added a section called "{/* Hardware Hacking Toolkit Section */}" or "{/* Hardware Toolkit Section */}"
start_str = "{/* Hardware Hacking Toolkit Section */}"
end_str = "</section>"

start_idx = content.find(start_str)
if start_idx != -1:
    end_idx = content.find(end_str, start_idx) + len(end_str)
    # Remove the section
    content = content[:start_idx] + content[end_idx:]
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Removed Hardware Hacking Toolkit Section from landing page.")
else:
    print("Could not find Hardware section.")
