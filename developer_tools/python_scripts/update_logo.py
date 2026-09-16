old_url = "https://logowik.com/content/uploads/images/buy-me-a-coffee7219.logowik.com.webp"
new_url = "https://cdn.brandfetch.io/idlFAkJfur/w/192/h/192/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1690821080412"

files_to_update = ["src/app/page.tsx", "src/app/dashboard/page.tsx"]

for path in files_to_update:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if old_url in content:
        content = content.replace(old_url, new_url)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {path}")
    else:
        print(f"URL not found in {path}")
