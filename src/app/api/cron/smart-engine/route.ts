import { NextResponse } from "next/server";
import { runSmartEngineIteration } from "@/lib/services/smartEngine";

export async function GET(req: Request) {
  // A simple cron endpoint.
  // In production, you would check an API key like process.env.CRON_SECRET here.
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== "Bearer " + process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await runSmartEngineIteration();
    return NextResponse.json({ success: true, results, timestamp: new Date().toISOString() });
  } catch (error: any) {
    console.error("[SmartEngine Cron Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return GET(req);
}

