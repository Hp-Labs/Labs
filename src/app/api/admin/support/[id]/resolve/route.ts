import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdminAPI } from '@/lib/services/adminGuard';

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  const adminUser = await requireAdminAPI();
  if (!adminUser) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });

  const params = await props.params;
  const { id } = params;

  try {
    const db = getDb();
    
    const result = db.prepare(`
      UPDATE support_tickets 
      SET status = 'resolved', updated_at = ? 
      WHERE ticket_id = ?
    `).run(Date.now(), id);

    if (result.changes === 0) {
      return NextResponse.json({ success: false, message: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Ticket marked as resolved' });
  } catch (e) {
    console.error("Resolve ticket error:", e);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
