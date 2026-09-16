import { requireAdminAPI } from '@/lib/services/adminGuard';
// ============================================================
// HpLabs  Background Vulnerability Ingestion API Route
// Silent background sync endpoint (1940 to Dynamic Today)
// This is a server-only API route  safe to import fs-based modules here.
// ============================================================

import { NextResponse } from "next/server";
import { runBackgroundVulnerabilitySync, getCombinedVulnerabilityCatalog } from "@/lib/services/vulnerabilitySync";
import { getPublishedPipelineLabs } from "@/lib/services/vulnPipelineStore";
import { getAllFreshnessRecords } from "@/lib/services/labFreshnessStore";

export async function GET(req: Request) {
  const adminUser = await requireAdminAPI();
  if (!adminUser) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
  try {
    const result = await runBackgroundVulnerabilitySync();
    const pipelineLabs = getPublishedPipelineLabs();
    const freshness = getAllFreshnessRecords();
    const catalog = getCombinedVulnerabilityCatalog(pipelineLabs, freshness);

    return NextResponse.json({
      success: true,
      syncSummary: result,
      totalCatalogLabs: catalog.length,
      pipelinePublishedCount: pipelineLabs.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed background sync" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const adminUser = await requireAdminAPI();
  if (!adminUser) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
  try {
    const result = await runBackgroundVulnerabilitySync();
    return NextResponse.json({
      success: true,
      message: "Background synchronization triggered successfully.",
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
