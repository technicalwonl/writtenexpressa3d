import { NextResponse } from "next/server";
import { getTableData, initializeDatabase } from "@/lib/db";

export async function GET() {
  initializeDatabase();
  try {
    const broadcasts = getTableData<any[]>("broadcast_notifications", []);
    // Return latest 10 delivered broadcasts
    const publicBroadcasts = broadcasts
      .filter((b) => b.status === "Delivered")
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      broadcasts: publicBroadcasts,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, broadcasts: [] },
      { status: 500 }
    );
  }
}
