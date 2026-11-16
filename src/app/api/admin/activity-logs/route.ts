import { NextResponse } from "next/server";
import { getTableData, recordActivity, initializeDatabase } from "@/lib/db";

export async function GET() {
  initializeDatabase();
  const logs = getTableData<any[]>("activity_logs", []);
  return NextResponse.json({ success: true, logs });
}

export async function POST(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    recordActivity(
      body.action || "INFO",
      body.entity || "SYSTEM",
      body.details || "Manual activity logged",
      body.user || "Admin User"
    );
    return NextResponse.json({ success: true, message: "Activity recorded" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to record activity" }, { status: 500 });
  }
}
