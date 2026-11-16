import { NextResponse } from "next/server";
import { getTableData, saveTableData, recordActivity, initializeDatabase } from "@/lib/db";

export async function GET() {
  initializeDatabase();
  const integrations = getTableData<any[]>("integrations", []);
  return NextResponse.json({ success: true, integrations });
}

export async function PUT(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    let integrations = getTableData<any[]>("integrations", []);
    const index = integrations.findIndex((i) => i.id === body.id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: "Integration not found" }, { status: 404 });
    }
    integrations[index] = {
      ...integrations[index],
      ...body,
      lastSync: new Date().toISOString()
    };
    saveTableData("integrations", integrations);
    recordActivity("UPDATE", "INTEGRATIONS", `Updated integration ${integrations[index].name} (${integrations[index].status})`);
    return NextResponse.json({ success: true, integration: integrations[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update integration" }, { status: 500 });
  }
}
