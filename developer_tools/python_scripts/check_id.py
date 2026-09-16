import glob

for f in glob.glob('src/app/api/auth/**/route.ts', recursive=True):
    with open(f, 'r', encoding='utf-8') as file:
        print(f"--- {f} ---")
        lines = file.readlines()
        for i, line in enumerate(lines):
            if 'id:' in line or 'uuid' in line or 'random' in line:
                print(line.strip())
