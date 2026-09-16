import os
import re

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                c = f.read()
            
            original = c
            
            c = re.sub(r'px-\d+\s+(?:sm:px-\d+\s+)?(?:lg:px-\d+\s+)?max-w-\[1440px\]\s+mx-auto', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', c)
            c = re.sub(r'max-w-\[1440px\]\s+mx-auto', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', c)
            c = re.sub(r'max-w-6xl\s+mx-auto', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', c)
            
            # Clean up duplicate px-4 sm:px-6 lg:px-8
            c = re.sub(r'px-\d+\s+(?:sm:px-\d+\s+)?(?:lg:px-\d+\s+)?max-w-7xl\s+mx-auto\s+px-4\s+sm:px-6\s+lg:px-8', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', c)
            
            if original != c:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(c)
                print(f"Updated wrappers in {path}")
