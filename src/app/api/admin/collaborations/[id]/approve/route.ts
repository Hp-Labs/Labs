import { NextResponse } from "next/server";
import { requireAdminAPI } from "@/lib/services/adminGuard";
import { getCollaborationBatch, getStudentsForBatch, activateStudent } from "@/lib/services/collaborationStore";
import { getUserByEmail } from "@/lib/services/userStore";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminAPI();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { studentId } = await req.json();
    const resolved = await params;
    
    const batch = getCollaborationBatch(resolved.id);
    if (!batch) return NextResponse.json({ error: "Batch not found" }, { status: 404 });

    const students = getStudentsForBatch(batch.id);
    const student = students.find(s => s.id === studentId);
    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    const user = getUserByEmail(student.email);
    if (!user) {
      return NextResponse.json({ error: "User has not registered an account yet with that email." }, { status: 400 });
    }

    activateStudent(student.id, user.id);

    return NextResponse.json({ success: true, userId: user.id });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
