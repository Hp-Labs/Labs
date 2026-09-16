path = "src/app/pricing/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch"',
    'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch"'
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Pricing page grid breakpoints")
