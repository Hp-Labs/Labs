import { NextResponse } from "next/server";
import { requireAdminAPI } from "@/lib/services/adminGuard";
import { getCollaborationBatch, getStudentsForBatch } from "@/lib/services/collaborationStore";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminAPI();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const resolved = await params;
  const batch = getCollaborationBatch(resolved.id);
  if (!batch) return NextResponse.json({ error: "Batch not found" }, { status: 404 });

  const students = getStudentsForBatch(batch.id);

  return NextResponse.json({ success: true, batch, students });
}
