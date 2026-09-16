import { requireAdminAPI } from '@/lib/services/adminGuard';
// ============================================================
// HpLabs  Admin: Vulnerability Pipeline  Item Operations
// GET    /api/admin/vuln-pipeline/[id]   (get single item)
// PATCH  /api/admin/vuln-pipeline/[id]   (update / advance stage / publish)
// DELETE /api/admin/vuln-pipeline/[id]   (delete; not allowed if Published)
// ============================================================

import { NextResponse } from "next/server";
import {
  getPipelineItem,
  advanceStage,
  updatePipelineItem,
  overrideDuplicate,
  publishLab,
  deletePipelineItem,
  PIPELINE_STAGES,
  type PipelineStage,
} from "@/lib/services/vulnPipelineStore";
import type { DomainId, Severity } from "@/lib/data/types";
import type { Lab } from "@/lib/data/types";

import { getSession } from '@/lib/services/sessionStore';








//  GET: get single pipeline item 
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  
  const adminUser = await requireAdminAPI();
  if (!adminUser) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;
  const item = getPipelineItem(id);
  if (!item) return NextResponse.json({ success: false, message: "Not found." }, { status: 404 });

  return NextResponse.json({ success: true, item });
}

//  PATCH: update item / advance stage / override dup / publish
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  
  const adminUser = await requireAdminAPI();
  if (!adminUser) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const { action, ...rest } = body;

    //  action: advance 
    if (action === "advance") {
      const { targetStage, adminNotes, reviewedBy, domain, severity, tags, labDraft } = rest;

      if (!targetStage || !PIPELINE_STAGES.includes(targetStage as PipelineStage)) {
        return NextResponse.json(
          { success: false, message: "Invalid or missing targetStage." },
          { status: 400 }
        );
      }

      const updated = advanceStage(id, targetStage as PipelineStage, {
        adminNotes, reviewedBy,
        domain:   domain   as DomainId  | undefined,
        severity: severity as Severity | undefined,
        tags,
        labDraft: labDraft as Partial<Lab> | undefined,
      });

      if (!updated) {
        const item = getPipelineItem(id);
        if (!item) return NextResponse.json({ success: false, message: "Not found." }, { status: 404 });
        if (item.isDuplicate) {
          return NextResponse.json(
            { success: false, message: "Cannot advance: item is flagged as duplicate. Override duplicate status first." },
            { status: 409 }
          );
        }
        return NextResponse.json(
          { success: false, message: "Stage advance failed. Ensure targetStage is exactly one step ahead of current stage, and item is not Published." },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true, item: updated });
    }

    //  action: override_duplicate 
    if (action === "override_duplicate") {
      const { reviewedBy, note } = rest;
      if (!reviewedBy || !note) {
        return NextResponse.json(
          { success: false, message: "reviewedBy and note are required for override_duplicate." },
          { status: 400 }
        );
      }
      const updated = overrideDuplicate(id, reviewedBy, note);
      if (!updated) return NextResponse.json({ success: false, message: "Not found." }, { status: 404 });
      return NextResponse.json({ success: true, item: updated });
    }

    //  action: update 
    if (action === "update") {
      const { rawTitle, rawDescription, cve, cwe, domain, severity, tags, labDraft, labSpec, adminNotes, validationNotes } = rest;
      const updated = updatePipelineItem(id, {
        rawTitle, rawDescription, cve, cwe,
        domain:   domain   as DomainId  | undefined,
        severity: severity as Severity | undefined,
        tags, labDraft: labDraft as Partial<Lab> | undefined,
        labSpec,
        adminNotes,
        validationNotes,
      });
      if (!updated) return NextResponse.json({ success: false, message: "Not found or item is Published." }, { status: 404 });
      return NextResponse.json({ success: true, item: updated });
    }

    //  action: generate_spec 
    if (action === "generate_spec") {
      const item = getPipelineItem(id);
      if (!item) return NextResponse.json({ success: false, message: "Not found." }, { status: 404 });
      
      const { generateSmartLabSpec } = await import("@/lib/services/labSpecGenerator");
      const spec = generateSmartLabSpec(item);
      
      const updated = updatePipelineItem(id, { labSpec: spec });
      return NextResponse.json({ success: true, item: updated });
    }

    //  action: publish 
    if (action === "publish") {
      const { approvedBy } = rest;
      if (!approvedBy) {
        return NextResponse.json(
          { success: false, message: "approvedBy is required." },
          { status: 400 }
        );
      }
      const result = publishLab(id, approvedBy);
      if (!result) {
        const item = getPipelineItem(id);
        if (!item) return NextResponse.json({ success: false, message: "Not found." }, { status: 404 });
        if (item.stage !== "Admin Review") {
          return NextResponse.json(
            { success: false, message: `Cannot publish: item must be at Admin Review stage (currently "${item.stage}").` },
            { status: 409 }
          );
        }
        if (!item.labDraft?.name || !item.labDraft?.domain || !item.labDraft?.severity) {
          return NextResponse.json(
            { success: false, message: "Cannot publish: labDraft must have name, domain, and severity filled." },
            { status: 422 }
          );
        }
        return NextResponse.json({ success: false, message: "Publish failed." }, { status: 500 });
      }
      console.log(`[VulnPipeline] Published: ${result.lab.id} (${result.lab.name}) by ${approvedBy}`);
      return NextResponse.json({ success: true, item: result.item, publishedLab: result.lab });
    }

    return NextResponse.json(
      { success: false, message: "Unknown action. Use: advance | override_duplicate | update | publish" },
      { status: 400 }
    );

  } catch (err: any) {
    if (err.message) {
      return NextResponse.json({ success: false, message: err.message }, { status: 422 });
    }
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }
}

//  DELETE: remove pipeline item 
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  
  const adminUser = await requireAdminAPI();
  if (!adminUser) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;
  const deleted = deletePipelineItem(id);

  if (!deleted) {
    const item = getPipelineItem(id);
    if (!item) return NextResponse.json({ success: false, message: "Not found." }, { status: 404 });
    return NextResponse.json(
      { success: false, message: "Published items cannot be deleted." },
      { status: 409 }
    );
  }

  return NextResponse.json({ success: true, message: "Item deleted." });
}
