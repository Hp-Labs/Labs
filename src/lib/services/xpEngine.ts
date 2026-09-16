import { Severity } from "@/lib/data/types";

const SEVERITY_XP_FLOORS: Record<string, number> = {
  information: 10,
  low: 25,
  medium: 50,
  high: 100,
  critical: 150,
};

export interface XPAward {
  total: number;
  base: number;
  firstBonus: number;
  noHintBonus: number;
}

export function computeXP(
  severity: string,
  baseXpReward: number,
  isRepeat: boolean,
  usedHints: number
): XPAward {
  if (isRepeat) {
    return { total: 0, base: 0, firstBonus: 0, noHintBonus: 0 };
  }

  const floor = SEVERITY_XP_FLOORS[severity.toLowerCase()] || 0;
  const base = Math.max(baseXpReward || 0, floor);

  const firstBonus = Math.round(base * 0.2);
  const noHintBonus = usedHints === 0 ? Math.round(base * 0.1) : 0;

  return {
    total: base + firstBonus + noHintBonus,
    base,
    firstBonus,
    noHintBonus,
  };
}
