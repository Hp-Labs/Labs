// ============================================================
// HpLabs  Entitlement Engine (pure server-side)
// Parses a course duration string and applies the best-matching
// entitlement rule to return the Premium months awarded.
// ============================================================

import { EntitlementRule } from "./entitlementRules";

/**
 * Parse a free-text course duration string into a number of months.
 *
 * Handles inputs such as:
 *   "6 months", "6months", "6 mo", "6m"
 *   "2 years", "2 year", "2y", "2yr", "2yrs"
 *   "1.5 years"   18 months
 *   "18"          18 months (bare number assumed months)
 *   "1 year 6 months"  18 months
 *
 * Returns 0 if unparseable.
 */
export function parseCourseDurationMonths(raw: string): number {
  const s = raw.trim().toLowerCase();

  // Try "N year(s) M month(s)" compound form first
  const compound = s.match(/(\d+(?:\.\d+)?)\s*(?:year|yr|y)\w*\s*(?:and\s*)?(\d+(?:\.\d+)?)\s*(?:month|mo|m)\w*/);
  if (compound) {
    return Math.round(parseFloat(compound[1]) * 12 + parseFloat(compound[2]));
  }

  // Extract all number+unit pairs and sum
  const yearMatch  = s.match(/(\d+(?:\.\d+)?)\s*(?:year|yr|y)\w*/);
  const monthMatch = s.match(/(\d+(?:\.\d+)?)\s*(?:month|mo)\w*/);

  if (yearMatch || monthMatch) {
    const years  = yearMatch  ? parseFloat(yearMatch[1])  : 0;
    const months = monthMatch ? parseFloat(monthMatch[1]) : 0;
    return Math.round(years * 12 + months);
  }

  // Bare number  assume months
  const bare = s.match(/^(\d+(?:\.\d+)?)$/);
  if (bare) return Math.round(parseFloat(bare[1]));

  // Short suffixes: "6m", "2y", "18mo"
  const shortYear  = s.match(/^(\d+(?:\.\d+)?)y$/);
  const shortMonth = s.match(/^(\d+(?:\.\d+)?)m$/);
  if (shortYear)  return Math.round(parseFloat(shortYear[1]) * 12);
  if (shortMonth) return Math.round(parseFloat(shortMonth[1]));

  return 0;
}

/**
 * Given a student's parsed course duration (months) and the full set of
 * active entitlement rules, return the number of Premium months they are
 * entitled to.
 *
 * Strategy: find the rule with the highest minCourseDurationMonths that
 * is still  the student's course duration. This gives the most generous
 * matching rule.
 *
 * Returns 0 if no rule matches.
 */
export function calculateEntitledPremiumMonths(
  courseDurationMonths: number,
  rules: EntitlementRule[]
): number {
  // Sort descending so the first match is the best (most specific) one
  const sorted = [...rules].sort(
    (a, b) => b.minCourseDurationMonths - a.minCourseDurationMonths
  );

  for (const rule of sorted) {
    if (courseDurationMonths >= rule.minCourseDurationMonths) {
      return rule.premiumMonthsAwarded;
    }
  }

  return 0; // No matching rule
}

/**
 * Full server-side entitlement computation for a student.
 * Returns the calculated months plus diagnostic detail.
 */
export function computeStudentEntitlement(
  durationString: string,
  rules: EntitlementRule[]
): {
  parsedMonths: number;
  entitledPremiumMonths: number;
  matchedRuleId: string | null;
  matchedRuleLabel: string | null;
} {
  const parsedMonths = parseCourseDurationMonths(durationString);

  // Sort descending to find best match
  const sorted = [...rules].sort(
    (a, b) => b.minCourseDurationMonths - a.minCourseDurationMonths
  );

  for (const rule of sorted) {
    if (parsedMonths >= rule.minCourseDurationMonths) {
      return {
        parsedMonths,
        entitledPremiumMonths: rule.premiumMonthsAwarded,
        matchedRuleId: rule.id,
        matchedRuleLabel: rule.label,
      };
    }
  }

  return {
    parsedMonths,
    entitledPremiumMonths: 0,
    matchedRuleId: null,
    matchedRuleLabel: null,
  };
}
