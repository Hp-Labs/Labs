import os

auth_snippet = """import { getSession } from '@/lib/services/sessionStore';

function checkAdmin(req: Request) {
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/hplabs_session_id=([^;]+)/);
  if (!match) return false;
  const user = getSession(match[1]);
  return user && user.isAdmin;
}
"""

for root, dirs, files in os.walk("src/app/api/admin"):
    for f in files:
        if f.endswith(".ts"):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8") as file:
                c = file.read()
            
            # If not already patched
            if "checkAdmin" not in c:
                # Add snippet after imports
                # Find last import
                lines = c.split("\n")
                last_import_idx = 0
                for i, l in enumerate(lines):
                    if l.startswith("import"):
                        last_import_idx = i
                
                c = "\n".join(lines[:last_import_idx+1]) + "\n\n" + auth_snippet + "\n" + "\n".join(lines[last_import_idx+1:])
                
                # Replace exported handlers
                for method in ["GET", "POST", "PUT", "DELETE", "PATCH"]:
                    target = f"export async function {method}(req: "
                    if target in c:
                        c = c.replace(target, f"export async function {method}(req: ")
                    else:
                        target2 = f"export async function {method}()"
                        c = c.replace(target2, f"export async function {method}(req: Request)")

                # Now inject the check at the start of every handler block
                import re
                def replacer(m):
                    return m.group(0) + "\n  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });\n"
                
                c = re.sub(r'export async function (GET|POST|PUT|DELETE|PATCH)\([^)]*\)\s*{', replacer, c)
                
                with open(path, "w", encoding="utf-8") as file:
                    file.write(c)
                print(f"Patched {path}")
