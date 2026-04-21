import { NextRequest, NextResponse } from "next/server";
import { loadNewsStories } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    let stories = loadNewsStories();

    const { searchParams } = new URL(request.url);
    const firmId = searchParams.get("firmId");
    const type = searchParams.get("type");

    if (firmId) {
      stories = stories.filter((s) => s.firmId === firmId);
    }

    if (type) {
      stories = stories.filter((s) => s.type === type);
    }

    return NextResponse.json(stories);
  } catch (error) {
    console.error("[api/news] Error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
