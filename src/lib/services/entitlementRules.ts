// ============================================================
// HpLabs  Partner Entitlement Rules Store (server-side only)
// Stored in partner_entitlement_rules.json
//
// A "rule" maps a course duration (in months, as a numeric floor)
// to a Premium entitlement duration (in months).
//
// Matching strategy: the rule with the highest minCourseDurationMonths
// that is  the student's parsed course duration wins.
// If no rule matches, entitledPremiumMonths is 0 (no entitlement).
// ============================================================

import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "partner_entitlement_rules.json");

export interface EntitlementRule {
  /** Unique rule ID */
  id: string;
  /** Human-readable label, e.g. "6-month course track" */
  label: string;
  /**
   * Minimum course duration in months (inclusive) to match this rule.
   * e.g. minCourseDurationMonths: 6 matches any course  6 months.
   */
  minCourseDurationMonths: number;
  /** Premium months awarded when this rule matches */
  premiumMonthsAwarded: number;
  /** ISO timestamp when created */
  createdAt: string;
  /** ISO timestamp when last modified */
  updatedAt: string;
}

interface RulesStore {
  rules: EntitlementRule[];
}

let store: RulesStore | null = null;

// Default rules (used when no rules file exists yet)
const DEFAULT_RULES: EntitlementRule[] = [
  {
    id: "rule-default-4",
    label: "4-month course track",
    minCourseDurationMonths: 4,
    premiumMonthsAwarded: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "rule-default-6",
    label: "6-month course track",
    minCourseDurationMonths: 6,
    premiumMonthsAwarded: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "rule-default-12",
    label: "1-year course track",
    minCourseDurationMonths: 12,
    premiumMonthsAwarded: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function loadStore(): RulesStore {
  if (store) return store;
  try {
    if (fs.existsSync(DATA_FILE)) {
      store = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as RulesStore;
    } else {
      // Seed with sensible defaults on first run
      store = { rules: DEFAULT_RULES };
      saveStore(store);
    }
  } catch {
    store = { rules: DEFAULT_RULES };
  }
  return store;
}

function saveStore(s: RulesStore) {
  store = s;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(s, null, 2));
  } catch (e) {
    console.error("[EntitlementRules] Failed to save:", e);
  }
}

/** Return all rules sorted ascending by minCourseDurationMonths. */
export function listEntitlementRules(): EntitlementRule[] {
  const s = loadStore();
  return [...s.rules].sort((a, b) => a.minCourseDurationMonths - b.minCourseDurationMonths);
}

/** Create a new rule. Returns the created rule. */
export function createEntitlementRule(
  label: string,
  minCourseDurationMonths: number,
  premiumMonthsAwarded: number
): EntitlementRule {
  const s = loadStore();
  const rule: EntitlementRule = {
    id: `rule-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    label,
    minCourseDurationMonths,
    premiumMonthsAwarded,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  s.rules.push(rule);
  saveStore(s);
  return rule;
}

/** Update an existing rule. Returns updated rule or null if not found. */
export function updateEntitlementRule(
  id: string,
  updates: Partial<Pick<EntitlementRule, "label" | "minCourseDurationMonths" | "premiumMonthsAwarded">>
): EntitlementRule | null {
  const s = loadStore();
  const rule = s.rules.find((r) => r.id === id);
  if (!rule) return null;
  Object.assign(rule, updates, { updatedAt: new Date().toISOString() });
  saveStore(s);
  return rule;
}

/** Delete a rule by ID. Returns true if deleted, false if not found. */
export function deleteEntitlementRule(id: string): boolean {
  const s = loadStore();
  const idx = s.rules.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  s.rules.splice(idx, 1);
  saveStore(s);
  return true;
}

/** Force-reload the store from disk (used after external modifications). */
export function reloadEntitlementRules(): void {
  store = null;
}
