path = "src/app/hardware/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Add ChevronDown import
if "ChevronDown" not in content:
    content = content.replace("ExternalLink,", "ExternalLink, ChevronDown,")

# Replace the summary block
old_summary = """                <details className="group/details mb-4">
                  <summary className="text-sm font-semibold text-[var(--hp-primary)] cursor-pointer select-none outline-none hover:underline flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Technical Details & Use Cases
                  </summary>"""

new_summary = """                <details className="group/details mb-4">
                  <summary className="text-sm font-semibold text-[var(--hp-primary)] cursor-pointer select-none outline-none hover:underline flex items-center justify-between gap-2 list-none [&::-webkit-details-marker]:hidden">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Technical Details & Use Cases
                    </div>
                    <ChevronDown className="w-4 h-4 transition-transform duration-300 group-open/details:rotate-180" />
                  </summary>"""

if old_summary in content:
    content = content.replace(old_summary, new_summary)
else:
    print("Could not find the exact old summary block.")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Added ChevronDown to details summary.")
