import { NextResponse } from "next/server";
import { getUserState } from "@/lib/services/userStore";
import { getSession } from "@/lib/services/sessionStore";

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/hplabs_session_id=([^;]+)/);
    const sessionId = match ? match[1] : null;

    if (!sessionId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const sessionUser = getSession(sessionId);
    if (!sessionUser || !sessionUser.id) {
      return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 });
    }

    // Return truth from the server, ignoring client payload
    const state = getUserState(sessionUser.id);
    if (!state) {
        return NextResponse.json({ success: false, message: "User not found on server" }, { status: 404 });
    }

    return NextResponse.json({ success: true, state });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Sync error" }, { status: 500 });
  }
}
