import { requireAdminAPI } from '@/lib/services/adminGuard';
// ============================================================
// HpLabs  Admin: Vulnerability Pipeline  List & Create
// GET  /api/admin/vuln-pipeline          (list, filterable by stage)
// POST /api/admin/vuln-pipeline          (create manual entry)
// ============================================================

import { NextResponse } from "next/server";
import {
  listPipelineItems,
  createPipelineItem,
  PIPELINE_STAGES,
  type PipelineStage,
} from "@/lib/services/vulnPipelineStore";
import type { DomainId, Severity } from "@/lib/data/types";

import { getSession } from '@/lib/services/sessionStore';








//  GET: list pipeline items 
export async function GET(req: Request) {
  
  const adminUser = await requireAdminAPI();
  if (!adminUser) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
  }

  const url   = new URL(req.url);
  const stage = url.searchParams.get("stage") as PipelineStage | null;

  if (stage && !PIPELINE_STAGES.includes(stage as PipelineStage)) {
    return NextResponse.json(
      { success: false, message: `Invalid stage. Valid: ${PIPELINE_STAGES.join(", ")}` },
      { status: 400 }
    );
  }

  const items = listPipelineItems(stage ?? undefined);

  // Summary counts per stage
  const stageCounts: Record<string, number> = {};
  for (const s of PIPELINE_STAGES) {
    stageCounts[s] = listPipelineItems(s).length;
  }

  return NextResponse.json({ success: true, items, stageCounts, total: items.length });
}

//  POST: create manual admin entry 
export async function POST(req: Request) {
  
  const adminUser = await requireAdminAPI();
  if (!adminUser) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { rawTitle, rawDescription, cve, cwe, cvssScore, affectedProducts, domain, severity } = body;

    if (!rawTitle || typeof rawTitle !== "string" || !rawTitle.trim()) {
      return NextResponse.json(
        { success: false, message: "rawTitle is required." },
        { status: 400 }
      );
    }

    const item = createPipelineItem({
      rawTitle:        rawTitle.trim(),
      rawDescription:  (rawDescription ?? "").trim(),
      cve:             Array.isArray(cve) ? cve : [],
      cwe:             Array.isArray(cwe) ? cwe : [],
      cvssScore:       typeof cvssScore === "number" ? cvssScore : undefined,
      affectedProducts: Array.isArray(affectedProducts) ? affectedProducts : [],
      source:          "admin_manual",
      domain:          domain as DomainId | undefined,
      severity:        severity as Severity | undefined,
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }
}
