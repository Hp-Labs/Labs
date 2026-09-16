import os
def scan_dir(d):
    for root, dirs, files in os.walk(d):
        for f in files:
            if not f.endswith(('.ts', '.tsx', '.json', '.md', '.css')): continue
            p = os.path.join(root, f)
            with open(p, 'rb') as fp:
                try:
                    content = fp.read().decode('utf-8')
                    if "\xc3" in content or "\xc2" in content or "â" in content:
                        print(f"Found Mojibake in {p}")
                except Exception:
                    pass
scan_dir("src")
