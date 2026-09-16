import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdminAPI } from '@/lib/services/adminGuard';

export async function GET(req: Request) {
  const adminUser = await requireAdminAPI();
  if (!adminUser) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });

  try {
    const db = getDb();
    
    const tickets = db.prepare(`
      SELECT 
        s.ticket_id as id,
        s.user_id,
        u.email as user_email,
        u.username as user_name,
        s.name as contact_name,
        s.email as contact_email,
        s.issue_description,
        s.status,
        s.lab_id,
        s.session_id,
        s.system_diagnostics,
        s.remediation_attempts,
        s.created_at,
        s.updated_at
      FROM support_tickets s
      LEFT JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
      LIMIT 200
    `).all();

    return NextResponse.json({ success: true, data: tickets });
  } catch (e) {
    console.error("Support tickets fetch error:", e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
