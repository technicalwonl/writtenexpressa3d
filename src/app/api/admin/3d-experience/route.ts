import { NextResponse } from "next/server";
import { getTableData, saveTableData, recordActivity, initializeDatabase } from "@/lib/db";

export async function GET() {
  initializeDatabase();
  const settings = getTableData<any>("three_d_settings", {});
  return NextResponse.json({ success: true, settings });
}

export async function POST(req: Request) {
  return handleSave3DSettings(req);
}

export async function PUT(req: Request) {
  return handleSave3DSettings(req);
}

async function handleSave3DSettings(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    saveTableData("three_d_settings", {
      ...body,
      updatedAt: new Date().toISOString()
    });
    recordActivity("3D_CONFIG", "3D_EXPERIENCE", `Updated 3D hero parameters (height: ${body.scrollContainerHeight}vh, lerp: ${body.lerpSpeed})`);
    return NextResponse.json({ success: true, message: "3D experience settings saved", settings: body });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update 3D settings" }, { status: 500 });
  }
}
