path = "src/app/hardware/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("ShoppingCart, Globe, MapPin", "Target, ShoppingCart, Globe, MapPin")
with open(path, "w", encoding="utf-8") as f:
    f.write(c)
