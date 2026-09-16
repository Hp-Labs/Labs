import glob
for f in glob.glob('src/**/*.tsx', recursive=True):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read().lower()
        if 'smart support' in content or 'smart' in content:
            print(f)
