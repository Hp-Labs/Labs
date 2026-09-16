import os

for root, _, files in os.walk("src"):
    for file in files:
        if file.lower() == "navbar.tsx":
            print(os.path.join(root, file))
