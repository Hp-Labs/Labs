import os
for root, dirs, files in os.walk("src/app/red-team"):
    for f in files:
        if f == "page.tsx":
            print(os.path.join(root, f))
