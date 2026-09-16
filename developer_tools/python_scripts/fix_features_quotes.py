path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('0.1" (', '0.1 inch (')
content = content.replace('0.1")', '0.1 inch)')
content = content.replace('2.54mm (0.1")', '2.54mm (0.1 inch)')
content = content.replace('0.1" (2.54mm)', '0.1 inch (2.54mm)')
content = content.replace('2.54mm (0.1") pitch', '2.54mm (0.1 inch) pitch')
content = content.replace('Color-coded"\n      "Standard 0.1', 'Color-coded",\n      "Standard 0.1')

# Fix any other trailing double quotes or similar things
# Just generic replace:
content = content.replace('0.1"', '0.1 inch')
content = content.replace('0.96"', '0.96 inch')
content = content.replace('1.3"', '1.3 inch')
content = content.replace('1.8"', '1.8 inch')

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed quotes in features.")
