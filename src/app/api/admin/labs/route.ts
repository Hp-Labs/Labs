import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

import { getSession } from '@/lib/services/sessionStore';




import { requireAdminAPI } from '@/lib/services/adminGuard';

export async function GET(req: Request) {
  const adminUser = await requireAdminAPI();
  if (!adminUser) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });

  
    try {
        const db = getDb();
        const sessions = db.prepare(`
            SELECT ls.lab_session_id, ls.lab_id, ls.start_time, ls.expires_at, ls.completed, u.username
            FROM lab_sessions ls
            JOIN users u ON ls.user_id = u.id
            ORDER BY ls.start_time DESC 
            LIMIT 100
        `).all();
        
        return NextResponse.json({ success: true, data: sessions });
    } catch (e) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
