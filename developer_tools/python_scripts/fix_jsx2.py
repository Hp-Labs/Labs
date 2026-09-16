path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
# Revert <main> wrapper completely
content = re.sub(r'<main className=\{`flex-1 relative \$\{\(!active && isModalOpen\) \? \'pointer-events-none blur-\[4px\] select-none overflow-hidden h-screen\' : \'\'\}`\}>', '', content)
content = content.replace('</main>', '')

# We will apply the class directly to the wrapping div just below Navbar
old_div = """<div className="min-h-screen bg-[var(--hp-bg)] flex flex-col font-sans text-gray-100">
      <Navbar user={user} />"""
      
# Wait, the modal is placed AFTER Navbar. If we blur the main container, the modal must be OUTSIDE of the blurred container.
# So:
# <div className="min-h-screen bg-[var(--hp-bg)] font-sans text-gray-100">
#   {modal}
#   <div className={`flex flex-col min-h-screen ${(!active && isModalOpen) ? 'pointer-events-none blur-[4px] select-none overflow-hidden' : ''}`}>
#      <Navbar user={user} />
#      ... rest of content ...
#   </div>
# </div>

# Let's rebuild the return carefully
content = re.sub(
    r'return \(\s*<div className="min-h-screen bg-\[var\(--hp-bg\)\] flex flex-col font-sans text-gray-100">\s*<Navbar user=\{user\} />',
    r"""return (
    <div className="bg-[var(--hp-bg)] font-sans text-gray-100">
""", content, count=1)

# The modal is already in the content right here:
modal_idx = content.find("{/* Activate Lab Modal Overlay */}")
if modal_idx != -1:
    # insert the new wrapping div right AFTER the modal
    end_modal_idx = content.find("      {/* Main Content Area */}")
    if end_modal_idx != -1:
        # replace "{/* Main Content Area */}" with the wrapping div
        content = content[:end_modal_idx] + "      <div className={`flex flex-col min-h-screen ${(!active && isModalOpen) ? 'pointer-events-none blur-md select-none overflow-hidden' : ''}`}>\n        <Navbar user={user} />" + content[end_modal_idx + 31:]

# And we need to add the closing </div> right before `function MetaItem`
idx = content.find("function MetaItem")
if idx != -1:
    before = content[:idx]
    after = content[idx:]
    
    # We want to replace the LAST `);` in `before` with `</div>);`
    last_return = before.rfind("  );\n}")
    if last_return != -1:
        before = before[:last_return] + "      </div>\n" + before[last_return:]
        
    with open(path, "w", encoding="utf-8") as f:
        f.write(before + after)

print("Fixed JSX tree")
