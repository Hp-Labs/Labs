import glob

for f in glob.glob('src/components/**/*.tsx', recursive=True):
    with open(f, 'r', encoding='utf-8') as file:
        if 'chat' in file.read().lower() or 'support' in file.read().lower():
            print(f)
