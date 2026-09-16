import os
files_to_check = [
    "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx",
    "src/components/SecurePoCUploader.tsx",
    "src/lib/services/labSessionStore.ts",
    "src/app/api/labs/[id]/activity/route.ts",
    "src/app/api/labs/submit-flag/route.ts",
    "src/lib/db.ts"
]

for file in files_to_check:
    print(f"\n{'='*40}\nFILE: {file}\n{'='*40}")
    if os.path.exists(file):
        with open(file, "r", encoding="utf-8") as f:
            content = f.read()
            # Print a snippet or structure. Since files can be large, I'll print the first 1000 chars,
            # and search for relevant keywords (Activate, Session, PoC, Timer)
            print(content[:800].encode('ascii', 'ignore').decode())
            print("\n...[truncated]...\n")
            
            if "page.tsx" in file:
                import re
                matches = re.findall(r'<ActivateLabModal[^>]*>|isActivated|timer|timeLeft', content)
                print("Keywords found in page.tsx:", set(matches))
            if "SecurePoCUploader" in file:
                import re
                matches = re.findall(r'multiple|cooldown|handleUpload|validation', content)
                print("Keywords found in SecurePoCUploader:", set(matches))
    else:
        print("NOT FOUND")
