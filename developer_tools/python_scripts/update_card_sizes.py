path = "src/app/hardware/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Change main grid
content = content.replace(
    'className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-4"',
    'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-4"'
)

# Change image container height to h-48 instead of h-56
content = content.replace(
    'className="h-56 w-full relative bg-[#0a0514] border-b border-[var(--hp-border)] overflow-hidden"',
    'className="h-48 w-full relative bg-[#0a0514] border-b border-[var(--hp-border)] overflow-hidden"'
)

# Change content padding from p-6 to p-4
content = content.replace(
    'className="p-6 flex-1 flex flex-col"',
    'className="p-4 flex-1 flex flex-col"'
)

# Title from text-xl to text-lg
content = content.replace(
    'className="text-xl font-bold text-white mb-2"',
    'className="text-lg font-bold text-white mb-2 leading-tight"'
)

# Description text-sm
content = content.replace(
    'className="text-[var(--hp-text-muted)] text-sm mb-6 flex-1"',
    'className="text-[var(--hp-text-muted)] text-sm mb-4 flex-1 line-clamp-3"'
)

# We can also clean up the inner grid inside the modal or features if they are too big,
# but the cards themselves didn't have features directly rendered, or did they?
# Ah, wait! The features are inside the modal? Let's check if the cards have features rendered in them.
# I'll check first, but the replacements above should make the cards much more "Amazon-like".

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated card sizes")
