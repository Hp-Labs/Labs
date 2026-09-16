import os

path = "src/app/api/admin/users/route.ts"
os.makedirs(os.path.dirname(path), exist_ok=True)
with open(path, "w", encoding="utf-8") as f:
    f.write("""import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
    try {
        const db = getDb();
        const users = db.prepare(`
            SELECT id, username, email, role, is_admin, xp, premium_until, created_at
            FROM users 
            ORDER BY created_at DESC 
            LIMIT 100
        `).all();
        
        return NextResponse.json({ success: true, data: users });
    } catch (e) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
""")
print("Created admin/users API")
