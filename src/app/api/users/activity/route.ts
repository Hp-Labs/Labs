import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/services/sessionStore";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("hplabs_session_id")?.value;
    if (!sessionId) return NextResponse.json({ success: false }, { status: 401 });
    
    const session = getSession(sessionId);
    if (!session) return NextResponse.json({ success: false }, { status: 401 });

    const db = getDb();
    
    // Get completions for the last 28 days
    const now = Date.now();
    const twentyEightDaysAgo = now - (28 * 24 * 60 * 60 * 1000);
    
    const completions = db.prepare(`
      SELECT completed_at 
      FROM lab_completions 
      WHERE user_id = ? AND completed_at >= ?
    `).all(session.id, twentyEightDaysAgo) as any[];

    // Map to 28-day array (index 0 is today, 27 is oldest)
    const activityMap = new Array(28).fill(0);
    const startOfToday = new Date();
    startOfToday.setHours(23, 59, 59, 999);
    
    for (const c of completions) {
      const diffMs = startOfToday.getTime() - c.completed_at;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 28) {
        activityMap[27 - diffDays]++; // 0 is oldest, 27 is today
      }
    }
    
    const activityData = activityMap.map((count, i) => ({ day: i, count }));

    return NextResponse.json({ success: true, activity: activityData });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
