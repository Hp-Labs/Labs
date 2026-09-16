path = "src/app/api/support/escalate/route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

auth_check = """
  // Authoritative identity check
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/hplabs_session_id=([^;]+)/);
  const authSessionId = match ? match[1].trim() : null;
  let serverUser = null;
  if (authSessionId) {
     const session = getSession(authSessionId);
     if (session) serverUser = getUserById(session.id);
  }
  if (!serverUser) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  const ticket = getTicket(ticketId);
  if (!ticket) return NextResponse.json({ success: false, message: "Ticket not found." }, { status: 404 });
  if (ticket.userId !== serverUser.id && !serverUser.isAdmin) return NextResponse.json({ success: false, message: "Unauthorized access to ticket." }, { status: 403 });
"""

c = c.replace("""
  const ticket = getTicket(ticketId);
  if (!ticket) {
    return NextResponse.json({ success: false, message: "Ticket not found." }, { status: 404 });
  }
""", auth_check)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed IDOR in support GET.")
