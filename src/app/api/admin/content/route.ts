import { NextResponse } from "next/server";
import { getTableData, saveTableData, recordActivity, initializeDatabase } from "@/lib/db";

export async function GET() {
  initializeDatabase();
  const content = getTableData<any>("website_content", {});
  return NextResponse.json({ success: true, content });
}

export async function POST(req: Request) {
  return handleSaveContent(req);
}

export async function PUT(req: Request) {
  return handleSaveContent(req);
}

async function handleSaveContent(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    saveTableData("website_content", {
      ...body,
      updatedAt: new Date().toISOString()
    });
    recordActivity("CONTENT_UPDATE", "WEBSITE_CONTENT", "Updated public website copy and brand sections");
    return NextResponse.json({ success: true, message: "Content updated successfully", content: body });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update content" }, { status: 500 });
  }
}
