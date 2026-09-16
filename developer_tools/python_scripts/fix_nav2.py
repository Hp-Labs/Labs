import os

path = 'src/components/Navbar.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

start_idx = c.find("{/* Daily Bonus Claim Button */}")
end_idx = c.find(")}", start_idx) + 2

if start_idx != -1 and end_idx != -1:
    c = c[:start_idx] + c[end_idx:]
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Button absolutely removed!")
else:
    print("Not found")
