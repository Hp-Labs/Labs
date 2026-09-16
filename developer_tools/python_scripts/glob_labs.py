import os
import glob

print(glob.glob('src/app/api/labs/**/route.ts', recursive=True))
