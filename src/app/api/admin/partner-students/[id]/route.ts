import { requireAdminAPI } from '@/lib/services/adminGuard';
// ============================================================
// HpLabs  Admin: Delete a single partner student record
// DELETE /api/admin/partner-students/[id]
// ============================================================

import { NextResponse } from "next/server";
import { deletePartnerStudent } from "@/lib/services/partnerStudentStore";

import { getSession } from '@/lib/services/sessionStore';








export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  
  const adminUser = await requireAdminAPI();
  if (!adminUser) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;
  const deleted = deletePartnerStudent(id);
  if (!deleted) {
    return NextResponse.json({ success: false, message: "Record not found." }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: "Record deleted." });
}
