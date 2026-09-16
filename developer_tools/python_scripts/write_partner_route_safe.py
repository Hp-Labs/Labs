import os

code = '''
import { NextResponse } from "next/server";
import { checkPartnerEligibility } from "@/lib/services/partnerStudentStore";
import { createPartnerOtp } from "@/lib/services/partnerOtpStore";

const lastRequestTime = new Map<string, number>();
const RATE_LIMIT_MS = 60 * 1000;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "A valid email address is required." },
        { status: 400 }
      );
    }

    const key = email.toLowerCase().trim();

    const lastReq = lastRequestTime.get(key) ?? 0;
    const secsSince = Math.floor((Date.now() - lastReq) / 1000);
    if (secsSince < 60) {
      return NextResponse.json(
        { success: false, message: "Please wait " + (60 - secsSince) + " seconds before requesting another code." },
        { status: 429 }
      );
    }

    const record = checkPartnerEligibility(key);

    if (record) {
      createPartnerOtp(key);
      lastRequestTime.set(key, Date.now());

      return NextResponse.json({
        success: true,
        message: "A verification code has been sent to your email.",
      });
    } else {
      lastRequestTime.set(key, Date.now());
      return NextResponse.json({
        success: true,
        message: "A verification code has been sent to your email.",
      });
    }
  } catch {
    return NextResponse.json(
      { success: false, message: "Request failed. Please try again." },
      { status: 500 }
    );
  }
}
'''

with open('src/app/api/partner/request-otp/route.ts', 'w', encoding='utf-8') as f:
    f.write(code)

