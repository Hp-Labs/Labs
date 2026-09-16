path = "src/app/api/labs/[id]/activity/route.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

get_handler = """
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const { id: labId } = await params;
  
  // Find an active session for this user and lab
  const activeSessions = getUserLabSessions(auth.userId).filter(s => s.labId === labId && !s.completed);
  
  if (activeSessions.length > 0) {
     const session = activeSessions[0];
     // Check if it's expired
     if (session.expiresAt && Date.now() > session.expiresAt) {
         destroyLabSession(session.id);
         return NextResponse.json({ active: false });
     }
     return NextResponse.json({ active: true, session });
  }
  return NextResponse.json({ active: false });
}
"""
content += "\n" + get_handler

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Added GET handler to check active sessions.")
