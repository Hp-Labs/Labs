// ============================================================
// HpLabs  Partner: Activate Premium
// POST /api/partner/activate
//
// Final step of partner activation. Receives:
//   { sessionToken, requestedMonths, userId }
//
// Server-side enforcements:
//   1. Session token must exist, be valid, and be unused
//   2. requestedMonths must be a positive integer
//   3. requestedMonths MUST be  entitledPremiumMonths (hard cap)
//   4. redeemPartnerEligibility() marks the record so it cannot
//      be activated again
//   5. Returns premiumUntil  client updates localStorage
//
// There is NO way to bypass the cap by modifying the request 
// the cap is read from the server-side session, not the request body.
// ============================================================

import { NextResponse } from "next/server";
import { getSession } from "@/lib/services/sessionStore";
import { updateUser } from "@/lib/services/userStore";
import { redeemPartnerEligibility, checkPartnerEligibility } from "@/lib/services/partnerStudentStore";
import { getPartnerSession, consumePartnerSession } from "@/lib/services/partnerOtpStore";

export async function POST(req: Request) {
  try {
    const { sessionToken, requestedMonths } = await req.json();

    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/hplabs_session_id=([^;]+)/);
    const authSessionId = match ? match[1].trim() : null;
    if (!authSessionId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    const sessionUser = getSession(authSessionId);
    if (!sessionUser || !sessionUser.id) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    const verifiedUserId = sessionUser.id;


    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: "Session token and user ID are required." },
        { status: 400 }
      );
    }

    //  1. Validate session 
    const session = getPartnerSession(sessionToken);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Your verification session has expired or is invalid. Please start again." },
        { status: 403 }
      );
    }

    //  2. Parse and validate requestedMonths 
    const months = Number(requestedMonths);
    if (!Number.isInteger(months) || months < 1) {
      return NextResponse.json(
        { success: false, message: "Invalid duration selected." },
        { status: 400 }
      );
    }

    //  3. SERVER-SIDE CAP  cannot be bypassed by client 
    const cap = session.entitledPremiumMonths;
    if (months > cap) {
      return NextResponse.json(
        {
          success: false,
          message: `Requested duration (${months} months) exceeds your entitlement (${cap} months). Please select ${cap} months or fewer.`,
          maxAllowed: cap,
        },
        { status: 403 }
      );
    }

    //  4. Re-check eligibility (prevents race conditions) 
    const record = checkPartnerEligibility(session.email);
    if (!record) {
      return NextResponse.json(
        { success: false, message: "This partner benefit has already been redeemed or is no longer available." },
        { status: 403 }
      );
    }

    //  5. Redeem  marks student record as used 
    const redeemed = redeemPartnerEligibility(session.email);
    if (!redeemed) {
      return NextResponse.json(
        { success: false, message: "Redemption failed  this benefit may have already been used." },
        { status: 409 }
      );
    }

    //  6. Consume the session (one-time use) 
    consumePartnerSession(sessionToken);

    //  7. Compute premiumUntil 
    const now = new Date();
    const premiumUntil = new Date(now);
    premiumUntil.setMonth(premiumUntil.getMonth() + months);
    const premiumUntilMs = premiumUntil.getTime();
    updateUser(verifiedUserId, { premiumUntil: premiumUntilMs });

    //  8. Log activation 
    console.log(
      `[PartnerActivation] userId=${verifiedUserId} email=${session.email} months=${months}/${cap} premiumUntil=${premiumUntilMs}`
    );

    return NextResponse.json({
      success: true,
      premiumUntil: premiumUntilMs,
      activatedMonths: months,
      message: `Partner Premium activated! You have ${months} months of Premium access.`,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Activation failed. Please try again." },
      { status: 500 }
    );
  }
}
