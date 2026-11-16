import { NextResponse } from "next/server";
import { getTableData, saveTableData, recordActivity, initializeDatabase } from "@/lib/db";

export async function GET() {
  initializeDatabase();
  const pricing = getTableData<any[]>("pricing", []);
  return NextResponse.json({ success: true, pricing });
}

export async function PUT(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    let pricingList = getTableData<any[]>("pricing", []);
    const index = pricingList.findIndex((p) => p.id === body.id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: "Pricing item not found" }, { status: 404 });
    }

    const prevValue = pricingList[index].details;
    pricingList[index] = {
      ...pricingList[index],
      ...body,
      updatedAt: new Date().toISOString()
    };
    saveTableData("pricing", pricingList);

    // Also update associated service package if matched
    let services = getTableData<any[]>("services", []);
    const srvIndex = services.findIndex((s) => s.id === pricingList[index].serviceId);
    if (srvIndex !== -1 && body.packages) {
      services[srvIndex].packages = body.packages;
      saveTableData("services", services);
    }

    recordActivity(
      "PRICE_CHANGE",
      "PRICING",
      `Changed price for ${pricingList[index].serviceName}: "${prevValue}" -> "${pricingList[index].details}"`
    );

    return NextResponse.json({ success: true, pricing: pricingList[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update pricing" }, { status: 500 });
  }
}
