import os

path = "src/app/api/admin/labs/route.ts"
os.makedirs(os.path.dirname(path), exist_ok=True)
with open(path, "w", encoding="utf-8") as f:
    f.write("""import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
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
""")
print("Created admin/labs API")
