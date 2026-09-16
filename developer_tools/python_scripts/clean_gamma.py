import os

def clean_file(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check if there are still any weird chars
    import re
    # We want to replace any leftover mojibake that wasn't caught
    modified = False
    
    if "ΓÇ" in content or "Γ" in content:
        content = re.sub(r'ΓÇ[^\s]*', '•', content) # fallback to bullet
        content = re.sub(r'Γ[^\s]*', '', content) # remove other gammas
        modified = True
        
    if modified:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Cleaned remaining bad chars in {path}")

clean_file("src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx")
print("Done!")
