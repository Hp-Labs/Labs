import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/services/sessionStore';

export async function GET(req: Request) {
    try {
        const cookieHeader = req.headers.get("cookie") || "";
        const match = cookieHeader.match(/hplabs_session_id=([^;]+)/);
        const sessionId = match ? match[1] : null;
        if (!sessionId) return NextResponse.json({ success: false }, { status: 401 });
        
        const sessionUser = getSession(sessionId);
        if (!sessionUser) return NextResponse.json({ success: false }, { status: 401 });
        
        const db = getDb();
        const notifications = db.prepare('SELECT id, title, message, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 5').all(sessionUser.userId);
        
        if (notifications.length === 0) {
            // Seed a welcome notification for new users
            db.prepare('INSERT INTO notifications (user_id, title, message, created_at) VALUES (?, ?, ?, ?)').run(sessionUser.userId, 'Welcome', 'Welcome to HPLabs. Explore your dashboard.', Date.now());
            notifications.push({ id: 1, title: 'Welcome', message: 'Welcome to HPLabs. Explore your dashboard.', created_at: Date.now() });
        }
        
        return NextResponse.json({ success: true, data: notifications });
    } catch (e) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
