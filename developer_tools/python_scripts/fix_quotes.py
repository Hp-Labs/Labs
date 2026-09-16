path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix the quotes issue
content = content.replace('name: "0.96" OLED Display",', 'name: "0.96\\" OLED Display",')
content = content.replace('name: "0.96\\" OLED Display",', 'name: "0.96 inch OLED Display",') # safer

content = content.replace('name: "1.3" OLED Display",', 'name: "1.3 inch OLED Display",')
content = content.replace('name: "1.8" TFT Display",', 'name: "1.8 inch TFT Display",')
# Wait, let's just do regex
import re
def fix_quotes(match):
    return f'name: "{match.group(1)} inch {match.group(2)}",'

content = re.sub(r'name: "([\d\.]+)" (.*?)",', fix_quotes, content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Quotes fixed.")
