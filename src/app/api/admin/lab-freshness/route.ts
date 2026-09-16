import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdminAPI } from '@/lib/services/adminGuard';

export async function GET() {
  const adminUser = await requireAdminAPI();
  if (!adminUser) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });

  try {
    const db = getDb();
    
    // Get all active sessions
    const activeSessions = db.prepare(`
      SELECT 
        l.lab_session_id,
        l.lab_id,
        l.user_id,
        u.email,
        u.username,
        l.created_at,
        l.expires_at
      FROM lab_sessions l
      JOIN users u ON l.user_id = u.id
      WHERE l.completed = 0
      ORDER BY l.created_at DESC
    `).all();

    return NextResponse.json({ success: true, activeSessions });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const adminUser = await requireAdminAPI();
  if (!adminUser) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });

  try {
    const { action, sessionId } = await req.json();
    const db = getDb();

    if (action === 'reset_all') {
      db.prepare(`DELETE FROM lab_sessions WHERE completed = 0`).run();
      return NextResponse.json({ success: true, message: 'All active lab environments have been hard-reset.' });
    }
    
    if (action === 'reset_one' && sessionId) {
      db.prepare(`DELETE FROM lab_sessions WHERE lab_session_id = ?`).run(sessionId);
      return NextResponse.json({ success: true, message: 'Lab environment hard-reset successfully.' });
    }

    return NextResponse.json({ success: false, message: 'Invalid action.' }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
