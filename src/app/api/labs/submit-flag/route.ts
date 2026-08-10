// ============================================================
// HpLabs — Flag Submission & Server-Side Validation Route
// Secure server HMAC flag validation (prevents client-side flag leaks)
// ============================================================

import { NextResponse } from "next/server";
import { validateSubmittedFlag } from "@/lib/services/flagEngine";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, labId, flag } = body;

    if (!userId || !labId || !flag) {
      return NextResponse.json(
        { success: false, message: "Missing userId, labId, or flag input." },
        { status: 400 }
      );
    }

    const validation = validateSubmittedFlag(userId, labId, flag);

    return NextResponse.json({
      success: validation.success,
      message: validation.message,
      labId,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server flag validation error" },
      { status: 500 }
    );
  }
}
