path = "src/app/api/labs/[id]/activate/route.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
content = re.sub(
    r'export async function POST\(req: Request, \{ params \}: \{ params: \{ id: string \} \}\) \{',
    'export async function POST(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {\n  const resolvedParams = await params;\n  const labId = resolvedParams.id;',
    content
)

content = content.replace("const labId = params.id;", "")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed activate API params")
