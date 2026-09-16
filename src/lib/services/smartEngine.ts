import { SmartDetector } from "@/lib/detector/SmartDetector";
import { ALL_LABS } from "@/lib/data/redteam";
import { runAllChecksForLab, attemptRecovery } from "@/lib/services/labHealthChecks";
import { groupOrIncrementIncident, markIncidentResolved, markIncidentRecovering, markIncidentNotified } from "@/lib/services/labHealthStore";
import { createTicket } from "@/lib/services/ticketStore";
import { notifySupportTeam, notifySecurityEvent } from "@/lib/services/notificationService";
import { listPipelineItems, createPipelineItem, publishLab } from "@/lib/services/vulnPipelineStore";

export async function runSmartEngineIteration() {
  const results = {
    healthIncidents: 0,
    healthRecovered: 0,
    healthEscalated: 0,
    vulnsDetected: 0,
    labsGenerated: 0,
    labsPublished: 0
  };

  // 1. Automated Health Monitoring & Smart Self-Healing
  for (const lab of ALL_LABS) {
    const checks = await runAllChecksForLab(lab);
    for (const check of checks) {
      if (check.status === "failing" || check.status === "degraded") {
        const incident = groupOrIncrementIncident(lab.id, check.checkType, check.message);
        
        // Diagnose & Safe Action
        const recovery = await attemptRecovery(check, lab, incident.occurrenceCount);
        
        // Verify & Record Result
        if (recovery.success) {
          markIncidentResolved(incident.incidentId);
          results.healthRecovered++;
        } else {
          // Escalate to support automatically if failing consistently
          if (incident.occurrenceCount >= 3 && !incident.notifiedAt) {
            const ticket = createTicket({
              userId: "SYSTEM_MONITOR",
              name: "Smart Health Monitor",
              email: "sysadmin@hackerplus.in",
              phone: "",
              issueDescription: `Lab ${lab.id} (${lab.name}) failed health check '${check.checkType}' ${incident.occurrenceCount} times. Auto-recovery failed. Reason: ${check.message}`,
              labId: lab.id,
              errorCode: check.checkType,
              systemDiagnostics: { timestamp: new Date().toISOString() },
              remediationAttempts: [recovery.note]
            });
            await notifySupportTeam(ticket);
            markIncidentNotified(incident.incidentId);
            results.healthEscalated++;
          } else {
             markIncidentRecovering(incident.incidentId);
          }
        }
        results.healthIncidents++;
      }
    }
  }

  // 2. Smart Security Monitor (CVE/CWE/News)
  const detector = new SmartDetector();
  const report = await detector.run();
  
  for (const action of report.actionRecords) {
    if (action.action === "coming-soon-created") {
      const vuln = action.vulnerability;
      await notifySecurityEvent({
        id: vuln.canonicalId,
        type: "new_vulnerability",
        title: vuln.name,
        severity: vuln.severity,
        affectedTechnology: [vuln.domainId],
        cwe: vuln.cwe,
        cve: vuln.cve,
        shortExplanation: vuln.description,
        hplabsAvailability: "pending",
        detectedAt: action.timestamp
      });
      
      createPipelineItem({
        title: vuln.name,
        description: vuln.description,
        severity: vuln.severity,
        domain: vuln.domainId,
        cveId: vuln.cve[0] || null,
        cwe: vuln.cwe,
        cve: vuln.cve,
        cvssScore: vuln.cvssScore
      });
      
      results.vulnsDetected++;
    }
  }

  // 3. Smart Vulnerability-to-Lab Pipeline (Generation & Validation)
  const pipeline = listPipelineItems();
  for (const item of pipeline) {
    if (item.stage === "Detected" || item.stage === "Verified" || item.stage === "Classified") {
      const labSpec = generateLabSpecFromVuln(item);
      const isValid = validateLabSpec(labSpec);
      
      if (isValid) {
        publishLab(item.id, labSpec); 
        
        await notifySecurityEvent({
          id: labSpec.id,
          type: "new_lab",
          title: labSpec.name,
          severity: labSpec.severity,
          affectedTechnology: [labSpec.domain],
          cwe: labSpec.cwe,
          cve: labSpec.cve,
          shortExplanation: labSpec.description,
          hplabsAvailability: "available",
          detectedAt: new Date().toISOString()
        });
        results.labsGenerated++;
        results.labsPublished++;
      }
    }
  }

  // 4. Entitlement Expiry Notifications
  try {
    const { processCollaborationExpiries } = require("@/lib/services/entitlements");
    const expiryResults = await processCollaborationExpiries();
    (results as any).expiriesNotified = expiryResults;
  } catch (err) {
    console.error("Error processing collaboration expiries", err);
  }

  return results;
}

function generateLabSpecFromVuln(item: any) {
  const source = item.sourceData || {};
  return {
    id: `auto-${item.id.toLowerCase()}`,
    level: 99,
    severity: source.severity || "medium",
    domain: source.domain || "web",
    name: source.title || "Auto-Generated Lab",
    shortName: (source.title || "Lab").substring(0, 15),
    description: source.description || "Automatically generated interactive lab from threat intel.",
    history: "Detected and generated via Smart Pipeline.",
    firstDiscoveredYear: new Date().getFullYear(),
    cwe: item.cwe || source.cwe || ["CWE-1000"],
    cve: item.cve || source.cve || [],
    cvssScore: source.cvssScore || 5.0,
    timeLimitMinutes: 30,
    methodology: [
      { step: 1, title: "Reconnaissance", description: `Identify the vulnerable endpoint related to ${source.title}.` },
      { step: 2, title: "Exploitation", description: "Execute the payload to retrieve the target flag." }
    ],
    hints: [
      "Review the advisory details to understand the payload structure.",
      "Check the vulnerable parameter or header mentioned in the intel report."
    ],
    xpReward: 100
  };
}

function validateLabSpec(spec: any): boolean {
  if (!spec.id || !spec.name || !spec.severity || !spec.domain) return false;
  if (!Array.isArray(spec.methodology) || spec.methodology.length === 0) return false;
  if (!spec.description || spec.description.trim().length === 0) return false;
  return true;
}
