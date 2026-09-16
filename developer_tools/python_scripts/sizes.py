files_to_read = [
    "src/lib/services/labSessionStore.ts",
    "src/lib/db.ts",
    "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx",
    "src/components/SecurePoCUploader.tsx"
]

for f in files_to_read:
    print(f"\n--- {f} ---")
    with open(f, "r", encoding="utf-8") as file:
        print(len(file.read()), "bytes")
