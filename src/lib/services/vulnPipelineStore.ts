// ============================================================
// HpLabs  Vulnerability Pipeline Store (server-side only)
// Backed by SQLite
// ============================================================

import { getDb } from "@/lib/db";
import fs from "fs";
import path from "path";

export const PIPELINE_STAGES = [
  "Detected", "Verified", "Classified", "Lab Candidate",
  "Lab Generation", "Validation", "Admin Review", "Published"
] as const;

export type PipelineStage = typeof PIPELINE_STAGES[number];

export interface PipelineItem { [key: string]: any;
  id: string;
  stage: PipelineStage;
  detectedAt: string;
  updatedAt: string;
  sourceData: any;
  isDuplicate: boolean;
  labSpec?: any;
}

function rowToItem(row: any): PipelineItem {
  const metadata = JSON.parse(row.metadata);
  return {
    id: row.id,
    stage: row.stage as PipelineStage,
    detectedAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
    sourceData: metadata.sourceData || { title: row.title, description: row.description, severity: row.severity, domain: row.domain, cveId: row.cve_id },
    isDuplicate: row.is_duplicate === 1,
    labSpec: row.lab_spec ? JSON.parse(row.lab_spec) : undefined,
    ...metadata
  };
}

export function listPipelineItems(options?: any): PipelineItem[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM vuln_pipeline ORDER BY created_at DESC").all();
  return rows.map(rowToItem);
}

export function getPipelineItem(id: string): PipelineItem | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM vuln_pipeline WHERE id = ?").get(id);
  if (!row) return null;
  return rowToItem(row);
}

export function createPipelineItem(sourceData: any): PipelineItem {
  const db = getDb();
  const id = `VULN-${Date.now()}`;
  const now = Date.now();

  const cveId = sourceData.cveId || null;
  const title = sourceData.title || "Unknown Title";
  const desc = sourceData.description || null;
  const sev = sourceData.severity || null;
  const domain = sourceData.domain || null;

  db.prepare(`
    INSERT INTO vuln_pipeline (id, stage, cve_id, title, description, severity, domain, is_duplicate, metadata, created_at, updated_at)
    VALUES (?, 'Detected', ?, ?, ?, ?, ?, 0, ?, ?, ?)
  `).run(id, cveId, title, desc, sev, domain, JSON.stringify({ sourceData }), now, now);

  return getPipelineItem(id)!;
}

export function updatePipelineItem(id: string, updates: any, ...args: any[]): PipelineItem | null {
  const db = getDb();
  const item = getPipelineItem(id);
  if (!item) return null;

  if (updates.stage) {
    db.prepare("UPDATE vuln_pipeline SET stage = ?, updated_at = ? WHERE id = ?").run(updates.stage, Date.now(), id);
  }
  if (updates.labSpec) {
    db.prepare("UPDATE vuln_pipeline SET lab_spec = ?, updated_at = ? WHERE id = ?").run(JSON.stringify(updates.labSpec), Date.now(), id);
  }
  return getPipelineItem(id);
}

export function advanceStage(id: string, ...args: any[]): PipelineItem | null {
  const item = getPipelineItem(id);
  if (!item) return null;

  const currentIdx = PIPELINE_STAGES.indexOf(item.stage);
  if (currentIdx === -1 || item.stage === "Published") return item;

  const newStage = PIPELINE_STAGES[currentIdx + 1];
  if (item.isDuplicate && PIPELINE_STAGES.indexOf(newStage) > PIPELINE_STAGES.indexOf("Verified")) {
    return item;
  }

  updatePipelineItem(id, { stage: newStage });
  return getPipelineItem(id);
}

export function overrideDuplicate(id: string, ...args: any[]): PipelineItem | null {
  const db = getDb();
  db.prepare("UPDATE vuln_pipeline SET is_duplicate = 0, updated_at = ? WHERE id = ?").run(Date.now(), id);
  return getPipelineItem(id);
}

export function deletePipelineItem(id: string): boolean {
  const db = getDb();
  const res = db.prepare("DELETE FROM vuln_pipeline WHERE id = ?").run(id);
  return res.changes > 0;
}

export function publishLab(id: string, labSpec: any): PipelineItem | null {
  updatePipelineItem(id, { stage: "Published", labSpec });
  
  const publishedPath = path.join(process.cwd(), "data", "pipeline_published_labs.json");
  let published: any[] = [];
  if (fs.existsSync(publishedPath)) {
    try {
      published = JSON.parse(fs.readFileSync(publishedPath, "utf-8"));
    } catch {}
  }
  const existingIdx = published.findIndex(l => l.id === labSpec.id);
  if (existingIdx >= 0) {
    published[existingIdx] = labSpec;
  } else {
    published.push(labSpec);
  }
  fs.writeFileSync(publishedPath, JSON.stringify(published, null, 2));

  return getPipelineItem(id);
}

export function getPublishedPipelineLabs(): any[] {
  const publishedPath = path.join(process.cwd(), "data", "pipeline_published_labs.json");
  if (!fs.existsSync(publishedPath)) return [];
  try {
    return JSON.parse(fs.readFileSync(publishedPath, "utf-8"));
  } catch {
    return [];
  }
}export type LabSpecification = any;
