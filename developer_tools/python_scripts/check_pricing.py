path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

print("Pricing in Landing Page:", "Pricing" in content)

path2 = "src/components/Navbar.tsx"
with open(path2, "r", encoding="utf-8") as f:
    content2 = f.read()
print("Pricing in Navbar:", "Pricing" in content2)
