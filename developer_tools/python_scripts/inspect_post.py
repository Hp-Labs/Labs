path = "src/app/api/labs/[id]/activity/route.ts"
with open(path, "r", encoding="utf-8-sig") as f:
    content = f.read()

idx = content.find("export async function POST")
if idx != -1:
    print(content[idx:idx+1500])
else:
    print("POST not found")
