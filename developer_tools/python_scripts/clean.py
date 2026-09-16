import re

path = "src/lib/data/hardware.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's rebuild the file cleanly.
# 1. Extract the actual items. We can use a regex that matches individual item dictionaries.
item_pattern = re.compile(r'\{\s*id:\s*"[^"]+",\s*name:\s*[\s\S]*?\s*links:\s*\{\s*(?:india:\s*"[^"]+",?)?\s*(?:global:\s*"[^"]+")?\s*\}\s*\}')
matches = item_pattern.findall(content)

# De-duplicate while preserving order
unique_items = []
seen = set()
for item in matches:
    # simple hash check
    if item not in seen:
        seen.add(item)
        unique_items.append(item)

# Create clean interface
interface = """export interface HardwareItem {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  useCases: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  image: string;
  links: {
    india?: string;
    global?: string;
  };
}

export const HARDWARE_INVENTORY: HardwareItem[] = [
"""

new_content = interface + ",\n".join(unique_items) + "\n];\n"

with open(path, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Cleaned up hardware.ts. Found {len(unique_items)} unique items.")
