import fs from "fs";
import path from "path";
import type { LabFreshness } from "@/lib/data/types";

const FRESHNESS_FILE = path.join(process.cwd(), "data", "lab_freshness.json");

interface FreshnessStore {
  records: Record<string, LabFreshness>;
}

let cache: FreshnessStore | null = null;

function loadStore(): FreshnessStore {
  if (cache) return cache;
  try {
    if (fs.existsSync(FRESHNESS_FILE)) {
      cache = JSON.parse(fs.readFileSync(FRESHNESS_FILE, "utf-8"));
      return cache!;
    }
  } catch (err) {
    console.error("[LabFreshnessStore] Error loading store:", err);
  }
  cache = { records: {} };
  return cache;
}

function saveStore(store: FreshnessStore) {
  try {
    fs.writeFileSync(FRESHNESS_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("[LabFreshnessStore] Error saving store:", err);
  }
}

export function getLabFreshness(labId: string): LabFreshness | undefined {
  const store = loadStore();
  return store.records[labId];
}

export function getAllFreshnessRecords(): Record<string, LabFreshness> {
  const store = loadStore();
  return store.records;
}

export function updateLabFreshness(labId: string, data: Partial<LabFreshness>): LabFreshness {
  const store = loadStore();
  
  const existing = store.records[labId] || {
    sourceVulnerability: "Unknown",
    labVersion: "1.0",
    targetVersion: "latest",
    lastValidationDate: new Date().toISOString(),
    reproductionStatus: "untested",
    compatibilityStatus: "compatible",
    needsReview: false,
  };

  const updated: LabFreshness = {
    ...existing,
    ...data,
  };

  store.records[labId] = updated;
  saveStore(store);
  return updated;
}
