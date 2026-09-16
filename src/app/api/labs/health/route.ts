import { NextRequest, NextResponse } from "next/server";
import { ALL_LABS } from "@/lib/data/redteam";
import { runAllChecksForLab, attemptRecovery } from "@/lib/services/labHealthChecks";
import {
  recordHealthCheck,
  groupOrIncrementIncident,
  markIncidentRecovering,
  markIncidentResolved,
  markIncidentNotified,
  getRecentChecks,
  getOpenIncidents,
  type LabIncident,
  type HealthCheckResult,
} from "@/lib/services/labHealthStore";
import type { Lab } from "@/lib/data/types";

const HEALTH_SECRET = process.env.HEALTH_MONITOR_SECRET;

//  Internal incident logger (no external credentials exposed) 
function logIncident(incident: LabIncident, lab: Lab): void {
  const sep = "=".repeat(60);
  console.log(`\n${sep}`);
  console.log(`[LabHealth] INCIDENT ${incident.incidentId}`);
  console.log(`  Lab        : ${lab.name} (${lab.id})`);
  console.log(`  Check      : ${incident.checkType}`);
  console.log(`  Occurrences: ${incident.occurrenceCount}`);
  console.log(`  Status     : ${incident.status}`);
  console.log(`  First seen : ${incident.firstOccurredAt}`);
  console.log(`  Last seen  : ${incident.lastOccurredAt}`);
  console.log(`  [INTERNAL] : ${incident.failureMessage}`);
  console.log(`${sep}\n`);
}

//  GET /api/labs/health 
// Public-safe: returns only status, checkType, checkedAt  no internal messages
export async function GET(req: NextRequest) {
  const labId = req.nextUrl.searchParams.get("labId") ?? undefined;

  // Sanitised check results  strip internal message
  const rawChecks = getRecentChecks(labId, 50);
  const safeChecks = rawChecks.map(c => ({
    checkId: c.checkId,
    labId: c.labId,
    checkType: c.checkType,
    status: c.status,
    checkedAt: c.checkedAt,
    recoveryStatus: c.recoveryStatus,
  }));

  // Open incidents  strip internal failureMessage
  const rawIncidents = getOpenIncidents();
  const safeIncidents = rawIncidents
    .filter(i => !labId || i.labId === labId)
    .map(i => ({
      incidentId: i.incidentId,
      labId: i.labId,
      checkType: i.checkType,
      status: i.status,
      firstOccurredAt: i.firstOccurredAt,
      occurrenceCount: i.occurrenceCount,
    }));

  return NextResponse.json({
    success: true,
    checks: safeChecks,
    openIncidents: safeIncidents,
  });
}

//  POST /api/labs/health 
// Requires x-health-monitor-secret header
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-health-monitor-secret");
  if (!HEALTH_SECRET || secret !== HEALTH_SECRET) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
  }

  let body: { labId?: string; trigger?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const { labId, trigger } = body;
  if (!labId) {
    return NextResponse.json({ success: false, message: "labId is required." }, { status: 400 });
  }

  const lab = ALL_LABS.find(l => l.id === labId);
  if (!lab) {
    return NextResponse.json({ success: false, message: "Lab not found." }, { status: 404 });
  }

  // Run all checks
  const results: HealthCheckResult[] = await runAllChecksForLab(lab);

  let incidentsCreated = 0;
  let incidentsResolved = 0;

  for (const result of results) {
    // Persist check result (internal  not returned to users)
    recordHealthCheck(result);

    if (result.status === "failing" || result.status === "degraded") {
      // Group or create incident (dedup by labId + checkType)
      const incident = groupOrIncrementIncident(lab.id, result.checkType, result.message);
      incident.labName = lab.name;
      incidentsCreated += 1;

      // Attempt predefined safe recovery
      const recovery = await attemptRecovery(result, lab, incident.occurrenceCount);
      result.recoveryStatus = recovery.success ? "success" : "failed";
      result.recoveryNote = recovery.note;

      if (recovery.success) {
        markIncidentResolved(incident.incidentId);
        incidentsResolved += 1;
      } else {
        // Escalate to support log after 2+ occurrences
        if (incident.occurrenceCount >= 2 && !incident.notifiedAt) {
          logIncident(incident, lab);
          markIncidentNotified(incident.incidentId);
        } else {
          markIncidentRecovering(incident.incidentId);
        }
      }
    }
  }

  const counts = results.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Safe summary only  no internal diagnostics
  return NextResponse.json({
    success: true,
    labId,
    trigger: trigger ?? "manual",
    totalChecks: results.length,
    healthy: counts.healthy ?? 0,
    degraded: counts.degraded ?? 0,
    failing: counts.failing ?? 0,
    unknown: counts.unknown ?? 0,
    incidentsCreated,
    incidentsResolved,
    checkedAt: new Date().toISOString(),
  });
}
