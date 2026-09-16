path = "src/lib/config/progressionConfig.ts"
content = """export const SERVER_PROGRESSION_CONFIG: Record<string, { minXP: number }> = {
  information: { minXP: 0 },
  low: { minXP: 500 },
  medium: { minXP: 2000 },
  high: { minXP: 5000 },
  critical: { minXP: 10000 }
};
"""
with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated SERVER_PROGRESSION_CONFIG")
