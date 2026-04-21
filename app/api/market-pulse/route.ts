import { NextResponse } from "next/server";
import { loadMarketPulse } from "@/lib/data";

export async function GET() {
  return NextResponse.json(loadMarketPulse());
}
