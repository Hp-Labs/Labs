with open("src/app/api/support/route.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()
for i in range(240, 255):
    try:
        print(f"{i+1}: {lines[i].strip()}".encode("ascii", "ignore").decode("ascii"))
    except:
        pass
