import { NextRequest, NextResponse } from "next/server";
import { createTicket, getTicket, updateTicketDeliveryStatus } from "@/lib/services/ticketStore";
import { notifySupportTeam, notifyUserTicketCreated } from "@/lib/services/notificationService";
import { getUserState, getUserById } from "@/lib/services/userStore";
import { getSession } from "@/lib/services/sessionStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let {
      userId,
      name,
      email,
      phone,
      issueDescription,
      labId,
      sessionId,
      errorCode,
      remediationAttempts,
      userAgent,
      isSecurityReport,
    } = body;

    // Server-authoritative Identity
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/hplabs_session_id=([^;]+)/);
    const authSessionId = match ? match[1].trim() : null;
    
    let serverUser = null;
    if (authSessionId) {
       const session = getSession(authSessionId);
       if (session) serverUser = getUserById(session.id);
    } 
    
    if (!serverUser) {
        return NextResponse.json({ success: false, message: "Unauthorized. Please log in." }, { status: 401 });
    }

    if (serverUser) {
       userId = serverUser.id;
       name = serverUser.username;
       email = serverUser.email;
       phone = serverUser.phone || "";
    }

    if (!userId || !name || !email || !issueDescription) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: userId, name, email, issueDescription." },
        { status: 400 }
      );
    }
    if (!email.includes("@")) {
      return NextResponse.json({ success: false, message: "Invalid email." }, { status: 400 });
    }
    if (issueDescription.length > 2000) {
      return NextResponse.json({ success: false, message: "Issue description too long." }, { status: 400 });
    }

    const serverState = getUserState(userId);
    const systemDiagnostics = {
      userAgent: userAgent ? String(userAgent).slice(0, 200) : undefined,
      timestamp: new Date().toISOString(),
      serverXP: serverState?.xp,
      serverLabsCompleted: serverState?.completedLabs?.length,
      plan: (serverUser as any)?.isPremium || (serverUser as any)?.premiumUntil ? "Premium" : "Free"
    };

    const ticket = createTicket({
      userId,
      name: String(name).slice(0, 100),
      email: String(email).toLowerCase().trim(),
      phone: String(phone ?? "").slice(0, 20),
      issueDescription: String(issueDescription).slice(0, 2000),
      labId: labId ? String(labId).slice(0, 100) : undefined,
      sessionId: sessionId ? String(sessionId).slice(0, 100) : undefined,
      errorCode: errorCode ? String(errorCode).slice(0, 100) : undefined,
      systemDiagnostics,
      remediationAttempts: Array.isArray(remediationAttempts)
        ? remediationAttempts.slice(0, 10).map(r => String(r).slice(0, 300))
        : [],
    });

    const isSecurity = isSecurityReport || String(issueDescription).toLowerCase().includes("vulnerability") || String(issueDescription).toLowerCase().includes("security flaw");

    const teamNotified = await notifySupportTeam(ticket, isSecurity);
    const userNotified = await notifyUserTicketCreated(ticket);
    
    // Record independently
    updateTicketDeliveryStatus(ticket.ticketId, teamNotified.email, teamNotified.whatsapp);
    
    const deliverySuccess = teamNotified.email === "sent" || teamNotified.whatsapp === "sent" || userNotified === "sent";

    return NextResponse.json({
      success: true,
      ticketId: ticket.ticketId,
      status: ticket.status,
      createdAt: ticket.createdAt,
      message: "Your support ticket has been raised.",
      deliveryStatus: deliverySuccess ? "delivered" : "queued"
    });
  } catch (e: any) {
    console.error("[escalate] Error:", e?.message);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const ticketId = req.nextUrl.searchParams.get("ticketId");
  if (!ticketId) {
    return NextResponse.json({ success: false, message: "ticketId is required." }, { status: 400 });
  }
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
  return NextResponse.json({
    success: true,
    ticketId: ticket.ticketId,
    status: ticket.status,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    issueDescription: ticket.issueDescription.slice(0, 120) + "",
  });
}
