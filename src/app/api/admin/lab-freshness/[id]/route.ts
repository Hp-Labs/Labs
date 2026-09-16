import { requireAdminAPI } from '@/lib/services/adminGuard';
import { NextResponse } from "next/server";
import { updateLabFreshness } from "@/lib/services/labFreshnessStore";

import { getSession } from '@/lib/services/sessionStore';






export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  
  const adminUser = await requireAdminAPI();
  if (!adminUser) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const updated = updateLabFreshness(id, body);
    return NextResponse.json({ success: true, record: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }
}
