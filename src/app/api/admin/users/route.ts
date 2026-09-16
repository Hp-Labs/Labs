import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

import { getSession } from '@/lib/services/sessionStore';




import { requireAdminAPI } from '@/lib/services/adminGuard';

export async function GET(req: Request) {
  const adminUser = await requireAdminAPI();
  if (!adminUser) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });

  
    try {
        const url = new URL(req.url);
        const search = url.searchParams.get('search') || '';
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = 20;
        const offset = (page - 1) * limit;

        const db = getDb();
        
        // Count total users matching search
        const countQuery = `
          SELECT COUNT(*) as count 
          FROM users 
          WHERE email LIKE ? OR username LIKE ?
        `;
        const totalRows = (db.prepare(countQuery).get(`%${search}%`, `%${search}%`) as any).count;

        const users = db.prepare(`
            SELECT 
              u.id, 
              u.username, 
              u.email, 
              u.role, 
              u.is_admin, 
              u.xp, 
              u.premium_until, 
              u.created_at,
              u.plan,
              u.suspended,
              (SELECT COUNT(*) FROM lab_completions WHERE user_id = u.id) as labs_completed,
              (SELECT MAX(created_at) FROM auth_sessions WHERE user_id = u.id) as last_login
            FROM users u
            WHERE u.email LIKE ? OR u.username LIKE ?
            ORDER BY u.created_at DESC 
            LIMIT ? OFFSET ?
        `).all(`%${search}%`, `%${search}%`, limit, offset);
        
        return NextResponse.json({ 
          success: true, 
          data: users,
          pagination: {
            total: totalRows,
            page,
            limit,
            pages: Math.ceil(totalRows / limit)
          }
        });
    } catch (e) {
        console.error("Admin users API error:", e);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
