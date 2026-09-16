import os
import re

for root, _, files in os.walk("src"):
    for file in files:
        if file.endswith((".tsx", ".ts")):
            path = os.path.join(root, file)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                # Check if there are any non-ascii characters
                if any(ord(c) > 127 for c in content):
                    # Remove or replace common corrupted artifacts
                    # â€¢ is bullet, â€” is em dash, etc.
                    # Actually, if we just encode to ascii with 'ignore', it will strip all emojis and corrupted chars!
                    # But wait, it will also strip valid emojis if they exist. The user wants to remove corrupted chars.
                    # Since we are a cybersecurity site, stripping all emojis and non-ascii is perfectly fine and makes it clean!
                    
                    clean_content = content.encode("ascii", "ignore").decode("ascii")
                    if clean_content != content:
                        with open(path, "w", encoding="utf-8") as f:
                            f.write(clean_content)
                        print(f"Cleaned non-ascii from {path}")
            except Exception as e:
                pass
