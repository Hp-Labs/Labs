import glob

# Find the file that matches the labs page
files = glob.glob("src/app/**/page.tsx", recursive=True)
lab_pages = [f for f in files if "labs" in f and "id" in f]
print("Lab pages found:", lab_pages)
