import { NextRequest, NextResponse } from "next/server";
import { listPipelineItems, getPublishedPipelineLabs } from "@/lib/services/vulnPipelineStore";
import type { PipelineItem } from "@/lib/services/vulnPipelineStore";
import type { Lab } from "@/lib/data/types";

//  Types 
export interface SecurityEvent {
  id: string;
  type: "new_lab" | "new_vulnerability" | "security_advisory";
  title: string;
  vulnerabilityName: string;
  detectedAt: string;       // ISO date string
  severity: string;
  affectedTechnology: string[];
  cwe?: string[];
  cve?: string[];
  cvssScore?: number;
  shortExplanation: string;
  whyItMatters: string;
  hplabsAvailability: "available" | "coming_soon" | "not_applicable";
  hplabsLabId?: string;
  isVerified: boolean;      // Only true when source is confirmed (Published/Admin Review+)
  source: "pipeline_published" | "pipeline_verified" | "static";
}

// Stages that count as verified for display purposes
const VERIFIED_STAGES = new Set(["Verified", "Classified", "Lab Candidate", "Lab Generation", "Validation", "Admin Review", "Published"]);

//  Dedup registry (in-memory between requests) 
const seenIds = new Set<string>();

//  Helpers 
function severityLabel(s?: string): string {
  if (!s) return "Unknown";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function labToEvent(lab: Lab): SecurityEvent {
  const techRaw = (lab as any).affectedTechnology ?? (lab as any).tools ?? [];
  const tech: string[] = Array.isArray(techRaw) ? techRaw : [techRaw].filter(Boolean);
  return {
    id: `lab-${lab.id}`,
    type: "new_lab",
    title: `NEW LAB: ${lab.name}`,
    vulnerabilityName: lab.name,
    detectedAt: (lab as any).publishedAt ?? (lab as any).updatedAt ?? new Date().toISOString(),
    severity: severityLabel((lab as any).severity ?? "medium"),
    affectedTechnology: tech.length > 0 ? tech : ["Web Application"],
    cwe: (lab as any).cwe ? [(lab as any).cwe] : undefined,
    cve: (lab as any).cve ? [(lab as any).cve] : undefined,
    cvssScore: (lab as any).cvssScore,
    shortExplanation: lab.description ?? "A new lab has been published on HpLabs.",
    whyItMatters: lab.impact ?? "Practice exploitation in a safe, legal, real-IP environment.",
    hplabsAvailability: "available",
    hplabsLabId: lab.id,
    isVerified: true,
    source: "pipeline_published",
  };
}

function pipelineItemToEvent(item: PipelineItem): SecurityEvent | null {
  if (!VERIFIED_STAGES.has(item.stage)) return null;
  if (item.isDuplicate) return null;  // never surface unverified duplicate claims

  const tech: string[] = item.affectedProducts ?? [];
  const hasLab = item.stage === "Published";

  return {
    id: `vuln-${item.id}`,
    type: hasLab ? "new_lab" : "new_vulnerability",
    title: hasLab
      ? `NEW LAB: ${item.rawTitle}`
      : `VERIFIED VULNERABILITY: ${item.rawTitle}`,
    vulnerabilityName: item.rawTitle,
    detectedAt: item.updatedAt,
    severity: severityLabel(item.severity),
    affectedTechnology: tech.length > 0 ? tech : ["Multiple"],
    cwe: item.cwe.length > 0 ? item.cwe : undefined,
    cve: item.cve.length > 0 ? item.cve : undefined,
    cvssScore: item.cvssScore,
    shortExplanation: item.rawDescription.slice(0, 300) || "A newly verified security issue has been identified.",
    whyItMatters: "This vulnerability has been independently verified and classified through the HPVuln intelligence pipeline.",
    hplabsAvailability: hasLab ? "available" : "coming_soon",
    hplabsLabId: hasLab ? item.labDraft?.id : undefined,
    isVerified: true,
    source: item.stage === "Published" ? "pipeline_published" : "pipeline_verified",
  };
}

//  GET /api/security-monitor 
export async function GET(req: NextRequest) {
  try {
    const events: SecurityEvent[] = [];

    // 1. Published pipeline labs  fully verified, highest priority
    const publishedLabs = getPublishedPipelineLabs();
    for (const lab of publishedLabs.slice(0, 10)) {
      const ev = labToEvent(lab);
      if (!seenIds.has(ev.id)) {
        seenIds.add(ev.id);
        events.push(ev);
      }
    }

    // 2. Verified pipeline items (not yet labs, but confirmed genuine)
    const verifiedItems = listPipelineItems().filter(
      i => VERIFIED_STAGES.has(i.stage) && !i.isDuplicate && i.stage !== "Published"
    );
    for (const item of verifiedItems.slice(0, 10)) {
      const ev = pipelineItemToEvent(item);
      if (ev && !seenIds.has(ev.id)) {
        seenIds.add(ev.id);
        events.push(ev);
      }
    }

    // Sort: newest first
    events.sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());

    return NextResponse.json({
      success: true,
      events: events.slice(0, 20),
      totalCount: events.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (e: any) {
    console.error("[security-monitor] Error:", e?.message);
    return NextResponse.json({ success: false, events: [], totalCount: 0 }, { status: 500 });
  }
}
