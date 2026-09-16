// ============================================================
// HpLabs  HPVuln Webhook Ingest
// POST /api/hpvuln/ingest
//
// HPVuln calls this endpoint when it has identified and
// verified a new vulnerability class or variant.
//
// Authentication: x-hpvuln-secret header must match
//   HPVULN_WEBHOOK_SECRET env var (default: hpvuln-secret-2026)
//
// The endpoint:
//   1. Verifies the shared secret
//   2. Runs deduplication immediately
//   3. Creates a pipeline item at stage "Detected"
//   4. Returns pipelineId, stage, isDuplicate, warnings
//
// If isDuplicate=true the item is created but blocked at
// "Detected"  an admin must explicitly override to advance.
// ============================================================

import { NextResponse } from "next/server";
import { createPipelineItem } from "@/lib/services/vulnPipelineStore";
import type { DomainId, Severity } from "@/lib/data/types";

const HPVULN_SECRET = process.env.HPVULN_WEBHOOK_SECRET;

export async function POST(req: Request) {
  //  Auth 
  const secret = req.headers.get("x-hpvuln-secret");
  if (!HPVULN_SECRET || secret !== HPVULN_SECRET) {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();

    const {
      feedId,
      title,
      description,
      cve,
      cwe,
      cvssScore,
      affectedProducts,
      domain,
      severity,
    } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { success: false, message: "title is required." },
        { status: 400 }
      );
    }

    const item = createPipelineItem({
      rawTitle:        title.trim(),
      rawDescription:  (description ?? "").trim(),
      cve:             Array.isArray(cve) ? cve : [],
      cwe:             Array.isArray(cwe) ? cwe : [],
      cvssScore:       typeof cvssScore === "number" ? cvssScore : undefined,
      affectedProducts: Array.isArray(affectedProducts) ? affectedProducts : [],
      hpvulnFeedId:   feedId ?? undefined,
      source:          "hpvuln_webhook",
      domain:          domain as DomainId | undefined,
      severity:        severity as Severity | undefined,
    });

    console.log(
      `[HPVuln Ingest] feedId=${feedId ?? "none"}  pipelineId=${item.id} ` +
      `stage=${item.stage} isDuplicate=${item.isDuplicate}`
    );

    return NextResponse.json({
      success: true,
      pipelineId:   item.id,
      stage:        item.stage,
      isDuplicate:  item.isDuplicate,
      duplicateReason: item.duplicateReason ?? null,
      warnings:     item.dedupWarnings ?? [],
    }, { status: 201 });

  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }
}
