import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdminAPI } from '@/lib/services/adminGuard';

export async function GET(req: Request) {
  const adminUser = await requireAdminAPI();
  if (!adminUser) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });

  try {
    const db = getDb();
    const events = db.prepare(`
      SELECT 
        s.id,
        s.event_type,
        s.user_id,
        u.email,
        u.username,
        s.ip,
        s.details,
        s.severity,
        s.created_at
      FROM security_events s
      LEFT JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
      LIMIT 200
    `).all();

    return NextResponse.json({ success: true, data: events });
  } catch (e) {
    console.error("Detector API error:", e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
