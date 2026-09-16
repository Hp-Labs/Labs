import os
import re

search_patterns = {
    "hardcoded_otp": r'000000|123456',
    "admin_bypass": r'(?i)x-admin|bypass|force-admin|admin123',
    "xp_manipulation": r'(?i)req\.json\(\).*?xp',
    "plaintext_password": r'(?i)password\s*===?\s*|password\s*:\s*req\.body\.password',
    "insecure_session": r'(?i)Math\.random|Date\.now',
}

results = {k: [] for k in search_patterns.keys()}

for root, dirs, files in os.walk("src"):
    for f in files:
        if not f.endswith((".ts", ".tsx")): continue
        path = os.path.join(root, f)
        with open(path, "r", encoding="utf-8") as fp:
            try:
                lines = fp.readlines()
                for i, line in enumerate(lines):
                    for key, pattern in search_patterns.items():
                        if re.search(pattern, line):
                            results[key].append(f"{path}:{i+1}: {line.strip()}")
            except Exception:
                pass

for k, v in results.items():
    if v:
        print(f"--- {k} ---")
        for match in v[:10]: # Print top 10 matches
            print(match)
        if len(v) > 10: print(f"... and {len(v)-10} more.")
