import os

path = "src/lib/auth.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

old_func = """export function getUserBadgesAndRank(user: User): {
  primaryTag: string;
  rankColor: string;
  badgeList: { name: string; icon: string; color: string }[];
} {
  const xp = user.xp;
  let primaryTag = "Script Kiddie";
  let rankColor = "text-[var(--hp-text-muted)] border-gray-500/30 bg-gray-500/10";

  if (xp >= 10000) {
    primaryTag = "Legendary Operator";
    rankColor = "text-red-400 border-red-500/40 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.3)]";
  } else if (xp >= 5000) {
    primaryTag = "Elite Red Teamer";
    rankColor = "text-orange-400 border-orange-500/40 bg-orange-500/10 shadow-[0_0_15px_rgba(251,146,60,0.3)]";
  } else if (xp >= 2000) {
    primaryTag = "Certified Pentester";
    rankColor = "text-[var(--hp-primary)] border-[var(--hp-border-hover)] bg-[var(--hp-primary)]/10 shadow-[0_0_15px_var(--hp-primary)]";
  } else if (xp >= 500) {
    primaryTag = "Apprentice Hacker";
    rankColor = "text-[#00e5ff] border-[#00e5ff]/40 bg-[#00e5ff]/10 shadow-[0_0_15px_rgba(0,229,255,0.3)]";
  }

  return {
    primaryTag,
    rankColor,
    badgeList: []
  };
}"""

new_func = """import { getRank } from "@/lib/data/types";
export function getUserBadgesAndRank(user: User): {
  primaryTag: string;
  rankColor: string;
  badgeList: { name: string; icon: string; color: string }[];
} {
  const xp = user.xp;
  const rank = getRank(xp);
  
  let rankColor = "text-[var(--hp-text-muted)] border-gray-500/30 bg-gray-500/10";
  if (xp >= 25000) {
    rankColor = "text-red-400 border-red-500/40 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.3)]";
  } else if (xp >= 10000) {
    rankColor = "text-orange-400 border-orange-500/40 bg-orange-500/10 shadow-[0_0_15px_rgba(251,146,60,0.3)]";
  } else if (xp >= 5000) {
    rankColor = "text-fuchsia-400 border-fuchsia-500/40 bg-fuchsia-500/10 shadow-[0_0_15px_rgba(232,121,249,0.3)]";
  } else if (xp >= 2000) {
    rankColor = "text-[var(--hp-primary)] border-[var(--hp-border-hover)] bg-[var(--hp-primary)]/10 shadow-[0_0_15px_var(--hp-primary)]";
  } else if (xp >= 500) {
    rankColor = "text-violet-400 border-violet-500/40 bg-violet-500/10 shadow-[0_0_15px_rgba(139,92,246,0.3)]";
  }

  return {
    primaryTag: rank.rank,
    rankColor,
    badgeList: []
  };
}"""

# since there might be Mojibake in the string matching, I'll use regex to replace it
import re
c = re.sub(r'export function getUserBadgesAndRank\(user: User\).*?return \{\n.*?primaryTag,\n.*?rankColor,\n.*?badgeList: \[\]\n\s*?\};\n\}', new_func, c, flags=re.DOTALL)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Updated auth.tsx to use getRank")
