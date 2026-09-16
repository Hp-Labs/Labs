import os
def scan_dir(d):
    for root, dirs, files in os.walk(d):
        for f in files:
            if not f.endswith('page.tsx'): continue
            p = os.path.join(root, f)
            with open(p, 'r', encoding="utf-8") as fp:
                try:
                    c = fp.read()
                    if 'max-w-' in c and 'max-w-7xl' not in c and 'login' not in p and 'register' not in p:
                        print(f"Non-standard max-w in {p}")
                except Exception:
                    pass
scan_dir("src")
