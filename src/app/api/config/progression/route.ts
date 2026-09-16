import { NextResponse } from "next/server";
import { SERVER_PROGRESSION_CONFIG } from "@/lib/config/progressionConfig";

export async function GET() {
  return NextResponse.json({ config: SERVER_PROGRESSION_CONFIG });
}
