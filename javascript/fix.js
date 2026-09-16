const fs = require('fs');

const fixLeaderboardApi = 
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
    try {
        const db = getDb();
        const users = db.prepare(\
            SELECT id, username, xp, premium_until, created_at,
            (SELECT COUNT(*) FROM lab_completions WHERE user_id = users.id) as labs
            FROM users 
            ORDER BY xp DESC 
            LIMIT 50
        \).all();
        
        return NextResponse.json({ success: true, data: users });
    } catch (e) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
;
fs.writeFileSync('src/app/api/leaderboard/route.ts', fixLeaderboardApi.trim());
