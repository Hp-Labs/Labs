import { NextRequest, NextResponse } from "next/server";
import { getAllIncidents } from "@/lib/services/labHealthStore";

const HEALTH_SECRET = process.env.HEALTH_MONITOR_SECRET ?? "hplabs-health-2026";

// GET /api/labs/health/incidents
// Admin-only  strips internal failureMessage from response
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-health-monitor-secret");
  if (secret !== HEALTH_SECRET) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
  }

  const all = getAllIncidents();

  // Strip internal failureMessage  it stays server-side only
  const safe = all.map(i => ({
    incidentId: i.incidentId,
    labId: i.labId,
    labName: i.labName,
    checkType: i.checkType,
    status: i.status,
    firstOccurredAt: i.firstOccurredAt,
    lastOccurredAt: i.lastOccurredAt,
    occurrenceCount: i.occurrenceCount,
    recoveryAttempts: i.recoveryAttempts,
    resolvedAt: i.resolvedAt,
    notifiedAt: i.notifiedAt,
    groupedWith: i.groupedWith,
  }));

  return NextResponse.json({
    success: true,
    total: safe.length,
    open: safe.filter(i => i.status === "open" || i.status === "recovering").length,
    resolved: safe.filter(i => i.status === "resolved").length,
    incidents: safe,
  });
}
