import { NextResponse } from "next/server";
import { loadAllFirms, loadNewsStories } from "@/lib/data";
import type { FlatFirm, Story } from "@/lib/types";

export async function GET() {
  const firms = loadAllFirms();
  const stories = loadNewsStories();
  return NextResponse.json({ firms, stories });
}
