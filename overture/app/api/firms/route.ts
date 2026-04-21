import { NextResponse } from "next/server";
import { loadAllFirms } from "@/lib/data";

export async function GET() {
  const firms = loadAllFirms();
  return NextResponse.json(firms);
}
