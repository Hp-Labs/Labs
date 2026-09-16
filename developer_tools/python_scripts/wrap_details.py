path = "src/app/hardware/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's wrap the features & useCases grid in an expandable details tag, OR remove the two-column inner grid to make it single column in smaller cards.
# Wait, if we use details, we can just do:
# <details className="group/details mt-2">
#   <summary className="text-xs text-[var(--hp-primary)] cursor-pointer outline-none select-none mb-2">View Technical Details</summary>
#   <div className="grid grid-cols-1 gap-4 mb-4 mt-2"> ... </div>
# </details>

# The current block starts with: <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
replacement = """
                <details className="group/details mb-4">
                  <summary className="text-sm font-semibold text-[var(--hp-primary)] cursor-pointer select-none outline-none hover:underline flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Technical Details & Use Cases
                  </summary>
                  <div className="flex flex-col gap-4 mt-4 mb-2">
"""

content = content.replace(
    '<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">',
    replacement
)

# And close the details tag where the grid closes
# The grid closes right before {/* Action Buttons */}
content = content.replace(
    '                </div>\n\n                {/* Action Buttons */}',
    '                </div>\n                </details>\n\n                {/* Action Buttons */}'
)

# Also need to make sure Settings is imported from lucide-react.
if "Settings" not in content:
    content = content.replace("Target,", "Target, Settings,")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Wrapped details in collapsible block.")
