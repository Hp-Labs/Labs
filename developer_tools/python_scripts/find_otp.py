import os
for root, dirs, files in os.walk("src"):
    for f in files:
        if "otp" in f.lower() or "verify" in f.lower():
            print(f"File {os.path.join(root, f)}")
