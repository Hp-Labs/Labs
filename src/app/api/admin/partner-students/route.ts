import { requireAdminAPI } from '@/lib/services/adminGuard';
// ============================================================
// HpLabs  Admin: Partner Student Import API
// POST /api/admin/partner-students   (import CSV/XLSX)
// GET  /api/admin/partner-students   (list)
//
// INTERNAL ONLY  Admin guard enforced server-side
// ============================================================

import { NextResponse } from "next/server";
import { importPartnerStudents, listPartnerStudents } from "@/lib/services/partnerStudentStore";
import { listEntitlementRules } from "@/lib/services/entitlementRules";
import { computeStudentEntitlement } from "@/lib/services/entitlementEngine";
import * as XLSX from "xlsx";

import { getSession } from '@/lib/services/sessionStore';








//  GET: list students 
export async function GET(req: Request) {
  
  const adminUser = await requireAdminAPI();
  if (!adminUser) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
  }

  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") || "1");
  const pageSize = Number(url.searchParams.get("pageSize") || "50");

  const result = listPartnerStudents(page, pageSize);
  return NextResponse.json({ success: true, ...result });
}

//  POST: import CSV/XLSX 
export async function POST(req: Request) {
  
  const adminUser = await requireAdminAPI();
  if (!adminUser) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded." }, { status: 400 });
    }

    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
    ];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
      return NextResponse.json(
        { success: false, message: "Unsupported file type. Please upload a CSV or XLSX file." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return NextResponse.json({ success: false, message: "File is empty." }, { status: 400 });
    }

    const rawRows: Record<string, string>[] = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetName],
      { defval: "" }
    );

    if (rawRows.length === 0) {
      return NextResponse.json({ success: false, message: "File has no data rows." }, { status: 400 });
    }

    const normalise = (s: string) => s.toLowerCase().replace(/[\s_\-]/g, "");

    const rows = rawRows.map((rawRow) => {
      const row: Record<string, string> = {};
      for (const [k, v] of Object.entries(rawRow)) {
        row[normalise(k)] = String(v).trim();
      }
      return row;
    });

    const FIELD_ALIASES: Record<string, string[]> = {
      studentId: ["studentid", "rollnumber", "rollno", "roll", "id", "studentrollno"],
      email:     ["email", "emailaddress", "mail"],
      course:    ["course", "coursename", "program", "programme"],
      duration:  ["duration", "courseduration", "length", "period"],
    };

    function extractField(row: Record<string, string>, aliases: string[]): string {
      for (const alias of aliases) {
        if (row[alias] !== undefined && row[alias] !== "") return row[alias];
      }
      return "";
    }

    // Load live entitlement rules ONCE for the whole batch
    const activeRules = listEntitlementRules();

    const validationErrors: string[] = [];
    const validRows: Parameters<typeof importPartnerStudents>[0] = [];
    const emailSeen = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
      const lineNum = i + 2;
      const row = rows[i];

      const studentId = extractField(row, FIELD_ALIASES.studentId);
      const email     = extractField(row, FIELD_ALIASES.email);
      const course    = extractField(row, FIELD_ALIASES.course);
      const duration  = extractField(row, FIELD_ALIASES.duration);

      if (!studentId) validationErrors.push(`Row ${lineNum}: Missing student ID/roll number.`);
      if (!email)     validationErrors.push(`Row ${lineNum}: Missing email.`);
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        validationErrors.push(`Row ${lineNum}: Invalid email format: "${email}"`);
      }
      if (!course)    validationErrors.push(`Row ${lineNum}: Missing course.`);
      if (!duration)  validationErrors.push(`Row ${lineNum}: Missing duration.`);

      if (email && emailSeen.has(email.toLowerCase())) {
        validationErrors.push(`Row ${lineNum}: Duplicate email within file: "${email}"`);
      }
      emailSeen.add(email?.toLowerCase() ?? "");

      if (studentId && email && course && duration) {
        // Server-side entitlement calculation per row
        const entitlement = computeStudentEntitlement(duration, activeRules);

        validRows.push({
          studentId,
          email,
          course,
          duration,
          batch: file.name,
          parsedCourseDurationMonths: entitlement.parsedMonths,
          entitledPremiumMonths: entitlement.entitledPremiumMonths,
          matchedRuleId: entitlement.matchedRuleId,
          matchedRuleLabel: entitlement.matchedRuleLabel,
        });
      }
    }

    if (validationErrors.length > 0 && validRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Validation failed. No records imported.", errors: validationErrors },
        { status: 422 }
      );
    }

    const { imported, skipped, duplicates } = importPartnerStudents(validRows, file.name);

    return NextResponse.json({
      success: true,
      imported,
      skipped,
      duplicates,
      validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
      message: `Import complete: ${imported} imported, ${skipped} skipped (duplicate).`,
      rulesApplied: activeRules.length,
    });
  } catch (err) {
    console.error("[Partner Import]", err);
    return NextResponse.json({ success: false, message: "Import failed due to a server error." }, { status: 500 });
  }
}
