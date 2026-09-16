path = "src/app/api/labs/[id]/activity/route.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()
if "export async function GET" in content:
    print("GET exists!")
else:
    print("GET does not exist.")
