// ============================================================
// HpLabs — Background Vulnerability Ingestion API Route
// Silent background sync endpoint (1940 to Dynamic Today)
// ============================================================

import { NextResponse } from "next/server";
import { runBackgroundVulnerabilitySync, getCombinedVulnerabilityCatalog } from "@/lib/services/vulnerabilitySync";

export async function GET() {
  try {
    const result = await runBackgroundVulnerabilitySync();
    const catalog = getCombinedVulnerabilityCatalog();

    return NextResponse.json({
      success: true,
      syncSummary: result,
      totalCatalogLabs: catalog.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed background sync" },
      { status: 500 }
    );
  }
}

export async function POST() {
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
