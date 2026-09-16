import os

code = '''import { NextResponse } from "next/server";
import { getSession } from "@/lib/services/sessionStore";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/hplabs_session_id=([^;]+)/);
    const sessionId = match ? match[1] : null;

    if (!sessionId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const sessionUser = getSession(sessionId);
    if (!sessionUser) {
      return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 });
    }

    const body = await req.json();
    const months = body.months || 1;
    
    const payload = JSON.stringify({
      id: "evt_sim_" + crypto.randomBytes(8).toString("hex"),
      type: "payment.succeeded",
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          customer_id: sessionUser.userId,
          status: "succeeded",
          metadata: { userId: sessionUser.userId, requested_months: months.toString() }
        }
      }
    });

    const secret = process.env.PAYMENT_WEBHOOK_SECRET || "hplabs_test_webhook_secret_12345";
    const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    const proto = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host") || "localhost:3000";
    const webhookUrl = ${proto}://System.Management.Automation.Internal.Host.InternalHost/api/premium/webhook;

    const webhookRes = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Signature": signature
      },
      body: payload
    });

    if (!webhookRes.ok) {
        return NextResponse.json({ success: false, message: "Simulated payment processor failed to trigger webhook." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Payment processed via local simulator." });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
'''

with open('src/app/api/premium/create-checkout-session/route.ts', 'w', encoding='utf-8') as f:
    f.write(code.replace('', '$'+'{proto}').replace('System.Management.Automation.Internal.Host.InternalHost', '$'+'{host}').replace('${', '${'))

