import { NextRequest, NextResponse } from "next/server";
import { loadFirm } from "@/lib/data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const firm = loadFirm(slug);
    if (!firm) {
      return NextResponse.json({ error: "Firm not found" }, { status: 404 });
    }
    return NextResponse.json(firm);
  } catch (error) {
    console.error(`[api/firms/${slug}] GET error:`, error);
    return NextResponse.json(
      { error: "Failed to read firm" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const firm = loadFirm(slug);
    if (!firm) {
      return NextResponse.json({ error: "Firm not found" }, { status: 404 });
    }

    const body = await request.json();

    // For now, file-based storage: just return the firm with the requested
    // watch status applied in the response (not persisted to disk).
    if (typeof body.watched === "boolean") {
      firm.watched = body.watched;
    }

    return NextResponse.json(firm);
  } catch (error) {
    console.error(`[api/firms/${slug}] PATCH error:`, error);
    return NextResponse.json(
      { error: "Failed to update firm" },
      { status: 500 }
    );
  }
}
