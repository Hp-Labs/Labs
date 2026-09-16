// ============================================================
// HpLabs  Partner: Verify OTP
// POST /api/partner/verify-otp
//
// Verifies the submitted 6-digit code. If correct:
//   - Destroys the OTP (one-time use)
//   - Creates a short-lived server-side session (15 min)
//   - Returns a session token + safe entitlement preview
//
// The session token is an opaque random string  it carries
// no decodable payload. The entitlement details are stored
// server-side only.
// ============================================================

import { NextResponse } from "next/server";
import { checkPartnerEligibility } from "@/lib/services/partnerStudentStore";
import { verifyPartnerOtp, createPartnerSession } from "@/lib/services/partnerOtpStore";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: "Email and code are required." },
        { status: 400 }
      );
    }

    const key = email.toLowerCase().trim();
    const result = verifyPartnerOtp(key, String(code).trim());

    if (!result.ok) {
      const messages: Record<string, string> = {
        invalid:           "Incorrect code. Please check and try again.",
        expired:           "This code has expired. Please request a new one.",
        too_many_attempts: "Too many incorrect attempts. Please request a new code.",
      };
      return NextResponse.json(
        { success: false, message: messages[result.reason] ?? "Verification failed." },
        { status: 400 }
      );
    }

    // Re-check eligibility (could have been redeemed between OTP request and verify)
    const record = checkPartnerEligibility(key);
    if (!record) {
      return NextResponse.json(
        { success: false, message: "This email is not eligible or has already been used." },
        { status: 403 }
      );
    }

    // Create a short-lived session  stores entitlement server-side
    const sessionToken = createPartnerSession(
      key,
      record.course,
      record.duration,
      record.entitledPremiumMonths,
      record.matchedRuleLabel,
    );

    // Return the session token + safe preview (months only, no internal IDs)
    return NextResponse.json({
      success: true,
      sessionToken,
      preview: {
        course: record.course,
        duration: record.duration,
        entitledPremiumMonths: record.entitledPremiumMonths,
        matchedRuleLabel: record.matchedRuleLabel,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
