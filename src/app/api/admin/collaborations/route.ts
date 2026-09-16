import { NextResponse } from "next/server";
import { requireAdminAPI } from "@/lib/services/adminGuard";
import { getCollaborationBatches, createCollaborationBatch, addCollaborationStudents, getStudentsForBatch } from "@/lib/services/collaborationStore";

export async function GET() {
  const admin = await requireAdminAPI();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const batches = getCollaborationBatches();
  
  // Attach some light stats
  const enriched = batches.map(b => {
    const students = getStudentsForBatch(b.id);
    const pending = students.filter(s => s.status === 'PENDING').length;
    const activated = students.filter(s => s.status === 'ACTIVATED').length;
    return { ...b, totalStudents: students.length, pending, activated };
  });

  return NextResponse.json({ success: true, batches: enriched });
}

export async function POST(req: Request) {
  const admin = await requireAdminAPI();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const { organization, courseName, courseDurationMonths, accessDurationMonths, plan, activationMethod, students } = data;

    if (!organization || !courseName || !plan || !activationMethod || !students || !Array.isArray(students)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { getUserState, getUserByEmail } = require("@/lib/services/userStore");
    const { activateStudent } = require("@/lib/services/collaborationStore");

    const batch = createCollaborationBatch({
      organization,
      courseName,
      courseDurationMonths: Number(courseDurationMonths),
      accessDurationMonths: Number(accessDurationMonths),
      plan,
      activationMethod,
      importedBy: admin.email
    });

    const studentsToInsert = students.map((s: any) => ({
      name: s.name,
      email: s.email,
      college: s.college || null,
      rollNumber: s.rollNumber || null
    }));

    const generatedCoupons = addCollaborationStudents(batch.id, studentsToInsert);

    // If AUTOMATIC, check for any students that already have an account and activate them now
    if (activationMethod === 'AUTOMATIC') {
      const freshStudents = getStudentsForBatch(batch.id);
      for (const s of freshStudents) {
        const existingUser = getUserByEmail(s.email);
        if (existingUser) {
          activateStudent(s.id, existingUser.id);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      batchId: batch.id, 
      studentCount: students.length,
      coupons: generatedCoupons
    });
  } catch (err: any) {
    console.error("Collab import error:", err);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
