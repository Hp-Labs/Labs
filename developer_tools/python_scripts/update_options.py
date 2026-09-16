import os

path = "src/app/api/premium/options/route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

new_content = """import { NextResponse } from "next/server";
import { PREMIUM_CONFIG } from "@/lib/config/premiumConfig";

export async function GET() {
  const allowedMonths = [3, 6, 12];
  const options = [];
  
  for (const m of allowedMonths) {
    let discount = 0;
    if (m === 12) discount = 0.20;
    else if (m === 6) discount = 0.10;
    
    const basePrice = m * PREMIUM_CONFIG.pricePerMonth;
    const finalPrice = Math.round(basePrice * (1 - discount));
    
    options.push({
      months: m,
      totalPrice: finalPrice,
      originalPrice: basePrice,
      discountText: discount > 0 ? `Save ${discount * 100}%` : null
    });
  }
  
  return NextResponse.json({ options, currency: PREMIUM_CONFIG.currency });
}
"""

with open(path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Updated premium options")
